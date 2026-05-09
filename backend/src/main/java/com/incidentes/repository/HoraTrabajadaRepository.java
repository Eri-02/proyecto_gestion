package com.incidentes.repository;

import com.incidentes.model.HoraTrabajada;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface HoraTrabajadaRepository extends JpaRepository<HoraTrabajada, Long> {

    List<HoraTrabajada> findByIncidenteId(Long incidenteId);

    @Query("SELECT COALESCE(SUM(h.horas), 0) FROM HoraTrabajada h WHERE h.incidente.id = :incidenteId")
    BigDecimal sumHorasByIncidenteId(@Param("incidenteId") Long incidenteId);
}
