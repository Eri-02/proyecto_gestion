package com.incidentes.controller;

import com.incidentes.dto.*;
import com.incidentes.service.RolService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController @RequestMapping("/api/roles") @RequiredArgsConstructor
public class RolController {
    private final RolService rolService;

    @GetMapping
    public ResponseEntity<List<RolResponseDTO>> listarTodos() { return ResponseEntity.ok(rolService.listarTodos()); }
    @GetMapping("/{id}")
    public ResponseEntity<RolResponseDTO> obtenerPorId(@PathVariable Long id) { return ResponseEntity.ok(rolService.obtenerPorId(id)); }
    @PostMapping
    public ResponseEntity<RolResponseDTO> crear(@Valid @RequestBody RolRequestDTO dto) { return ResponseEntity.status(HttpStatus.CREATED).body(rolService.crear(dto)); }
    @PutMapping("/{id}")
    public ResponseEntity<RolResponseDTO> actualizar(@PathVariable Long id, @Valid @RequestBody RolRequestDTO dto) { return ResponseEntity.ok(rolService.actualizar(id, dto)); }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) { rolService.eliminar(id); return ResponseEntity.noContent().build(); }
}
