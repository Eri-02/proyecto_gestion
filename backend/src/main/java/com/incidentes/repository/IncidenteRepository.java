package com.incidentes.repository;

import com.incidentes.model.Incidente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

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
}
