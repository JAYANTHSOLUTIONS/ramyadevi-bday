package com.example.manufacturing.controller;

import com.example.manufacturing.dto.WorkOrderDto;
import com.example.manufacturing.model.WorkOrder;
import com.example.manufacturing.service.WorkOrderService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * REST Controller for managing Work Orders.
 * Exposes API endpoints for CRUD operations.
 */
@RestController
@RequestMapping("/api/work-orders")
public class WorkOrderController {

    private final WorkOrderService workOrderService;

    public WorkOrderController(WorkOrderService workOrderService) {
        this.workOrderService = workOrderService;
    }

    /**
     * Handles POST requests to create a new work order.
     *
     * @param workOrderDto The work order data to create.
     * @return A ResponseEntity with the created work order and HTTP status CREATED.
     */
    @PostMapping
    public ResponseEntity<WorkOrder> createWorkOrder(@Valid @RequestBody WorkOrderDto workOrderDto) {
        WorkOrder createdWorkOrder = workOrderService.createWorkOrder(workOrderDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdWorkOrder);
    }

    /**
     * Handles GET requests to fetch all work orders.
     *
     * @return A ResponseEntity with a list of all work orders and HTTP status OK.
     */
    @GetMapping
    public ResponseEntity<List<WorkOrder>> getAllWorkOrders() {
        List<WorkOrder> workOrders = workOrderService.getAllWorkOrders();
        return ResponseEntity.ok(workOrders);
    }

    /**
     * Handles GET requests to fetch a single work order by its ID.
     *
     * @param id The ID of the work order to retrieve.
     * @return A ResponseEntity with the work order and HTTP status OK, or NOT_FOUND if the order doesn't exist.
     */
    @GetMapping("/{id}")
    public ResponseEntity<WorkOrder> getWorkOrderById(@PathVariable Long id) {
        Optional<WorkOrder> workOrder = workOrderService.getWorkOrderById(id);
        return workOrder.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    /**
     * Handles PUT requests to update the status of a work order.
     *
     * @param id The ID of the work order to update.
     * @param statusUpdate A map containing the new status.
     * @return A ResponseEntity with the updated work order and HTTP status OK, or NOT_FOUND.
     */
    @PutMapping("/{id}/status")
    public ResponseEntity<WorkOrder> updateWorkOrderStatus(@PathVariable Long id, @RequestBody Map<String, String> statusUpdate) {
        String newStatus = statusUpdate.get("status");
        if (newStatus == null || newStatus.isBlank()) {
            return ResponseEntity.badRequest().build();
        }
        Optional<WorkOrder> updatedWorkOrder = workOrderService.updateWorkOrderStatus(id, newStatus);
        return updatedWorkOrder.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    /**
     * Handles PUT requests to update all fields of an existing work order.
     *
     * @param id The ID of the work order to update.
     * @param workOrderDto The work order data to update.
     * @return A ResponseEntity with the updated work order and HTTP status OK, or NOT_FOUND.
     */
    @PutMapping("/{id}")
    public ResponseEntity<WorkOrder> updateWorkOrder(@PathVariable Long id, @Valid @RequestBody WorkOrderDto workOrderDto) {
        Optional<WorkOrder> updatedWorkOrder = workOrderService.updateWorkOrder(id, workOrderDto);
        return updatedWorkOrder.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    /**
     * Handles PATCH requests for partial updates to an existing work order.
     *
     * @param id The ID of the work order to update.
     * @param updates A map containing the fields to update.
     * @return A ResponseEntity with the updated work order and HTTP status OK, or NOT_FOUND.
     */
    @PatchMapping("/{id}")
    public ResponseEntity<WorkOrder> updateWorkOrderPartially(@PathVariable Long id, @RequestBody Map<String, Object> updates) {
        Optional<WorkOrder> updatedWorkOrder = workOrderService.updateWorkOrderPartially(id, updates);
        return updatedWorkOrder.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    /**
     * Handles DELETE requests to delete a work order.
     *
     * @param id The ID of the work order to delete.
     * @return A ResponseEntity with HTTP status NO_CONTENT.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteWorkOrder(@PathVariable Long id) {
        workOrderService.deleteWorkOrder(id);
        return ResponseEntity.noContent().build();
    }
}
