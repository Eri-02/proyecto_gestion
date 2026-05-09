package com.incidentes.repository;

import com.incidentes.model.CostoExtra;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface CostoExtraRepository extends JpaRepository<CostoExtra, Long> {

    List<CostoExtra> findByIncidenteId(Long incidenteId);

    @Query("SELECT COALESCE(SUM(c.monto), 0) FROM CostoExtra c WHERE c.incidente.id = :incidenteId")
    BigDecimal sumMontosByIncidenteId(@Param("incidenteId") Long incidenteId);
}
