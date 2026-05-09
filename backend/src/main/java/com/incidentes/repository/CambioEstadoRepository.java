package com.incidentes.repository;

import com.incidentes.model.CambioEstado;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CambioEstadoRepository extends JpaRepository<CambioEstado, Long> {
    List<CambioEstado> findByIncidenteId(Long incidenteId);
    List<CambioEstado> findByIncidenteIdOrderByFechaCambioDesc(Long incidenteId);
}
