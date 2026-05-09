package com.incidentes.dto;

import jakarta.validation.constraints.*;
import lombok.*;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class CambioEstadoRequestDTO {
    @NotNull private Long incidenteId;
    @NotNull private Long estadoAnteriorId;
    @NotNull private Long estadoNuevoId;
    @NotNull private Long usuarioId;
    private String comentario;
}
