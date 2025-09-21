package com.example.manufacturing.controller;

import com.example.manufacturing.dto.ManufacturingOrderDto;
import com.example.manufacturing.model.ManufacturingOrder;
import com.example.manufacturing.service.ManufacturingOrderService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/manufacturing-orders")
@CrossOrigin(origins = "http://localhost:3000")
public class ManufacturingOrderController {

    private final ManufacturingOrderService orderService;

    public ManufacturingOrderController(ManufacturingOrderService orderService) {
        this.orderService = orderService;
    }

    /**
     * Handles GET requests to fetch all manufacturing orders with optional sorting and limiting.
     * @param limit The maximum number of orders to return.
     * @param sort The field to sort by (e.g., "dueDate").
     * @param order The sort direction ("asc" or "desc").
     * @return A ResponseEntity containing a list of ManufacturingOrder objects.
     */
    @GetMapping
    public ResponseEntity<List<ManufacturingOrder>> getAllOrders(
            @RequestParam(defaultValue = "10") int limit,
            @RequestParam(defaultValue = "dueDate") String sort,
            @RequestParam(defaultValue = "asc") String order) {
        String[] sortParams = sort.split(",");
        String sortField = sortParams[0];
        String sortDirection = (sortParams.length > 1) ? sortParams[1] : order;

        return ResponseEntity.ok(orderService.findAllOrders(limit, sortField, sortDirection));
    }

    /**
     * Handles GET requests to fetch a single manufacturing order by its ID.
     * @param orderId The ID of the order to retrieve.
     * @return A ResponseEntity containing the found ManufacturingOrder or a 404 Not Found status.
     */
    @GetMapping("/{orderId}")
    public ResponseEntity<ManufacturingOrder> getOrderById(@PathVariable String orderId) {
        ManufacturingOrder order = orderService.findOrderById(orderId);
        if (order != null) {
            return ResponseEntity.ok(order);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Handles POST requests to create a new manufacturing order.
     * The @Valid annotation triggers validation rules defined in the ManufacturingOrderDto.
     * @param orderDto The DTO containing the data for the new order.
     * @return A ResponseEntity containing the newly created ManufacturingOrder and a 201 Created status.
     */
    @PostMapping
    public ResponseEntity<ManufacturingOrder> createOrder(@Valid @RequestBody ManufacturingOrderDto orderDto) {
        ManufacturingOrder createdOrder = orderService.createOrder(orderDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdOrder);
    }

    /**
     * Handles PUT requests to update all fields of an existing manufacturing order.
     * @param orderId The ID of the order to update.
     * @param orderDto The DTO containing the updated data.
     * @return A ResponseEntity containing the updated ManufacturingOrder or a 404 Not Found status.
     */
    @PutMapping("/{orderId}")
    public ResponseEntity<ManufacturingOrder> updateOrder(
            @PathVariable String orderId,
            @Valid @RequestBody ManufacturingOrderDto orderDto) {
        try {
            ManufacturingOrder updatedOrder = orderService.updateOrder(orderId, orderDto);
            return ResponseEntity.ok(updatedOrder);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Handles PATCH requests for partial updates to an existing manufacturing order.
     * This is useful for updating one or two fields without sending the entire object.
     * @param orderId The ID of the order to update.
     * @param updates A map of field names and new values.
     * @return A ResponseEntity containing the partially updated ManufacturingOrder or a 404 Not Found status.
     */
    @PatchMapping("/{orderId}")
    public ResponseEntity<ManufacturingOrder> updatePartialOrder(
            @PathVariable String orderId,
            @RequestBody Map<String, Object> updates) {
        try {
            ManufacturingOrder updatedOrder = orderService.updateOrderPartially(orderId, updates);
            return ResponseEntity.ok(updatedOrder);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }


    /**
     * Handles PUT requests to update the status of an existing order.
     * This method provides a more specific update endpoint for a single field.
     * @param orderId The ID of the order to update.
     * @param statusUpdate A map containing the new "status".
     * @return A ResponseEntity with the updated order or an error status.
     */
    @PutMapping("/{orderId}/status")
    public ResponseEntity<ManufacturingOrder> updateStatus(
            @PathVariable String orderId,
            @RequestBody Map<String, String> statusUpdate) {
        String newStatus = statusUpdate.get("status");
        if (newStatus == null || newStatus.isBlank()) {
            return ResponseEntity.badRequest().build();
        }
        try {
            ManufacturingOrder updatedOrder = orderService.updateOrderStatus(orderId, newStatus);
            return ResponseEntity.ok(updatedOrder);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Handles DELETE requests to remove a manufacturing order by ID.
     * @param orderId The ID of the order to delete.
     * @return A ResponseEntity with a 204 No Content status on success or 404 Not Found if the order does not exist.
     */
    @DeleteMapping("/{orderId}")
    public ResponseEntity<Void> deleteOrder(@PathVariable String orderId) {
        try {
            orderService.deleteOrderById(orderId);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
