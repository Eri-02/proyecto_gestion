package com.incidentes.service;

import com.incidentes.dto.*;
import com.incidentes.exception.BusinessException;
import com.incidentes.exception.ResourceNotFoundException;
import com.incidentes.model.*;
import com.incidentes.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class IncidenteService {

    private final IncidenteRepository incidenteRepository;
    private final PrioridadRepository prioridadRepository;
    private final EstadoRepository estadoRepository;
    private final UsuarioRepository usuarioRepository;
    private final RecursoRepository recursoRepository;
    private final HoraTrabajadaRepository horaTrabajadaRepository;
    private final CostoExtraRepository costoExtraRepository;
    private final CambioEstadoRepository cambioEstadoRepository;
    private final AuditoriaFinancieraRepository auditoriaFinancieraRepository;

    // =====================================================================
    // CRUD - LISTAR TODOS
    // =====================================================================
    @Transactional(readOnly = true)
    public List<IncidenteResponseDTO> listarTodos() {
        return incidenteRepository.findAll().stream()
                .map(this::convertirAResponseDTO).collect(Collectors.toList());
    }

    // =====================================================================
    // CRUD - OBTENER POR ID (con detalle de horas y costos)
    // =====================================================================
    @Transactional(readOnly = true)
    public IncidenteResponseDTO obtenerPorId(Long id) {
        Incidente inc = incidenteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Incidente", "id", id));
        List<HoraTrabajada> horas = horaTrabajadaRepository.findByIncidenteId(id);
        List<CostoExtra> costos = costoExtraRepository.findByIncidenteId(id);
        IncidenteResponseDTO dto = convertirAResponseDTO(inc);
        dto.setHorasTrabajadas(horas.stream().map(this::horaToDTO).collect(Collectors.toList()));
        dto.setCostosExtras(costos.stream().map(this::costoToDTO).collect(Collectors.toList()));
        return dto;
    }

    // =====================================================================
    // CRUD - CREAR
    // =====================================================================
    public IncidenteResponseDTO crear(IncidenteRequestDTO req) {
        Prioridad prioridad = prioridadRepository.findById(req.getPrioridadId())
                .orElseThrow(() -> new ResourceNotFoundException("Prioridad", "id", req.getPrioridadId()));
        Estado estado = estadoRepository.findById(req.getEstadoId())
                .orElseThrow(() -> new ResourceNotFoundException("Estado", "id", req.getEstadoId()));
        Usuario creadoPor = usuarioRepository.findById(req.getCreadoPorUsuarioId())
                .orElseThrow(() -> new ResourceNotFoundException("Usuario", "id", req.getCreadoPorUsuarioId()));

        Incidente inc = Incidente.builder()
                .titulo(req.getTitulo()).descripcion(req.getDescripcion())
                .prioridad(prioridad).estado(estado)
                .costoEstimado(req.getCostoEstimado())
                .ingresos(req.getIngresos() != null ? req.getIngresos() : BigDecimal.ZERO)
                .creadoPor(creadoPor).cliente(req.getCliente())
                .sistemaAfectado(req.getSistemaAfectado())
                .descripcionTecnica(req.getDescripcionTecnica())
                .leccionesAprendidas(req.getLeccionesAprendidas())
                .activo(true).build();

        if (req.getResueltoPorUsuarioId() != null) {
            Usuario resueltoPor = usuarioRepository.findById(req.getResueltoPorUsuarioId())
                    .orElseThrow(() -> new ResourceNotFoundException("Usuario", "id", req.getResueltoPorUsuarioId()));
            inc.setResueltoPor(resueltoPor);
        }

        Incidente guardado = incidenteRepository.save(inc);
        registrarAuditoria(guardado, creadoPor, "CREACION",
                "Incidente creado: " + guardado.getTitulo(), guardado.getCostoEstimado(), null, null);
        return obtenerPorId(guardado.getId());
    }

    // =====================================================================
    // CRUD - ACTUALIZAR
    // =====================================================================
    public IncidenteResponseDTO actualizar(Long id, IncidenteRequestDTO req) {
        Incidente inc = incidenteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Incidente", "id", id));
        Prioridad prioridad = prioridadRepository.findById(req.getPrioridadId())
                .orElseThrow(() -> new ResourceNotFoundException("Prioridad", "id", req.getPrioridadId()));
        Estado estadoNuevo = estadoRepository.findById(req.getEstadoId())
                .orElseThrow(() -> new ResourceNotFoundException("Estado", "id", req.getEstadoId()));
        Usuario usuario = usuarioRepository.findById(req.getCreadoPorUsuarioId())
                .orElseThrow(() -> new ResourceNotFoundException("Usuario", "id", req.getCreadoPorUsuarioId()));

        // Cambio de estado
        if (!inc.getEstado().getId().equals(estadoNuevo.getId())) {
            cambioEstadoRepository.save(CambioEstado.builder()
                    .incidente(inc).estadoAnterior(inc.getEstado()).estadoNuevo(estadoNuevo)
                    .usuario(usuario).comentario("Cambio de estado por actualización").build());
            if ("Resuelto".equals(estadoNuevo.getNombre()) && inc.getFechaResolucion() == null)
                inc.setFechaResolucion(LocalDateTime.now());
            if ("Cerrado".equals(estadoNuevo.getNombre()) && inc.getFechaCierre() == null)
                inc.setFechaCierre(LocalDateTime.now());
        }

        // Auditoría de costo
        if (req.getCostoEstimado().compareTo(inc.getCostoEstimado()) != 0) {
            registrarAuditoria(inc, usuario, "CAMBIO_COSTO_ESTIMADO", "Costo estimado modificado",
                    req.getCostoEstimado(), inc.getCostoEstimado().toString(), req.getCostoEstimado().toString());
        }

        inc.setTitulo(req.getTitulo()); inc.setDescripcion(req.getDescripcion());
        inc.setPrioridad(prioridad); inc.setEstado(estadoNuevo);
        inc.setCostoEstimado(req.getCostoEstimado());
        inc.setIngresos(req.getIngresos() != null ? req.getIngresos() : inc.getIngresos());
        inc.setCliente(req.getCliente()); inc.setSistemaAfectado(req.getSistemaAfectado());
        inc.setDescripcionTecnica(req.getDescripcionTecnica());
        inc.setLeccionesAprendidas(req.getLeccionesAprendidas());

        if (req.getResueltoPorUsuarioId() != null) {
            Usuario resueltoPor = usuarioRepository.findById(req.getResueltoPorUsuarioId())
                    .orElseThrow(() -> new ResourceNotFoundException("Usuario", "id", req.getResueltoPorUsuarioId()));
            inc.setResueltoPor(resueltoPor);
        }

        incidenteRepository.save(inc);
        return obtenerPorId(id);
    }

    // =====================================================================
    // CRUD - ELIMINAR (solo si estado = "Nuevo")
    // =====================================================================
    public void eliminar(Long id) {
        Incidente inc = incidenteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Incidente", "id", id));
        if (!"Nuevo".equals(inc.getEstado().getNombre()))
            throw new BusinessException("Solo se pueden eliminar incidentes en estado 'Nuevo'. Actual: '" + inc.getEstado().getNombre() + "'");
        incidenteRepository.delete(inc);
    }

    // =====================================================================
    // CÁLCULOS FINANCIEROS
    // =====================================================================
    @Transactional(readOnly = true)
    public BigDecimal calcularCostoReal(Long incidenteId) {
        List<HoraTrabajada> horas = horaTrabajadaRepository.findByIncidenteId(incidenteId);
        List<CostoExtra> costos = costoExtraRepository.findByIncidenteId(incidenteId);
        BigDecimal manoObra = horas.stream()
                .map(h -> h.getHoras().multiply(h.getRecurso().getCostoPorHora()))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal extras = costos.stream().map(CostoExtra::getMonto).reduce(BigDecimal.ZERO, BigDecimal::add);
        return manoObra.add(extras);
    }

    @Transactional(readOnly = true)
    public BigDecimal calcularDesviacion(BigDecimal costoReal, BigDecimal costoEstimado) {
        if (costoEstimado == null || costoEstimado.compareTo(BigDecimal.ZERO) == 0) return BigDecimal.ZERO;
        return costoReal.subtract(costoEstimado).divide(costoEstimado, 4, RoundingMode.HALF_UP)
                .multiply(new BigDecimal("100")).setScale(2, RoundingMode.HALF_UP);
    }

    // =====================================================================
    // MÉTRICAS
    // =====================================================================
    @Transactional(readOnly = true)
    public double calcularMTTR() {
        List<Incidente> resueltos = incidenteRepository.findResueltos();
        if (resueltos.isEmpty()) return 0.0;
        long total = 0; int count = 0;
        for (Incidente i : resueltos) {
            if (i.getFechaResolucion() != null && i.getFechaCreacion() != null) {
                total += Duration.between(i.getFechaCreacion(), i.getFechaResolucion()).toHours();
                count++;
            }
        }
        return count == 0 ? 0.0 : Math.round((double) total / count * 100.0) / 100.0;
    }

    @Transactional(readOnly = true)
    public long contarIncidentesActivos() { return incidenteRepository.countIncidentesActivos(); }

    @Transactional(readOnly = true)
    public List<IncidenteResponseDTO> listarIncidentesCriticos() {
        BigDecimal umbral = new BigDecimal("15");
        return incidenteRepository.findByActivoTrue().stream().filter(inc -> {
            BigDecimal cr = calcularCostoReal(inc.getId());
            return calcularDesviacion(cr, inc.getCostoEstimado()).abs().compareTo(umbral) > 0;
        }).map(this::convertirAResponseDTO).collect(Collectors.toList());
    }

    // =====================================================================
    // MÉTODOS PRIVADOS
    // =====================================================================
    private IncidenteResponseDTO convertirAResponseDTO(Incidente inc) {
        BigDecimal costoReal = calcularCostoReal(inc.getId());
        BigDecimal desviacion = calcularDesviacion(costoReal, inc.getCostoEstimado());
        List<HoraTrabajada> horas = horaTrabajadaRepository.findByIncidenteId(inc.getId());
        List<CostoExtra> costos = costoExtraRepository.findByIncidenteId(inc.getId());
        BigDecimal manoObra = horas.stream().map(h -> h.getHoras().multiply(h.getRecurso().getCostoPorHora()))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal extras = costos.stream().map(CostoExtra::getMonto).reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal ingresos = inc.getIngresos() != null ? inc.getIngresos() : BigDecimal.ZERO;
        BigDecimal margenAbs = ingresos.subtract(costoReal);
        BigDecimal margenPct = ingresos.compareTo(BigDecimal.ZERO) > 0
                ? margenAbs.divide(ingresos, 4, RoundingMode.HALF_UP).multiply(new BigDecimal("100")).setScale(2, RoundingMode.HALF_UP)
                : BigDecimal.ZERO;
        Long horasRes = (inc.getFechaResolucion() != null && inc.getFechaCreacion() != null)
                ? Duration.between(inc.getFechaCreacion(), inc.getFechaResolucion()).toHours() : null;

        return IncidenteResponseDTO.builder()
                .id(inc.getId()).titulo(inc.getTitulo()).descripcion(inc.getDescripcion())
                .prioridadId(inc.getPrioridad().getId()).prioridadNombre(inc.getPrioridad().getNombre())
                .prioridadNivel(inc.getPrioridad().getNivel()).prioridadColor(inc.getPrioridad().getColor())
                .estadoId(inc.getEstado().getId()).estadoNombre(inc.getEstado().getNombre())
                .estadoColor(inc.getEstado().getColor())
                .costoEstimado(inc.getCostoEstimado()).ingresos(ingresos).costoReal(costoReal)
                .desviacionPorcentual(desviacion).costoManoObra(manoObra).costoExtras(extras)
                .margenAbsoluto(margenAbs).margenPorcentual(margenPct)
                .fechaCreacion(inc.getFechaCreacion()).fechaResolucion(inc.getFechaResolucion()).fechaCierre(inc.getFechaCierre())
                .creadoPorUsuarioId(inc.getCreadoPor().getId()).creadoPorNombre(inc.getCreadoPor().getNombreCompleto())
                .resueltoPorUsuarioId(inc.getResueltoPor() != null ? inc.getResueltoPor().getId() : null)
                .resueltoPorNombre(inc.getResueltoPor() != null ? inc.getResueltoPor().getNombreCompleto() : null)
                .cliente(inc.getCliente()).sistemaAfectado(inc.getSistemaAfectado())
                .descripcionTecnica(inc.getDescripcionTecnica()).leccionesAprendidas(inc.getLeccionesAprendidas())
                .horasParaResolucion(horasRes).activo(inc.getActivo()).build();
    }

    private HoraTrabajadaResponseDTO horaToDTO(HoraTrabajada h) {
        return HoraTrabajadaResponseDTO.builder()
                .id(h.getId()).incidenteId(h.getIncidente().getId()).incidenteTitulo(h.getIncidente().getTitulo())
                .recursoId(h.getRecurso().getId()).recursoNombre(h.getRecurso().getNombre())
                .recursoCargo(h.getRecurso().getCargo()).costoPorHora(h.getRecurso().getCostoPorHora())
                .usuarioRegistraId(h.getUsuarioRegistra().getId()).usuarioRegistraNombre(h.getUsuarioRegistra().getNombreCompleto())
                .horas(h.getHoras()).costoTotal(h.getHoras().multiply(h.getRecurso().getCostoPorHora()))
                .fechaTrabajo(h.getFechaTrabajo()).descripcion(h.getDescripcion())
                .facturable(h.getFacturable()).fechaRegistro(h.getFechaRegistro()).build();
    }

    private CostoExtraResponseDTO costoToDTO(CostoExtra c) {
        return CostoExtraResponseDTO.builder()
                .id(c.getId()).incidenteId(c.getIncidente().getId()).incidenteTitulo(c.getIncidente().getTitulo())
                .usuarioRegistraId(c.getUsuarioRegistra().getId()).usuarioRegistraNombre(c.getUsuarioRegistra().getNombreCompleto())
                .concepto(c.getConcepto()).monto(c.getMonto()).fecha(c.getFecha())
                .proveedor(c.getProveedor()).documentoSoporte(c.getDocumentoSoporte())
                .categoria(c.getCategoria()).facturable(c.getFacturable()).fechaRegistro(c.getFechaRegistro()).build();
    }

    private void registrarAuditoria(Incidente inc, Usuario usr, String tipo, String detalle,
                                    BigDecimal valor, String anterior, String nuevo) {
        auditoriaFinancieraRepository.save(AuditoriaFinanciera.builder()
                .incidente(inc).usuario(usr).tipoCambio(tipo).detalle(detalle)
                .valorAfectado(valor).registroAnterior(anterior).registroNuevo(nuevo).build());
    }
}
