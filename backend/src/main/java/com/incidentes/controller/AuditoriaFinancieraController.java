package com.incidentes.controller;

import com.incidentes.dto.*;
import com.incidentes.service.AuditoriaFinancieraService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController @RequestMapping("/api/auditoria") @RequiredArgsConstructor
public class AuditoriaFinancieraController {
    private final AuditoriaFinancieraService auditoriaService;

    @GetMapping
    public ResponseEntity<List<AuditoriaFinancieraResponseDTO>> listarTodos() { return ResponseEntity.ok(auditoriaService.listarTodos()); }
    @GetMapping("/{id}")
    public ResponseEntity<AuditoriaFinancieraResponseDTO> obtenerPorId(@PathVariable Long id) { return ResponseEntity.ok(auditoriaService.obtenerPorId(id)); }
    @PostMapping
    public ResponseEntity<AuditoriaFinancieraResponseDTO> crear(@Valid @RequestBody AuditoriaFinancieraRequestDTO dto) { return ResponseEntity.status(HttpStatus.CREATED).body(auditoriaService.crear(dto)); }
    @PutMapping("/{id}")
    public ResponseEntity<AuditoriaFinancieraResponseDTO> actualizar(@PathVariable Long id, @Valid @RequestBody AuditoriaFinancieraRequestDTO dto) { return ResponseEntity.ok(auditoriaService.actualizar(id, dto)); }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) { auditoriaService.eliminar(id); return ResponseEntity.noContent().build(); }
}
