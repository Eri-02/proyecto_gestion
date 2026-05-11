package com.incidentes.controller;

import com.incidentes.dto.PresupuestoRequestDTO;
import com.incidentes.dto.PresupuestoResponseDTO;
import com.incidentes.service.PresupuestoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/presupuestos")
@RequiredArgsConstructor
public class PresupuestoController {

    private final PresupuestoService presupuestoService;

    @GetMapping
    public ResponseEntity<List<PresupuestoResponseDTO>> listarTodos() {
        return ResponseEntity.ok(presupuestoService.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PresupuestoResponseDTO> obtenerPorId(@PathVariable Long id) {
        return ResponseEntity.ok(presupuestoService.obtenerPorId(id));
    }

    @PostMapping
    public ResponseEntity<PresupuestoResponseDTO> crear(@Valid @RequestBody PresupuestoRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(presupuestoService.crear(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PresupuestoResponseDTO> actualizar(@PathVariable Long id, @Valid @RequestBody PresupuestoRequestDTO dto) {
        return ResponseEntity.ok(presupuestoService.actualizar(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        presupuestoService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
