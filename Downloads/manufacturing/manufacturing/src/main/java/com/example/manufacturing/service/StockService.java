package com.example.manufacturing.service;


import com.example.manufacturing.dto.DashboardDtos;
import com.example.manufacturing.model.StockItem;
import com.example.manufacturing.model.StockLedger;
import com.example.manufacturing.repository.StockItemRepository;
import com.example.manufacturing.repository.StockLedgerRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime; // Ensure this is imported
import java.util.List;
import java.util.stream.Collectors;

@Service
public class StockService {

    private final StockItemRepository stockItemRepository;
    private final StockLedgerRepository stockLedgerRepository;

    public StockService(StockItemRepository stockItemRepository, StockLedgerRepository stockLedgerRepository) {
        this.stockItemRepository = stockItemRepository;
        this.stockLedgerRepository = stockLedgerRepository;
    }

    @Transactional
    public StockItem createOrUpdateStock(String sku, String name, int quantity) {
        if (name == null || name.isBlank()) {
            throw new IllegalArgumentException("Stock item name cannot be null or empty for SKU: " + sku);
        }

        StockItem stockItem = stockItemRepository.findBySku(sku).orElse(new StockItem());
        int oldQuantity = stockItem.getQuantity() != null ? stockItem.getQuantity() : 0;

        stockItem.setSku(sku);
        stockItem.setName(name);
        stockItem.setQuantity(quantity);
        StockItem savedItem = stockItemRepository.save(stockItem);

        int quantityChange = savedItem.getQuantity() - oldQuantity;
        String reason = oldQuantity == 0 ? "Initial stock creation" : "Manual stock update";

        // FIX: Pass LocalDateTime.now() for the timestamp to match the constructor
        StockLedger ledgerEntry = new StockLedger(
                sku,
                LocalDateTime.now(), // This now correctly provides a LocalDateTime object
                "SET",
                quantityChange,
                savedItem.getQuantity(),
                reason
        );
        stockLedgerRepository.save(ledgerEntry);

        return savedItem;
    }

    @Transactional
    public void changeStock(String sku, int qtyChange, String reason) {
        StockItem stockItem = stockItemRepository.findBySku(sku)
                .orElseThrow(() -> new IllegalArgumentException("Stock item not found for SKU: " + sku));

        stockItem.setQuantity(stockItem.getQuantity() + qtyChange);
        StockItem savedItem = stockItemRepository.save(stockItem);

        // FIX: Pass LocalDateTime.now() for the timestamp to match the constructor
        StockLedger ledgerEntry = new StockLedger(
                sku,
                LocalDateTime.now(), // This now correctly provides a LocalDateTime object
                "ADJUST",
                qtyChange,
                savedItem.getQuantity(),
                reason
        );
        stockLedgerRepository.save(ledgerEntry);
    }

    public List<DashboardDtos.ComponentAvailabilityDto> getComponentAvailability(int limit) {
        return stockItemRepository.findAll(PageRequest.of(0, limit)).stream()
                .map(item -> {
                    int required = item.getQuantity() + 20;
                    String status = "good";
                    if (item.getQuantity() < required * 0.75) status = "low";
                    if (item.getQuantity() < required * 0.25) status = "critical";
                    return new DashboardDtos.ComponentAvailabilityDto(item.getName(), item.getQuantity(), required, status);
                })
                .collect(Collectors.toList());
    }
}

