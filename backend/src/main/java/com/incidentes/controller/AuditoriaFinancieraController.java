package com.incidentes.controller;

import com.incidentes.dto.*;
import com.incidentes.service.AuditoriaFinancieraService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.time.LocalTime;

@RestController @RequestMapping("/api/auditoria") @RequiredArgsConstructor
public class AuditoriaFinancieraController {
    private final AuditoriaFinancieraService auditoriaService;

    @GetMapping
    public ResponseEntity<Page<AuditoriaFinancieraResponseDTO>> listarTodos(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate inicio,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fin,
            @RequestParam(required = false) String tipoCambio,
            @RequestParam(required = false) String accion,
            @RequestParam(required = false) String entidadAfectada,
            @RequestParam(required = false) Long incidenteId,
            @RequestParam(required = false) Long usuarioId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "25") int size) {
        var pageable = PageRequest.of(Math.max(page, 0), Math.min(Math.max(size, 1), 100),
                Sort.by(Sort.Direction.DESC, "fechaCambio"));
        return ResponseEntity.ok(auditoriaService.listarConFiltros(
                inicio != null ? inicio.atStartOfDay() : null,
                fin != null ? fin.atTime(LocalTime.MAX) : null,
                tipoCambio, accion, entidadAfectada, incidenteId, usuarioId, pageable));
    }
    @GetMapping("/{id}")
    public ResponseEntity<AuditoriaFinancieraResponseDTO> obtenerPorId(@PathVariable Long id) { return ResponseEntity.ok(auditoriaService.obtenerPorId(id)); }
    @PostMapping
    public ResponseEntity<AuditoriaFinancieraResponseDTO> crear(@Valid @RequestBody AuditoriaFinancieraRequestDTO dto) { return ResponseEntity.status(HttpStatus.CREATED).body(auditoriaService.crear(dto)); }
    @PutMapping("/{id}")
    public ResponseEntity<AuditoriaFinancieraResponseDTO> actualizar(@PathVariable Long id, @Valid @RequestBody AuditoriaFinancieraRequestDTO dto) { return ResponseEntity.ok(auditoriaService.actualizar(id, dto)); }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) { auditoriaService.eliminar(id); return ResponseEntity.noContent().build(); }
}
