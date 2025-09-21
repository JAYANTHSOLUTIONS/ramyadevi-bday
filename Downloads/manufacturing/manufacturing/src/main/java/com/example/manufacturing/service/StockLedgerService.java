package com.example.manufacturing.service;


import com.example.manufacturing.model.StockLedger;
import com.example.manufacturing.repository.StockLedgerRepository;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Service for handling business logic related to the stock ledger.
 */
@Service
public class StockLedgerService {

    private final StockLedgerRepository stockLedgerRepository;

    public StockLedgerService(StockLedgerRepository stockLedgerRepository) {
        this.stockLedgerRepository = stockLedgerRepository;
    }

    /**
     * Retrieves all stock ledger entries.
     * @return A list of all entries.
     */
    public List<StockLedger> getAllLedgerEntries() {
        return stockLedgerRepository.findAll();
    }

    /**
     * Retrieves all stock ledger entries for a specific SKU.
     * @param sku The SKU to filter by.
     * @return A list of matching entries.
     */
    public List<StockLedger> getLedgerEntriesBySku(String sku) {
        return stockLedgerRepository.findBySku(sku);
    }

    public void createOrUpdateStock(String s, String woodenLegs, int i) {
    }
}
