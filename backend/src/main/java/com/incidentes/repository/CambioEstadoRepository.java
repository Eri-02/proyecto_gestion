package com.incidentes.repository;

import com.incidentes.model.CambioEstado;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CambioEstadoRepository extends JpaRepository<CambioEstado, Long> {
    List<CambioEstado> findByIncidenteId(Long incidenteId);
    List<CambioEstado> findByIncidenteIdOrderByFechaCambioDesc(Long incidenteId);

    // Primer cambio de estado (para calcular tiempo de respuesta)
    Optional<CambioEstado> findFirstByIncidenteIdOrderByFechaCambioAsc(Long incidenteId);
}
