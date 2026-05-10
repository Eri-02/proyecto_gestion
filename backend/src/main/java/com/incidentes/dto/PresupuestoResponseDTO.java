package com.incidentes.dto;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PresupuestoResponseDTO {
    private Long id;
    private String nombre;
    private LocalDate fechaInicio;
    private LocalDate fechaFin;
    private BigDecimal montoPresupuestado;
    private BigDecimal umbralAlertaPorcentaje;
    private String descripcion;
    private Long creadoPorUsuarioId;
    private String creadoPorUsuarioNombre;
    private Boolean activo;
    private LocalDateTime fechaCreacion;
    private BigDecimal montoConsumido;
    private BigDecimal montoDisponible;
    private BigDecimal porcentajeConsumo;
    private BigDecimal desviacionAbsoluta;
    private BigDecimal desviacionPorcentual;
    private Boolean excedeUmbral;
    private String estado;
    private String alertaMensaje;
}
