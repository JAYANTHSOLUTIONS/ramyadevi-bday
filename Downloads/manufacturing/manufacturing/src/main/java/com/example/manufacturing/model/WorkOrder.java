package com.example.manufacturing.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class WorkOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String operation;
    private String status;
    private Integer duration;
    private String workCenter;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "manufacturing_order_id")
    @JsonIgnore // Prevents infinite loops during JSON serialization
    private ManufacturingOrder manufacturingOrder;
}
