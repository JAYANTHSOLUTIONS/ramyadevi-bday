package com.example.manufacturing.service;

import com.example.manufacturing.model.WorkOrder;
import com.example.manufacturing.model.ManufacturingOrder;
import com.example.manufacturing.repository.WorkOrderRepository;
import com.example.manufacturing.repository.ManufacturingOrderRepository;
import com.example.manufacturing.dto.WorkOrderDto;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * Service layer for managing Work Orders.
 * Handles business logic and data manipulation.
 */
@Service
public class WorkOrderService {

    private final WorkOrderRepository workOrderRepository;
    private final ManufacturingOrderRepository manufacturingOrderRepository;

    @Autowired
    public WorkOrderService(WorkOrderRepository workOrderRepository, ManufacturingOrderRepository manufacturingOrderRepository) {
        this.workOrderRepository = workOrderRepository;
        this.manufacturingOrderRepository = manufacturingOrderRepository;
    }

    /**
     * Creates a new work order.
     *
     * @param workOrderDto The DTO containing work order details.
     * @return The created WorkOrder entity.
     */
    @Transactional
    public WorkOrder createWorkOrder(WorkOrderDto workOrderDto) {
        // Find the associated manufacturing order
        ManufacturingOrder manufacturingOrder = manufacturingOrderRepository.findById(workOrderDto.getManufacturingOrderId())
                .orElseThrow(() -> new EntityNotFoundException("Manufacturing Order not found with ID: " + workOrderDto.getManufacturingOrderId()));

        WorkOrder workOrder = new WorkOrder();
        workOrder.setOperation(workOrderDto.getOperation());
        workOrder.setStatus(workOrderDto.getStatus());

        // Convert the String duration from the DTO to an Integer
        try {
            workOrder.setDuration(Integer.parseInt(workOrderDto.getDuration()));
        } catch (NumberFormatException e) {
            // Throw a specific exception if the duration is not a valid number
            throw new IllegalArgumentException("Invalid duration format. Must be a number.", e);
        }

        workOrder.setWorkCenter(workOrderDto.getWorkCenter());
        workOrder.setManufacturingOrder(manufacturingOrder); // Set the relationship

        return workOrderRepository.save(workOrder);
    }

    /**
     * Retrieves all work orders.
     *
     * @return A list of all work orders.
     */
    public List<WorkOrder> getAllWorkOrders() {
        return workOrderRepository.findAll();
    }

    /**
     * Retrieves a single work order by its ID.
     *
     * @param id The ID of the work order to retrieve.
     * @return An Optional containing the WorkOrder entity if found, otherwise an empty Optional.
     */
    public Optional<WorkOrder> getWorkOrderById(Long id) {
        return workOrderRepository.findById(id);
    }

    /**
     * Updates the status of an existing work order.
     *
     * @param id The ID of the work order to update.
     * @param newStatus The new status string.
     * @return The updated WorkOrder entity.
     */
    @Transactional
    public Optional<WorkOrder> updateWorkOrderStatus(Long id, String newStatus) {
        return workOrderRepository.findById(id).map(workOrder -> {
            workOrder.setStatus(newStatus);
            return workOrderRepository.save(workOrder);
        });
    }

    /**
     * Updates all fields of an existing work order.
     *
     * @param id The ID of the work order to update.
     * @param workOrderDto The DTO containing the updated data.
     * @return An Optional containing the updated WorkOrder entity if found, otherwise an empty Optional.
     */
    @Transactional
    public Optional<WorkOrder> updateWorkOrder(Long id, WorkOrderDto workOrderDto) {
        return workOrderRepository.findById(id).map(workOrder -> {
            workOrder.setOperation(workOrderDto.getOperation());
            workOrder.setStatus(workOrderDto.getStatus());

            try {
                workOrder.setDuration(Integer.parseInt(workOrderDto.getDuration()));
            } catch (NumberFormatException e) {
                throw new IllegalArgumentException("Invalid duration format. Must be a number.", e);
            }
            workOrder.setWorkCenter(workOrderDto.getWorkCenter());
            return workOrderRepository.save(workOrder);
        });
    }

    /**
     * Partially updates an existing work order with the provided fields.
     *
     * @param id The ID of the work order to update.
     * @param updates A map containing the fields to update and their new values.
     * @return An Optional containing the partially updated WorkOrder entity if found, otherwise an empty Optional.
     */
    @Transactional
    public Optional<WorkOrder> updateWorkOrderPartially(Long id, Map<String, Object> updates) {
        return workOrderRepository.findById(id).map(workOrder -> {
            updates.forEach((key, value) -> {
                switch (key) {
                    case "operation":
                        workOrder.setOperation((String) value);
                        break;
                    case "status":
                        workOrder.setStatus((String) value);
                        break;
                    case "duration":
                        try {
                            workOrder.setDuration(Integer.parseInt((String) value));
                        } catch (NumberFormatException e) {
                            throw new IllegalArgumentException("Invalid duration format. Must be a number.", e);
                        }
                        break;
                    case "workCenter":
                        workOrder.setWorkCenter((String) value);
                        break;
                    default:
                        // Ignore unknown fields
                        break;
                }
            });
            return workOrderRepository.save(workOrder);
        });
    }

    /**
     * Deletes a work order by its ID.
     *
     * @param id The ID of the work order to delete.
     */
    @Transactional
    public void deleteWorkOrder(Long id) {
        workOrderRepository.deleteById(id);
    }
}
