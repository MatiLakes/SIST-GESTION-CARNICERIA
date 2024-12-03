¡Hola y bienvenido! 👋  
Gracias por tu interés en contribuir a este proyecto. Es emocionante contar con tu participación para mejorar nuestro sistema de gestión, ya sea corrigiendo errores, proponiendo nuevas ideas o ayudando a construir una herramienta aún mejor. Cada sugerencia, línea de código y esfuerzo que aportes nos ayuda a hacer que este proyecto sea más útil para todos.

## Tabla de Contenidos
1. [Cómo contribuir](#cómo-contribuir)
2. [Estilo de código](#estilo-de-código)
3. [Buenas prácticas para commits y ramas](#buenas-prácticas-para-commits-y-ramas)
4. [Estrategias de branching](#estrategias-de-branching)
5. [Convenciones de mensajes de commit](#convenciones-de-mensajes-de-commit)

---

## 1. Cómo contribuir

Queremos que seas parte de nuestro proyecto, y hay muchas maneras de hacerlo:
- **Reporta errores:** Si encuentras algo que no funciona bien, haznos saber.
- **Propone nuevas funcionalidades:** Tus ideas pueden llevar el proyecto a otro nivel.
- **Mejora la documentación:** Ayúdanos a que el proyecto sea más accesible para todos.
- **Envía código:** Si tienes una solución a un problema o quieres agregar algo nuevo, ¡adelante!

Si tienes algo en mente, abre un **issue** y conversemos. Juntos podemos definir el mejor camino para implementar tu idea o solucionar un problema.

## Cómo abrir un issue

Un **issue** es la manera de reportar errores, proponer nuevas ideas o pedir ayuda. Para abrir un issue en este proyecto:

1. Ve a la página principal del repositorio en **GitHub**.
2. Haz clic en la pestaña **Issues**.
3. Haz clic en el botón verde **New issue**.
4. Llena los campos requeridos:
   - **Título:** Un resumen claro y breve del problema o propuesta.
   - **Descripción:** Proporciona detalles, como pasos para reproducir un error, capturas de pantalla, o ejemplos de código.
   - **Etiquetas (opcional):** Si tienes permiso, clasifica el issue con etiquetas como `bug`, `enhancement`, o `question`.
5. Haz clic en **Submit new issue** para enviarlo.

Si es un error técnico, incluye toda la información necesaria, como:

- Mensajes de error completos.
- Pasos para reproducirlo.
- Detalles sobre tu entorno (sistema operativo, versión de Node.js, etc.).

## 2. Estilo de código

La consistencia en el estilo de código es clave para mantener un proyecto limpio y legible:

1. Usa **ESLint** para verificar que tu código siga las normas del proyecto. Puedes ejecutar el siguiente comando para validar tu código:

   ```bash
   npm run lint
   ```

2. Sigue las reglas definidas en el archivo `.eslintrc.js`. Estas reglas incluyen:

   ```markdown
   - **Versión y tipo de ECMAScript**: Configurado para usar la última versión de ECMAScript (`ecmaVersion: "latest"`) y el tipo de módulo (`sourceType: "module"`).

   - **Indentación y formato**: La regla `indent` está desactivada, pero se mantienen otros estilos como el espacio entre llaves (`object-curly-spacing`) y la longitud máxima de líneas (`max-len` de 120 caracteres para el código y 150 para los comentarios).

   - **Uso de comillas**: Deben usarse **comillas dobles** en todo el proyecto (`quotes: ["error", "double"]`).

   - **Orden de importaciones**: Las importaciones deben ordenarse alfabéticamente, ignorando el orden de declaraciones y respetando un orden coherente entre miembros (`sort-imports`).

   - **Estilo de operadores**: La regla `operator-linebreak` especifica cómo se deben manejar las líneas largas con operadores (`before` o `after` dependiendo del caso).

   - **Otras reglas**: Algunas reglas, como `no-console` y `linebreak-style`, están desactivadas para mayor flexibilidad en el desarrollo.
   ```

3. Usa nombres de variables claros y descriptivos para que el código sea más fácil de entender.

4. Si tienes dudas, revisa el código existente para guiarte y mantener la coherencia con el resto del proyecto.

## 3. Buenas prácticas para commits y ramas

Para contribuir correctamente al proyecto, sigue estas buenas prácticas al realizar commits y trabajar en nuevas funcionalidades:

1. **Crea una nueva rama para cada funcionalidad o corrección**:
   - Antes de comenzar a trabajar en una nueva característica, crea una rama específica para ello. Esto te permitirá aislar tus cambios y evitar conflictos en la rama principal (`main`).
   - Nombra la rama de forma clara y descriptiva, por ejemplo: `feature/nueva-funcionalidad` o `fix/correccion-bug`.

   ```bash
   git checkout -b feature/nueva-funcionalidad
   ```

2. **Escribe mensajes de commit claros y descriptivos**:
   - Utiliza el comando `git commit` para hacer un commit y asegúrate de incluir un mensaje claro sobre lo que has hecho.
   - Sigue un formato estándar para los mensajes, como `feat: añade nueva funcionalidad` o `fix: corrige bug en la vista de usuario`.
   - Si el commit fue realizado por alguien en particular, puedes agregar la opción `--author` para especificar quién lo hizo:

   ```bash
   git commit -m "feat: añade nueva funcionalidad para gestión de inventario" --author="Juan Pérez <juan.perez@example.com>"
   ```

3. **Realiza commits pequeños y frecuentes**:
   - Intenta hacer commits pequeños y frecuentes que se enfoquen en una única funcionalidad o corrección. Esto facilita la revisión y seguimiento de los cambios.

4. **Sincroniza tu rama con `main` antes de hacer un push**:
   - Antes de hacer `push`, asegúrate de que tu rama esté actualizada con los últimos cambios de `main`. Esto ayuda a evitar conflictos cuando se hace un merge.

   ```bash
   git pull origin main
   ```

5. **Revisión de Código (Code Review)**:
   - Participa en el proceso de revisión de código, tanto revisando los PRs de otros colaboradores como solicitando revisiones para los tuyos.
   - La revisión de código es clave para mantener la calidad del proyecto y compartir conocimientos dentro del equipo.

## 4. Estrategias de branching

En este proyecto utilizamos una estrategia de branching estructurada para mantener un desarrollo organizado y fluido. A continuación, se detallan las principales ramas utilizadas:

1. **`main`**: Esta rama contiene el código estable en producción. Solo se debe hacer un merge en `main` cuando los cambios han sido revisados y aprobados.

2. **Ramas de características (`feature/`)**:
   - Estas ramas se crean para desarrollar nuevas funcionalidades. El nombre de la rama debe describir la característica específica, por ejemplo: `feature/nueva-funcionalidad`.

3. **Ramas de correcciones (`fix/`)**:
   - Estas ramas se utilizan para solucionar errores. Deben crearse desde `main` o `develop` dependiendo de la urgencia del arreglo. Ejemplo: `fix/correccion-error`.

4. **Ramas de soporte (`hotfix/`)**:
   - Estas ramas se utilizan para correcciones rápidas y críticas en la rama `main`. Se suelen utilizar para arreglar errores que se han encontrado en producción.

## 5. Convenciones de mensajes de commit

Para asegurar un historial claro y consistente, seguimos la convención **Conventional Commits** para escribir los mensajes de commit:

- **`feat:`** Se utiliza para agregar una nueva funcionalidad.
  - Ejemplo: `feat: añade gestión de proveedores`

- **`fix:`** Se utiliza para corregir un error.
  - Ejemplo: `fix: corrige cálculo incorrecto en ganancias estimadas`

- **`docs:`** Para cambios relacionados con la documentación.
  - Ejemplo: `docs: actualiza contributing`

- **`style:`** Cambios de formato que no afectan la lógica del código (por ejemplo, indentación, comas, etc.).
  - Ejemplo: `style: corrige formato en archivo de componentes`

- **`refactor:`** Cambios en el código que no añaden nuevas funcionalidades ni corrigen errores, pero mejoran la estructura o la eficiencia.
  - Ejemplo: `refactor: optimiza lógica de cálculo de ganancias`

- **`test:`** Se utiliza para agregar o corregir pruebas.
  - Ejemplo: `test: añade pruebas unitarias para la gestión de pedidos`

- **`chore:`** Cambios que no afectan la funcionalidad del código fuente ni las pruebas (actualización de dependencias, scripts

¡Gracias nuevamente por tu interés en contribuir a nuestro proyecto! Cada aporte cuenta para hacer de esta herramienta algo mejor para todos.