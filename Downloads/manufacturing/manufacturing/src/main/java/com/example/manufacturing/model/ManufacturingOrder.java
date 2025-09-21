package com.example.manufacturing.model;


import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ManufacturingOrder {

    // --- Start of Update: Define Enums for Status and Priority ---
    public enum OrderStatus {
        DRAFT,
        CONFIRMED,
        IN_PROGRESS,
        COMPLETED,
        CANCELLED
    }

    public enum OrderPriority {
        LOW,
        MEDIUM,
        HIGH,
        URGENT
    }
    // --- End of Update ---

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String orderId; // Human-readable ID like "MO-001"

    @NotBlank
    private String productName;

    @NotBlank
    private String sku;

    @NotNull
    @Min(1)
    private Integer quantity;

    // --- Start of Update: Change field types to Enum ---
    @NotNull
    @Enumerated(EnumType.STRING)
    private OrderStatus status;

    @Enumerated(EnumType.STRING)
    private OrderPriority priority;
    // --- End of Update ---

    private String assignee;

    private LocalDate startDate;

    @NotNull
    private LocalDate dueDate;

    @Min(0)
    private Integer progress;

    private String bomSku;

    private Integer estimatedTime;

    private LocalDate createdDate;

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "manufacturing_order_id")
    private List<WorkOrder> workOrders = new ArrayList<>();

    // Constructor to fix the "no suitable constructor" error from the data initializer
    // --- Start of Update: Changed status type in constructor ---
    public ManufacturingOrder(String orderId, String productName, int quantity, OrderStatus status, int progress, String assignee, LocalDate dueDate) {
        this.orderId = orderId;
        this.productName = productName;
        this.quantity = quantity;
        this.status = status;
        this.progress = progress;
        this.assignee = assignee;
        this.dueDate = dueDate;
        this.createdDate = LocalDate.now(); // Set a default created date
    }
    // --- End of Update ---
}

