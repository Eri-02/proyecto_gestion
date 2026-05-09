package com.incidentes.controller;

import com.incidentes.dto.*;
import com.incidentes.service.RecursoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController @RequestMapping("/api/recursos") @RequiredArgsConstructor
public class RecursoController {
    private final RecursoService recursoService;

    @GetMapping
    public ResponseEntity<List<RecursoResponseDTO>> listarTodos() { return ResponseEntity.ok(recursoService.listarTodos()); }
    @GetMapping("/{id}")
    public ResponseEntity<RecursoResponseDTO> obtenerPorId(@PathVariable Long id) { return ResponseEntity.ok(recursoService.obtenerPorId(id)); }
    @PostMapping
    public ResponseEntity<RecursoResponseDTO> crear(@Valid @RequestBody RecursoRequestDTO dto) { return ResponseEntity.status(HttpStatus.CREATED).body(recursoService.crear(dto)); }
    @PutMapping("/{id}")
    public ResponseEntity<RecursoResponseDTO> actualizar(@PathVariable Long id, @Valid @RequestBody RecursoRequestDTO dto) { return ResponseEntity.ok(recursoService.actualizar(id, dto)); }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) { recursoService.eliminar(id); return ResponseEntity.noContent().build(); }
}
