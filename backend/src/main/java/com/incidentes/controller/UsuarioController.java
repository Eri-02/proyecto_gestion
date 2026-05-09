package com.incidentes.controller;

import com.incidentes.dto.*;
import com.incidentes.service.UsuarioService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController @RequestMapping("/api/usuarios") @RequiredArgsConstructor
public class UsuarioController {
    private final UsuarioService usuarioService;

    @GetMapping
    public ResponseEntity<List<UsuarioResponseDTO>> listarTodos() { return ResponseEntity.ok(usuarioService.listarTodos()); }
    @GetMapping("/{id}")
    public ResponseEntity<UsuarioResponseDTO> obtenerPorId(@PathVariable Long id) { return ResponseEntity.ok(usuarioService.obtenerPorId(id)); }
    @PostMapping
    public ResponseEntity<UsuarioResponseDTO> crear(@Valid @RequestBody UsuarioRequestDTO dto) { return ResponseEntity.status(HttpStatus.CREATED).body(usuarioService.crear(dto)); }
    @PutMapping("/{id}")
    public ResponseEntity<UsuarioResponseDTO> actualizar(@PathVariable Long id, @Valid @RequestBody UsuarioRequestDTO dto) { return ResponseEntity.ok(usuarioService.actualizar(id, dto)); }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) { usuarioService.eliminar(id); return ResponseEntity.noContent().build(); }
}
