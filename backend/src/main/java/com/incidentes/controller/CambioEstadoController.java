package com.incidentes.controller;

import com.incidentes.dto.*;
import com.incidentes.service.CambioEstadoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController @RequestMapping("/api/cambios-estado") @RequiredArgsConstructor
public class CambioEstadoController {
    private final CambioEstadoService cambioEstadoService;

    @GetMapping
    public ResponseEntity<List<CambioEstadoResponseDTO>> listarTodos() { return ResponseEntity.ok(cambioEstadoService.listarTodos()); }
    @GetMapping("/{id}")
    public ResponseEntity<CambioEstadoResponseDTO> obtenerPorId(@PathVariable Long id) { return ResponseEntity.ok(cambioEstadoService.obtenerPorId(id)); }
    @GetMapping("/incidente/{incidenteId}")
    public ResponseEntity<List<CambioEstadoResponseDTO>> listarPorIncidente(@PathVariable Long incidenteId) { return ResponseEntity.ok(cambioEstadoService.listarPorIncidente(incidenteId)); }
    @PostMapping
    public ResponseEntity<CambioEstadoResponseDTO> crear(@Valid @RequestBody CambioEstadoRequestDTO dto) { return ResponseEntity.status(HttpStatus.CREATED).body(cambioEstadoService.crear(dto)); }
    @PutMapping("/{id}")
    public ResponseEntity<CambioEstadoResponseDTO> actualizar(@PathVariable Long id, @Valid @RequestBody CambioEstadoRequestDTO dto) { return ResponseEntity.ok(cambioEstadoService.actualizar(id, dto)); }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) { cambioEstadoService.eliminar(id); return ResponseEntity.noContent().build(); }
}
