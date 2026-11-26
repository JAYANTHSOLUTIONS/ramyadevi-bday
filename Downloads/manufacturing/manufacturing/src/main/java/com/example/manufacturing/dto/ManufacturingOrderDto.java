package com.example.manufacturing.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Data Transfer Object (DTO) for creating and updating a Manufacturing Order.
 * This separates the API's data contract from the database entity.
 */
@Data
@NoArgsConstructor
public class ManufacturingOrderDto {
    @NotBlank
    private String productName;

    @NotBlank
    private String sku;

    @NotNull
    private String quantity; // Changed to String to handle form input

    @NotNull
    private String status;

    @NotNull
    private String priority;

    private String assignee;

    @NotBlank
    @Pattern(regexp = "\\d{4}-\\d{2}-\\d{2}", message = "Date must be in yyyy-MM-dd format")
    private String startDate;

    @NotBlank
    @Pattern(regexp = "\\d{4}-\\d{2}-\\d{2}", message = "Date must be in yyyy-MM-dd format")
    private String dueDate;

    @NotNull
    private String progress; // Changed to String to handle form input

    @NotBlank
    private String bomSku;

    @NotNull
    private String estimatedTime; // Changed to String to handle form input
}
