package com.incidentes.dto;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class KpiFinancieroPeriodoDTO {
    private LocalDate inicio;
    private LocalDate fin;
    private BigDecimal ingresos;
    private BigDecimal costoReal;
    private BigDecimal rentabilidadMensual;
    private BigDecimal rentabilidadPorcentual;
    private BigDecimal costosFacturables;
    private BigDecimal costosNoFacturables;
    private List<TopClienteCostoDTO> topClientesPorCosto;
    private PresupuestoComparacionDTO presupuesto;
    private List<AlertaDesvioDTO> alertas;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TopClienteCostoDTO {
        private String cliente;
        private BigDecimal costo;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PresupuestoComparacionDTO {
        private Long presupuestoId;
        private String nombre;
        private BigDecimal montoPresupuestado;
        private BigDecimal costoReal;
        private BigDecimal desviacionAbsoluta;
        private BigDecimal desviacionPorcentual;
        private BigDecimal umbralAlertaPorcentaje;
        private Boolean excedeUmbral;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AlertaDesvioDTO {
        private String tipo;
        private String mensaje;
        private BigDecimal valor;
        private BigDecimal umbral;
    }
}
