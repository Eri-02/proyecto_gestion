package com.incidentes.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "evidencia")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Evidencia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "incidente_id", nullable = false)
    private Incidente incidente;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @Column(name = "nombre_archivo",
            nullable = false,
            length = 255)
    private String nombreArchivo;

    @Column(name = "ruta_archivo",
            nullable = false,
            length = 500)
    private String rutaArchivo;

    @Column(name = "tipo_archivo",
            length = 100)
    private String tipoArchivo;

    @Column(name = "tamano_bytes")
    private Long tamanoBytes;

    @Column(name = "hash_sha256",
            length = 64)
    private String hashSha256;

    @Column(name = "descripcion",
            columnDefinition = "TEXT")
    private String descripcion;

    @Column(name = "fecha_subida",
            updatable = false)
    private LocalDateTime fechaSubida;

    @PrePersist
    protected void onCreate() {
        this.fechaSubida = LocalDateTime.now();
    }
}