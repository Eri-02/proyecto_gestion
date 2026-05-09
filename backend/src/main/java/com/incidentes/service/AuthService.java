package com.incidentes.service;

import com.incidentes.dto.LoginRequestDTO;
import com.incidentes.dto.LoginResponseDTO;
import com.incidentes.model.Usuario;
import com.incidentes.repository.UsuarioRepository;
import com.incidentes.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Autowired
    private UsuarioRepository usuarioRepository;

    public LoginResponseDTO login(LoginRequestDTO loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getUsername(),
                            loginRequest.getPassword()
                    )
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);
            String token = tokenProvider.generateToken(authentication);

            Usuario usuario = usuarioRepository.findByUsername(loginRequest.getUsername())
                    .orElseThrow(() -> new BadCredentialsException("Usuario no encontrado"));

            // Actualizar último acceso
            usuario.setUltimoAcceso(LocalDateTime.now());
            usuarioRepository.save(usuario);

            return LoginResponseDTO.builder()
                    .token(token)
                    .tipo("Bearer")
                    .usuarioId(usuario.getId())
                    .username(usuario.getUsername())
                    .nombreCompleto(usuario.getNombreCompleto())
                    .email(usuario.getEmail())
                    .rol(usuario.getRol().getNombre())
                    .nivelPermiso(usuario.getRol().getNivelPermiso())
                    .build();

        } catch (BadCredentialsException ex) {
            throw new BadCredentialsException("Credenciales inválidas");
        }
    }
}
