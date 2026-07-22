package com.nestbridge.user;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class NotificationsPreferenceResponse {
    private boolean enabled;
}
