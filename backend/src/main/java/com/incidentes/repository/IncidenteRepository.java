package com.incidentes.repository;

import com.incidentes.model.Incidente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface IncidenteRepository extends JpaRepository<Incidente, Long> {

    List<Incidente> findByEstadoId(Long estadoId);
    List<Incidente> findByPrioridadId(Long prioridadId);
    List<Incidente> findByEstadoNombre(String estadoNombre);
    List<Incidente> findByActivoTrue();

    @Query("SELECT i FROM Incidente i WHERE i.activo = true AND i.fechaResolucion IS NOT NULL")
    List<Incidente> findResueltos();

    @Query("SELECT COUNT(i) FROM Incidente i WHERE i.activo = true AND i.estado.nombre NOT IN ('Cerrado','Resuelto')")
    Long countIncidentesActivos();

    @Query("SELECT COUNT(i) FROM Incidente i WHERE i.activo = true AND i.prioridad.nombre = 'Critica' AND i.estado.nombre NOT IN ('Cerrado','Resuelto')")
    Long countIncidentesCriticosActivos();

    // ---- Queries para reportes por período ----

    @Query("SELECT i FROM Incidente i WHERE i.activo = true AND i.fechaCreacion BETWEEN :inicio AND :fin")
    List<Incidente> findByFechaCreacionBetween(@Param("inicio") LocalDateTime inicio, @Param("fin") LocalDateTime fin);

    @Query("SELECT i FROM Incidente i WHERE i.activo = true AND i.estado.nombre = :estado AND i.fechaCreacion BETWEEN :inicio AND :fin")
    List<Incidente> findByEstadoNombreAndFechaCreacionBetween(
            @Param("estado") String estado,
            @Param("inicio") LocalDateTime inicio,
            @Param("fin") LocalDateTime fin);

    @Query("SELECT i FROM Incidente i WHERE i.activo = true AND LOWER(i.cliente) LIKE LOWER(CONCAT('%', :cliente, '%'))")
    List<Incidente> findByClienteContaining(@Param("cliente") String cliente);

    @Query("SELECT i FROM Incidente i WHERE i.activo = true AND i.fechaResolucion IS NOT NULL AND i.fechaResolucion BETWEEN :inicio AND :fin")
    List<Incidente> findResueltosEnPeriodo(@Param("inicio") LocalDateTime inicio, @Param("fin") LocalDateTime fin);

    // ---- Queries para desempeño por analista ----

    @Query("SELECT i FROM Incidente i WHERE i.activo = true AND i.resueltoPor.id = :usuarioId")
    List<Incidente> findByResueltoPorId(@Param("usuarioId") Long usuarioId);

    @Query("SELECT i FROM Incidente i WHERE i.activo = true AND i.creadoPor.id = :usuarioId")
    List<Incidente> findByCreadoPorId(@Param("usuarioId") Long usuarioId);

    @Query("SELECT i FROM Incidente i WHERE i.activo = true AND i.resueltoPor.id = :usuarioId AND i.fechaResolucion BETWEEN :inicio AND :fin")
    List<Incidente> findByResueltoPorIdAndPeriodo(
            @Param("usuarioId") Long usuarioId,
            @Param("inicio") LocalDateTime inicio,
            @Param("fin") LocalDateTime fin);

    @Query("SELECT i FROM Incidente i WHERE i.activo = true AND i.creadoPor.id = :usuarioId AND i.fechaCreacion BETWEEN :inicio AND :fin")
    List<Incidente> findByCreadoPorIdAndPeriodo(
            @Param("usuarioId") Long usuarioId,
            @Param("inicio") LocalDateTime inicio,
            @Param("fin") LocalDateTime fin);

    // ---- Queries con filtros combinados para reportes ----

    @Query("SELECT i FROM Incidente i WHERE i.activo = true " +
           "AND (:inicio IS NULL OR i.fechaCreacion >= :inicio) " +
           "AND (:fin IS NULL OR i.fechaCreacion <= :fin) " +
           "AND (:estado IS NULL OR i.estado.nombre = :estado) " +
           "AND (:cliente IS NULL OR LOWER(i.cliente) LIKE LOWER(CONCAT('%', :cliente, '%')))")
    List<Incidente> findConFiltros(
            @Param("inicio") LocalDateTime inicio,
            @Param("fin") LocalDateTime fin,
            @Param("estado") String estado,
            @Param("cliente") String cliente);
}
