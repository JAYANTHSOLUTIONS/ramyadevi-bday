package com.example.manufacturing.model;



import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @ToString
public class BillOfMaterials {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String productSku;
    private String productName;

    @OneToMany(mappedBy = "bom", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<BomItem> items;
}
