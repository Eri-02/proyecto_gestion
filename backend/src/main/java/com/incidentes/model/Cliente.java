package com.incidentes.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "cliente")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Cliente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nombre",
            nullable = false,
            length = 150)
    private String nombre;

    @Column(name = "nit",
            unique = true,
            length = 30)
    private String nit;

    @Column(name = "email",
            length = 100)
    private String email;

    @Column(name = "telefono",
            length = 30)
    private String telefono;

    @Column(name = "direccion",
            length = 255)
    private String direccion;

    @Column(name = "contacto_principal",
            length = 150)
    private String contactoPrincipal;

    @Builder.Default
    @Column(name = "activo")
    private Boolean activo = true;

    @Column(name = "fecha_creacion",
            updatable = false)
    private LocalDateTime fechaCreacion;

    @PrePersist
    protected void onCreate() {
        this.fechaCreacion = LocalDateTime.now();

        if (this.activo == null) {
            this.activo = true;
        }
    }
}