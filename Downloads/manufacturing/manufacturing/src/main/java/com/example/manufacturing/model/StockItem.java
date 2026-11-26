package com.example.manufacturing.model;


import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Represents a stock item in the inventory.
 * This entity maps to the 'stock_items' table.
 */
@Entity
@Table(name = "stock_items")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class StockItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "SKU cannot be blank")
    private String sku;

    @NotBlank(message = "Name cannot be blank")
    private String name;

    @NotNull(message = "Quantity cannot be null")
    @Min(value = 0, message = "Quantity cannot be negative")
    private Integer quantity;

    /**
     * Custom constructor to allow creating new StockItem instances
     * without providing an ID.
     * @param sku The unique SKU.
     * @param name The name of the item.
     * @param quantity The current quantity.
     */
    public StockItem(String sku, String name, Integer quantity) {
        this.sku = sku;
        this.name = name;
        this.quantity = quantity;
    }
}

