package com.incidentes.service;

import com.incidentes.dto.DashboardResponseDTO;
import com.incidentes.model.Incidente;
import com.incidentes.model.VistaKpiFinanciero;
import com.incidentes.repository.IncidenteRepository;
import com.incidentes.repository.VistaKpiFinancieroRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Duration;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class DashboardService {

    @Autowired
    private IncidenteRepository incidenteRepository;

    @Autowired
    private VistaKpiFinancieroRepository vistaKpiFinancieroRepository;

    public DashboardResponseDTO obtenerResumen() {
        // MTTR - Mean Time To Resolve (en horas)
        BigDecimal mttr = calcularMTTR();

        // Desviación promedio
        List<VistaKpiFinanciero> todosKpi = vistaKpiFinancieroRepository.findAll();
        BigDecimal desviacionPromedio = calcularDesviacionPromedio(todosKpi);

        // Conteos
        Long incidentesActivos = incidenteRepository.countIncidentesActivos();
        Long incidentesCriticos = incidenteRepository.countIncidentesCriticosActivos();
        Long totalIncidentes = incidenteRepository.count();

        // Totales financieros
        BigDecimal costoEstimadoTotal = BigDecimal.ZERO;
        BigDecimal costoRealTotal = BigDecimal.ZERO;
        BigDecimal ingresosTotal = BigDecimal.ZERO;

        for (VistaKpiFinanciero kpi : todosKpi) {
            if (kpi.getCostoEstimado() != null) costoEstimadoTotal = costoEstimadoTotal.add(kpi.getCostoEstimado());
            if (kpi.getCostoReal() != null) costoRealTotal = costoRealTotal.add(kpi.getCostoReal());
            if (kpi.getIngresos() != null) ingresosTotal = ingresosTotal.add(kpi.getIngresos());
        }

        BigDecimal margenTotal = ingresosTotal.subtract(costoRealTotal);

        return DashboardResponseDTO.builder()
                .mttrHoras(mttr)
                .desviacionPromedio(desviacionPromedio)
                .incidentesActivos(incidentesActivos)
                .incidentesCriticos(incidentesCriticos)
                .totalIncidentes(totalIncidentes)
                .costoEstimadoTotal(costoEstimadoTotal)
                .costoRealTotal(costoRealTotal)
                .ingresosTotal(ingresosTotal)
                .margenTotal(margenTotal)
                .build();
    }

    public List<DashboardResponseDTO.IncidenteCriticoDTO> obtenerIncidentesCriticos() {
        BigDecimal umbral = new BigDecimal("15");
        List<VistaKpiFinanciero> criticos = vistaKpiFinancieroRepository.findConDesviacionMayorA(umbral);

        return criticos.stream()
                .map(kpi -> DashboardResponseDTO.IncidenteCriticoDTO.builder()
                        .id(kpi.getId())
                        .titulo(kpi.getTitulo())
                        .costoEstimado(kpi.getCostoEstimado())
                        .costoReal(kpi.getCostoReal())
                        .desviacionPorcentual(kpi.getDesviacionPorcentual())
                        .ingresos(kpi.getIngresos())
                        .margenPorcentual(kpi.getMargenPorcentual())
                        .build())
                .collect(Collectors.toList());
    }

    private BigDecimal calcularMTTR() {
        List<Incidente> resueltos = incidenteRepository.findResueltos();

        if (resueltos.isEmpty()) {
            return BigDecimal.ZERO;
        }

        long totalHoras = 0;
        int count = 0;

        for (Incidente inc : resueltos) {
            if (inc.getFechaResolucion() != null && inc.getFechaCreacion() != null) {
                Duration duration = Duration.between(inc.getFechaCreacion(), inc.getFechaResolucion());
                totalHoras += duration.toHours();
                count++;
            }
        }

        if (count == 0) return BigDecimal.ZERO;

        return new BigDecimal(totalHoras)
                .divide(new BigDecimal(count), 2, RoundingMode.HALF_UP);
    }

    private BigDecimal calcularDesviacionPromedio(List<VistaKpiFinanciero> kpis) {
        if (kpis.isEmpty()) return BigDecimal.ZERO;

        BigDecimal suma = BigDecimal.ZERO;
        int count = 0;

        for (VistaKpiFinanciero kpi : kpis) {
            if (kpi.getDesviacionPorcentual() != null) {
                suma = suma.add(kpi.getDesviacionPorcentual().abs());
                count++;
            }
        }

        if (count == 0) return BigDecimal.ZERO;

        return suma.divide(new BigDecimal(count), 2, RoundingMode.HALF_UP);
    }
}
