# Módulo de Ganancia Estimada

## Descripción
El módulo de ganancia estimada calcula la ganancia potencial del negocio considerando todos los productos en stock y las pérdidas asociadas. Este cálculo proporciona una vista general de la rentabilidad estimada si se vendiera todo el inventario disponible.

## Componentes del Cálculo

### 1. Ganancias por Animal en Vara
**Fórmula**: `Suma(cantidad_corte × precio_corte) - precio_total_vara`

- **Ingresos**: Se multiplica la cantidad de cada corte de carne por su precio de venta correspondiente
- **Costos**: El precio total pagado por el animal en vara
- **Ganancia**: Diferencia entre ingresos estimados y costo de compra

**Cortes considerados**:
- Abastero, Asado de tira, Asado carnicero, Asiento, Choclillo
- Cogote, Entraña, Filete, Ganso, Huachalomo
- Lomo liso, Lomo vetado, Palanca, Plateada
- Pollo barriga, Pollo ganso, Posta negra, Posta paleta, Posta rosada
- Punta ganso, Punta picana, Punta paleta, Sobrecostilla
- Tapabarriga, Tapapecho, Hueso carnudo, Hueso con carne
- Pata vacuno, Huachalomo olla, Cazuela paleta, Osobuco
- Lagarto, Costilla vacuno, Tapaposta, Malaya

### 2. Ganancias por Productos
**Fórmula**: `(cantidad_recepcion × precio_venta) - (cantidad_recepcion × costo_unitario)`

- **Ingresos**: Cantidad recibida multiplicada por precio de venta
- **Costos**: Cantidad recibida multiplicada por costo unitario de compra
- **Fuentes**: 
  - Precio de venta: Entidad `Producto`
  - Costo de compra: Entidad `RecepcionStock`

### 3. Ganancias por Subproductos
**Fórmula**: `cantidad_entregados × precio_subproducto`

- **Solo ganancias**: Los subproductos representan ingresos adicionales sin costo directo asociado
- **Tipos de subproductos**:
  - Guata, Corazón, Cabezas, Lenguas, Chunchul
  - Hígado, Riñón, Patas, Charcha

### 4. Pérdidas por Mermas
**Fórmula**: `cantidad_perdida × precio_referencia`

- **Tipos de merma**:
  - **Producto**: Usa precio de venta del producto
  - **Subproducto**: Usa precio específico del tipo de subproducto (guata, corazón, cabezas, lenguas, chunchul, hígado, riñón, patas, charcha)
  - **Carne**: Usa precio específico del corte de carne perdido según la lista de precios del animal

## Endpoints Disponibles

### GET `/api/ganancia-estimada`
Obtiene el cálculo completo de ganancia estimada con todos los detalles.

**Respuesta**:
```json
{
  "detalles": {
    "animalVara": { ... },
    "productos": { ... },
    "subproductos": { ... },
    "mermas": { ... }
  },
  "resumen": {
    "totalGanancias": 0,
    "totalPerdidas": 0,
    "gananciaEstimadaTotal": 0,
    "margenGanancia": "0.00"
  }
}
```

### GET `/api/ganancia-estimada/resumen`
Obtiene solo el resumen financiero.

### GET `/api/ganancia-estimada/detalle`
Obtiene el detalle completo por categorías.

### GET `/api/ganancia-estimada/animal-vara`
Obtiene ganancias específicas de animales en vara.

### GET `/api/ganancia-estimada/productos`
Obtiene ganancias específicas de productos.

### GET `/api/ganancia-estimada/subproductos`
Obtiene ganancias específicas de subproductos.

### GET `/api/ganancia-estimada/mermas`
Obtiene las pérdidas por mermas.

## Consideraciones

### Permisos
- Todos los endpoints requieren autenticación
- Solo usuarios con rol de administrador pueden acceder

### Limitaciones
- Los cálculos se basan en el stock actual y precios configurados
- No considera factores externos como demanda del mercado
- Las fechas de vencimiento no afectan el cálculo actual

### Optimizaciones Futuras
- Considerar fechas de vencimiento en el cálculo
- Incluir proyecciones basadas en demanda histórica
- Agregar alertas cuando la ganancia estimada sea negativa
- Implementar filtros por fechas o categorías específicas

## Uso Recomendado
Este módulo es útil para:
- Evaluación periódica de rentabilidad
- Toma de decisiones de compra
- Identificación de productos poco rentables
- Planificación financiera a corto plazo

## Estado de Implementación

### ✅ Completado
- Backend service con cálculos de ganancia estimada
- Controllers y rutas para todos los endpoints
- Frontend con dashboard principal y vistas detalladas
- Autenticación y autorización para todos los endpoints
- Middleware personalizado para logging y validación
- Estilos CSS para todas las interfaces

### 🔧 Correcciones Aplicadas
- Importaciones de middlewares de autenticación corregidas (`authenticateJwt`)
- Iconos de React corregidos:
  - `FaRefresh` → `FaSyncAlt` (en todas las páginas)
  - `FaTrendingDown` → `FaArrowDown` (en GananciaEstimada.jsx)
  - `FaTrendingUp` → `FaArrowUp` (en GananciaEstimada.jsx)
- Estructura de exports/imports validada y sincronizada
- **Agregado a la navegación**: Incluido en Navbar2.jsx con icono `FaChartLine`
- **Estructura de datos backend-frontend sincronizada**: Corregida la estructura de respuesta del backend para que coincida con lo que espera el frontend:
  - `detalleAnimales` → `detalles` 
  - `detalleProductos` → `detalles`
  - `detalleSubproductos` → `detalles`
  - `detalleMermas` → `detalles`
- **Renderizado condicional corregido**: Implementado verificación `length > 0` para mostrar correctamente los datos o el mensaje "No hay datos"
- **Optimización visual**: Reducido el tamaño de fuentes para mejor legibilidad y aprovechamiento del espacio

### 📋 Frontend Disponible
- `/ganancia-estimada` - **Página única completa** con todos los cálculos integrados:
  - Resumen principal con totales de ganancias, pérdidas y ganancia neta
  - Tabla detallada de animales en vara con cálculos individuales
  - Tabla de productos con márgenes de ganancia
  - Tabla de subproductos con ingresos adicionales
  - Tabla de mermas con pérdidas detalladas
  - Alertas y recomendaciones automáticas basadas en los resultados
- **Accesible desde**: Navbar lateral → "Ganancia Estimada" (icono de gráfico)
- **Permisos**: Solo usuarios administrador pueden acceder

### 🎯 Diseño y Estilo Aplicado
**Título simplificado**: Se ha actualizado la página para usar un título simple "Ganancia Estimada" (similar al estilo de la página de Pedidos), eliminando:
- El botón de actualizar manual
- El header elaborado con descripción
- Los iconos decorativos en el título

**Beneficios del nuevo diseño**:
- Interfaz más limpia y minimalista
- Consistencia visual con otras páginas del sistema
- Enfoque directo en los datos sin distracciones
- Carga automática de datos sin necesidad de actualización manual
- Mejor aprovechamiento del espacio vertical

**Estilo aplicado**:
- Título con subrayado rojo (#e8272b) matching el branding
- Cards con headers oscuros (#2b2727) y contenido claro
- Tablas con el mismo esquema de colores del proyecto
- Fuente Montserrat consistente en toda la interfaz

**Datos mostrados simultáneamente**:
- Resumen financiero general
- Detalles de cada animal en vara con sus cortes
- Análisis de productos con márgenes individuales
- Ingresos por subproductos
- Registro completo de mermas y pérdidas
- Alertas automáticas y recomendaciones
