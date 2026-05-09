package com.incidentes.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.Immutable;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Immutable
@Table(name = "vista_incidente_completo")
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class VistaIncidenteCompleto {

    @Id
    private Long id;

    private String titulo;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    private String prioridad;

    @Column(name = "prioridad_nivel")
    private Integer prioridadNivel;

    @Column(name = "prioridad_color")
    private String prioridadColor;

    private String estado;

    @Column(name = "estado_color")
    private String estadoColor;

    @Column(name = "costo_estimado", precision = 12, scale = 2)
    private BigDecimal costoEstimado;

    @Column(precision = 12, scale = 2)
    private BigDecimal ingresos;

    @Column(name = "costo_mano_obra", precision = 12, scale = 2)
    private BigDecimal costoManoObra;

    @Column(name = "costo_extras", precision = 12, scale = 2)
    private BigDecimal costoExtras;

    @Column(name = "costo_real", precision = 12, scale = 2)
    private BigDecimal costoReal;

    @Column(name = "fecha_creacion")
    private LocalDateTime fechaCreacion;

    @Column(name = "fecha_resolucion")
    private LocalDateTime fechaResolucion;

    @Column(name = "fecha_cierre")
    private LocalDateTime fechaCierre;

    private String cliente;

    @Column(name = "sistema_afectado")
    private String sistemaAfectado;

    @Column(name = "creado_por")
    private String creadoPor;

    @Column(name = "horas_para_resolucion")
    private Long horasParaResolucion;
}
