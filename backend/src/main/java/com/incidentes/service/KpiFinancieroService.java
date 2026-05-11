package com.incidentes.service;

import com.incidentes.dto.KpiFinancieroPeriodoDTO;
import com.incidentes.model.CostoExtra;
import com.incidentes.model.HoraTrabajada;
import com.incidentes.model.Incidente;
import com.incidentes.repository.CostoExtraRepository;
import com.incidentes.repository.HoraTrabajadaRepository;
import com.incidentes.repository.IncidenteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class KpiFinancieroService {

    private static final BigDecimal CIEN = BigDecimal.valueOf(100);

    private final IncidenteRepository incidenteRepository;
    private final HoraTrabajadaRepository horaTrabajadaRepository;
    private final CostoExtraRepository costoExtraRepository;
    private final PresupuestoService presupuestoService;

    public KpiFinancieroPeriodoDTO obtenerKpis(LocalDate inicio, LocalDate fin) {
        LocalDate start = inicio != null ? inicio : LocalDate.now().withDayOfMonth(1);
        LocalDate end = fin != null ? fin : LocalDate.now();

        LocalDateTime startDateTime = start.atStartOfDay();
        LocalDateTime endDateTime = end.atTime(LocalTime.MAX);

        BigDecimal horasFacturables = horaTrabajadaRepository.sumCostoByPeriodoAndFacturable(start, end, true);
        BigDecimal horasNoFacturables = horaTrabajadaRepository.sumCostoByPeriodoAndFacturable(start, end, false);
        BigDecimal extrasFacturables = costoExtraRepository.sumMontosByPeriodoAndFacturable(start, end, true);
        BigDecimal extrasNoFacturables = costoExtraRepository.sumMontosByPeriodoAndFacturable(start, end, false);

        BigDecimal costosFacturables = horasFacturables.add(extrasFacturables);
        BigDecimal costosNoFacturables = horasNoFacturables.add(extrasNoFacturables);
        BigDecimal costoReal = costosFacturables.add(costosNoFacturables);

        BigDecimal ingresos = incidenteRepository.findByFechaCreacionBetween(startDateTime, endDateTime).stream()
                .map(i -> i.getIngresos() != null ? i.getIngresos() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal rentabilidad = ingresos.subtract(costoReal);
        BigDecimal rentabilidadPorcentual = porcentaje(rentabilidad, ingresos);

        List<KpiFinancieroPeriodoDTO.TopClienteCostoDTO> topClientes = obtenerTopClientes(start, end);
        KpiFinancieroPeriodoDTO.PresupuestoComparacionDTO presupuesto = compararPresupuesto(start, end, costoReal);
        List<KpiFinancieroPeriodoDTO.AlertaDesvioDTO> alertas = construirAlertas(presupuesto);

        return KpiFinancieroPeriodoDTO.builder()
                .inicio(start)
                .fin(end)
                .ingresos(ingresos)
                .costoReal(costoReal)
                .rentabilidadMensual(rentabilidad)
                .rentabilidadPorcentual(rentabilidadPorcentual)
                .costosFacturables(costosFacturables)
                .costosNoFacturables(costosNoFacturables)
                .topClientesPorCosto(topClientes)
                .presupuesto(presupuesto)
                .alertas(alertas)
                .build();
    }

    private List<KpiFinancieroPeriodoDTO.TopClienteCostoDTO> obtenerTopClientes(LocalDate inicio, LocalDate fin) {
        Map<String, BigDecimal> costosPorCliente = new HashMap<>();

        for (HoraTrabajada h : horaTrabajadaRepository.findByFechaTrabajoBetween(inicio, fin)) {
            String cliente = cliente(h.getIncidente());
            BigDecimal costo = h.getHoras().multiply(h.getRecurso().getCostoPorHora());
            costosPorCliente.merge(cliente, costo, BigDecimal::add);
        }

        for (CostoExtra c : costoExtraRepository.findByFechaBetween(inicio, fin)) {
            String cliente = cliente(c.getIncidente());
            costosPorCliente.merge(cliente, c.getMonto(), BigDecimal::add);
        }

        return costosPorCliente.entrySet().stream()
                .map(e -> KpiFinancieroPeriodoDTO.TopClienteCostoDTO.builder()
                        .cliente(e.getKey())
                        .costo(e.getValue())
                        .build())
                .sorted((a, b) -> b.getCosto().compareTo(a.getCosto()))
                .limit(5)
                .collect(Collectors.toList());
    }

    private KpiFinancieroPeriodoDTO.PresupuestoComparacionDTO compararPresupuesto(LocalDate inicio, LocalDate fin, BigDecimal costoReal) {
        PresupuestoService.PresupuestoComparacion comparacion = presupuestoService.compararPeriodo(inicio, fin, costoReal);
        if (comparacion == null) {
            return null;
        }

        return KpiFinancieroPeriodoDTO.PresupuestoComparacionDTO.builder()
                .presupuestoId(comparacion.presupuestoId())
                .nombre(comparacion.nombre())
                .montoPresupuestado(comparacion.montoPresupuestado())
                .costoReal(comparacion.costoReal())
                .desviacionAbsoluta(comparacion.desviacionAbsoluta())
                .desviacionPorcentual(comparacion.desviacionPorcentual())
                .umbralAlertaPorcentaje(comparacion.umbralAlertaPorcentaje())
                .excedeUmbral(comparacion.excedeUmbral())
                .build();
    }

    private List<KpiFinancieroPeriodoDTO.AlertaDesvioDTO> construirAlertas(KpiFinancieroPeriodoDTO.PresupuestoComparacionDTO presupuesto) {
        if (presupuesto == null || !Boolean.TRUE.equals(presupuesto.getExcedeUmbral())) {
            return Collections.emptyList();
        }

        return List.of(KpiFinancieroPeriodoDTO.AlertaDesvioDTO.builder()
                .tipo("PRESUPUESTO_SUPERADO")
                .mensaje("El costo real supera el umbral configurado para el presupuesto del periodo")
                .valor(presupuesto.getDesviacionPorcentual())
                .umbral(presupuesto.getUmbralAlertaPorcentaje())
                .build());
    }

    private BigDecimal porcentaje(BigDecimal valor, BigDecimal base) {
        if (base == null || base.compareTo(BigDecimal.ZERO) == 0) {
            return BigDecimal.ZERO;
        }
        return valor.multiply(CIEN).divide(base, 2, RoundingMode.HALF_UP);
    }

    private String cliente(Incidente incidente) {
        return incidente.getCliente() != null && !incidente.getCliente().isBlank()
                ? incidente.getCliente()
                : "Sin cliente";
    }
}
