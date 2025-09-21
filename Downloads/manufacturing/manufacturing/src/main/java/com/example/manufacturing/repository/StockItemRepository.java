package com.example.manufacturing.repository;


import com.example.manufacturing.model.StockItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Spring Data JPA repository for the StockItem entity.
 */
@Repository
public interface StockItemRepository extends JpaRepository<StockItem, Long> {

    /**
     * Finds a stock item by its unique SKU.
     * @param sku The SKU to search for.
     * @return An Optional containing the found stock item, or empty if not found.
     */
    Optional<StockItem> findBySku(String sku);
}
