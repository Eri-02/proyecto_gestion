package com.incidentes.service;

import com.incidentes.dto.PresupuestoRequestDTO;
import com.incidentes.dto.PresupuestoResponseDTO;
import com.incidentes.exception.BusinessException;
import com.incidentes.exception.ResourceNotFoundException;
import com.incidentes.model.Presupuesto;
import com.incidentes.model.Usuario;
import com.incidentes.repository.CostoExtraRepository;
import com.incidentes.repository.HoraTrabajadaRepository;
import com.incidentes.repository.PresupuestoRepository;
import com.incidentes.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class PresupuestoService {

    private final PresupuestoRepository presupuestoRepository;
    private final UsuarioRepository usuarioRepository;
    private final HoraTrabajadaRepository horaTrabajadaRepository;
    private final CostoExtraRepository costoExtraRepository;

    public record PresupuestoComparacion(
            Long presupuestoId,
            String nombre,
            BigDecimal montoPresupuestado,
            BigDecimal costoReal,
            BigDecimal desviacionAbsoluta,
            BigDecimal desviacionPorcentual,
            BigDecimal umbralAlertaPorcentaje,
            Boolean excedeUmbral
    ) {}

    @Transactional(readOnly = true)
    public List<PresupuestoResponseDTO> listarTodos() {
        return presupuestoRepository.findByActivoTrueOrderByFechaInicioDesc().stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public PresupuestoResponseDTO obtenerPorId(Long id) {
        return toDTO(presupuestoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Presupuesto", "id", id)));
    }

    public PresupuestoResponseDTO crear(PresupuestoRequestDTO dto) {
        validarPeriodo(dto);
        Usuario usuario = null;
        if (dto.getCreadoPorUsuarioId() != null) {
            usuario = usuarioRepository.findById(dto.getCreadoPorUsuarioId())
                    .orElseThrow(() -> new ResourceNotFoundException("Usuario", "id", dto.getCreadoPorUsuarioId()));
        }

        Presupuesto presupuesto = Presupuesto.builder()
                .nombre(dto.getNombre())
                .fechaInicio(dto.getFechaInicio())
                .fechaFin(dto.getFechaFin())
                .montoPresupuestado(dto.getMontoPresupuestado())
                .umbralAlertaPorcentaje(dto.getUmbralAlertaPorcentaje())
                .descripcion(dto.getDescripcion())
                .creadoPor(usuario)
                .activo(true)
                .build();

        return toDTO(presupuestoRepository.save(presupuesto));
    }

    public PresupuestoResponseDTO actualizar(Long id, PresupuestoRequestDTO dto) {
        validarPeriodo(dto);
        Presupuesto presupuesto = presupuestoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Presupuesto", "id", id));

        presupuesto.setNombre(dto.getNombre());
        presupuesto.setFechaInicio(dto.getFechaInicio());
        presupuesto.setFechaFin(dto.getFechaFin());
        presupuesto.setMontoPresupuestado(dto.getMontoPresupuestado());
        presupuesto.setUmbralAlertaPorcentaje(dto.getUmbralAlertaPorcentaje());
        presupuesto.setDescripcion(dto.getDescripcion());
        if (dto.getCreadoPorUsuarioId() != null) {
            Usuario usuario = usuarioRepository.findById(dto.getCreadoPorUsuarioId())
                    .orElseThrow(() -> new ResourceNotFoundException("Usuario", "id", dto.getCreadoPorUsuarioId()));
            presupuesto.setCreadoPor(usuario);
        }

        return toDTO(presupuestoRepository.save(presupuesto));
    }

    public void eliminar(Long id) {
        Presupuesto presupuesto = presupuestoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Presupuesto", "id", id));
        presupuesto.setActivo(false);
        presupuestoRepository.save(presupuesto);
    }

    @Transactional(readOnly = true)
    public PresupuestoComparacion compararPeriodo(LocalDate inicio, LocalDate fin, BigDecimal costoReal) {
        return presupuestoRepository.findActivosParaPeriodo(inicio, fin).stream()
                .findFirst()
                .map(p -> comparar(p, costoReal))
                .orElse(null);
    }

    private void validarPeriodo(PresupuestoRequestDTO dto) {
        if (dto.getFechaInicio().isAfter(dto.getFechaFin())) {
            throw new BusinessException("La fecha de inicio no puede ser posterior a la fecha fin");
        }
    }

    private PresupuestoResponseDTO toDTO(Presupuesto p) {
        BigDecimal montoConsumido = calcularConsumo(p);
        BigDecimal montoDisponible = p.getMontoPresupuestado().subtract(montoConsumido);
        BigDecimal porcentajeConsumo = porcentaje(montoConsumido, p.getMontoPresupuestado());
        PresupuestoComparacion comparacion = comparar(p, montoConsumido);
        BigDecimal desviacionAbsoluta = comparacion.desviacionAbsoluta();
        BigDecimal desviacionPorcentual = comparacion.desviacionPorcentual();
        boolean excedeUmbral = Boolean.TRUE.equals(comparacion.excedeUmbral());
        String estado = resolverEstado(p, montoConsumido, excedeUmbral);
        String alertaMensaje = excedeUmbral
                ? "El consumo supera el presupuesto por encima del umbral configurado"
                : null;

        return PresupuestoResponseDTO.builder()
                .id(p.getId())
                .nombre(p.getNombre())
                .fechaInicio(p.getFechaInicio())
                .fechaFin(p.getFechaFin())
                .montoPresupuestado(p.getMontoPresupuestado())
                .umbralAlertaPorcentaje(p.getUmbralAlertaPorcentaje())
                .descripcion(p.getDescripcion())
                .creadoPorUsuarioId(p.getCreadoPor() != null ? p.getCreadoPor().getId() : null)
                .creadoPorUsuarioNombre(p.getCreadoPor() != null ? p.getCreadoPor().getNombreCompleto() : null)
                .activo(p.getActivo())
                .fechaCreacion(p.getFechaCreacion())
                .montoConsumido(montoConsumido)
                .montoDisponible(montoDisponible)
                .porcentajeConsumo(porcentajeConsumo)
                .desviacionAbsoluta(desviacionAbsoluta)
                .desviacionPorcentual(desviacionPorcentual)
                .excedeUmbral(excedeUmbral)
                .estado(estado)
                .alertaMensaje(alertaMensaje)
                .build();
    }

    private BigDecimal calcularConsumo(Presupuesto p) {
        BigDecimal horasFacturables = horaTrabajadaRepository.sumCostoByPeriodoAndFacturable(p.getFechaInicio(), p.getFechaFin(), true);
        BigDecimal horasNoFacturables = horaTrabajadaRepository.sumCostoByPeriodoAndFacturable(p.getFechaInicio(), p.getFechaFin(), false);
        BigDecimal extrasFacturables = costoExtraRepository.sumMontosByPeriodoAndFacturable(p.getFechaInicio(), p.getFechaFin(), true);
        BigDecimal extrasNoFacturables = costoExtraRepository.sumMontosByPeriodoAndFacturable(p.getFechaInicio(), p.getFechaFin(), false);
        return horasFacturables.add(horasNoFacturables).add(extrasFacturables).add(extrasNoFacturables);
    }

    private PresupuestoComparacion comparar(Presupuesto presupuesto, BigDecimal costoReal) {
        BigDecimal desviacionAbsoluta = costoReal.subtract(presupuesto.getMontoPresupuestado());
        BigDecimal desviacionPorcentual = porcentaje(desviacionAbsoluta, presupuesto.getMontoPresupuestado());
        boolean excedeUmbral = desviacionPorcentual.compareTo(presupuesto.getUmbralAlertaPorcentaje()) > 0;
        return new PresupuestoComparacion(
                presupuesto.getId(),
                presupuesto.getNombre(),
                presupuesto.getMontoPresupuestado(),
                costoReal,
                desviacionAbsoluta,
                desviacionPorcentual,
                presupuesto.getUmbralAlertaPorcentaje(),
                excedeUmbral);
    }

    private String resolverEstado(Presupuesto p, BigDecimal montoConsumido, boolean excedeUmbral) {
        if (!Boolean.TRUE.equals(p.getActivo())) {
            return "CERRADO";
        }
        if (montoConsumido.compareTo(p.getMontoPresupuestado()) > 0) {
            return "EXCEDIDO";
        }
        if (excedeUmbral) {
            return "ALERTA";
        }
        return "VIGENTE";
    }

    private BigDecimal porcentaje(BigDecimal valor, BigDecimal base) {
        if (base == null || base.compareTo(BigDecimal.ZERO) == 0) {
            return BigDecimal.ZERO;
        }
        return valor.multiply(BigDecimal.valueOf(100)).divide(base, 2, RoundingMode.HALF_UP);
    }
}
