package com.example.manufacturing.repository;



import com.example.manufacturing.model.BillOfMaterials;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BomRepository extends JpaRepository<BillOfMaterials, Long> {
    BillOfMaterials findByProductSku(String sku);
}
