package com.example.manufacturing.util;


import com.example.manufacturing.model.ManufacturingOrder;
import com.example.manufacturing.model.StockItem;
import com.example.manufacturing.repository.ManufacturingOrderRepository;
import com.example.manufacturing.repository.StockItemRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

/**
 * Initializes the database with sample data on application startup.
 */
@Component
public class DashboardDataInit implements CommandLineRunner {

    private final StockItemRepository stockItemRepository;
    private final ManufacturingOrderRepository orderRepository;

    public DashboardDataInit(StockItemRepository stockItemRepository, ManufacturingOrderRepository orderRepository) {
        this.stockItemRepository = stockItemRepository;
        this.orderRepository = orderRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        // Only initialize if the database is empty
        if (orderRepository.count() == 0 && stockItemRepository.count() == 0) {
            initializeStockItems();
            initializeManufacturingOrders();
        }
    }

    private void initializeStockItems() {
        List<StockItem> items = List.of(
                new StockItem(null, "RM-LEG-01", "Wooden Legs", 120),
                new StockItem(null, "RM-TOP-01", "Wooden Tops", 45),
                new StockItem(null, "RM-SCR-01", "Screws", 2400),
                new StockItem(null, "RM-VAR-01", "Varnish", 8)
        );
        stockItemRepository.saveAll(items);
    }

    private void initializeManufacturingOrders() {
        // --- FIX: Use the OrderStatus enum instead of raw strings ---
        List<ManufacturingOrder> orders = List.of(
                new ManufacturingOrder("MO-001", "Wooden Table", 10, ManufacturingOrder.OrderStatus.IN_PROGRESS, 65, "John Smith", LocalDate.now().plusDays(5)),
                new ManufacturingOrder("MO-002", "Office Chair", 25, ManufacturingOrder.OrderStatus.COMPLETED, 100, "Sarah Johnson", LocalDate.now().minusDays(1)),
                new ManufacturingOrder("MO-003", "Desk Lamp", 50, ManufacturingOrder.OrderStatus.DRAFT, 0, "Mike Wilson", LocalDate.now().plusDays(9)),
                new ManufacturingOrder("MO-004", "Bookshelf", 15, ManufacturingOrder.OrderStatus.IN_PROGRESS, 30, "John Smith", LocalDate.now().plusDays(12)),
                new ManufacturingOrder("MO-005", "Cabinet", 5, ManufacturingOrder.OrderStatus.CONFIRMED, 0, "Emily White", LocalDate.now().plusDays(15))
        );
        orderRepository.saveAll(orders);
    }
}

