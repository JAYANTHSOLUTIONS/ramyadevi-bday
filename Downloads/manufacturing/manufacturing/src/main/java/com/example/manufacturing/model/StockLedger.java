package com.example.manufacturing.model;




import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Represents a single transaction in the stock audit trail.
 * This is an immutable record of a stock movement.
 */
@Entity
@Table(name = "stock_ledger")
@Data
@NoArgsConstructor
// @AllArgsConstructor has been removed to allow for custom constructors.
public class StockLedger {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String sku;

    private LocalDateTime timestamp;

    private String changeType; // e.g., "SET", "ADJUST", "CONSUME"

    private int quantityChange;

    private int quantityAfterChange;

    private String reason;

    /**
     * Full constructor for creating a complete StockLedger object.
     * @param id The unique ID.
     * @param sku The product SKU.
     * @param timestamp The time of the transaction.
     * @param changeType The type of change.
     * @param quantityChange The amount the quantity changed by.
     * @param quantityAfterChange The total quantity after the transaction.
     * @param reason A description of the reason for the change.
     */
    public StockLedger(Long id, String sku, LocalDateTime timestamp, String changeType, int quantityChange, int quantityAfterChange, String reason) {
        this.id = id;
        this.sku = sku;
        this.timestamp = timestamp;
        this.changeType = changeType;
        this.quantityChange = quantityChange;
        this.quantityAfterChange = quantityAfterChange;
        this.reason = reason;
    }

    /**
     * Added a new constructor to match the arguments from the service layer,
     * which was causing the "no suitable constructor" error.
     */
    public StockLedger(String sku, LocalDateTime timestamp, String changeType, int quantityChange, int quantityAfterChange, String reason) {
        this.sku = sku;
        this.timestamp = timestamp;
        this.changeType = changeType;
        this.quantityChange = quantityChange;
        this.quantityAfterChange = quantityAfterChange;
        this.reason = reason;
    }
}

