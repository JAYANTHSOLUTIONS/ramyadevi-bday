package com.example.manufacturing.model;



import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @ToString
public class BomItem {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String materialSku; // points to StockItem.sku
    private Integer qtyPerProduct; // how many units of material needed per finished product

    @ManyToOne
    private BillOfMaterials bom;
}
