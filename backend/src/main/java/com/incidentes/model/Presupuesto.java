package com.incidentes.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(
        name = "presupuesto",
        uniqueConstraints = @UniqueConstraint(name = "uk_presupuesto_periodo", columnNames = {"fecha_inicio", "fecha_fin"})
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Presupuesto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(name = "nombre", nullable = false, length = 120)
    private String nombre;

    @Column(name = "fecha_inicio", nullable = false)
    private LocalDate fechaInicio;

    @Column(name = "fecha_fin", nullable = false)
    private LocalDate fechaFin;

    @Column(name = "monto_presupuestado", nullable = false, precision = 14, scale = 2)
    @DecimalMin(value = "0.01", message = "El presupuesto debe ser mayor a 0")
    private BigDecimal montoPresupuestado;

    @Builder.Default
    @Column(name = "umbral_alerta_porcentaje", nullable = false, precision = 5, scale = 2)
    @DecimalMin(value = "0.00", message = "El umbral no puede ser negativo")
    @DecimalMax(value = "999.99", message = "El umbral no puede superar 999.99")
    private BigDecimal umbralAlertaPorcentaje = BigDecimal.valueOf(10);

    @Column(name = "descripcion", length = 250)
    private String descripcion;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "creado_por_usuario_id")
    private Usuario creadoPor;

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
        if (this.umbralAlertaPorcentaje == null) {
            this.umbralAlertaPorcentaje = BigDecimal.valueOf(10);
        }
    }
}
