package com.nestbridge.user;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class NotificationsPreferenceRequest {

    @NotNull(message = "enabled is required.")
    private Boolean enabled;
}
