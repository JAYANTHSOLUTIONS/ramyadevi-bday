package com.example.manufacturing.service;

import com.example.manufacturing.dto.ManufacturingOrderDto;
import com.example.manufacturing.model.ManufacturingOrder;
import com.example.manufacturing.repository.ManufacturingOrderRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.concurrent.atomic.AtomicLong;

/**
 * Service class for handling business logic related to Manufacturing Orders.
 */
@Service
public class ManufacturingOrderService {

    private final ManufacturingOrderRepository orderRepository;
    // A thread-safe counter to generate unique, sequential order IDs (e.g., MO-001, MO-002).
    private final AtomicLong orderCounter;

    public ManufacturingOrderService(ManufacturingOrderRepository orderRepository) {
        this.orderRepository = orderRepository;
        // Initialize the counter based on the current number of orders in the database.
        this.orderCounter = new AtomicLong(orderRepository.count());
    }

    /**
     * Retrieves a list of all manufacturing orders with optional sorting and limiting.
     * @param limit The maximum number of orders to return.
     * @param sortField The field to sort by (e.g., "dueDate").
     * @param sortDirection The direction to sort ("asc" or "desc").
     * @return A list of ManufacturingOrder entities.
     */
    public List<ManufacturingOrder> findAllOrders(int limit, String sortField, String sortDirection) {
        Sort sort = Sort.by(Sort.Direction.fromString(sortDirection), sortField);
        Pageable pageable = PageRequest.of(0, limit, sort);
        return orderRepository.findAll(pageable).getContent();
    }

