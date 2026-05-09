package com.incidentes.repository;

import com.incidentes.model.AuditoriaFinanciera;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AuditoriaFinancieraRepository extends JpaRepository<AuditoriaFinanciera, Long> {
    List<AuditoriaFinanciera> findByIncidenteId(Long incidenteId);
    List<AuditoriaFinanciera> findByUsuarioId(Long usuarioId);
}
