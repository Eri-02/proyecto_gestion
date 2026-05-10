package com.incidentes.repository;

import com.incidentes.model.HoraTrabajada;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface HoraTrabajadaRepository extends JpaRepository<HoraTrabajada, Long> {

    List<HoraTrabajada> findByIncidenteId(Long incidenteId);

    @Query("SELECT COALESCE(SUM(h.horas), 0) FROM HoraTrabajada h WHERE h.incidente.id = :incidenteId")
    BigDecimal sumHorasByIncidenteId(@Param("incidenteId") Long incidenteId);

    // ---- Queries para utilización de recursos ----

    List<HoraTrabajada> findByRecursoId(Long recursoId);

    @Query("SELECT h FROM HoraTrabajada h WHERE h.recurso.id = :recursoId AND h.fechaTrabajo BETWEEN :inicio AND :fin")
    List<HoraTrabajada> findByRecursoIdAndFechaTrabajoBetween(
            @Param("recursoId") Long recursoId,
            @Param("inicio") LocalDate inicio,
            @Param("fin") LocalDate fin);

    @Query("SELECT COALESCE(SUM(h.horas), 0) FROM HoraTrabajada h WHERE h.recurso.id = :recursoId AND h.fechaTrabajo BETWEEN :inicio AND :fin")
    BigDecimal sumHorasByRecursoIdAndFechaTrabajoBetween(
            @Param("recursoId") Long recursoId,
            @Param("inicio") LocalDate inicio,
            @Param("fin") LocalDate fin);

    // ---- Queries para desempeño por analista (horas registradas por usuario) ----

    @Query("SELECT COALESCE(SUM(h.horas), 0) FROM HoraTrabajada h WHERE h.usuarioRegistra.id = :usuarioId AND h.fechaTrabajo BETWEEN :inicio AND :fin")
    BigDecimal sumHorasByUsuarioRegistraIdAndPeriodo(
            @Param("usuarioId") Long usuarioId,
            @Param("inicio") LocalDate inicio,
            @Param("fin") LocalDate fin);

    @Query("SELECT COALESCE(SUM(h.horas), 0) FROM HoraTrabajada h WHERE h.usuarioRegistra.id = :usuarioId")
    BigDecimal sumHorasByUsuarioRegistraId(@Param("usuarioId") Long usuarioId);
}
