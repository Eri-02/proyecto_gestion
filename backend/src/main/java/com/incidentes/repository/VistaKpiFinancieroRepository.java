package com.incidentes.repository;

import com.incidentes.model.VistaKpiFinanciero;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.math.BigDecimal;
import java.util.List;

@Repository
public interface VistaKpiFinancieroRepository extends JpaRepository<VistaKpiFinanciero, Long> {

    @Query("SELECT v FROM VistaKpiFinanciero v WHERE v.desviacionPorcentual > :porcentaje OR v.desviacionPorcentual < -:porcentaje")
    List<VistaKpiFinanciero> findConDesviacionMayorA(BigDecimal porcentaje);
}
