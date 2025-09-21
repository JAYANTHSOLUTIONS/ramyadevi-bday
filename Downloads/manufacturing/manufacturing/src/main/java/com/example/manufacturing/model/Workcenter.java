package com.example.manufacturing.model;


import jakarta.persistence.*;
        import lombok.*;

@Entity
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @ToString
public class Workcenter {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String code;
    private String name;
    private Double costPerHour;
    private Boolean active = true;
}
