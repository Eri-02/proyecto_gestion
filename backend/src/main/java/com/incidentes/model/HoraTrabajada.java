package com.incidentes.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "hora_trabajada")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HoraTrabajada {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "incidente_id", nullable = false)
    private Incidente incidente;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "recurso_id", nullable = false)
    private Recurso recurso;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "usuario_registra_id", nullable = false)
    private Usuario usuarioRegistra;

    @Column(name = "horas", nullable = false, precision = 8, scale = 2)
    @DecimalMin(value = "0.01", message = "Las horas deben ser mayor a 0")
    @DecimalMax(value = "24.00", message = "Las horas no pueden exceder 24")
    private BigDecimal horas;

    @Column(name = "fecha_trabajo", nullable = false)
    private LocalDate fechaTrabajo;

    @Column(name = "descripcion", length = 200)
    private String descripcion;

    @Builder.Default
    @Column(name = "facturable")
    private Boolean facturable = true;

    @Column(name = "fecha_registro", updatable = false)
    private LocalDateTime fechaRegistro;

    @PrePersist
    protected void onCreate() {
        this.fechaRegistro = LocalDateTime.now();
        if (this.facturable == null) {
            this.facturable = true;
        }
    }
}
