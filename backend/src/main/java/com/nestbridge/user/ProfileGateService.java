package com.nestbridge.user;

import com.nestbridge.common.BookingType;
import com.nestbridge.common.ProfileStatus;
import com.nestbridge.host.HostProfileRepository;
import com.nestbridge.guide.GuideProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProfileGateService {

    private final UserRepository userRepository;
    private final SeekerProfileRepository seekerProfileRepository;
    private final ProviderSetupRepository providerSetupRepository;
    private final HostProfileRepository hostProfileRepository;
    private final GuideProfileRepository guideProfileRepository;

    public void requireEmailVerified(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found."));
        if (!user.isEmailVerified()) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Please verify your email before continuing.");
        }
    }

    /**
     * Staff KYC gate for marketplace actions (book, pay, chat, accept).
     * Browse / explore stays open. NestBridge staff accounts are exempt (ops + preview).
     */
    public void requireIdentityVerified(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found."));
        if (user.isStaff()) {
            return;
        }
        if (!user.isIdentityVerified()) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "NestBridge staff must verify your identity before you can book, pay, message, or accept requests. You can still browse.");
        }
    }

    public void requireSeekerComplete(UUID userId) {
        SeekerProfile seeker = seekerProfileRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.FORBIDDEN,
                        "Complete your travel profile before booking."));
        if (seeker.getStatus() != ProfileStatus.COMPLETE) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Complete your travel profile before booking.");
        }
        requireIdentityProfile(userId, seeker.getProfileData(),
                "Add and lock your short bio and about section before booking. Browsing stays open.");
    }

    public void requireHostProviderComplete(UUID userId) {
        // Browse is open; hosting (accept / earn) needs locked bio+about AND staff KYC.
        requireIdentityVerified(userId);
        ProviderSetup host = providerSetupRepository.findByUserIdAndTrack(userId, "HOST")
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.FORBIDDEN,
                        "Complete your host listing setup before accepting requests."));
        if (host.getStatus() != ProfileStatus.COMPLETE) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Complete your host listing setup before accepting requests.");
        }
        requireIdentityProfile(userId, host.getProfileData(),
                "Add and lock your short bio and about section before accepting requests.");
        if (!hostProfileRepository.findByUserId(userId).isPresent()) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Publish your host listing before accepting requests.");
        }
    }

    public void requireGuideProviderComplete(UUID userId) {
        // Browse is open; guiding (accept / earn) needs locked bio+about AND staff KYC.
        requireIdentityVerified(userId);
        ProviderSetup guide = providerSetupRepository.findByUserIdAndTrack(userId, "GUIDE")
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.FORBIDDEN,
                        "Complete your guide listing setup before accepting sessions."));
        if (guide.getStatus() != ProfileStatus.COMPLETE) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Complete your guide listing setup before accepting sessions.");
        }
        requireIdentityProfile(userId, guide.getProfileData(),
                "Add and lock your short bio and about section before accepting sessions.");
        if (!guideProfileRepository.findByUserId(userId).isPresent()) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Publish your guide listing before accepting sessions.");
        }
    }

    /**
     * Messaging is a core activity — require locked bio + about so the other
     * person knows who they are talking to (seeker or provider track).
     */
    public void requireSeekerIdentityForMessaging(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found."));
        if (UserProfileService.hasIdentity(user)) {
            return;
        }
        SeekerProfile seeker = seekerProfileRepository.findById(userId).orElse(null);
        if (seeker != null && UserProfileService.hasIdentityInData(seeker.getProfileData())) {
            return;
        }
        for (String track : new String[] { "HOST", "GUIDE" }) {
            ProviderSetup setup = providerSetupRepository.findByUserIdAndTrack(userId, track).orElse(null);
            if (setup != null && UserProfileService.hasIdentityInData(setup.getProfileData())) {
                return;
            }
        }
        throw new ResponseStatusException(
                HttpStatus.FORBIDDEN,
                "Add and lock your short bio and about section before messaging.");
    }

    private void requireIdentityProfile(UUID userId, Map<String, Object> trackData, String message) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found."));
        if (UserProfileService.hasIdentity(user) || UserProfileService.hasIdentityInData(trackData)) {
            return;
        }
        throw new ResponseStatusException(HttpStatus.FORBIDDEN, message);
    }

    public void requireProviderCompleteForBooking(UUID providerUserId, BookingType type) {
        if (type == BookingType.HOST) {
            requireHostProviderComplete(providerUserId);
        } else {
            requireGuideProviderComplete(providerUserId);
        }
    }
}
