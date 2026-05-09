package com.incidentes.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "recurso")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Recurso {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nombre", nullable = false, length = 100)
    private String nombre;

    @Column(name = "cargo", nullable = false, length = 100)
    private String cargo;

    @Column(name = "costo_por_hora", nullable = false, precision = 10, scale = 2)
    @DecimalMin(value = "0.00", message = "El costo por hora debe ser >= 0")
    private BigDecimal costoPorHora;

    @Column(name = "especialidad", length = 100)
    private String especialidad;

    @Column(name = "email", length = 100)
    private String email;

    @Builder.Default
    @Column(name = "activo")
    private Boolean activo = true;

    @Column(name = "fecha_creacion", updatable = false)
    private LocalDateTime fechaCreacion;

    @PrePersist
    protected void onCreate() {
        this.fechaCreacion = LocalDateTime.now();
        if (this.activo == null) {
            this.activo = true;
        }
    }
}
