package com.carbontrack.service;

import com.carbontrack.dto.ChallengeDtos.AdminChallengeView;
import com.carbontrack.dto.ChallengeDtos.ChallengeView;
import com.carbontrack.dto.ChallengeDtos.CreateChallengeRequest;
import com.carbontrack.dto.ChallengeDtos.Participant;
import com.carbontrack.model.Activity;
import com.carbontrack.model.Challenge;
import com.carbontrack.model.User;
import com.carbontrack.model.UserChallenge;
import com.carbontrack.repository.ActivityRepository;
import com.carbontrack.repository.ChallengeRepository;
import com.carbontrack.repository.UserChallengeRepository;
import com.carbontrack.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Comparator;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Service
public class ChallengeService {

    private static final DateTimeFormatter ACT_FMT = DateTimeFormatter.ofPattern("dd/MM/yyyy");
    private static final Set<String> VALID_MATCH = Set.of("SUBCATEGORY", "CATEGORY");

    private final ChallengeRepository challengeRepo;
    private final UserChallengeRepository userChallengeRepo;
    private final ActivityRepository activityRepo;
    private final UserRepository userRepo;

    public ChallengeService(ChallengeRepository challengeRepo,
                            UserChallengeRepository userChallengeRepo,
                            ActivityRepository activityRepo,
                            UserRepository userRepo) {
        this.challengeRepo = challengeRepo;
        this.userChallengeRepo = userChallengeRepo;
        this.activityRepo = activityRepo;
        this.userRepo = userRepo;
    }

    /** Danh sách challenge đang mở, kèm trạng thái + tiến độ của người dùng. */
    public List<ChallengeView> listForUser(String userId) {
        List<Activity> acts = activityRepo.findByUserId(userId);

        return challengeRepo.findByActiveTrue().stream().map(ch -> {
            var ucOpt = userChallengeRepo.findByUserIdAndChallengeId(userId, ch.getId());
            if (ucOpt.isEmpty()) {
                return new ChallengeView(ch.getId(), ch.getTitle(), ch.getDescription(),
                        ch.getPoints(), ch.getTarget(), false, 0, null,
                        ch.getMatchType(), ch.getMatchValue());
            }

            UserChallenge uc = ucOpt.get();
            int progress = computeProgress(acts, ch, uc.getJoinedDate());
            String status = uc.getStatus();

            // Chuyển sang COMPLETED + cộng điểm (chỉ 1 lần) khi đạt mục tiêu
            if (progress >= ch.getTarget() && !"COMPLETED".equals(status)) {
                uc.setStatus("COMPLETED");
                userChallengeRepo.save(uc);
                userRepo.findById(userId).ifPresent(u -> {
                    u.setPoints(u.getPoints() + ch.getPoints());
                    userRepo.save(u);
                });
                status = "COMPLETED";
            }

            return new ChallengeView(ch.getId(), ch.getTitle(), ch.getDescription(),
                    ch.getPoints(), ch.getTarget(), true,
                    Math.min(progress, ch.getTarget()), status,
                    ch.getMatchType(), ch.getMatchValue());
        }).toList();
    }

    private int computeProgress(List<Activity> acts, Challenge ch, String joinedDateIso) {
        LocalDate joined = LocalDate.parse(joinedDateIso); // ISO yyyy-MM-dd
        boolean byCategory = "CATEGORY".equals(ch.getMatchType());
        return (int) acts.stream().filter(a -> {
            LocalDate d = LocalDate.parse(a.getDate(), ACT_FMT);
            if (d.isBefore(joined)) return false;
            return byCategory
                    ? ch.getMatchValue().equals(a.getCategory())
                    : ch.getMatchValue().equals(a.getActivity());
        }).count();
    }

