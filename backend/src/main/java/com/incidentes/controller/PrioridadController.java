package com.incidentes.controller;

import com.incidentes.dto.*;
import com.incidentes.service.PrioridadService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController @RequestMapping("/api/prioridades") @RequiredArgsConstructor
public class PrioridadController {
    private final PrioridadService prioridadService;

    @GetMapping
    public ResponseEntity<List<PrioridadResponseDTO>> listarTodos() { return ResponseEntity.ok(prioridadService.listarTodos()); }
    @GetMapping("/{id}")
    public ResponseEntity<PrioridadResponseDTO> obtenerPorId(@PathVariable Long id) { return ResponseEntity.ok(prioridadService.obtenerPorId(id)); }
    @PostMapping
    public ResponseEntity<PrioridadResponseDTO> crear(@Valid @RequestBody PrioridadRequestDTO dto) { return ResponseEntity.status(HttpStatus.CREATED).body(prioridadService.crear(dto)); }
    @PutMapping("/{id}")
    public ResponseEntity<PrioridadResponseDTO> actualizar(@PathVariable Long id, @Valid @RequestBody PrioridadRequestDTO dto) { return ResponseEntity.ok(prioridadService.actualizar(id, dto)); }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) { prioridadService.eliminar(id); return ResponseEntity.noContent().build(); }
}
