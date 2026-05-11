package com.incidentes.util;

import java.util.*;

public class EstadoTransitions {

    private static final Map<String, List<String>> TRANSICIONES = new HashMap<>();

    static {

        TRANSICIONES.put(
                "Abierto",
                Arrays.asList(
                        "En Proceso",
                        "Cancelado"
                )
        );

        TRANSICIONES.put(
                "En Proceso",
                Arrays.asList(
                        "Resuelto",
                        "Cancelado"
                )
        );

        TRANSICIONES.put(
                "Resuelto",
                Arrays.asList(
                        "Cerrado"
                )
        );

        TRANSICIONES.put(
                "Cerrado",
                Collections.emptyList()
        );
    }

    public static boolean esTransicionValida(
            String actual,
            String nuevo
    ) {

        List<String> permitidos =
                TRANSICIONES.get(actual);

        return permitidos != null
                && permitidos.contains(nuevo);
    }
}