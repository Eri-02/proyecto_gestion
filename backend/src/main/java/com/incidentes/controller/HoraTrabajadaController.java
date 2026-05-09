package com.incidentes.controller;

import com.incidentes.dto.*;
import com.incidentes.service.HoraTrabajadaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController @RequestMapping("/api/horas") @RequiredArgsConstructor
public class HoraTrabajadaController {
    private final HoraTrabajadaService horaTrabajadaService;

    @GetMapping
    public ResponseEntity<List<HoraTrabajadaResponseDTO>> listarTodos() { return ResponseEntity.ok(horaTrabajadaService.listarTodos()); }
    @GetMapping("/{id}")
    public ResponseEntity<HoraTrabajadaResponseDTO> obtenerPorId(@PathVariable Long id) { return ResponseEntity.ok(horaTrabajadaService.obtenerPorId(id)); }
    @GetMapping("/incidente/{incidenteId}")
    public ResponseEntity<List<HoraTrabajadaResponseDTO>> listarPorIncidente(@PathVariable Long incidenteId) { return ResponseEntity.ok(horaTrabajadaService.listarPorIncidente(incidenteId)); }
    @PostMapping
    public ResponseEntity<HoraTrabajadaResponseDTO> crear(@Valid @RequestBody HoraTrabajadaRequestDTO dto) { return ResponseEntity.status(HttpStatus.CREATED).body(horaTrabajadaService.crear(dto)); }
    @PutMapping("/{id}")
    public ResponseEntity<HoraTrabajadaResponseDTO> actualizar(@PathVariable Long id, @Valid @RequestBody HoraTrabajadaRequestDTO dto) { return ResponseEntity.ok(horaTrabajadaService.actualizar(id, dto)); }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) { horaTrabajadaService.eliminar(id); return ResponseEntity.noContent().build(); }
}
