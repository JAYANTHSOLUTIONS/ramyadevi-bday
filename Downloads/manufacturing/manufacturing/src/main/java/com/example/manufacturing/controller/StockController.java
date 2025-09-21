package com.example.manufacturing.controller;



import com.example.manufacturing.dto.DashboardDtos;
import com.example.manufacturing.model.StockItem;
import com.example.manufacturing.repository.StockItemRepository;
import com.example.manufacturing.service.StockService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

/**
 * REST Controller for managing stock items and viewing availability.
 */
@RestController
@RequestMapping("/api/stock")
public class StockController {

    private final StockService stockService;
    private final StockItemRepository stockItemRepository; // Injected for simple read operations

    public StockController(StockService stockService, StockItemRepository stockItemRepository) {
        this.stockService = stockService;
        this.stockItemRepository = stockItemRepository;
    }

    /**
     * Endpoint to create a new stock item or update its quantity.
     * @param req The StockItem data from the request body.
     * @return The created or updated StockItem.
     */
    @PostMapping("/create")
    public ResponseEntity<StockItem> createStock(@Valid @RequestBody StockItem req) {
        StockItem saved = stockService.createOrUpdateStock(req.getSku(), req.getName(), req.getQuantity());
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    /**
     * Endpoint to adjust the quantity of an existing stock item.
     * @param sku The SKU of the item to change.
     * @param qtyChange The amount to add (positive) or remove (negative).
     * @param reason A description of the reason for the change.
     * @return A confirmation message.
     */
    @PostMapping("/change")
    public ResponseEntity<String> changeStock(@RequestParam String sku, @RequestParam int qtyChange, @RequestParam String reason) {
        try {
            stockService.changeStock(sku, qtyChange, reason);
            return ResponseEntity.ok("Stock updated successfully for SKU: " + sku);
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage(), e);
        }
    }

    /**
     * Endpoint to retrieve a single stock item by its SKU.
     * @param sku The SKU to search for.
     * @return The found StockItem.
     */
    @GetMapping("/{sku}")
    public ResponseEntity<StockItem> getStockItemBySku(@PathVariable String sku) {
        return stockItemRepository.findBySku(sku)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "StockItem not found with sku: " + sku));
    }

    /**
     * Endpoint to get component availability data for the dashboard.
     * @param limit The number of components to return.
     * @return A list of component availability DTOs.
     */
    @GetMapping("/availability")
    public ResponseEntity<List<DashboardDtos.ComponentAvailabilityDto>> getComponentAvailability(
            @RequestParam(defaultValue = "4") int limit) {
        return ResponseEntity.ok(stockService.getComponentAvailability(limit));
    }
}

