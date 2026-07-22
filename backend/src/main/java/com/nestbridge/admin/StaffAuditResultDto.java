package com.nestbridge.admin;

import lombok.Builder;
import lombok.Data;

import java.time.OffsetDateTime;
import java.util.UUID;

@Data
@Builder
public class StaffAuditResultDto {
    private UUID auditId;
    private String action;
    private String detail;
    private OffsetDateTime createdAt;
}
