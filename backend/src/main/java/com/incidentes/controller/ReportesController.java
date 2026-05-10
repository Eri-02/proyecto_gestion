package com.incidentes.controller;

import com.incidentes.dto.AnalistaDesempenoDTO;
import com.incidentes.dto.ReportesPeriodoDTO;
import com.incidentes.dto.TiempoRespuestaDTO;
import com.incidentes.dto.UtilizacionRecursoDTO;
import com.incidentes.service.ReportesService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/reportes")
@RequiredArgsConstructor
public class ReportesController {

    private final ReportesService reportesService;

    @GetMapping("/costos-mensuales")
    public ResponseEntity<List<ReportesPeriodoDTO.CostoMensualDTO>> obtenerCostosMensuales(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate inicio,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fin) {
        return ResponseEntity.ok(reportesService.obtenerCostosMensuales(inicio, fin));
    }

    @GetMapping("/mttr-historico")
    public ResponseEntity<List<ReportesPeriodoDTO.MttrMensualDTO>> obtenerMttrHistorico(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate inicio,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fin) {
        return ResponseEntity.ok(reportesService.obtenerMttrHistorico(inicio, fin));
    }

    @GetMapping("/incidentes-por-categoria")
    public ResponseEntity<List<ReportesPeriodoDTO.IncidentePorCategoriaDTO>> obtenerIncidentesPorCategoria(
            @RequestParam(defaultValue = "prioridad") String tipo) {
        return ResponseEntity.ok(reportesService.obtenerIncidentesPorCategoria(tipo));
    }

    @GetMapping("/desempeno-analistas")
    public ResponseEntity<List<AnalistaDesempenoDTO>> obtenerDesempenoPorAnalista(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate inicio,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fin) {
        return ResponseEntity.ok(reportesService.obtenerDesempenoPorAnalista(inicio, fin));
    }

    @GetMapping("/tiempos-respuesta")
    public ResponseEntity<TiempoRespuestaDTO> obtenerTiemposRespuesta() {
        return ResponseEntity.ok(reportesService.obtenerTiemposRespuesta());
    }

    @GetMapping("/utilizacion-recursos")
    public ResponseEntity<List<UtilizacionRecursoDTO>> obtenerUtilizacionRecursos(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate inicio,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fin,
            @RequestParam(required = false) BigDecimal capacidad) {
        return ResponseEntity.ok(reportesService.obtenerUtilizacionRecursos(inicio, fin, capacidad));
    }
}
