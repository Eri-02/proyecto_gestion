package com.incidentes.repository;

import com.incidentes.model.AuditoriaFinanciera;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AuditoriaFinancieraRepository extends JpaRepository<AuditoriaFinanciera, Long> {
    List<AuditoriaFinanciera> findByIncidenteId(Long incidenteId);
    List<AuditoriaFinanciera> findByUsuarioId(Long usuarioId);

    @Query("SELECT a FROM AuditoriaFinanciera a WHERE " +
            "(:inicio IS NULL OR a.fechaCambio >= :inicio) " +
            "AND (:fin IS NULL OR a.fechaCambio <= :fin) " +
            "AND (:tipoCambio IS NULL OR a.tipoCambio = :tipoCambio) " +
            "AND (:accion IS NULL OR a.accion = :accion) " +
            "AND (:entidadAfectada IS NULL OR a.entidadAfectada = :entidadAfectada) " +
            "AND (:incidenteId IS NULL OR a.incidente.id = :incidenteId) " +
            "AND (:usuarioId IS NULL OR a.usuario.id = :usuarioId)")
    Page<AuditoriaFinanciera> findConFiltros(
            @Param("inicio") LocalDateTime inicio,
            @Param("fin") LocalDateTime fin,
            @Param("tipoCambio") String tipoCambio,
            @Param("accion") String accion,
            @Param("entidadAfectada") String entidadAfectada,
            @Param("incidenteId") Long incidenteId,
            @Param("usuarioId") Long usuarioId,
            Pageable pageable);
}
