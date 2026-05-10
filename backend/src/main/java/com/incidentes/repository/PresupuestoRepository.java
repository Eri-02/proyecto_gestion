package com.incidentes.repository;

import com.incidentes.model.Presupuesto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface PresupuestoRepository extends JpaRepository<Presupuesto, Long> {

    List<Presupuesto> findByActivoTrueOrderByFechaInicioDesc();

    @Query("SELECT p FROM Presupuesto p WHERE p.activo = true AND p.fechaInicio <= :fin AND p.fechaFin >= :inicio ORDER BY p.fechaInicio ASC")
    List<Presupuesto> findActivosParaPeriodo(@Param("inicio") LocalDate inicio, @Param("fin") LocalDate fin);
}
