package com.example.manufacturing.repository;



import com.example.manufacturing.model.ManufacturingOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ManufacturingOrderRepository extends JpaRepository<ManufacturingOrder, Long> {
    /**
     * Custom query method to find an order by its human-readable orderId.
     */
    Optional<ManufacturingOrder> findByOrderId(String orderId);

    /**
     * Custom query to count orders by their status, used by the dashboard service.
     */
    long countByStatus(ManufacturingOrder.OrderStatus status);
}

