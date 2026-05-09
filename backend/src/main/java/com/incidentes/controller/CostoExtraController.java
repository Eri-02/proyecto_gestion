package com.incidentes.controller;

import com.incidentes.dto.*;
import com.incidentes.service.CostoExtraService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController @RequestMapping("/api/costos-extras") @RequiredArgsConstructor
public class CostoExtraController {
    private final CostoExtraService costoExtraService;

    @GetMapping
    public ResponseEntity<List<CostoExtraResponseDTO>> listarTodos() { return ResponseEntity.ok(costoExtraService.listarTodos()); }
    @GetMapping("/{id}")
    public ResponseEntity<CostoExtraResponseDTO> obtenerPorId(@PathVariable Long id) { return ResponseEntity.ok(costoExtraService.obtenerPorId(id)); }
    @GetMapping("/incidente/{incidenteId}")
    public ResponseEntity<List<CostoExtraResponseDTO>> listarPorIncidente(@PathVariable Long incidenteId) { return ResponseEntity.ok(costoExtraService.listarPorIncidente(incidenteId)); }
    @PostMapping
    public ResponseEntity<CostoExtraResponseDTO> crear(@Valid @RequestBody CostoExtraRequestDTO dto) { return ResponseEntity.status(HttpStatus.CREATED).body(costoExtraService.crear(dto)); }
    @PutMapping("/{id}")
    public ResponseEntity<CostoExtraResponseDTO> actualizar(@PathVariable Long id, @Valid @RequestBody CostoExtraRequestDTO dto) { return ResponseEntity.ok(costoExtraService.actualizar(id, dto)); }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) { costoExtraService.eliminar(id); return ResponseEntity.noContent().build(); }
}
