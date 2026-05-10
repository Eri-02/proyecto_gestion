package com.incidentes.repository;

import com.incidentes.model.CostoExtra;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface CostoExtraRepository extends JpaRepository<CostoExtra, Long> {

    List<CostoExtra> findByIncidenteId(Long incidenteId);

    List<CostoExtra> findByFechaBetween(LocalDate inicio, LocalDate fin);

    @Query("SELECT c FROM CostoExtra c WHERE " +
            "(:incidenteId IS NULL OR c.incidente.id = :incidenteId) " +
            "AND (:inicio IS NULL OR c.fecha >= :inicio) " +
            "AND (:fin IS NULL OR c.fecha <= :fin) " +
            "AND (:facturable IS NULL OR c.facturable = :facturable)")
    List<CostoExtra> findConFiltros(
            @Param("incidenteId") Long incidenteId,
            @Param("inicio") LocalDate inicio,
            @Param("fin") LocalDate fin,
            @Param("facturable") Boolean facturable);

    @Query("SELECT COALESCE(SUM(c.monto), 0) FROM CostoExtra c WHERE c.incidente.id = :incidenteId")
    BigDecimal sumMontosByIncidenteId(@Param("incidenteId") Long incidenteId);

    @Query("SELECT COALESCE(SUM(c.monto), 0) FROM CostoExtra c WHERE c.incidente.id = :incidenteId AND c.facturable = :facturable")
    BigDecimal sumMontosByIncidenteIdAndFacturable(@Param("incidenteId") Long incidenteId, @Param("facturable") Boolean facturable);

    @Query("SELECT COALESCE(SUM(c.monto), 0) FROM CostoExtra c WHERE c.fecha BETWEEN :inicio AND :fin AND c.facturable = :facturable")
    BigDecimal sumMontosByPeriodoAndFacturable(@Param("inicio") LocalDate inicio, @Param("fin") LocalDate fin, @Param("facturable") Boolean facturable);
}
