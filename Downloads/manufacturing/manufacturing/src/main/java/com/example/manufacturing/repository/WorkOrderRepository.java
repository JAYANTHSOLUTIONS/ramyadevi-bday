package com.example.manufacturing.repository;

import com.example.manufacturing.model.WorkOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for WorkOrder entities.
 * Provides standard CRUD operations.
 */
@Repository
public interface WorkOrderRepository extends JpaRepository<WorkOrder, Long> {
}
