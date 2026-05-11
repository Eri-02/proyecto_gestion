package com.incidentes.controller;

import com.incidentes.dto.*;
import com.incidentes.service.HoraTrabajadaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;

@RestController @RequestMapping("/api/horas") @RequiredArgsConstructor
public class HoraTrabajadaController {
    private final HoraTrabajadaService horaTrabajadaService;

    @GetMapping
    public ResponseEntity<List<HoraTrabajadaResponseDTO>> listarTodos(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate inicio,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fin,
            @RequestParam(required = false) Boolean facturable) {
        return ResponseEntity.ok(horaTrabajadaService.listarConFiltros(inicio, fin, facturable));
    }
    @GetMapping("/{id}")
    public ResponseEntity<HoraTrabajadaResponseDTO> obtenerPorId(@PathVariable Long id) { return ResponseEntity.ok(horaTrabajadaService.obtenerPorId(id)); }
    @GetMapping("/incidente/{incidenteId}")
    public ResponseEntity<List<HoraTrabajadaResponseDTO>> listarPorIncidente(
            @PathVariable Long incidenteId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate inicio,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fin,
            @RequestParam(required = false) Boolean facturable) {
        return ResponseEntity.ok(horaTrabajadaService.listarPorIncidenteConFiltros(incidenteId, inicio, fin, facturable));
    }
    @PostMapping
    public ResponseEntity<HoraTrabajadaResponseDTO> crear(@Valid @RequestBody HoraTrabajadaRequestDTO dto) { return ResponseEntity.status(HttpStatus.CREATED).body(horaTrabajadaService.crear(dto)); }
    @PutMapping("/{id}")
    public ResponseEntity<HoraTrabajadaResponseDTO> actualizar(@PathVariable Long id, @Valid @RequestBody HoraTrabajadaRequestDTO dto) { return ResponseEntity.ok(horaTrabajadaService.actualizar(id, dto)); }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) { horaTrabajadaService.eliminar(id); return ResponseEntity.noContent().build(); }
}
