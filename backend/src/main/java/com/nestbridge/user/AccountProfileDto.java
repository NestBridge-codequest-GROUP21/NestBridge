package com.nestbridge.user;

import com.nestbridge.common.PrimaryIntent;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AccountProfileDto {
    private PrimaryIntent primaryIntent;
    private Boolean isActiveExchangeStudent;
    private ProfileProgressDto seekerSetup;
    private ProfileProgressDto hostProvider;
    private ProfileProgressDto guideProvider;
}
