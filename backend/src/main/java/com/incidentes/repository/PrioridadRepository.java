package com.incidentes.repository;

import com.incidentes.model.Prioridad;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PrioridadRepository extends JpaRepository<Prioridad, Long> {
    Optional<Prioridad> findByNombre(String nombre);
}
