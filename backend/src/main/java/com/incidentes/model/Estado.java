package com.incidentes.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "estado")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Estado {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nombre", nullable = false, unique = true, length = 30)
    private String nombre;

    @Column(name = "descripcion", length = 100)
    private String descripcion;

    @Column(name = "color", length = 20)
    private String color;
}
