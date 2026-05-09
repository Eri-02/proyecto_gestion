package com.incidentes.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

@Component
public class JwtTokenProvider {

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.expiration}")
    private long jwtExpiration;

    // =====================================================================
    // OBTENER CLAVE DE FIRMA (SecretKey para HS256)
    // =====================================================================
    private SecretKey getSigningKey() {
        byte[] keyBytes = Decoders.BASE64.decode(
                java.util.Base64.getEncoder().encodeToString(jwtSecret.getBytes())
        );
        return Keys.hmacShaKeyFor(keyBytes);
    }

    // =====================================================================
    // GENERAR TOKEN desde Authentication (usado internamente por AuthService)
    // =====================================================================
    public String generateToken(Authentication authentication) {
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        return generarToken(userDetails.getUsername());
    }

    // =====================================================================
    // GENERAR TOKEN desde username (String)
    // Crea un JWT con:
    //   - subject: username
    //   - issuedAt: fecha actual
    //   - expiration: fecha actual + jwt.expiration (86400000ms = 24h)
    //   - firmado con HS256
    // =====================================================================
    public String generarToken(String username) {
        Date ahora = new Date();
        Date fechaExpiracion = new Date(ahora.getTime() + jwtExpiration);

        return Jwts.builder()
                .subject(username)
                .issuedAt(ahora)
                .expiration(fechaExpiracion)
                .signWith(getSigningKey())
                .compact();
    }

    // =====================================================================
    // OBTENER USERNAME DEL TOKEN
    // Parsea el JWT, verifica la firma y extrae el subject (username)
    // =====================================================================
    public String obtenerUsernameDelToken(String token) {
        Claims claims = Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();

        return claims.getSubject();
    }

    // Alias para compatibilidad con JwtAuthenticationFilter
    public String getUsernameFromToken(String token) {
        return obtenerUsernameDelToken(token);
    }

    // =====================================================================
    // VALIDAR TOKEN
    // Verifica que:
    //   - La firma sea válida
    //   - El token no haya expirado
    //   - El formato sea correcto
    // Retorna true si es válido, false si no
    // =====================================================================
    public boolean validarToken(String token) {
        try {
            Jwts.parser()
                    .verifyWith(getSigningKey())
                    .build()
                    .parseSignedClaims(token);
            return true;
        } catch (ExpiredJwtException ex) {
            // Token expirado
            return false;
        } catch (UnsupportedJwtException ex) {
            // Token no soportado
            return false;
        } catch (MalformedJwtException ex) {
            // Token mal formado
            return false;
        } catch (IllegalArgumentException ex) {
            // Token vacío o nulo
            return false;
        } catch (JwtException ex) {
            // Cualquier otro error de JWT
            return false;
        }
    }

    // Alias para compatibilidad con JwtAuthenticationFilter
    public boolean validateToken(String token) {
        return validarToken(token);
    }
}
