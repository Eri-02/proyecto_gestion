package com.incidentes.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

/**
 * Manejador global de excepciones con @ControllerAdvice.
 * Captura todas las excepciones y devuelve respuestas JSON estandarizadas.
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    // =====================================================================
    // 404 - RECURSO NO ENCONTRADO
    // Captura: ResourceNotFoundException
    // =====================================================================
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<Map<String, Object>> handleResourceNotFound(ResourceNotFoundException ex) {
        Map<String, Object> body = new HashMap<>();
        body.put("timestamp", LocalDateTime.now().toString());
        body.put("status", HttpStatus.NOT_FOUND.value());
        body.put("error", "No encontrado");
        body.put("mensaje", ex.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(body);
    }

    // =====================================================================
    // 400 - ERROR DE NEGOCIO
    // Captura: BusinessException (reglas de negocio violadas)
    // Ejemplo: intentar eliminar un incidente que no está en estado "Nuevo"
    // =====================================================================
    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<Map<String, Object>> handleBusinessException(BusinessException ex) {
        Map<String, Object> body = new HashMap<>();
        body.put("timestamp", LocalDateTime.now().toString());
        body.put("status", HttpStatus.BAD_REQUEST.value());
        body.put("error", "Error de negocio");
        body.put("mensaje", ex.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(body);
    }

    // =====================================================================
    // 400 - ERROR DE VALIDACIÓN
    // Captura: MethodArgumentNotValidException
    // Se activa cuando @Valid falla en los DTOs (@NotNull, @Positive, etc.)
    // Devuelve un mapa campo -> mensaje de error
    // =====================================================================
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidationErrors(MethodArgumentNotValidException ex) {
        Map<String, Object> body = new HashMap<>();
        body.put("timestamp", LocalDateTime.now().toString());
        body.put("status", HttpStatus.BAD_REQUEST.value());
        body.put("error", "Error de validación");

        // Extraer errores campo por campo
        Map<String, String> erroresCampos = new HashMap<>();
        for (FieldError fieldError : ex.getBindingResult().getFieldErrors()) {
            erroresCampos.put(fieldError.getField(), fieldError.getDefaultMessage());
        }
        body.put("errores", erroresCampos);

        // Mensaje resumen
        body.put("mensaje", "Se encontraron " + erroresCampos.size() + " errores de validación");

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(body);
    }

    // =====================================================================
    // 401 - CREDENCIALES INVÁLIDAS
    // Captura: BadCredentialsException
    // Se activa cuando el login falla (username/password incorrectos)
    // =====================================================================
    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<Map<String, Object>> handleBadCredentials(BadCredentialsException ex) {
        Map<String, Object> body = new HashMap<>();
        body.put("timestamp", LocalDateTime.now().toString());
        body.put("status", HttpStatus.UNAUTHORIZED.value());
        body.put("error", "No autorizado");
        body.put("mensaje", "Credenciales inválidas. Verifique su usuario y contraseña.");
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(body);
    }

    // =====================================================================
    // 403 - ACCESO DENEGADO
    // Captura: AccessDeniedException
    // Se activa cuando el usuario no tiene el rol necesario
    // =====================================================================
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<Map<String, Object>> handleAccessDenied(AccessDeniedException ex) {
        Map<String, Object> body = new HashMap<>();
        body.put("timestamp", LocalDateTime.now().toString());
        body.put("status", HttpStatus.FORBIDDEN.value());
        body.put("error", "Acceso denegado");
        body.put("mensaje", "No tiene permisos suficientes para acceder a este recurso");
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(body);
    }

    // =====================================================================
    // 500 - ERROR INTERNO DEL SERVIDOR
    // Captura: Exception (cualquier excepción no manejada arriba)
    // =====================================================================
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleGenericException(Exception ex) {
        Map<String, Object> body = new HashMap<>();
        body.put("timestamp", LocalDateTime.now().toString());
        body.put("status", HttpStatus.INTERNAL_SERVER_ERROR.value());
        body.put("error", "Error interno del servidor");
        body.put("mensaje", ex.getMessage());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(body);
    }
}
