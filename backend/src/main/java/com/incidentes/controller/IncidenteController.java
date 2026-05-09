package com.incidentes.controller;

import com.incidentes.dto.*;
import com.incidentes.service.IncidenteService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController @RequestMapping("/api/incidentes") @RequiredArgsConstructor
public class IncidenteController {
    private final IncidenteService incidenteService;

    @GetMapping
    public ResponseEntity<List<IncidenteResponseDTO>> listarTodos() { return ResponseEntity.ok(incidenteService.listarTodos()); }
    @GetMapping("/{id}")
    public ResponseEntity<IncidenteResponseDTO> obtenerPorId(@PathVariable Long id) { return ResponseEntity.ok(incidenteService.obtenerPorId(id)); }
    @PostMapping
    public ResponseEntity<IncidenteResponseDTO> crear(@Valid @RequestBody IncidenteRequestDTO dto) { return ResponseEntity.status(HttpStatus.CREATED).body(incidenteService.crear(dto)); }
    @PutMapping("/{id}")
    public ResponseEntity<IncidenteResponseDTO> actualizar(@PathVariable Long id, @Valid @RequestBody IncidenteRequestDTO dto) { return ResponseEntity.ok(incidenteService.actualizar(id, dto)); }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) { incidenteService.eliminar(id); return ResponseEntity.noContent().build(); }
    @GetMapping("/criticos")
    public ResponseEntity<List<IncidenteResponseDTO>> listarCriticos() { return ResponseEntity.ok(incidenteService.listarIncidentesCriticos()); }
}
