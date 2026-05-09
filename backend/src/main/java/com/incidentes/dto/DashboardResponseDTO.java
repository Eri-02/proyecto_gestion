package com.incidentes.dto;

import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardResponseDTO {

    // ---- KPIs principales ----
    private BigDecimal mttrHoras;
    private BigDecimal desviacionPromedio;
    private Long incidentesActivos;
    private Long incidentesCriticos;
    private Long totalIncidentes;

    // ---- Resumen financiero global ----
    private BigDecimal costoEstimadoTotal;
    private BigDecimal costoRealTotal;
    private BigDecimal ingresosTotal;
    private BigDecimal margenTotal;

    // ---- Lista de incidentes críticos (desviación > 15%) ----
    private List<IncidenteCriticoDTO> listaIncidentesCriticos;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class IncidenteCriticoDTO {
        private Long id;
        private String titulo;
        private BigDecimal costoEstimado;
        private BigDecimal costoReal;
        private BigDecimal desviacionPorcentual;
        private BigDecimal ingresos;
        private BigDecimal margenPorcentual;
    }
}
