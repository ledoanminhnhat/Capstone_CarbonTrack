package com.carbontrack.service;

import com.carbontrack.dto.ChallengeDtos.ChallengeView;
import com.carbontrack.dto.ChallengeDtos.CreateChallengeRequest;
import com.carbontrack.model.Activity;
import com.carbontrack.model.Challenge;
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
import java.util.List;
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

    public List<Challenge> listAll() {
        return challengeRepo.findAll();
    }

    public Challenge create(CreateChallengeRequest r) {
        if (!VALID_MATCH.contains(r.matchType())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "matchType phải là SUBCATEGORY hoặc CATEGORY");
        }
        Challenge ch = new Challenge(null, r.title(), r.description(),
                r.points(), r.matchType(), r.matchValue(), r.target(), true);
        return challengeRepo.save(ch);
    }

    public void delete(String challengeId) {
        if (!challengeRepo.existsById(challengeId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Challenge not found");
        }
        challengeRepo.deleteById(challengeId);
        userChallengeRepo.deleteByChallengeId(challengeId); // dọn tham gia liên quan
    }
}
