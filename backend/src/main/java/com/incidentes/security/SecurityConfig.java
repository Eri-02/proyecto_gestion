package com.incidentes.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.password.NoOpPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    @Autowired
    private JwtAuthenticationEntryPoint authenticationEntryPoint;

    @Autowired
    private JwtAuthenticationFilter authenticationFilter;

    // =====================================================================
    // PASSWORD ENCODER
    // Usa NoOpPasswordEncoder porque la BD tiene contraseñas en texto plano.
    // TODO: Migrar a BCryptPasswordEncoder cuando se hasheen las contraseñas.
    // =====================================================================
    @Bean
    public PasswordEncoder passwordEncoder() {
        @SuppressWarnings("deprecation")
        PasswordEncoder encoder = NoOpPasswordEncoder.getInstance();
        return encoder;
    }

    // =====================================================================
    // AUTHENTICATION MANAGER
    // =====================================================================
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }

    // =====================================================================
    // CORS - Permite localhost:5173 (Vite) y localhost:3000 (React/Next)
    // =====================================================================
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList(
                "http://localhost:4200",
                "http://localhost:5173",
                "http://localhost:3000"
        ));
        configuration.setAllowedMethods(Arrays.asList(
                "GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"
        ));
        configuration.setAllowedHeaders(List.of(
                "Authorization",
                "Content-Type",
                "Accept",
                "Origin",
                "X-Requested-With"
        ));
        configuration.setAllowCredentials(true);
        configuration.setExposedHeaders(List.of("Authorization"));
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    // =====================================================================
    // SECURITY FILTER CHAIN - Autorización por roles
    //
    // Roles de la tabla 'rol':
    //   ROLE_READ_ONLY  (nivel 1) - Solo lectura
    //   ROLE_ANALISTA   (nivel 2) - Gestiona incidentes
    //   ROLE_FINANZAS   (nivel 2) - Ve y edita costos
    //   ROLE_ADMIN      (nivel 3) - Gestión completa
    //   ROLE_SUPER_ADMIN(nivel 4) - Acceso total
    //   ROLE_DIRECTOR   (nivel 3) - Dashboards y reportes
    // =====================================================================
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // Habilitar CORS con la configuración definida arriba
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                // Deshabilitar CSRF (no necesario con JWT stateless)
                .csrf(csrf -> csrf.disable())

                // Configurar respuesta para accesos no autorizados
                .exceptionHandling(exception -> exception
                        .authenticationEntryPoint(authenticationEntryPoint)
                )

                // Sesiones stateless (JWT no usa sesiones del servidor)
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )

                // Reglas de autorización por endpoint y rol
                .authorizeHttpRequests(authorize -> authorize
                        // ---- Endpoints públicos ----
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        // ---- Roles: ADMIN, SUPER_ADMIN ----
                        .requestMatchers("/api/roles/**").hasAnyAuthority("ROLE_ADMIN", "ROLE_SUPER_ADMIN")

                        // ---- Usuarios: ADMIN, SUPER_ADMIN ----
                        .requestMatchers("/api/usuarios/**").hasAnyAuthority("ROLE_ADMIN", "ROLE_SUPER_ADMIN")

                        // ---- Prioridades: ADMIN, ANALISTA, SUPER_ADMIN ----
                        .requestMatchers("/api/prioridades/**").hasAnyAuthority("ROLE_ADMIN", "ROLE_ANALISTA", "ROLE_SUPER_ADMIN")

                        // ---- Estados: ADMIN, ANALISTA, SUPER_ADMIN ----
                        .requestMatchers("/api/estados/**").hasAnyAuthority("ROLE_ADMIN", "ROLE_ANALISTA", "ROLE_SUPER_ADMIN")

                        // ---- Incidentes: ANALISTA, ADMIN, DIRECTOR, FINANZAS, SUPER_ADMIN ----
                        .requestMatchers("/api/incidentes/**").hasAnyAuthority("ROLE_ANALISTA", "ROLE_ADMIN", "ROLE_DIRECTOR", "ROLE_FINANZAS", "ROLE_SUPER_ADMIN")

                        // ---- Recursos: ADMIN, FINANZAS, SUPER_ADMIN ----
                        .requestMatchers("/api/recursos/**").hasAnyAuthority("ROLE_ADMIN", "ROLE_FINANZAS", "ROLE_SUPER_ADMIN")

                        // ---- Horas trabajadas: ANALISTA, ADMIN, SUPER_ADMIN ----
                        .requestMatchers("/api/horas/**").hasAnyAuthority("ROLE_ANALISTA", "ROLE_ADMIN", "ROLE_SUPER_ADMIN")

                        // ---- Costos extras: FINANZAS, ADMIN, SUPER_ADMIN ----
                        .requestMatchers("/api/costos-extras/**").hasAnyAuthority("ROLE_FINANZAS", "ROLE_ADMIN", "ROLE_SUPER_ADMIN")

                        // ---- Auditoría: GET/POST → ADMIN y SUPER_ADMIN ----
                        //      PUT/DELETE → bloqueados (los registros de auditoría son inmutables)
                        .requestMatchers(HttpMethod.GET, "/api/auditoria/**").hasAnyAuthority("ROLE_ADMIN", "ROLE_SUPER_ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/auditoria/**").hasAnyAuthority("ROLE_ADMIN", "ROLE_SUPER_ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/auditoria/**").denyAll()
                        .requestMatchers(HttpMethod.DELETE, "/api/auditoria/**").denyAll()

                        // ---- Cambios de estado: ADMIN, DIRECTOR, SUPER_ADMIN ----
                        .requestMatchers("/api/cambios-estado/**").hasAnyAuthority("ROLE_ADMIN", "ROLE_DIRECTOR", "ROLE_SUPER_ADMIN")

                        // ---- Dashboard: DIRECTOR, ADMIN, FINANZAS, SUPER_ADMIN ----
                        .requestMatchers("/api/dashboard/**").hasAnyAuthority("ROLE_DIRECTOR", "ROLE_ADMIN", "ROLE_FINANZAS", "ROLE_SUPER_ADMIN")

                        // ---- Reportes: DIRECTOR, ADMIN, FINANZAS, SUPER_ADMIN, ANALISTA ----
                        .requestMatchers("/api/reportes/**").hasAnyAuthority("ROLE_DIRECTOR", "ROLE_ADMIN", "ROLE_FINANZAS", "ROLE_SUPER_ADMIN", "ROLE_ANALISTA")

                        // ---- Todo lo demás requiere autenticación ----
                        .anyRequest().authenticated()
                )

                // Agregar el filtro JWT antes del filtro de autenticación estándar
                .addFilterBefore(authenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