    /**
     * Finds a single manufacturing order by its ID.
     * @param orderId The human-readable ID of the order (e.g., "MO-001").
     * @return The found ManufacturingOrder entity.
     * @throws IllegalArgumentException if the order is not found.
     */
    public ManufacturingOrder findOrderById(String orderId) {
        return orderRepository.findByOrderId(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found with ID: " + orderId));
    }


    /**
     * Creates a new manufacturing order from a DTO.
     * @param dto The data transfer object containing the order details from the API request.
     * @return The newly created and saved ManufacturingOrder entity.
     */
    @Transactional
    public ManufacturingOrder createOrder(ManufacturingOrderDto dto) {
        ManufacturingOrder newOrder = new ManufacturingOrder();

        // Generate the next sequential order ID.
        long nextId = orderCounter.incrementAndGet();
        newOrder.setOrderId(String.format("MO-%03d", nextId));

        // Map fields from the DTO to the entity, converting types where necessary.
        newOrder.setProductName(dto.getProductName());
        newOrder.setSku(dto.getSku());

        // Safely convert String to Integer for numerical fields
        try {
            newOrder.setQuantity(Integer.parseInt(dto.getQuantity()));
            newOrder.setProgress(Integer.parseInt(dto.getProgress()));
            newOrder.setEstimatedTime(Integer.parseInt(dto.getEstimatedTime()));
        } catch (NumberFormatException e) {
            throw new IllegalArgumentException("Invalid number format for quantity, progress, or estimated time.", e);
        }

        newOrder.setStatus(ManufacturingOrder.OrderStatus.valueOf(dto.getStatus().toUpperCase()));

        newOrder.setPriority(ManufacturingOrder.OrderPriority.valueOf(dto.getPriority().toUpperCase()));
        newOrder.setAssignee(dto.getAssignee());
        newOrder.setStartDate(LocalDate.parse(dto.getStartDate()));
        newOrder.setDueDate(LocalDate.parse(dto.getDueDate()));

        // Use the correct setter 'setBomSku' instead of 'setBomId'.
        newOrder.setBomSku(dto.getBomSku());

        newOrder.setCreatedDate(LocalDate.now());

        return orderRepository.save(newOrder);
    }

    /**
     * Updates the status of an existing order.
     * @param orderId The human-readable ID of the order to update (e.g., "MO-001").
     * @param newStatus The new status for the order as a String.
     * @return The updated ManufacturingOrder entity.
     */
    @Transactional
    public ManufacturingOrder updateOrderStatus(String orderId, String newStatus) {
        ManufacturingOrder order = findOrderById(orderId);

        // Convert the incoming String to the OrderStatus Enum.
        ManufacturingOrder.OrderStatus statusEnum = ManufacturingOrder.OrderStatus.valueOf(newStatus.toUpperCase().replace(" ", "_"));
        order.setStatus(statusEnum);

        // Compare against the Enum, not a String.
        if (statusEnum == ManufacturingOrder.OrderStatus.COMPLETED) {
            order.setProgress(100);
        }

        return orderRepository.save(order);
    }

    /**
     * Updates all fields of an existing manufacturing order.
     * @param orderId The ID of the order to update.
     * @param dto The DTO containing the updated data.
     * @return The updated ManufacturingOrder entity.
     */
    @Transactional
    public ManufacturingOrder updateOrder(String orderId, ManufacturingOrderDto dto) {
        ManufacturingOrder existingOrder = findOrderById(orderId);

        // Map fields from the DTO to the existing entity
        existingOrder.setProductName(dto.getProductName());
        existingOrder.setSku(dto.getSku());

        try {
            existingOrder.setQuantity(Integer.parseInt(dto.getQuantity()));
            existingOrder.setProgress(Integer.parseInt(dto.getProgress()));
            existingOrder.setEstimatedTime(Integer.parseInt(dto.getEstimatedTime()));
        } catch (NumberFormatException e) {
            throw new IllegalArgumentException("Invalid number format for quantity, progress, or estimated time.", e);
        }

        existingOrder.setStatus(ManufacturingOrder.OrderStatus.valueOf(dto.getStatus().toUpperCase()));
        existingOrder.setPriority(ManufacturingOrder.OrderPriority.valueOf(dto.getPriority().toUpperCase()));
        existingOrder.setAssignee(dto.getAssignee());
        existingOrder.setStartDate(LocalDate.parse(dto.getStartDate()));
        existingOrder.setDueDate(LocalDate.parse(dto.getDueDate()));
        existingOrder.setBomSku(dto.getBomSku());

        return orderRepository.save(existingOrder);
    }

    /**
     * Partially updates an existing manufacturing order with the provided fields.
     * @param orderId The ID of the order to update.
     * @param updates A map containing the fields to update and their new values.
     * @return The partially updated ManufacturingOrder entity.
     */
    @Transactional
    public ManufacturingOrder updateOrderPartially(String orderId, Map<String, Object> updates) {
        ManufacturingOrder existingOrder = findOrderById(orderId);

        updates.forEach((key, value) -> {
            switch (key) {
                case "productName":
                    existingOrder.setProductName((String) value);
                    break;
                case "sku":
                    existingOrder.setSku((String) value);
                    break;
                case "quantity":
                    existingOrder.setQuantity((Integer) value);
                    break;
                case "progress":
                    existingOrder.setProgress((Integer) value);
                    break;
                case "estimatedTime":
                    existingOrder.setEstimatedTime((Integer) value);
                    break;
                case "status":
                    existingOrder.setStatus(ManufacturingOrder.OrderStatus.valueOf(((String) value).toUpperCase()));
                    break;
                case "priority":
                    existingOrder.setPriority(ManufacturingOrder.OrderPriority.valueOf(((String) value).toUpperCase()));
                    break;
                case "assignee":
                    existingOrder.setAssignee((String) value);
                    break;
                case "startDate":
                    existingOrder.setStartDate(LocalDate.parse((String) value));
                    break;
                case "dueDate":
                    existingOrder.setDueDate(LocalDate.parse((String) value));
                    break;
                case "bomSku":
                    existingOrder.setBomSku((String) value);
                    break;
                default:
                    // Ignore unknown fields
                    break;
            }
        });

        return orderRepository.save(existingOrder);
    }

    /**
     * Deletes a manufacturing order by its ID.
     * @param orderId The ID of the order to delete.
     */
    @Transactional
    public void deleteOrderById(String orderId) {
        ManufacturingOrder order = findOrderById(orderId);
        orderRepository.delete(order);
    }
}
