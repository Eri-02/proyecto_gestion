package com.incidentes.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "categoria")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Categoria {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nombre",
            nullable = false,
            unique = true,
            length = 100)
    private String nombre;

    @Column(name = "descripcion",
            length = 255)
    private String descripcion;

    @Builder.Default
    @Column(name = "activo")
    private Boolean activo = true;
}