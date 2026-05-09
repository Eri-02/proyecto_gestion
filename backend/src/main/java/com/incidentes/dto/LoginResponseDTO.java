package com.incidentes.dto;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponseDTO {

    private String token;
    private String tipo;
    private Long usuarioId;
    private String username;
    private String nombreCompleto;
    private String email;
    private String rol;
    private Integer nivelPermiso;
}
