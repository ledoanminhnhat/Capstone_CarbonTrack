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
        Map<String, User> authors = usersById(result.getContent().stream().map(Post::getUserId).toList());
        List<PostView> posts = result.getContent().stream()
                .map(p -> toView(p, viewer, authors.get(p.getUserId())))
                .toList();
        return new FeedPage(posts, result.getNumber(), result.hasNext());
    }

    public PostView getPost(String viewerId, String postId) {
        User viewer = loadUser(viewerId);
        Post p = loadPost(postId);
        return toView(p, viewer, userRepo.findById(p.getUserId()).orElse(null));
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
        return toView(saved, me, me);
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
        return new LikeResult(updated.getLikedBy().size(), updated.getLikedBy().contains(userId));
    }

    public ShareResult share(String postId) {
        Post updated = mongo.findAndModify(byId(postId), new Update().inc("shareCount", 1),
                FindAndModifyOptions.options().returnNew(true), Post.class);
        if (updated == null) throw notFound("Post not found");
        return new ShareResult(updated.getShareCount());
    }

    // ===================== Comments =====================

    public List<CommentView> comments(String viewerId, String postId) {
        User viewer = loadUser(viewerId);
        Post post = loadPost(postId);
        boolean viewerOwnsPost = post.getUserId().equals(viewer.getId());
        Set<String> muted = new HashSet<>(mutedOf(viewer));
        List<Comment> list = commentRepo.findByPostIdOrderByCreatedAtAsc(postId).stream()
                .filter(c -> !muted.contains(c.getUserId()))
                .toList();
        Map<String, User> authors = usersById(list.stream().map(Comment::getUserId).toList());
        return list.stream()
                .map(c -> toView(c, viewer, authors.get(c.getUserId()), viewerOwnsPost))
                .toList();
    }

    public CommentView addComment(String userId, String postId, CreateCommentRequest req) {
        loadPost(postId);
        String content = req.content().trim();
        if (content.isEmpty()) throw bad("Comment cannot be empty");

        Comment c = new Comment();
        c.setPostId(postId);
        c.setUserId(userId);
        c.setContent(content);
        c.setCreatedAt(Instant.now());
        Comment saved = commentRepo.save(c);
        mongo.updateFirst(byId(postId), new Update().inc("commentCount", 1), Post.class);
        User me = loadUser(userId);
        return toView(saved, me, me, false);
    }

    /** Người viết comment, chủ bài, hoặc admin được xóa comment. */
    public void deleteComment(String userId, String commentId) {
        User me = loadUser(userId);
        Comment c = commentRepo.findById(commentId).orElseThrow(() -> notFound("Comment not found"));
        boolean postOwner = postRepo.findById(c.getPostId())
                .map(p -> p.getUserId().equals(userId)).orElse(false);
        if (!c.getUserId().equals(userId) && !postOwner && !isAdmin(me)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You cannot delete this comment");
        }
        commentRepo.deleteById(commentId);
        mongo.updateFirst(byId(c.getPostId()), new Update().inc("commentCount", -1), Post.class);
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
                .map(u -> new LeaderboardEntry(u.getId(), u.getName(), u.getAvatarUrl(), u.getPoints())).toList();
    }

    // ===================== Dọn dữ liệu khi admin xóa user =====================

    public void deleteAllOfUser(String userId) {
        // comment của user trên bài người khác: giảm đếm của bài đó
        commentRepo.findByUserId(userId).forEach(c -> {
            commentRepo.deleteById(c.getId());
            mongo.updateFirst(byId(c.getPostId()), new Update().inc("commentCount", -1), Post.class);
        });
        postRepo.findByUserId(userId).forEach(p -> commentRepo.deleteByPostId(p.getId()));
        postRepo.deleteByUserId(userId);
        mongo.updateMulti(new Query(), new Update().pull("likedBy", userId), Post.class);
        mongo.updateMulti(new Query(), new Update().pull("likedBy", userId), Comment.class);
        mongo.updateMulti(new Query(), new Update().pull("mutedUserIds", userId), User.class);
    }

    // ===================== Helpers =====================

    private PostView toView(Post p, User viewer, User author) {
        return new PostView(p.getId(), authorOf(p.getUserId(), author), p.getContent(), p.getImageUrls(),
                p.getLikedBy().size(), p.getLikedBy().contains(viewer.getId()),
                p.getCommentCount(), p.getShareCount(), p.getCreatedAt(),
                p.getUserId().equals(viewer.getId()) || isAdmin(viewer));
    }

    /** Được xóa comment: người viết, chủ bài, hoặc admin (khớp với deleteComment). */
    private CommentView toView(Comment c, User viewer, User author, boolean viewerOwnsPost) {
        List<String> likedBy = c.getLikedBy() == null ? List.of() : c.getLikedBy();
        return new CommentView(c.getId(), authorOf(c.getUserId(), author), c.getContent(), c.getCreatedAt(),
                c.getUserId().equals(viewer.getId()) || viewerOwnsPost || isAdmin(viewer),
                likedBy.size(), likedBy.contains(viewer.getId()));
    }

    private static Author authorOf(String id, User u) {
        return u == null ? new Author(id, "Deleted user", null) : new Author(id, u.getName(), u.getAvatarUrl());
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
