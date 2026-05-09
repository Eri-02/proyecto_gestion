package com.incidentes.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "costo_extra")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CostoExtra {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "incidente_id", nullable = false)
    private Incidente incidente;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "usuario_registra_id", nullable = false)
    private Usuario usuarioRegistra;

    @Column(name = "concepto", nullable = false, length = 200)
    private String concepto;

    @Column(name = "monto", nullable = false, precision = 12, scale = 2)
    @DecimalMin(value = "0.01", message = "El monto debe ser mayor a 0")
    private BigDecimal monto;

    @Column(name = "fecha", nullable = false)
    private LocalDate fecha;

    @Column(name = "proveedor", length = 150)
    private String proveedor;

    @Column(name = "documento_soporte", length = 255)
    private String documentoSoporte;

    @Builder.Default
    @Column(name = "categoria", length = 50)
    private String categoria = "Otros";

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
        if (this.categoria == null) {
            this.categoria = "Otros";
        }
    }
}
