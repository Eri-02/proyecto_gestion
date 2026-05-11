package com.incidentes.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "incidente")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Incidente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "titulo", nullable = false, length = 200)
    private String titulo;

    @Column(name = "descripcion", nullable = false, columnDefinition = "TEXT")
    private String descripcion;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "prioridad_id", nullable = false)
    private Prioridad prioridad;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "estado_id", nullable = false)
    private Estado estado;

    @Column(name = "costo_estimado", nullable = false, precision = 12, scale = 2)
    @DecimalMin(value = "0.01", message = "El costo estimado debe ser mayor a 0")
    private BigDecimal costoEstimado;

    @Column(name = "ingresos", precision = 12, scale = 2)
    private BigDecimal ingresos;

    @Column(name = "fecha_creacion", updatable = false)
    private LocalDateTime fechaCreacion;

    @Column(name = "fecha_resolucion")
    private LocalDateTime fechaResolucion;

    @Column(name = "fecha_cierre")
    private LocalDateTime fechaCierre;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "creado_por_usuario_id", nullable = false)
    private Usuario creadoPor;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "resuelto_por_usuario_id")
    private Usuario resueltoPor;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "categoria_id", nullable = false)
    private Categoria categoria;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "cliente_id", nullable = false)
    private Cliente cliente;

    @Column(name = "sistema_afectado", length = 200)
    private String sistemaAfectado;

    @Column(name = "descripcion_tecnica", columnDefinition = "TEXT")
    private String descripcionTecnica;

    @Column(name = "lecciones_aprendidas", columnDefinition = "TEXT")
    private String leccionesAprendidas;

    @Builder.Default
    @Column(name = "activo")
    private Boolean activo = true;

    @PrePersist
    protected void onCreate() {
        this.fechaCreacion = LocalDateTime.now();
        if (this.activo == null) {
            this.activo = true;
        }
        if (this.ingresos == null) {
            this.ingresos = BigDecimal.ZERO;
        }
    }
}
