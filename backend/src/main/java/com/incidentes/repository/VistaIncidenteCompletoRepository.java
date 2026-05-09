package com.incidentes.repository;

import com.incidentes.model.VistaIncidenteCompleto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VistaIncidenteCompletoRepository extends JpaRepository<VistaIncidenteCompleto, Long> {
}
