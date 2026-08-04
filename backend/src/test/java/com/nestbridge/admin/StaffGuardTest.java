package com.nestbridge.admin;

import com.nestbridge.user.User;
import com.nestbridge.user.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class StaffGuardTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private StaffGuard staffGuard;

    @Test
    void nonStaff_isForbidden() {
        UUID userId = UUID.randomUUID();
        when(userRepository.findById(userId)).thenReturn(Optional.of(
                User.builder().userId(userId).staff(false).suspended(false).build()));

        ResponseStatusException ex = assertThrows(
                ResponseStatusException.class,
                () -> staffGuard.requireStaff(userId));
        assertEquals(HttpStatus.FORBIDDEN, ex.getStatusCode());
    }

    @Test
    void suspendedStaff_isForbidden() {
        UUID userId = UUID.randomUUID();
        when(userRepository.findById(userId)).thenReturn(Optional.of(
                User.builder().userId(userId).staff(true).suspended(true).build()));

        ResponseStatusException ex = assertThrows(
                ResponseStatusException.class,
                () -> staffGuard.requireStaff(userId));
        assertEquals(HttpStatus.FORBIDDEN, ex.getStatusCode());
    }
}
