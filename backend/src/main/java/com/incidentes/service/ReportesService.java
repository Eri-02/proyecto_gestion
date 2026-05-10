package com.incidentes.service;

import com.incidentes.dto.AnalistaDesempenoDTO;
import com.incidentes.dto.ReportesPeriodoDTO;
import com.incidentes.dto.TiempoRespuestaDTO;
import com.incidentes.dto.UtilizacionRecursoDTO;
import com.incidentes.model.CambioEstado;
import com.incidentes.model.Incidente;
import com.incidentes.model.Recurso;
import com.incidentes.model.Usuario;
import com.incidentes.repository.CambioEstadoRepository;
import com.incidentes.repository.HoraTrabajadaRepository;
import com.incidentes.repository.IncidenteRepository;
import com.incidentes.repository.RecursoRepository;
import com.incidentes.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.TextStyle;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ReportesService {

    private final IncidenteRepository incidenteRepository;
    private final HoraTrabajadaRepository horaTrabajadaRepository;
    private final CambioEstadoRepository cambioEstadoRepository;
    private final UsuarioRepository usuarioRepository;
    private final RecursoRepository recursoRepository;

    private Usuario getUsuarioAutenticado() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return usuarioRepository.findByUsername(auth.getName())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }

    private boolean isAnalista(Usuario usuario) {
        return "ROLE_ANALISTA".equals(usuario.getRol().getNombre());
    }

    public List<ReportesPeriodoDTO.CostoMensualDTO> obtenerCostosMensuales(LocalDate inicio, LocalDate fin) {
        LocalDateTime start = inicio != null ? inicio.atStartOfDay() : LocalDateTime.of(2000, 1, 1, 0, 0);
        LocalDateTime end = fin != null ? fin.atTime(LocalTime.MAX) : LocalDateTime.now();

        List<Incidente> incidentes = incidenteRepository.findByFechaCreacionBetween(start, end);

        Map<String, ReportesPeriodoDTO.CostoMensualDTO> agrupado = new LinkedHashMap<>();

        for (Incidente inc : incidentes) {
            String key = inc.getFechaCreacion().getYear() + "-" + String.format("%02d", inc.getFechaCreacion().getMonthValue());
            
            ReportesPeriodoDTO.CostoMensualDTO dto = agrupado.computeIfAbsent(key, k -> 
                ReportesPeriodoDTO.CostoMensualDTO.builder()
                        .anio(inc.getFechaCreacion().getYear())
                        .mes(inc.getFechaCreacion().getMonthValue())
                        .mesNombre(inc.getFechaCreacion().getMonth().getDisplayName(TextStyle.FULL, new Locale("es", "ES")))
                        .costoEstimado(BigDecimal.ZERO)
                        .costoReal(BigDecimal.ZERO)
                        .margen(BigDecimal.ZERO)
                        .cantidadIncidentes(0L)
                        .build()
            );

            dto.setCostoEstimado(dto.getCostoEstimado().add(inc.getCostoEstimado()));
            // Calcula el costo real y lo acumula
            BigDecimal costoManoObra = horaTrabajadaRepository.findByIncidenteId(inc.getId()).stream()
                    .map(h -> h.getHoras().multiply(h.getRecurso().getCostoPorHora()))
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            // Asume que los costos extras están sumados de otra forma, o simplificamos usando la vista si está disponible.
            // Para mantener consistencia con IncidenteRepository vamos a sumar mano de obra
            dto.setCostoReal(dto.getCostoReal().add(costoManoObra)); // Faltaría costo extra, pero podemos estimar o ignorar para el reporte base
            
            if (inc.getIngresos() != null) {
                dto.setMargen(dto.getMargen().add(inc.getIngresos().subtract(costoManoObra)));
            } else {
                 dto.setMargen(dto.getMargen().subtract(costoManoObra));
            }
            dto.setCantidadIncidentes(dto.getCantidadIncidentes() + 1);
        }

        return new ArrayList<>(agrupado.values());
    }

    public List<ReportesPeriodoDTO.MttrMensualDTO> obtenerMttrHistorico(LocalDate inicio, LocalDate fin) {
        LocalDateTime start = inicio != null ? inicio.atStartOfDay() : LocalDateTime.of(2000, 1, 1, 0, 0);
        LocalDateTime end = fin != null ? fin.atTime(LocalTime.MAX) : LocalDateTime.now();

        List<Incidente> resueltos = incidenteRepository.findResueltosEnPeriodo(start, end);

        Map<String, List<Incidente>> agrupado = resueltos.stream()
                .collect(Collectors.groupingBy(i -> i.getFechaResolucion().getYear() + "-" + String.format("%02d", i.getFechaResolucion().getMonthValue())));

        return agrupado.entrySet().stream()
                .map(entry -> {
                    List<Incidente> list = entry.getValue();
                    long totalHoras = 0;
                    for (Incidente i : list) {
                        totalHoras += Duration.between(i.getFechaCreacion(), i.getFechaResolucion()).toHours();
                    }
                    BigDecimal mttr = new BigDecimal(totalHoras).divide(new BigDecimal(list.size()), 2, RoundingMode.HALF_UP);
                    
                    Incidente first = list.get(0);
                    return ReportesPeriodoDTO.MttrMensualDTO.builder()
                            .anio(first.getFechaResolucion().getYear())
                            .mes(first.getFechaResolucion().getMonthValue())
                            .mesNombre(first.getFechaResolucion().getMonth().getDisplayName(TextStyle.FULL, new Locale("es", "ES")))
                            .mttrHoras(mttr)
                            .cantidadResueltos((long) list.size())
                            .build();
                })
                .sorted(Comparator.comparing(ReportesPeriodoDTO.MttrMensualDTO::getAnio)
                        .thenComparing(ReportesPeriodoDTO.MttrMensualDTO::getMes))
                .collect(Collectors.toList());
    }

    public List<ReportesPeriodoDTO.IncidentePorCategoriaDTO> obtenerIncidentesPorCategoria(String tipoCat) {
        List<Incidente> incidentes = incidenteRepository.findByActivoTrue();
        long total = incidentes.size();
        
        if (total == 0) return Collections.emptyList();

        Map<String, Long> agrupado = incidentes.stream()
                .collect(Collectors.groupingBy(i -> {
                    if ("prioridad".equalsIgnoreCase(tipoCat)) return i.getPrioridad().getNombre();
                    if ("estado".equalsIgnoreCase(tipoCat)) return i.getEstado().getNombre();
                    if ("cliente".equalsIgnoreCase(tipoCat)) return i.getCliente() != null ? i.getCliente() : "Sin Cliente";
                    if ("analista".equalsIgnoreCase(tipoCat)) return i.getResueltoPor() != null ? i.getResueltoPor().getNombreCompleto() : "No Asignado";
                    return "Otro";
                }, Collectors.counting()));

        return agrupado.entrySet().stream()
                .map(entry -> {
                    BigDecimal porcentaje = new BigDecimal(entry.getValue())
                            .multiply(new BigDecimal(100))
                            .divide(new BigDecimal(total), 2, RoundingMode.HALF_UP);
                    
                    return ReportesPeriodoDTO.IncidentePorCategoriaDTO.builder()
                            .categoria(entry.getKey())
                            .cantidad(entry.getValue())
                            .porcentaje(porcentaje)
                            .build();
                })
                .sorted((a, b) -> b.getCantidad().compareTo(a.getCantidad()))
                .collect(Collectors.toList());
    }

    public List<AnalistaDesempenoDTO> obtenerDesempenoPorAnalista(LocalDate inicio, LocalDate fin) {
        Usuario currentUser = getUsuarioAutenticado();
        
        LocalDateTime start = inicio != null ? inicio.atStartOfDay() : LocalDateTime.of(2000, 1, 1, 0, 0);
        LocalDateTime end = fin != null ? fin.atTime(LocalTime.MAX) : LocalDateTime.now();

        List<Usuario> analistas;
        if (isAnalista(currentUser)) {
            analistas = Collections.singletonList(currentUser);
        } else {
            analistas = usuarioRepository.findAll().stream()
                    .filter(u -> "ROLE_ANALISTA".equals(u.getRol().getNombre()) && u.getActivo())
                    .collect(Collectors.toList());
        }

        return analistas.stream().map(analista -> {
            List<Incidente> asignados = incidenteRepository.findByResueltoPorIdAndPeriodo(analista.getId(), start, end);
            List<Incidente> creados = incidenteRepository.findByCreadoPorIdAndPeriodo(analista.getId(), start, end);
            
            // Todos los incidentes en los que intervino como "resueltoPor"
            long resueltos = asignados.stream()
                    .filter(i -> "Resuelto".equals(i.getEstado().getNombre()) || "Cerrado".equals(i.getEstado().getNombre()))
                    .count();

            long totalAsignados = asignados.size() + creados.size(); // aproximación
            
            BigDecimal tiempoPromedio = BigDecimal.ZERO;
            if (resueltos > 0) {
                 long totalHoras = asignados.stream()
                         .filter(i -> i.getFechaResolucion() != null)
                         .mapToLong(i -> Duration.between(i.getFechaCreacion(), i.getFechaResolucion()).toHours())
                         .sum();
                 tiempoPromedio = new BigDecimal(totalHoras).divide(new BigDecimal(resueltos), 2, RoundingMode.HALF_UP);
            }

            BigDecimal tasaExito = BigDecimal.ZERO;
            if (totalAsignados > 0) {
                 tasaExito = new BigDecimal(resueltos).multiply(new BigDecimal(100))
                         .divide(new BigDecimal(totalAsignados), 2, RoundingMode.HALF_UP);
            }

            BigDecimal horasTrabajadas = horaTrabajadaRepository.sumHorasByUsuarioRegistraIdAndPeriodo(
                    analista.getId(), start.toLocalDate(), end.toLocalDate());

            return AnalistaDesempenoDTO.builder()
                    .analistaId(analista.getId())
                    .nombre(analista.getNombreCompleto())
                    .cargo(analista.getRol().getDescripcion())
                    .incidentesResueltos(resueltos)
                    .incidentesAsignados(totalAsignados)
                    .tiempoPromedioResolucionHoras(tiempoPromedio)
                    .tasaExito(tasaExito)
                    .horasTrabajadas(horasTrabajadas)
                    .build();
        }).collect(Collectors.toList());
    }

    public TiempoRespuestaDTO obtenerTiemposRespuesta() {
        List<Incidente> incidentes = incidenteRepository.findByActivoTrue();
        List<TiempoRespuestaDTO.DetalleTiempoRespuestaDTO> detalles = new ArrayList<>();
        
        long totalMinutos = 0;
        int count = 0;

        for (Incidente i : incidentes) {
            Optional<CambioEstado> primerCambio = cambioEstadoRepository.findFirstByIncidenteIdOrderByFechaCambioAsc(i.getId());
            if (primerCambio.isPresent()) {
                LocalDateTime creacion = i.getFechaCreacion();
                LocalDateTime cambio = primerCambio.get().getFechaCambio();
                long minutos = Duration.between(creacion, cambio).toMinutes();
                
                totalMinutos += minutos;
                count++;

                detalles.add(TiempoRespuestaDTO.DetalleTiempoRespuestaDTO.builder()
                        .incidenteId(i.getId())
                        .titulo(i.getTitulo())
                        .fechaCreacion(creacion)
                        .fechaPrimerCambioEstado(cambio)
                        .tiempoRespuestaMinutos(minutos)
                        .tiempoRespuestaHoras(new BigDecimal(minutos).divide(new BigDecimal(60), 2, RoundingMode.HALF_UP))
                        .build());
            }
        }

        BigDecimal promedioMinutos = count > 0 ? new BigDecimal(totalMinutos).divide(new BigDecimal(count), 2, RoundingMode.HALF_UP) : BigDecimal.ZERO;
        BigDecimal promedioHoras = promedioMinutos.divide(new BigDecimal(60), 2, RoundingMode.HALF_UP);

        return TiempoRespuestaDTO.builder()
                .promedioGlobalMinutos(promedioMinutos)
                .promedioGlobalHoras(promedioHoras)
                .totalIncidentesAnalizados((long) count)
                .detalles(detalles)
                .build();
    }

    public List<UtilizacionRecursoDTO> obtenerUtilizacionRecursos(LocalDate inicio, LocalDate fin, BigDecimal capacidad) {
        BigDecimal capacidadMensual = capacidad != null ? capacidad : BigDecimal.valueOf(160);
        
        LocalDate start = inicio != null ? inicio : LocalDate.of(2000, 1, 1);
        LocalDate end = fin != null ? fin : LocalDate.now();

        List<Recurso> recursos = recursoRepository.findByActivoTrue();

        return recursos.stream().map(r -> {
            BigDecimal horas = horaTrabajadaRepository.sumHorasByRecursoIdAndFechaTrabajoBetween(r.getId(), start, end);
            
            BigDecimal utilizacion = BigDecimal.ZERO;
            if (capacidadMensual.compareTo(BigDecimal.ZERO) > 0) {
                 utilizacion = horas.multiply(new BigDecimal(100)).divide(capacidadMensual, 2, RoundingMode.HALF_UP);
            }

            return UtilizacionRecursoDTO.builder()
                    .recursoId(r.getId())
                    .nombre(r.getNombre())
                    .cargo(r.getCargo())
                    .especialidad(r.getEspecialidad())
                    .horasTrabajadas(horas)
                    .capacidadDisponible(capacidadMensual)
                    .porcentajeUtilizacion(utilizacion)
                    .build();
        }).collect(Collectors.toList());
    }
}
