package com.incidentes.dto;

import lombok.*;
import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReportesPeriodoDTO {

    private List<CostoMensualDTO> costosMensuales;
    private List<MttrMensualDTO> mttrMensual;
    private List<IncidentePorCategoriaDTO> incidentesPorCategoria;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CostoMensualDTO {
        private Integer anio;
        private Integer mes;
        private String mesNombre;
        private BigDecimal costoEstimado;
        private BigDecimal costoReal;
        private BigDecimal margen;
        private Long cantidadIncidentes;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MttrMensualDTO {
        private Integer anio;
        private Integer mes;
        private String mesNombre;
        private BigDecimal mttrHoras;
        private Long cantidadResueltos;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class IncidentePorCategoriaDTO {
        private String categoria;
        private Long cantidad;
        private BigDecimal porcentaje;
    }
}
