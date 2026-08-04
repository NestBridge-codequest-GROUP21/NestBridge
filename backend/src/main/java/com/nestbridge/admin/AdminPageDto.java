package com.nestbridge.admin;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class AdminPageDto<T> {
    private List<T> items;
    private int page;
    private int limit;
    private Long total;
    private boolean hasMore;
}