    /** Tham gia 1 challenge (idempotent: đã join rồi thì bỏ qua). */
    public void join(String userId, String challengeId) {
        Challenge ch = challengeRepo.findById(challengeId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Challenge not found"));
        if (userChallengeRepo.findByUserIdAndChallengeId(userId, ch.getId()).isPresent()) {
            return;
        }
        userChallengeRepo.save(new UserChallenge(
                null, userId, challengeId, LocalDate.now().toString(), "IN_PROGRESS"));
    }

    // ===== Admin =====

    /** Tất cả challenge (kể cả inactive) + số người tham gia / đã hoàn thành. */
    public List<AdminChallengeView> listAll() {
        // chỉ đếm user còn tồn tại (khớp với danh sách người tham gia; dữ liệu cũ có thể còn bản ghi của user đã xóa)
        List<UserChallenge> all0 = userChallengeRepo.findAll();
        Set<String> existing = new HashSet<>();
        userRepo.findAllById(all0.stream().map(UserChallenge::getUserId).distinct().toList())
                .forEach(u -> existing.add(u.getId()));
        List<UserChallenge> joins = all0.stream().filter(uc -> existing.contains(uc.getUserId())).toList();
        Map<String, Challenge> byId = new HashMap<>();
        List<Challenge> all = challengeRepo.findAll();
        all.forEach(ch -> byId.put(ch.getId(), ch));

        // tải activity mỗi người 1 lần, dùng chung cho mọi challenge họ tham gia
        Map<String, List<Activity>> actsByUser = new HashMap<>();
        Map<String, int[]> stats = new HashMap<>(); // challengeId -> [participants, completed]
        for (UserChallenge uc : joins) {
            Challenge ch = byId.get(uc.getChallengeId());
            if (ch == null) continue;
            List<Activity> acts = actsByUser.computeIfAbsent(uc.getUserId(), activityRepo::findByUserId);
            int[] s = stats.computeIfAbsent(ch.getId(), k -> new int[2]);
            s[0]++;
            if (isCompleted(uc, computeProgress(acts, ch, uc.getJoinedDate()), ch)) s[1]++;
        }
        return all.stream().map(ch -> {
            int[] s = stats.getOrDefault(ch.getId(), new int[2]);
            return toAdminView(ch, s[0], s[1]);
        }).toList();
    }

    /** Những người đã tham gia 1 challenge + tiến độ (tính trực tiếp từ activity). */
    public List<Participant> participants(String challengeId) {
        Challenge ch = challengeRepo.findById(challengeId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Challenge not found"));
        List<UserChallenge> joins = userChallengeRepo.findByChallengeId(challengeId);
        Map<String, User> users = new HashMap<>();
        userRepo.findAllById(joins.stream().map(UserChallenge::getUserId).toList())
                .forEach(u -> users.put(u.getId(), u));

        return joins.stream()
                .filter(uc -> users.containsKey(uc.getUserId())) // bỏ qua user đã bị xóa
                .map(uc -> {
                    User u = users.get(uc.getUserId());
                    int progress = computeProgress(activityRepo.findByUserId(u.getId()), ch, uc.getJoinedDate());
                    String status = isCompleted(uc, progress, ch) ? "COMPLETED" : "IN_PROGRESS";
                    return new Participant(u.getId(), u.getName(), u.getAvatarUrl(), uc.getJoinedDate(),
                            Math.min(progress, ch.getTarget()), ch.getTarget(), status);
                })
                // xong trước, rồi tiến độ cao -> thấp
                .sorted(Comparator.comparing((Participant p) -> !"COMPLETED".equals(p.status()))
                        .thenComparing(Participant::progress, Comparator.reverseOrder()))
                .toList();
    }

    /**
     * Admin chỉ xem, không cộng điểm: trạng thái lưu có thể chưa kịp cập nhật
     * (chỉ cập nhật khi user mở trang Challenges) nên tính lại từ tiến độ.
     */
    private static boolean isCompleted(UserChallenge uc, int progress, Challenge ch) {
        return "COMPLETED".equals(uc.getStatus()) || progress >= ch.getTarget();
    }

    private static AdminChallengeView toAdminView(Challenge ch, int participants, int completed) {
        return new AdminChallengeView(ch.getId(), ch.getTitle(), ch.getDescription(), ch.getPoints(),
                ch.getMatchType(), ch.getMatchValue(), ch.getTarget(), ch.isActive(), participants, completed);
    }

    public AdminChallengeView create(CreateChallengeRequest r) {
        if (!VALID_MATCH.contains(r.matchType())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "matchType phải là SUBCATEGORY hoặc CATEGORY");
        }
        Challenge ch = new Challenge(null, r.title(), r.description(),
                r.points(), r.matchType(), r.matchValue(), r.target(), true);
        return toAdminView(challengeRepo.save(ch), 0, 0);
    }

    public void delete(String challengeId) {
        if (!challengeRepo.existsById(challengeId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Challenge not found");
        }
        challengeRepo.deleteById(challengeId);
        userChallengeRepo.deleteByChallengeId(challengeId); // dọn tham gia liên quan
    }
}
