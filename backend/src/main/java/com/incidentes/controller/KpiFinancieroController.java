package com.incidentes.controller;

import com.incidentes.dto.KpiFinancieroPeriodoDTO;
import com.incidentes.service.KpiFinancieroService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/kpis/financieros")
@RequiredArgsConstructor
public class KpiFinancieroController {

    private final KpiFinancieroService kpiFinancieroService;

    @GetMapping
    public ResponseEntity<KpiFinancieroPeriodoDTO> obtenerKpis(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate inicio,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fin) {
        return ResponseEntity.ok(kpiFinancieroService.obtenerKpis(inicio, fin));
    }
}
