package com.example.manufacturing.repository;

import com.example.manufacturing.model.StockLedger;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository for accessing StockLedger data.
 */
@Repository
public interface StockLedgerRepository extends JpaRepository<StockLedger, Long> {
    /**
     * Finds all ledger entries for a specific stock keeping unit (SKU).
     * @param sku The SKU to search for.
     * @return A list of stock ledger entries.
     */
    List<StockLedger> findBySku(String sku);
}

