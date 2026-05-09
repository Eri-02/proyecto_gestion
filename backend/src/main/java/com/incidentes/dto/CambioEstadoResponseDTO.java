package com.incidentes.dto;

import lombok.*;
import java.time.LocalDateTime;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class CambioEstadoResponseDTO {
    private Long id;
    private Long incidenteId;
    private String incidenteTitulo;
    private Long estadoAnteriorId;
    private String estadoAnteriorNombre;
    private Long estadoNuevoId;
    private String estadoNuevoNombre;
    private Long usuarioId;
    private String usuarioNombre;
    private String comentario;
    private LocalDateTime fechaCambio;
}
