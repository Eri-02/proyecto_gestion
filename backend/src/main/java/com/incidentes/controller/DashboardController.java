package com.incidentes.controller;

import com.incidentes.dto.DashboardResponseDTO;
import com.incidentes.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    @Autowired
    private DashboardService dashboardService;

    @GetMapping("/resumen")
    public ResponseEntity<DashboardResponseDTO> obtenerResumen() {
        DashboardResponseDTO resumen = dashboardService.obtenerResumen();
        return ResponseEntity.ok(resumen);
    }

    @GetMapping("/criticos")
    public ResponseEntity<List<DashboardResponseDTO.IncidenteCriticoDTO>> obtenerCriticos() {
        List<DashboardResponseDTO.IncidenteCriticoDTO> criticos = dashboardService.obtenerIncidentesCriticos();
        return ResponseEntity.ok(criticos);
    }
}
