package com.nestbridge.admin;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class StaffAuditRequest {

    @NotBlank(message = "action is required.")
    @Size(max = 64)
    private String action;

    @Size(max = 2000)
    private String detail;
}
