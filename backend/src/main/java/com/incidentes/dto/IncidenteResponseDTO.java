package com.incidentes.dto;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class IncidenteResponseDTO {
    private Long id;
    private String titulo;
    private String descripcion;
    // Prioridad
    private Long prioridadId;
    private String prioridadNombre;
    private Integer prioridadNivel;
    private String prioridadColor;
    // Estado
    private Long estadoId;
    private String estadoNombre;
    private String estadoColor;
    // Financiero
    private BigDecimal costoEstimado;
    private BigDecimal ingresos;
    private BigDecimal costoReal;
    private BigDecimal desviacionPorcentual;
    private BigDecimal costoManoObra;
    private BigDecimal costoExtras;
    private BigDecimal margenAbsoluto;
    private BigDecimal margenPorcentual;
    // Fechas
    private LocalDateTime fechaCreacion;
    private LocalDateTime fechaResolucion;
    private LocalDateTime fechaCierre;
    // Relaciones
    private Long creadoPorUsuarioId;
    private String creadoPorNombre;
    private Long resueltoPorUsuarioId;
    private String resueltoPorNombre;
    private String cliente;
    private String sistemaAfectado;
    private String descripcionTecnica;
    private String leccionesAprendidas;
    // Métricas
    private Long horasParaResolucion;
    private Boolean activo;
    // Detalle
    private List<HoraTrabajadaResponseDTO> horasTrabajadas;
    private List<CostoExtraResponseDTO> costosExtras;
}
