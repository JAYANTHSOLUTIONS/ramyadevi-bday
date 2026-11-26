package com.example.manufacturing.controller;

import com.example.manufacturing.model.BillOfMaterials;
import com.example.manufacturing.repository.BomRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/bom")
public class BomController {
    private final BomRepository bomRepository;
    public BomController(BomRepository bomRepository) { this.bomRepository = bomRepository; }

    @PostMapping("/create")
    public ResponseEntity<BillOfMaterials> create(@RequestBody BillOfMaterials bom) {
        // Note: For beginner level we accept BOM with nested BomItems in request body
        BillOfMaterials saved = bomRepository.save(bom);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/{sku}")
    public ResponseEntity<BillOfMaterials> getBySku(@PathVariable String sku) {
        BillOfMaterials bom = bomRepository.findByProductSku(sku);
        return ResponseEntity.ok(bom);
    }
}

