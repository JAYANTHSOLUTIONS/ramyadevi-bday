package com.example.manufacturing.controller;

import com.example.manufacturing.model.StockLedger;
import com.example.manufacturing.service.StockLedgerService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * REST Controller for viewing stock ledger (audit trail) data.
 * Note: This controller is read-only as ledger entries are created by other services.
 */
@RestController
@RequestMapping("/api/stock-ledger")
public class StockLedgerController {

    private final StockLedgerService stockLedgerService;

    public StockLedgerController(StockLedgerService stockLedgerService) {
        this.stockLedgerService = stockLedgerService;
    }

    /**
     * Gets all stock ledger entries.
     * @return A list of all ledger entries.
     */
    @GetMapping
    public ResponseEntity<List<StockLedger>> getAllEntries() {
        List<StockLedger> entries = stockLedgerService.getAllLedgerEntries();
        return ResponseEntity.ok(entries);
    }

    /**
     * Gets all stock ledger entries for a specific SKU.
     * @param sku The SKU of the stock item.
     * @return A list of matching ledger entries.
     */
    @GetMapping("/{sku}")
    public ResponseEntity<List<StockLedger>> getEntriesBySku(@PathVariable String sku) {
        List<StockLedger> entries = stockLedgerService.getLedgerEntriesBySku(sku);
        return ResponseEntity.ok(entries);
    }
}
