package com.example.manufacturing.service;




import com.example.manufacturing.dto.DashboardDtos;
import com.example.manufacturing.model.ManufacturingOrder;
import com.example.manufacturing.repository.ManufacturingOrderRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class DashboardService {

    private final ManufacturingOrderRepository orderRepository;

    public DashboardService(ManufacturingOrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    public List<DashboardDtos.KpiDto> getKpiData() {
        List<DashboardDtos.KpiDto> kpis = new ArrayList<>();

        // --- FIX: This section shows the correct way to call countByStatus ---
        // Instead of passing a String like "COMPLETED", we pass the Enum constant.
        long completedCount = orderRepository.countByStatus(ManufacturingOrder.OrderStatus.COMPLETED);
        long inProgressCount = orderRepository.countByStatus(ManufacturingOrder.OrderStatus.IN_PROGRESS);
        long confirmedCount = orderRepository.countByStatus(ManufacturingOrder.OrderStatus.CONFIRMED);
        long draftCount = orderRepository.countByStatus(ManufacturingOrder.OrderStatus.DRAFT);
        // --- End of Fix ---

        kpis.add(new DashboardDtos.KpiDto("Orders Completed", String.valueOf(completedCount), "+12%", "up", "CheckCircle", "text-green-400"));
        kpis.add(new DashboardDtos.KpiDto("In Progress", String.valueOf(inProgressCount), "+3", "up", "Clock", "text-blue-400"));
        kpis.add(new DashboardDtos.KpiDto("Confirmed Orders", String.valueOf(confirmedCount), "-1", "down", "AlertTriangle", "text-yellow-400"));
        kpis.add(new DashboardDtos.KpiDto("Draft Orders", String.valueOf(draftCount), "0", "neutral", "Settings", "text-purple-400"));

        return kpis;
    }
}

