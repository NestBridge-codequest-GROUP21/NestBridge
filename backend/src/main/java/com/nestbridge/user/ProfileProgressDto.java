package com.nestbridge.user;

import com.nestbridge.common.ProfileStatus;
import lombok.Builder;
import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
@Builder
public class ProfileProgressDto {
    private ProfileStatus status;
    private List<String> stepsCompleted;
    private Map<String, Object> data;
}
