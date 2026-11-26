package com.example.manufacturing.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Data Transfer Object for creating and updating a Work Order.
 * It uses String types for numerical fields to handle data coming from a web form
 * before conversion in the service layer.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class WorkOrderDto {
    @NotNull(message = "Manufacturing Order ID is required")
    private Long manufacturingOrderId;

    @NotBlank(message = "Operation is required")
    private String operation;

    @NotBlank(message = "Status is required")
    private String status;

    @NotBlank(message = "Duration is required")
    @Pattern(regexp = "^[0-9]+$", message = "Duration must be a number")
    private String duration;

    @NotBlank(message = "Work Center is required")
    private String workCenter;
}
