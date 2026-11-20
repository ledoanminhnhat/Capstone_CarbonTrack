package com.carbontrack.service;

import com.carbontrack.dto.CommunityDtos.*;
import static com.carbontrack.dto.CommunityDtos.*;
import com.carbontrack.model.Comment;
import com.carbontrack.model.Post;
import com.carbontrack.model.User;
import com.carbontrack.repository.CommentRepository;
import com.carbontrack.repository.PostRepository;
import com.carbontrack.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.FindAndModifyOptions;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class CommunityService {

    private static final int PAGE_SIZE = 10;

    private final PostRepository postRepo;
    private final CommentRepository commentRepo;
    private final UserRepository userRepo;
    private final MongoTemplate mongo;
    private final UploadService uploadService;

    public CommunityService(PostRepository postRepo, CommentRepository commentRepo,
                            UserRepository userRepo, MongoTemplate mongo, UploadService uploadService) {
        this.postRepo = postRepo;
        this.commentRepo = commentRepo;
        this.userRepo = userRepo;
        this.mongo = mongo;
        this.uploadService = uploadService;
    }

    // ===================== Posts =====================

    public FeedPage feed(String viewerId, int page) {
        User viewer = loadUser(viewerId);
        Page<Post> result = postRepo.findByUserIdNotInOrderByCreatedAtDesc(
                mutedOf(viewer), PageRequest.of(Math.max(page, 0), PAGE_SIZE));
        // tải 1 lần: tác giả + vài người like gần nhất của mọi bài trong trang
        Set<String> muted = new HashSet<>(mutedOf(viewer));
        Map<String, List<Comment>> previews = new HashMap<>();
        result.getContent().forEach(p -> previews.put(p.getId(), previewOf(p.getId(), muted)));
        // tải 1 lần: tác giả + người like gần nhất + người viết comment xem trước
        Map<String, User> users = usersById(result.getContent().stream()
                .flatMap(p -> java.util.stream.Stream.concat(
                        java.util.stream.Stream.concat(java.util.stream.Stream.of(p.getUserId()), recentLikerIds(p).stream()),
                        previews.get(p.getId()).stream().map(Comment::getUserId)))
                .toList());
        List<PostView> posts = result.getContent().stream()
                .map(p -> toView(p, viewer, users, previews.get(p.getId())))
                .toList();
        return new FeedPage(posts, result.getNumber(), result.hasNext());
    }

    public PostView getPost(String viewerId, String postId) {
        User viewer = loadUser(viewerId);
        Post p = loadPost(postId);
        List<Comment> preview = previewOf(p.getId(), new HashSet<>(mutedOf(viewer)));
        List<String> ids = new ArrayList<>(recentLikerIds(p));
        ids.add(p.getUserId());
        preview.forEach(c -> ids.add(c.getUserId()));
        return toView(p, viewer, usersById(ids), preview);
    }

    public PostView create(String userId, CreatePostRequest req) {
        String content = req.content() == null ? "" : req.content().trim();
        List<String> images = req.imageUrls() == null ? List.of() : req.imageUrls();
        if (content.isEmpty() && images.isEmpty()) {
            throw bad("Post cannot be empty");
        }
        if (content.length() > MAX_CONTENT) throw bad("Post is too long (max " + MAX_CONTENT + " characters)");
        if (images.size() > MAX_IMAGES) throw bad("Maximum " + MAX_IMAGES + " images per post");
        if (!images.stream().allMatch(u -> uploadService.isOwnImage(u, UploadService.Kind.POST))) throw bad("Invalid image URL");

        Post p = new Post();
        p.setUserId(userId);
        p.setContent(content);
        p.setImageUrls(new ArrayList<>(images));
        p.setCreatedAt(Instant.now());
        Post saved = postRepo.save(p);
        User me = loadUser(userId);
        return toView(saved, me, Map.of(me.getId(), me), List.of());
    }

    /** Tác giả hoặc admin mới được xóa. */
    public void delete(String userId, String postId) {
        User me = loadUser(userId);
        Post p = loadPost(postId);
        if (!p.getUserId().equals(userId) && !isAdmin(me)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You can only delete your own posts");
        }
        commentRepo.deleteByPostId(postId);
        postRepo.deleteById(postId);
    }

    /** Bấm 1 lần là like, bấm lần nữa là bỏ like (cập nhật atomic). */
    public LikeResult toggleLike(String userId, String postId) {
        Post p = loadPost(postId);
        boolean liked = p.getLikedBy().contains(userId);
        Update u = liked ? new Update().pull("likedBy", userId) : new Update().addToSet("likedBy", userId);
        Post updated = mongo.findAndModify(byId(postId), u,
                FindAndModifyOptions.options().returnNew(true), Post.class);
        if (updated == null) throw notFound("Post not found");
        return new LikeResult(updated.getLikedBy().size(), updated.getLikedBy().contains(userId),
                likersOf(updated, usersById(recentLikerIds(updated))));
    }

    // ===================== Danh sách người like =====================

    /** Người đã like 1 bài, mới nhất trước. */
    public List<Author> postLikers(String postId) {
        return likersFromIds(loadPost(postId).getLikedBy());
    }

    /** Người đã like 1 comment, mới nhất trước. */
    public List<Author> commentLikers(String commentId) {
        Comment c = commentRepo.findById(commentId).orElseThrow(() -> notFound("Comment not found"));
        return likersFromIds(c.getLikedBy() == null ? List.of() : c.getLikedBy());
    }

    /** likedBy thêm vào cuối -> đảo lại để người like gần nhất lên đầu; bỏ account đã bị xóa. */
    private List<Author> likersFromIds(List<String> likedBy) {
        List<String> ids = new ArrayList<>(likedBy);
        Collections.reverse(ids);
        Map<String, User> users = usersById(ids);
        return ids.stream().filter(users::containsKey).map(id -> authorOf(id, users.get(id))).toList();
    }

    /** Người đã share 1 bài, mới nhất trước. */
    public List<Author> postSharers(String postId) {
        List<String> ids = loadPost(postId).getSharedBy();
        return likersFromIds(ids == null ? List.of() : ids);
    }

    /**
     * Share bài của người khác (không tự share bài mình). Mỗi người chỉ tính 1 lần:
     * chỉ tăng đếm khi user chưa có trong sharedBy (1 lệnh atomic, bấm liên tục cũng không đếm trùng).
     */
    public ShareResult share(String userId, String postId) {
        if (loadPost(postId).getUserId().equals(userId)) throw bad("You can't share your own post");
        Query notYet = new Query(Criteria.where("_id").is(postId).and("sharedBy").ne(userId));
        Post updated = mongo.findAndModify(notYet,
                new Update().addToSet("sharedBy", userId).inc("shareCount", 1),
                FindAndModifyOptions.options().returnNew(true), Post.class);
        if (updated == null) updated = loadPost(postId); // đã share trước đó -> giữ nguyên số
        return new ShareResult(updated.getShareCount(), true);
    }

    // ===================== Comments =====================

    public List<CommentView> comments(String viewerId, String postId) {
        User viewer = loadUser(viewerId);
        Post post = loadPost(postId);
        boolean viewerOwnsPost = post.getUserId().equals(viewer.getId());
        Set<String> muted = new HashSet<>(mutedOf(viewer));
        List<Comment> all = commentRepo.findByPostIdOrderByCreatedAtAsc(postId);
        // ẩn comment của người bị mute; comment gốc bị ẩn thì ẩn luôn các reply của nó
        Set<String> hiddenRoots = new HashSet<>();
        all.stream().filter(c -> c.getParentId() == null && muted.contains(c.getUserId()))
                .forEach(c -> hiddenRoots.add(c.getId()));
        List<Comment> list = all.stream()
                .filter(c -> !muted.contains(c.getUserId()))
                .filter(c -> c.getParentId() == null || !hiddenRoots.contains(c.getParentId()))
                .toList();
        Map<String, Integer> replyCounts = new HashMap<>();
        list.stream().filter(c -> c.getParentId() != null)
                .forEach(c -> replyCounts.merge(c.getParentId(), 1, Integer::sum));
        Map<String, User> authors = usersById(list.stream().map(Comment::getUserId).toList());
        return list.stream()
                .map(c -> toView(c, viewer, authors.get(c.getUserId()), viewerOwnsPost,
                        replyCounts.getOrDefault(c.getId(), 0)))
                .toList();
    }

    public CommentView addComment(String userId, String postId, CreateCommentRequest req) {
        Post post = loadPost(postId);
        String content = req.content().trim();
        if (content.isEmpty()) throw bad("Comment cannot be empty");

        // reply: chỉ 2 tầng -> trả lời 1 reply thì gắn vào comment gốc của nó
        String parentId = null;
        if (req.parentId() != null && !req.parentId().isBlank()) {
            Comment parent = commentRepo.findById(req.parentId())
                    .orElseThrow(() -> notFound("Comment not found"));
            if (!parent.getPostId().equals(postId)) throw bad("Comment does not belong to this post");
            parentId = parent.getParentId() != null ? parent.getParentId() : parent.getId();
        }

        Comment c = new Comment();
        c.setPostId(postId);
        c.setParentId(parentId);
        c.setUserId(userId);
        c.setContent(content);
        c.setCreatedAt(Instant.now());
        Comment saved = commentRepo.save(c);
        mongo.updateFirst(byId(postId), new Update().inc("commentCount", 1), Post.class);
        User me = loadUser(userId);
        return toView(saved, me, me, post.getUserId().equals(userId), 0);
    }

    /**
     * Người viết comment, chủ bài, hoặc admin được xóa comment.
     * Xóa comment gốc thì xóa luôn các reply. Trả về số comment đã xóa.
     */
    public int deleteComment(String userId, String commentId) {
        User me = loadUser(userId);
        Comment c = commentRepo.findById(commentId).orElseThrow(() -> notFound("Comment not found"));
        boolean postOwner = postRepo.findById(c.getPostId())
                .map(p -> p.getUserId().equals(userId)).orElse(false);
        if (!c.getUserId().equals(userId) && !postOwner && !isAdmin(me)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You cannot delete this comment");
        }
        return removeWithReplies(c);
    }

    /** Xóa 1 comment (+ reply nếu là comment gốc) và giảm commentCount của bài tương ứng. */
    private int removeWithReplies(Comment c) {
        int deleted = 1;
        if (c.getParentId() == null) {
            deleted += (int) commentRepo.countByParentId(c.getId());
            commentRepo.deleteByParentId(c.getId());
        }
        commentRepo.deleteById(c.getId());
        mongo.updateFirst(byId(c.getPostId()), new Update().inc("commentCount", -deleted), Post.class);
        return deleted;
    }

    /** Like / bỏ like 1 comment (atomic). */
    public LikeResult toggleCommentLike(String userId, String commentId) {
        Comment c = commentRepo.findById(commentId).orElseThrow(() -> notFound("Comment not found"));
        boolean liked = c.getLikedBy() != null && c.getLikedBy().contains(userId);
        Update u = liked ? new Update().pull("likedBy", userId) : new Update().addToSet("likedBy", userId);
        Comment updated = mongo.findAndModify(byId(commentId), u,
                FindAndModifyOptions.options().returnNew(true), Comment.class);
        if (updated == null) throw notFound("Comment not found");
        return new LikeResult(updated.getLikedBy().size(), updated.getLikedBy().contains(userId));
    }

    // ===================== Mute (ẩn người dùng) =====================

    public List<Author> mutedUsers(String userId) {
        List<String> ids = mutedOf(loadUser(userId));
        Map<String, User> users = usersById(ids);
        return ids.stream().filter(users::containsKey)
                .map(id -> authorOf(id, users.get(id))).toList();
    }

    public void mute(String userId, String targetId) {
        if (userId.equals(targetId)) throw bad("You cannot mute yourself");
        if (!userRepo.existsById(targetId)) throw notFound("User not found");
        mongo.updateFirst(byId(userId), new Update().addToSet("mutedUserIds", targetId), User.class);
    }

    public void unmute(String userId, String targetId) {
        mongo.updateFirst(byId(userId), new Update().pull("mutedUserIds", targetId), User.class);
    }

    // ===================== Leaderboard =====================

    public List<LeaderboardEntry> leaderboard() {
        Query q = new Query(Criteria.where("role").is("USER"))
                .with(Sort.by(Sort.Direction.DESC, "points")).limit(5);
        return mongo.find(q, User.class).stream()
                .map(u -> new LeaderboardEntry(u.getId(), u.getName(), u.getAvatarUrl(), u.getPoints(), u.getLastActiveAt())).toList();
    }

    // ===================== Dọn dữ liệu khi admin xóa user =====================

    public void deleteAllOfUser(String userId) {
        // comment của user trên bài người khác: xóa (kèm reply nếu là comment gốc), giảm đếm của bài đó.
        // reply có thể đã bị xóa theo comment gốc ở vòng trước -> kiểm tra còn tồn tại
        commentRepo.findByUserId(userId).forEach(c -> {
            if (commentRepo.existsById(c.getId())) removeWithReplies(c);
        });
        postRepo.findByUserId(userId).forEach(p -> commentRepo.deleteByPostId(p.getId()));
        postRepo.deleteByUserId(userId);
        mongo.updateMulti(new Query(), new Update().pull("likedBy", userId), Post.class);
        // bỏ khỏi danh sách người share + giảm đếm của các bài đó
        mongo.updateMulti(new Query(Criteria.where("sharedBy").is(userId)),
                new Update().pull("sharedBy", userId).inc("shareCount", -1), Post.class);
        mongo.updateMulti(new Query(), new Update().pull("likedBy", userId), Comment.class);
        mongo.updateMulti(new Query(), new Update().pull("mutedUserIds", userId), User.class);
    }

    // ===================== Helpers =====================

    private static final int RECENT_LIKERS = 3;

    /** Id những người like gần nhất (likedBy thêm vào cuối -> lấy từ cuối). */
    private static List<String> recentLikerIds(Post p) {
        List<String> all = p.getLikedBy();
        List<String> out = new ArrayList<>();
        for (int i = all.size() - 1; i >= 0 && out.size() < RECENT_LIKERS; i--) out.add(all.get(i));
        return out;
    }

    private static List<Author> likersOf(Post p, Map<String, User> users) {
        return recentLikerIds(p).stream().filter(users::containsKey)
                .map(id -> authorOf(id, users.get(id))).toList();
    }

    private static final int PREVIEW_COMMENTS = 2;

    /** 2 comment gốc mới nhất không thuộc người bị ẩn, xếp cũ -> mới (không lấy reply). */
    private List<Comment> previewOf(String postId, Set<String> muted) {
        List<Comment> latest = new ArrayList<>(commentRepo.findTop10ByPostIdAndParentIdIsNullOrderByCreatedAtDesc(postId).stream()
                .filter(c -> !muted.contains(c.getUserId()))
                .limit(PREVIEW_COMMENTS)
                .toList());
        Collections.reverse(latest);
        return latest;
    }

    /**  cần chứa tác giả, người like gần nhất và người viết comment xem trước. */
    private PostView toView(Post p, User viewer, Map<String, User> users, List<Comment> preview) {
        boolean viewerOwnsPost = p.getUserId().equals(viewer.getId());
        List<CommentView> previewViews = preview.stream()
                .map(c -> toView(c, viewer, users.get(c.getUserId()), viewerOwnsPost,
                        (int) commentRepo.countByParentId(c.getId())))
                .toList();
        return new PostView(p.getId(), authorOf(p.getUserId(), users.get(p.getUserId())), p.getContent(),
                p.getImageUrls(), p.getLikedBy().size(), p.getLikedBy().contains(viewer.getId()),
                likersOf(p, users), previewViews, p.getCommentCount(), p.getShareCount(),
                p.getSharedBy() != null && p.getSharedBy().contains(viewer.getId()), p.getCreatedAt(),
                p.getUserId().equals(viewer.getId()) || isAdmin(viewer));
    }

    /** Được xóa comment: người viết, chủ bài, hoặc admin (khớp với deleteComment). */
    private CommentView toView(Comment c, User viewer, User author, boolean viewerOwnsPost, int replyCount) {
        List<String> likedBy = c.getLikedBy() == null ? List.of() : c.getLikedBy();
        return new CommentView(c.getId(), authorOf(c.getUserId(), author), c.getContent(), c.getCreatedAt(),
                c.getUserId().equals(viewer.getId()) || viewerOwnsPost || isAdmin(viewer),
                likedBy.size(), likedBy.contains(viewer.getId()), c.getParentId(), replyCount);
    }

    private static Author authorOf(String id, User u) {
        return u == null ? new Author(id, "Deleted user", null, null)
                : new Author(id, u.getName(), u.getAvatarUrl(), u.getLastActiveAt());
    }

    private Map<String, User> usersById(Collection<String> ids) {
        return userRepo.findAllById(new HashSet<>(ids)).stream()
                .collect(Collectors.toMap(User::getId, Function.identity()));
    }

    private static List<String> mutedOf(User u) {
        return u.getMutedUserIds() == null ? List.of() : u.getMutedUserIds();
    }

    private static boolean isAdmin(User u) {
        return "ADMIN".equals(u.getRole());
    }

    private User loadUser(String id) {
        return userRepo.findById(id).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));
    }

    private Post loadPost(String id) {
        return postRepo.findById(id).orElseThrow(() -> notFound("Post not found"));
    }

    private static Query byId(String id) {
        return new Query(Criteria.where("_id").is(id));
    }

    private static ResponseStatusException bad(String msg) {
        return new ResponseStatusException(HttpStatus.BAD_REQUEST, msg);
    }

    private static ResponseStatusException notFound(String msg) {
        return new ResponseStatusException(HttpStatus.NOT_FOUND, msg);
    }
}
