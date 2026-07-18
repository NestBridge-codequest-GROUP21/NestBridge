package com.nestbridge.admin;

import com.nestbridge.user.User;
import com.nestbridge.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

import java.util.UUID;

@Component
@RequiredArgsConstructor
public class StaffGuard {

    private final UserRepository userRepository;

    public User requireStaff(UUID actorId) {
        User actor = userRepository.findById(actorId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.FORBIDDEN, "Staff access required."));
        if (!actor.isStaff()) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Staff access required.");
        }
        if (actor.isSuspended()) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Staff account is suspended.");
        }
        return actor;
    }
}
