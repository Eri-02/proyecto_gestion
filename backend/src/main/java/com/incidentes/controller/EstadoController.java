package com.incidentes.controller;

import com.incidentes.dto.*;
import com.incidentes.service.EstadoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController @RequestMapping("/api/estados") @RequiredArgsConstructor
public class EstadoController {
    private final EstadoService estadoService;

    @GetMapping
    public ResponseEntity<List<EstadoResponseDTO>> listarTodos() { return ResponseEntity.ok(estadoService.listarTodos()); }
    @GetMapping("/{id}")
    public ResponseEntity<EstadoResponseDTO> obtenerPorId(@PathVariable Long id) { return ResponseEntity.ok(estadoService.obtenerPorId(id)); }
    @PostMapping
    public ResponseEntity<EstadoResponseDTO> crear(@Valid @RequestBody EstadoRequestDTO dto) { return ResponseEntity.status(HttpStatus.CREATED).body(estadoService.crear(dto)); }
    @PutMapping("/{id}")
    public ResponseEntity<EstadoResponseDTO> actualizar(@PathVariable Long id, @Valid @RequestBody EstadoRequestDTO dto) { return ResponseEntity.ok(estadoService.actualizar(id, dto)); }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) { estadoService.eliminar(id); return ResponseEntity.noContent().build(); }
}
