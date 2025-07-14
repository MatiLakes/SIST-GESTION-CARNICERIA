



Título

“Sistema Integral de Apoyo a la Gestión para Carnicería GOVAL.”



Proyecto de título para optar al título de Ingeniero de Ejecución en Computación e Informática



Alumnos

Álvaro Jorquera Godoy

Matías Lagos Contreras



Profesor guía

Luis Cabrera Crot



de julio de 2025

Concepción – Chile

Dedicatoria y/o Agradecimientos

Queremos expresar nuestro más sincero agradecimiento a Maryori Godoy y Neftalí Valdebenito, dueños de Carnicería Goval, por habernos abierto las puertas de su negocio y permitirnos llevar a cabo este proyecto en un entorno real. Su disposición, confianza y buena onda fueron clave para que pudiéramos conocer de cerca las dinámicas del rubro y adaptar nuestra propuesta tecnológica a la realidad del día a día en la carnicería. Gracias a su apoyo, pudimos detectar oportunidades de mejora y comprobar cómo la digitalización puede aportar valor a este tipo de negocios.

También queremos agradecer muy especialmente a la profesora Alejandra Segura por estar siempre presente durante la redacción del informe. Su guía, comentarios y sugerencias nos ayudaron muchísimo a mejorar la calidad del trabajo y a mantener el enfoque académico en cada parte del proceso.

De igual manera, agradecemos al profesor Luis Cabrera, quien nos acompañó como profesor guía. Su compromiso, experiencia y disposición para resolver nuestras dudas y entregarnos retroalimentación clara y oportuna fueron fundamentales para que este proyecto pudiera llegar a buen puerto. Sentimos su apoyo constante en cada etapa y eso hizo toda la diferencia.

A cada uno de ustedes, gracias de corazón por su tiempo, confianza y todo lo que aportaron a este trabajo. Sin ustedes, este proyecto no habría sido lo mismo.















Índice Tablas





















Índice de Ilustraciones

No se encuentran elementos de tabla de ilustraciones.



# Introducción



## Definiciones, siglas y abreviaciones del negocio

A continuación, se presentan las definiciones, siglas y abreviaciones que serán utilizadas en el desarrollo de la presente tesis, junto con una breve descripción de los conceptos relevantes al desarrollo de una aplicación web para la gestión integral de procesos en SILVOAGROPECUARIA GOVAL SpA.

Unidad de carne en estado bruto que corresponde al animal completo, generalmente canal o media canal, que llega a la carnicería para ser despostada en distintos cortes.

Corte de carne:
 Porción específica obtenida durante el proceso de desposte, como lomo vetado, posta negra, asiento, entre otros. Cada corte posee un valor comercial distinto y se vende por kilo.

Subproductos:
 Partes del animal distintas de los cortes principales, como chunchules, guatitas, corazón o huesos, que también se comercializan.

Mermas:
 Pérdidas de producto que pueden producirse por descomposición, vencimiento, errores de manipulación o deterioro físico, afectando directamente el inventario y la rentabilidad.

Carne blanca:
 Productos como pollo o cerdo que se comercializan por kilo y que, a diferencia de la carne en vara, no requieren desposte, ya que llegan envasados o fraccionados.

Productos no cárnicos:
 Mercancías complementarias ofrecidas en la carnicería, como bebidas, verduras congeladas, carbón, abarrotes u otros artículos de consumo diario.

Proveedor:
 Persona o empresa encargada de abastecer a la carnicería con carne en vara, subproductos, carnes blancas o productos no cárnicos. Generalmente entrega guías de despacho o facturas con detalle de productos.

Pedido:
 Solicitud de productos realizada por un cliente, que puede programarse para retiro en una fecha específica. En algunos casos, incluye cortes personalizados o encargos especiales.



1.1.2 Siglas y Abreviaciones
A continuación, se presentan las siglas y abreviaciones que serán utilizadas en el desarrollo de la presente tesis, junto con una breve descripción de cada una:

API (Application Programming Interface):
Conjunto de reglas y definiciones que permiten que una aplicación interactúe con otras aplicaciones, servicios o plataformas de manera estructurada.

CRUD (Create, Read, Update, Delete):
Operaciones básicas para gestionar datos en una base de datos, como crear, leer, actualizar y eliminar registros.

PDF (Portable Document Format):
Formato de archivo utilizado para presentar documentos de manera independiente del software, hardware o sistema operativo, comúnmente usado para informes y registros.

PERN (PostgreSQL, Express, React, Node.js):
Conjunto de tecnologías utilizadas para el desarrollo del sistema, compuesto por una base de datos relacional (PostgreSQL), un framework backend (Express), una biblioteca frontend (React) y un entorno de ejecución (Node.js).



## Presentación del contexto o área de su problemática.

### Presentación Empresa

SILVOAGROPECUARIA GOVAL SpA es una empresa chilena que nació en 2023 y se dedica principalmente a la venta de carne en vara. Además, ofrece una variada línea de productos alimenticios que incluye congelados, bebidas y abarrotes. Actualmente, la compañía opera a través de una sola sucursal ubicada en la ciudad de Los Ángeles, en la Región del Biobío.

Su modelo de negocio se centra en el procesamiento y comercialización de animales completos, los cuales son despostados por un equipo especializado para obtener diferentes cortes de carne. Estos cortes se destinan tanto a la venta directa como a pedidos específicos, lo que permite aprovechar cada parte del animal de forma eficiente y reducir el desperdicio de materia prima.

Más allá de los cortes tradicionales de vacuno, SILVOAGROPECUARIA GOVAL también trabaja con subproductos como chunchules, guatitas, corazones y cabezas, entre otros. Estos productos no solo diversifican su oferta, sino que también representan una fuente importante de ingresos.

Adicionalmente, la empresa comercializa productos de consumo cotidiano, como carnes blancas, mariscos, verduras congeladas, bebidas y abarrotes básicos, convirtiéndose en un punto de abastecimiento integral para sus clientes.

Desde sus inicios, la compañía se ha distinguido por su fuerte compromiso con la trazabilidad de sus productos, el cumplimiento de las normativas sanitarias y la mejora continua de sus procesos. Gracias a esto, ha logrado fidelizar a una base sólida de clientes que valoran la calidad, la atención personalizada y la transparencia en su forma de operar.



Procesos del ámbito

Para comprender la necesidad e impacto del proyecto, es esencial analizar los procesos actuales de gestión administrativa e inventario en SILVOAGROPECUARIA GOVAL SpA. A continuación, se describen las actividades y desafíos que justifican el desarrollo de la nueva aplicación web:

Gestión de inventarios: Actualmente, el inventario se gestiona de manera manual. Los registros de entrada y salida de productos se realizan en hojas sueltas o cuadernos, lo que dificulta la organización y aumenta el riesgo de errores humanos. Esto genera ineficiencias y pérdida de tiempo, afectando la disponibilidad de productos críticos.



Manejo de mermas: Las pérdidas de productos cárnicos por descomposición o mal manejo son registradas manualmente, sin un sistema que permita realizar análisis de las causas o frecuencia. Esto limita la capacidad de reducir pérdidas y optimizar los recursos.



Cumplimiento de normativas sanitarias: Los formularios y documentos requeridos por la normativa se completan manualmente y se almacenan en archivadores físicos. Este método dificulta el acceso rápido a la información en caso de inspecciones o auditorías, además de ser propenso a extravíos.



Registro de pedidos: Los pedidos de clientes se anotan manualmente en hojas sueltas, lo que incrementa el riesgo de errores en las entregas y dificulta llevar un historial detallado de los compromisos con los clientes.



Gestión de contactos y proveedores: La información de proveedores y clientes especiales se guarda en cuadernos, lo que no permite un manejo eficiente de las relaciones comerciales ni una revisión ágil de históricos de compras o deudas.



Cálculo de ganancias: Actualmente, no existe un sistema para calcular de manera automatizada las ganancias estimadas basadas en los cortes obtenidos y sus precios. Esto dificulta la toma de decisiones estratégicas para mejorar la rentabilidad.



En resumen, los procesos actuales de SILVOAGROPECUARIA GOVAL SpA presentan ineficiencias que justifican la implementación de un sistema digital integral, que optimice y centralice estas actividades clave.

### Descripción de problemas u Oportunidades de Mejora

SILVOAGROPECUARIA GOVAL SpA enfrenta diversos problemas críticos en sus operaciones diarias, que han dado origen a la necesidad de un sistema de gestión integral. Actualmente, la gestión del inventario se realiza de manera manual, lo que implica inspecciones visuales y registros en papel, un método tedioso, ineficiente y propenso a errores. Esto dificulta la disponibilidad de productos, incrementa el riesgo de desabastecimientos o sobreinventarios y afecta directamente la eficiencia operativa.

El manejo de mermas también presenta dificultades, ya que las pérdidas de productos cárnicos se anotan en hojas sueltas sin un sistema que permita analizar las causas, identificar patrones o tomar decisiones informadas para minimizar las pérdidas.

Adicionalmente, el cumplimiento de normativas sanitarias, como la trazabilidad de carne, el registro de temperaturas y la asistencia del personal, se gestiona de manera manual y se archiva físicamente. Este enfoque incrementa el riesgo de extravío de documentos y complica la respuesta a auditorías o inspecciones sanitarias.

La gestión de contactos, proveedores y clientes especiales también carece de centralización, ya que los registros se llevan en cuadernos, lo que dificulta consultar históricos, realizar seguimientos eficientes o mantener relaciones comerciales óptimas. Del mismo modo, los pedidos de clientes se registran en hojas sueltas, lo que incrementa el riesgo de errores y la falta de un historial organizado.

Por último, la empresa no cuenta con una herramienta que calcule las ganancias estimadas de manera precisa, considerando los cortes obtenidos y los precios de venta. Esto limita la capacidad de evaluar la rentabilidad y tomar decisiones estratégicas para mejorar los resultados del negocio.

Estos problemas representan una oportunidad significativa para mejorar la eficiencia, la precisión y la organización mediante la implementación de un sistema integral que automatice y centralice estas actividades clave.



## Propuesta de solución

El uso de tecnologías de la información presenta una oportunidad clave para transformar y mejorar los procesos operativos en SILVOAGROPECUARIA GOVAL SpA. La solución propuesta consiste en el desarrollo de una aplicación web diseñada para optimizar la gestión de inventarios, normativas y registros administrativos, adaptándose a las necesidades específicas de la empresa.

Con esta aplicación, se logrará mantener un sistema centralizado y actualizado en tiempo real, donde los movimientos de stock, como la entrada de carne en vara y subproductos, sean gestionados de manera automatizada. Esto eliminará la dependencia de métodos manuales, minimizando errores y mejorando la organización del inventario. Adicionalmente, se incorporará una funcionalidad que registre y analice las mermas, permitiendo tomar decisiones más informadas para reducir pérdidas.

La propuesta también aborda el cumplimiento normativo, automatizando la generación de documentos como trazabilidad de productos, registro de temperaturas y asistencia del personal, los cuales estarán disponibles en formatos digitales para facilitar el acceso y la consulta.

Por otro lado, se desarrollará un módulo para administrar información de proveedores y clientes especiales, permitiendo un mejor seguimiento de las relaciones comerciales y de los pagos pendientes. Asimismo, la aplicación incluirá una herramienta para gestionar pedidos de clientes, ayudando a mantener un control más eficiente sobre las solicitudes y su cumplimiento.

Esta solución está dirigida a los dueños y colaboradores de SILVOAGROPECUARIA GOVAL SpA, quienes podrán acceder a diferentes módulos según su rol. De esta manera, la aplicación no solo optimizará los procesos, sino que también permitirá tomar decisiones estratégicas basadas en datos confiables y organizados.

## Análisis de las principales soluciones disponibles en el área

Se investigaron diversas herramientas tecnológicas disponibles en el mercado que podrían abordar las problemáticas de gestión de inventarios y administración identificadas en SILVOAGROPECUARIA GOVAL SpA. Entre estas opciones, destacan Defontana, Contabilium y otros sistemas más generalizados disponibles en línea.

Defontana:
Defontana es un software ERP en la nube diseñado para gestionar integralmente las operaciones empresariales, incluyendo finanzas, inventarios y ventas. Se destaca por su modularidad y accesibilidad, permitiendo a las empresas pequeñas y medianas elegir las funcionalidades que necesitan. Sin embargo, su enfoque generalista presenta limitaciones para atender las necesidades específicas de SILVOAGROPECUARIA GOVAL SpA, como el manejo de carne en vara, la gestión detallada de mermas y la generación automatizada de documentos sanitarios.

Contabilium:
Contabilium es otra solución en la nube enfocada principalmente en la automatización de procesos administrativos y contables. Ofrece control de inventarios, integración con sistemas de ventas y reportes financieros. Aunque es una herramienta eficiente para empresas pequeñas y medianas, carece de funcionalidades específicas para el sector cárnico, como la gestión de despostada, subproductos y carne blanca, además de no incluir módulos para cumplir con normativas sanitarias.

Otras Soluciones en Línea:
Además de Defontana y Contabilium, se encontraron otras herramientas disponibles en plataformas como Google Play Store y App Store. Estas aplicaciones ofrecen funcionalidades básicas como el escaneo de códigos de barras, seguimiento de stock y generación de informes. Sin embargo, su alcance limitado y falta de personalización las hacen menos adecuadas para un negocio con procesos tan específicos como SILVOAGROPECUARIA GOVAL SpA.

Limitaciones de las Soluciones Existentes:
Aunque estas herramientas presentan ventajas en términos de accesibilidad y funcionalidad general, ninguna se enfoca completamente en las necesidades particulares de SILVOAGROPECUARIA GOVAL SpA. La mayoría carece de personalización para manejar procesos específicos como la despostada de animales, la gestión de mermas o la generación automatizada de documentos exigidos por normativas sanitarias chilenas. Además, algunas de estas soluciones pueden ser complejas de configurar y operar, requiriendo conocimientos técnicos avanzados o personal adicional.

En resumen, si bien existen herramientas disponibles, su enfoque generalizado y la falta de adaptabilidad a los procesos únicos del negocio resaltan la necesidad de desarrollar una solución a medida que satisfaga de manera eficiente las particularidades de SILVOAGROPECUARIA GOVAL SpA.

## Justificación del proyecto

Abordar los problemas identificados en SILVOAGROPECUARIA GOVAL SpA es fundamental para mejorar la eficiencia operativa, la precisión en la gestión de inventarios y el cumplimiento de normativas sanitarias. Actualmente, los procesos manuales relacionados con el manejo de inventario, el registro de mermas, la generación de documentos sanitarios y la gestión de contactos consumen tiempo, son propensos a errores y dificultan la organización. Estas ineficiencias no solo afectan el desempeño diario de la empresa, sino que también pueden generar pérdidas económicas y comprometer el cumplimiento regulatorio.

La implementación de una aplicación web permitirá automatizar y optimizar estas actividades, reduciendo significativamente los errores humanos y agilizando los procesos. La centralización de datos garantizará que la información esté siempre disponible, organizada y actualizada, lo que facilitará la toma de decisiones estratégicas basadas en datos precisos. Además, el tiempo liberado por los empleados gracias a la automatización de tareas administrativas podrá ser dedicado a actividades más estratégicas y relacionadas con la atención a clientes y proveedores.

La automatización del manejo de mermas y el registro de inventarios asegurará que los productos estén disponibles según la demanda y minimizará las pérdidas. Asimismo, la generación automatizada de documentos normativos en formato digital facilitará el cumplimiento de regulaciones sanitarias, reduciendo el riesgo de incumplimientos y mejorando la trazabilidad de los productos.

Frente a soluciones existentes como Defontana y Contabilium, la propuesta de desarrollar una aplicación personalizada para SILVOAGROPECUARIA GOVAL SpA presenta varias ventajas. En primer lugar, la solución estará diseñada específicamente para las necesidades de la empresa, asegurando que todas las funcionalidades requeridas sean incluidas y sean fácilmente utilizables por los empleados. Además, esta solución personalizada elimina los costos recurrentes de suscripciones a servicios comerciales y permite un control total sobre el hosting y el mantenimiento, optimizando los gastos a largo plazo.

La aplicación también será intuitiva y adaptada al nivel de experiencia de los usuarios, reduciendo la necesidad de capacitaciones extensas y garantizando una implementación ágil. Por último, la escalabilidad de la solución permitirá añadir nuevas funcionalidades en el futuro o adaptarla a cambios en el modelo de negocio sin las restricciones impuestas por las herramientas comerciales predefinidas.

En conclusión, este proyecto no solo resuelve las problemáticas actuales de SILVOAGROPECUARIA GOVAL SpA, sino que también sienta las bases para un crecimiento sostenido, mejorando la eficiencia, la organización y el cumplimiento normativo, lo que asegura beneficios significativos a corto y largo plazo.



## Composición del Informe

El presente documento contiene las especificaciones técnicas correspondientes al desarrollo del proyecto de titulación. Este informe detalla el diseño y desarrollo de la solución propuesta para abordar las problemáticas específicas de SILVOAGROPECUARIA GOVAL SpA.

El documento se organiza en los siguientes capítulos:

Capítulo 1: Introducción y Justificacion
Se presenta la problemática y el área de estudio. Incluye una descripción de SILVOAGROPECUARIA GOVAL SpA, su ubicación, historia y los desafíos actuales que enfrenta en la gestión de inventarios, mermas y normativas sanitarias.

Capítulo 2: Proyecto
Este capítulo explica la importancia de resolver los problemas identificados y los beneficios que se obtendrán al hacerlo. También se analizan las soluciones existentes en el mercado y se justifica por qué la propuesta del proyecto es la opción más adecuada para la empresa.

Capítulo 3: Propuesta de Solución
Se describe cómo las tecnologías de la información y la comunicación (TIC) pueden abordar o mejorar las problemáticas identificadas. Se detallan los usuarios principales, las funcionalidades clave del sistema, las tecnologías empleadas y los beneficios esperados.

Capítulo 4: Metodología
Este capítulo detalla la metodología empleada en el desarrollo del proyecto, incluyendo las etapas de análisis, diseño, implementación y pruebas. Además, se mencionan las técnicas de recolección de datos y las herramientas utilizadas.

Capítulo 5: Análisis de Requerimientos
Se especifican los requerimientos funcionales y no funcionales del sistema, describiendo las necesidades de los usuarios y las funcionalidades que debe cumplir la aplicación para satisfacer dichas necesidades.

Capítulo 6: Diseño del Sistema
Se presenta el diseño de la solución, incluyendo diagramas de arquitectura, diagramas de flujo, y modelos de datos. También se explican las decisiones de diseño tomadas para cumplir con los objetivos del proyecto.

Capítulo 7: Desarrollo e Implementación
En este capítulo se describe el proceso de desarrollo e implementación del sistema. Se detallan las tecnologías empleadas, el entorno de desarrollo, y las fases del proceso de programación y pruebas.

Capítulo 8: Pruebas y Validación
Se documentan las pruebas realizadas para garantizar el correcto funcionamiento del sistema, incluyendo los tipos de pruebas, casos de prueba y resultados obtenidos. También se incluye la validación realizada con los usuarios finales.

Capítulo 9: Conclusiones y Recomendaciones
El último capítulo presenta las conclusiones del proyecto, destacando los logros obtenidos y los beneficios para la empresa. Además, se proponen recomendaciones para futuras mejoras y posibles expansiones del sistema.

# Proyecto

## Objetivo general del proyecto

Mejorar los procesos operativos y administrativos de SILVOAGROPECUARIA GOVAL SpA, particularmente en áreas críticas como la gestión de inventarios, el control de mermas, la trazabilidad sanitaria y la organización de pedidos y productos, con el fin de aumentar la eficiencia, reducir errores y fortalecer la capacidad de gestión del negocio.

## Objetivos específicos del proyecto

Analizar los procesos críticos de la carnicería, tales como el control de inventario, la gestión de pedidos y el manejo de productos cárnicos y subproductos, con el fin de identificar ineficiencias y oportunidades de mejora.

Diseñar una solución tecnológica que se adapte a los flujos operativos reales de SILVOAGROPECUARIA GOVAL SpA, facilitando una interfaz intuitiva y accesible para el personal de la carnicería.

Optimizar el proceso de gestión de inventarios, incorporando un sistema digital que permita registrar entradas y salidas de productos en tiempo real, incluyendo cortes de carne, subproductos y carnes blancas.

Mejorar el control sobre las mermas, mediante la implementación de un módulo específico que registre pérdidas y entregue reportes claros que apoyen la toma de decisiones estratégicas.

Digitalizar procesos asociados al cumplimiento de normativas sanitarias, como el registro de temperaturas, controles de higiene, trazabilidad de la carne molida y asistencia del personal, asegurando organización y respaldo documental.

Validar el sistema mediante pruebas con el personal de la carnicería, considerando sus observaciones para ajustar funcionalidades y garantizar una implementación efectiva.

Capacitar a los trabajadores en el uso del nuevo sistema, promoviendo su integración en la rutina diaria de trabajo y asegurando una adopción exitosa de la herramienta tecnológica.



## Metodología de desarrollo

La siguiente tabla caracteriza el proyecto a desarrollar, en distintos aspectos:

Tabla 1:  Características del proyecto

Considerando los valores mostrados en la tabla, se determinó que la mejor metodología para este proyecto es un enfoque incremental y entregado por etapas. Esta metodología permite dividir el desarrollo en módulos, lo cual es adecuado debido a la modularidad del sistema y la experiencia limitada de los tesistas en tecnologías como bases de datos.

Además, la entrega por etapas facilita mantener un contacto constante con el dueño de SILVOAGROPECUARIA GOVAL SpA, quien puede validar cada funcionalidad desarrollada, asegurando que cumpla con los requerimientos específicos del negocio. Esto también permite realizar ajustes tempranos y reducir el riesgo de desviaciones significativas en el desarrollo del sistema.

## Descripción de las actividades para lograr los objetivos Específicos

- Objetivo específico: Identificar y documentar los requerimientos funcionales y no funcionales
1) Realizar reuniones con los dueños de SILVOAGROPECUARIA GOVAL SpA para analizar sus necesidades y los procesos actuales de la carnicería.
2) Elaborar un documento detallado que describa los requerimientos funcionales y no funcionales del sistema.
3) Validar la documentación con los dueños y realizar los ajustes necesarios según su retroalimentación.

- Objetivo específico: Diseñar un software 
1) Crear mockups preliminares para representar las principales funcionalidades del sistema.
2) Validar los mockups con los dueños y ajustar el diseño en base a sus comentarios, asegurando que sea fácil de usar y cumpla con sus expectativas.

- Objetivo específico: Desarrollar un módulo de gestión de inventarios y manejo de mermas
1) Programar las funcionalidades de registro de inventarios en tiempo real, incluyendo subproductos y carne blanca.
2) Desarrollar el módulo de manejo de mermas, permitiendo registrar pérdidas y generar reportes detallados.
3) Realizar pruebas unitarias e integrales para asegurar el correcto funcionamiento de estas funcionalidades.

- Objetivo específico: Automatizar la generación de documentos normativos
1) Implementar funcionalidades para la creación automática de documentos como trazabilidad de carne, registros de temperatura y asistencia del personal.
2) Generar documentos en formato PDF, garantizando su disponibilidad para auditorías y regulaciones sanitarias.

- Objetivo específico: Realizar la implementación del sistema
1) Ejecutar un periodo de prueba con el personal de la carnicería, permitiéndoles usar el sistema en un entorno controlado.
2) Recopilar retroalimentación del personal para identificar posibles problemas o áreas de mejora.
3) Realizar ajustes finales en el sistema en base al feedback recibido y garantizar su funcionamiento óptimo.

- Objetivo específico: Capacitar al personal en el uso del sistema
1) Diseñar una capacitación básica que cubra las principales funcionalidades del sistema.
2) Entrenar al personal de la carnicería, asegurando que puedan operar el software de manera eficiente en sus tareas diarias.

## Estándares de documentación

La documentación del proyecto se elaboró siguiendo los lineamientos de los estándares IEEE 830-1998 para especificación de requerimientos y IEEE 829-1998 para documentación de pruebas. Además, se consideraron los criterios de calidad definidos en la norma ISO/IEC 25000, especialmente en lo relacionado con atributos como usabilidad, eficiencia y seguridad, para asegurar una solución coherente con estándares internacionales de calidad del software.

## Técnicas y notaciones

Durante el desarrollo del proyecto se recurrió a distintas técnicas de modelado y planificación, con la intención de comprender a fondo los procesos actuales de la carnicería, diseñar cómo funcionaría el nuevo sistema y definir de manera ordenada las etapas del trabajo. Las herramientas y notaciones principales que se usaron fueron:



Diagrama de Gantt
 Sirvió para organizar y visualizar cómo se distribuirían en el tiempo las actividades del proyecto. Gracias a este diagrama, fue posible establecer las fases de desarrollo, estimar tiempos y asignar responsables a cada tarea. Se elaboró utilizando GanttProject, versión 3.3.3300.



Modelo Entidad-Relación (MER)
 Esta técnica permitió diseñar la estructura lógica de la base de datos, definiendo entidades clave como productos, varas, pedidos, mermas y clientes, además de las relaciones entre ellas. El modelo se creó con la herramienta web dbdiagram.io (versión 2025).



Diagramas BPMN (Business Process Model and Notation)
 Se usaron para representar de forma gráfica los procesos operativos actuales de SILVOAGROPECUARIA GOVAL SpA, como el registro de varas, la gestión de pedidos y el manejo de mermas. Estos diagramas facilitaron la comprensión de las tareas, los responsables y los puntos críticos dentro de cada flujo. Se realizaron con Bizagi Modeler, versión 4.1.



Diagramas de Casos de Uso (UML)
 Permitieron visualizar las funciones principales del sistema desde el punto de vista del usuario administrador. Ayudaron a identificar cómo interactuaría con el sistema y qué funcionalidades tendría a su alcance. Estos diagramas se desarrollaron en StarUML, versión 5.0.2.



El uso conjunto de estas herramientas ayudó a tener una visión clara de los procesos del negocio, planificar de manera estructurada el desarrollo del sistema y mostrar visualmente sus componentes clave.



## Herramientas, framework, lenguajes usados en el desarrollo del proyecto

Para el desarrollo del sistema se emplearán las siguientes herramientas, frameworks y lenguajes, seleccionados por su compatibilidad con el enfoque del proyecto y su capacidad para satisfacer los requerimientos técnicos:

Docker (27.3.1):
Herramienta utilizada para la creación y gestión de contenedores que facilitan la portabilidad y el despliegue del software en diferentes entornos.

Docker Compose (v2.30.3):
Utilizado para la configuración y ejecución de aplicaciones multicontenedor, permitiendo gestionar fácilmente los servicios del sistema.

Git (2.40.1):
Sistema de control de versiones utilizado para rastrear cambios en el código fuente, facilitar el trabajo en equipo y mantener un historial de desarrollo.

Node.js (20.10.0):
Entorno de ejecución para JavaScript que se utiliza para el desarrollo del backend del sistema, proporcionando una infraestructura eficiente y escalable.

NPM (10.2.3):
Gestor de paquetes para Node.js utilizado para la instalación y administración de dependencias en el proyecto.

PostgreSQL (15.3):
Sistema de gestión de bases de datos relacional utilizado para almacenar y gestionar la información del sistema, garantizando integridad y rendimiento.

React (18.3.1):
Biblioteca de JavaScript utilizada para el desarrollo del frontend, permitiendo crear interfaces de usuario dinámicas y reactivas.

Vite (5.4.10):
Herramienta de desarrollo utilizada para la construcción rápida de aplicaciones modernas, mejorando los tiempos de desarrollo gracias a su alta velocidad y compatibilidad con React.

# Factibilidad

## Factibilidad técnica

La factibilidad técnica del proyecto ha sido evaluada considerando la disponibilidad de personal capacitado, recursos de hardware y las herramientas necesarias para el desarrollo e implementación del sistema.

Existencia de Personas y Competencias Técnicas:
El equipo de desarrollo cuenta con experiencia básica en tecnologías modernas utilizadas para el desarrollo web. Aunque hay áreas de menor dominio, como el manejo avanzado de bases de datos, se dispone de los conocimientos necesarios en frameworks y herramientas clave como Docker, Node.js, PostgreSQL y React, lo que garantiza una implementación adecuada.

Disponibilidad de Hardware de Desarrollo:
Se dispone del hardware necesario para el desarrollo, incluyendo computadoras personales y servidores compatibles con las tecnologías seleccionadas. Estos recursos aseguran un entorno de desarrollo estable y óptimo para pruebas y despliegue.



Tabla 2 Especificación Software Requerido en el Desarrollo



Tabla 2: Especificación software requerido en desarrollo en el proyecto.





Tabla 3: Especificación Hw requerido en desarrollo el proyecto.



Tabla 4: Especificación hw servidor de desarrollo y explotación.

El hardware disponible cumple con los requisitos técnicos necesarios para el desarrollo y las pruebas del sistema, garantizando un entorno estable y eficiente para la programación, implementación y validación.









## Factibilidad operativa

La factibilidad operativa del proyecto para implementar una aplicación web en SILVOAGROPECUARIA GOVAL SpA es alta. Tanto los dueños como el personal reconocen la importancia del sistema y están motivados para adoptarlo. La infraestructura tecnológica existente es adecuada, y se han planificado actividades como un periodo de pruebas y capacitación para asegurar una transición fluida.

Con el soporte continuo del equipo de desarrollo y un diseño adaptado a las necesidades específicas de la empresa, se espera que el sistema optimice significativamente las operaciones diarias, reduciendo errores y mejorando la eficiencia.



## Factibilidad económica

A continuación, se presenta el análisis económico del proyecto, donde se evalúan los costos asociados a su desarrollo, infraestructura técnica y soporte, así como los beneficios proyectados. Para ello, se utilizan estimaciones realistas de mercado, considerando tanto recursos humanos como tecnológicos.





Tabla 5: Licencias.

Esta tabla muestra que todas las herramientas de desarrollo utilizadas en el proyecto cuentan con licencias gratuitas o de código abierto. Esto significa que no fue necesario incurrir en gastos por concepto de licenciamiento, lo que reduce considerablemente los costos de implementación





Tabla 6: Costo hosting y dominio, Este servicio tiene un costo anual obtenido de

Se presenta el valor anual estimado para el servicio de hosting y dominio del sistema, obtenido desde HostGator. El costo mensual del hosting es de $1.390 CLP, resultando en un gasto anual de $16.680 CLP. El dominio es gratuito dentro del plan seleccionado, lo que permite mantener los costos bajos durante el primer año de operación.

Tabla 7:Tabla de Valoración de Tiempo Ahorrado por la Aplicación (Tiempo Ahorrado por Módulo)

Basado en Ingreso Mínimo Mensual: $529.000

Cálculo de Valor Hora

Ingreso Mínimo Mensual: $529.000

Horas mensuales (180 horas): $529.000 ÷ 180 = $2.939 /hora

Valor Hora Administrador (2,2 del mínimo): $6.466 /hora



Tabla 8:Tabla de Valoración de Tiempo Ahorrado por la Aplicación (Resumen de Tiempo y Valor Económico Ahorrado)

Tabla 9:Tabla de Valoración de Tiempo Ahorrado por la Aplicación (Valorización por Escenarios Económicos)

Tabla 10:Tabla de Valoración de Tiempo Ahorrado por la Aplicación (Beneficios Adicionales Cuantificados)

Conclusión del Análisis Económico

Inversión Inicial (Ingenieros}: $5.200.000

Ahorro Anual Solo en Tiempo: $8.082.500

Beneficios Adicionales Anuales: $4.000.000



Tabla 11: Calculo costo de desarrollo y soporte. Obtenido de

En esta tabla se estima el costo del recurso humano necesario para desarrollar y mantener el sistema. Se consideró la participación de dos ingenieros Full-Stack durante los dos semestres de duración del proyecto, con un sueldo base de $1.000.000 CLP mensuales. Durante el primer semestre se trabajó en promedio 20 horas semanales, mientras que en el segundo semestre se incrementó a 25 horas semanales. El costo total estimado para el desarrollo es de $5.200.000 CLP.



Desglose por Semestres:

Semestre 1:

4 meses con 20 horas semanales (320 horas por ingeniero).

Total: $1.800.000 para ambos ingenieros ($900.000 cada uno).

Semestre 2:

6 meses con 25 horas semanales (600 horas por ingeniero).

Total: $3.400.000 para ambos ingenieros ($1.700.000 cada uno).



Total Proyecto: $5.200.000 CLP.





### Flujo de caja

Para asegurar la viabilidad económica del proyecto, se empleará el indicador del Valor Actual Neto (VAN) como medida. Para ello, se realizará el cálculo del flujo de caja correspondiente a la inversión inicial, así como se proyectarán los flujos de caja para los primeros 5 años. Estos datos se presentan en detalle en la siguiente tabla:

La evaluación se realizará con una tasa de descuento del 10 %, valor utilizado comúnmente en estudios de factibilidad para proyectos de software de mediana escala. Esta tasa representa el costo de oportunidad del capital y permite reflejar adecuadamente el valor temporal del dinero en un contexto de bajo riesgo.

Se ha estimado una mantención semestral de 15 horas, dado que el sistema no requiere actualizaciones periódicas. Considerando el sueldo promedio de un Ingeniero de Ejecución en Computación e Informática, el costo anual de mantención es de $170.455 CLP, valor que se incluye como gasto operativo en los flujos proyectados. Estos datos se presentan en detalle en la siguiente tabla.







Tabla 12: Flujo de caja del proyecto





Cálculo del V.A.N



Donde cada uno de los términos, se especifican en la Tabla:







Tabla 10: Términos de la fórmula de VAN

A continuación, se calculará el VAN con una tasa de descuento del 10%.





Tabla 13: Cálculo del VAN



VAN (10%) = Año 0 + Año 1 + Año 2 + Año 3 + Año 4 + Año 5

= -$5.200.000+$10.813.059+$9.830.054+$8.936.413 +$8.124.012+$7.385.465

VAN (10%) = $39.889.003

En este caso, el VAN obtenido es positivo ($39.889.003), lo que indica que el proyecto es viable desde una perspectiva económica.

Conclusión de la factibilidad

Gracias al análisis realizado en los puntos anteriores, se puede concluir que el proyecto es económicamente viable, ya que el valor generado por el desarrollo del sistema y los beneficios proyectados en términos de eficiencia operativa y ahorro superan los costos asociados a su implementación y mantención.

El proyecto es claramente rentable.
 Se recupera la inversión en menos de un año.
 La rentabilidad acumulada en 5 años es muy significativa.

Además, esta evaluación no contempla beneficios cualitativos relevantes para el rubro, como la organización y trazabilidad del inventario de productos cárnicos, la optimización del tiempo del personal en tareas administrativas, y la reducción de errores humanos en el control de stock y generación de reportes. Estos factores fortalecen aún más la justificación de la inversión.

# Opcional

Capítulos para detallar temas importantes, explicar un modelo que será utilizado.

# Definición de la solución Software

## Objetivo General del Software propuesto.

El software, a través de sus funcionalidades relacionadas con la gestión integral de inventarios, control de mermas y generación de documentos normativos, permite a SILVOAGROPECUARIA GOVAL SpA optimizar sus operaciones diarias, reduciendo la dependencia de procesos manuales y permitiendo un enfoque más estratégico en la gestión del negocio.

## Objetivos Específicos del Software propuesto.

Reducir errores y tiempos en la gestión de inventario, permitiendo llevar un control en tiempo real de la entrada y salida de carne en vara, subproductos y productos complementarios. Esto ayuda a mantener los procesos diarios más ordenados y a minimizar pérdidas causadas por la desorganización.

Disminuir los costos por mermas, incorporando un módulo que registre las pérdidas, analice sus causas y genere reportes útiles para tomar decisiones correctivas a tiempo. Con ello, se busca mejorar la rentabilidad del negocio.

Ahorrar tiempo en el cumplimiento de normativas sanitarias, automatizando la elaboración de documentos como formularios de trazabilidad, registros de temperatura y controles de higiene. Estos archivos estarán disponibles en formato digital, facilitando auditorías y revisiones.

Optimizar la relación con proveedores y clientes especiales, mediante un sistema que organice su información, permita dar seguimiento a pagos, deudas e historial de compras. Esto se traduce en un mejor manejo del flujo de caja y puede fortalecer la fidelización.

Agilizar la atención de pedidos, a través de un módulo que registre solicitudes, asigne responsables y minimice errores en las entregas. Así, se mejora la experiencia del cliente y se incrementa la posibilidad de ventas repetidas.











## Límites

El sistema solo podrá ser utilizado por el administrador de la carnicería. No se contempla el acceso de otros roles como clientes, proveedores o trabajadores operativos.

El sistema no permitirá realizar pedidos automáticos a proveedores cuando el stock esté bajo. Solo se notificará al administrador mediante alertas.

No se podrá realizar ningún tipo de transacción financiera desde el sistema, como pagos en línea o integración con bancos.

El sistema no permitirá la modificación directa de los registros históricos (como listas de precios o reportes de mermas); estos quedarán registrados para auditoría interna.

No se permite la integración automática con sistemas de facturación electrónica, contabilidad o plataformas externas como SII.

El sistema está orientado a la gestión interna; no se considera acceso externo público o funciones de comercio electrónico.



## Restricciones técnicas

La empresa cuenta con una infraestructura básica para operar el sistema, incluyendo un equipo de escritorio adquirido específicamente como parte del proyecto. Este computador permanecerá instalado en SILVOAGROPECUARIA GOVAL SpA para el uso exclusivo del sistema, tal como se contempla en la evaluación económica.

La empresa cuenta con:

El sistema requiere el uso de un computador de escritorio o portátil con conexión a Internet y navegador web moderno (como Google Chrome o Firefox).

El sistema no está optimizado para dispositivos móviles ni incluye aplicación móvil.

La aplicación funciona en entorno web local o de hosting básico, sin uso de servicios en la nube como AWS, Firebase o similares.

No se contempla la integración con periféricos como balanzas, lectores de códigos de barra o impresoras térmicas, salvo que se configure manualmente.

No se cuenta con respaldo automático de la base de datos. Los respaldos deben realizarse manualmente por el administrador.

El sistema fue desarrollado para ser utilizado exclusivamente dentro de la infraestructura tecnológica disponible en SILVOAGROPECUARIA GOVAL SpA, sin dependencias externas.





## Roles de Usuario

Rol de Usuario

El sistema ha sido diseñado considerando un único rol de usuario: el Administrador de la Carnicería, quien es el responsable directo de gestionar las operaciones diarias del negocio. Este enfoque responde a la estructura organizacional de SILVOAGROPECUARIA GOVAL SpA, donde todas las funciones administrativas y de control están centralizadas en una sola persona: el dueño o alguien de su total confianza.

Este usuario es el encargado de realizar todas las tareas relacionadas con el inventario, los pedidos, los precios, los reportes y el cumplimiento de normativas sanitarias. La interfaz del sistema está diseñada específicamente para facilitar su uso por parte de este perfil, con acceso completo a todas las funcionalidades.

Funciones del Administrador:

Gestionar el inventario
 Registrar nuevos productos, cortes de carne, subproductos y productos no cárnicos. Actualizar cantidades y precios, y supervisar el stock disponible.

Monitorear alertas
 Visualizar notificaciones automáticas sobre productos con stock bajo o próximos a vencer, para tomar decisiones de reposición o descarte.

Controlar precios y rentabilidad
 Establecer y actualizar precios de venta, mantener un historial de cambios y utilizar herramientas de estimación de ganancias según cortes y mermas.

Registrar deudas de clientes especiales
 Llevar el control de pagos pendientes, fechas límite y contacto de clientes con crédito, asegurando seguimiento financiero.

Administrar pedidos
 Registrar solicitudes de clientes, asignar carniceros responsables y hacer seguimiento de las entregas.

Generar reportes
 Emitir informes en formato PDF sobre inventarios, mermas, trazabilidad, higiene y otros aspectos normativos.

Supervisar el uso del sistema
 Asegurar que los datos se ingresen correctamente, revisar la información generada y mantener actualizada la operación digital del negocio.



## Requerimientos Funcionales del Sw

Tabla : Requerimientos Funcionales



## Requerimientos No Funcionales del Sw

La presente sección hablará de los requerimientos no funcionales de la aplicación desarrollada. Todos los requerimientos no funcionales se relacionarán con uno o más atributos. Si un atributo aplica a un requerimiento no funcional, eso quiere decir que el requerimiento contribuye a la calidad del software desarrollado a través de ese atributo. Todos los atributos listados están basados en la norma ISO 25010





## Interfaces externas de entrada

Se detallan todas las entradas del sistema, es decir, los conjuntos de datos que ingresan al sistema.

## Interfaces externas de Salida

Se especifica cada salida del sistema, conjuntos de datos que se sacan del sistema para los usuarios u otros sistemas, indicando en cada caso el formato o medio de salida.

Tabla : interfaces de Salida

# Análisis y Diseño

## Descripción del Sistema de Gestión de Inventario de Carnicería



LOGO:

El sistema de gestión de inventario para la carnicería tiene como objetivo principal optimizar el registro y control de los productos cárnicos, subproductos y productos no cárnicos. Este sistema está diseñado para ser utilizado por administradores encargados de la gestión diaria de los productos en el negocio. A través de la interfaz de usuario, los administradores pueden registrar la llegada de productos, realizar el seguimiento de inventarios, gestionar las deudas de los clientes, calcular ganancias, y generar reportes.



Cada producto (ya sea carne, subproducto o no cárnico) se almacena en el sistema con información detallada como nombre, tipo, cantidad, precio de compra y venta, fechas de caducidad, y más. El sistema permite la clasificación de productos en diferentes categorías y proporciona herramientas de búsqueda y filtrado para facilitar la gestión.



Los administradores tienen la capacidad de crear y gestionar listas de precios predefinidas para distintos tipos de animales y productos, y estos precios se actualizan automáticamente cuando se registran nuevas llegadas. Además, el sistema permite registrar las mermas de los productos y calcular las ganancias estimadas, teniendo en cuenta tanto las ventas como las pérdidas por deterioro o vencimiento.











## Modelo de datos

El modelo de datos que utiliza la base del sistema de gestión para la carnicería está compuesto por varias tablas que se encuentran interconectadas. Cada una de ellas guarda información clave para que todo el sistema funcione de manera ordenada y eficiente. A continuación, se describe brevemente qué contiene cada tabla y cómo se relacionan entre sí:

• users: Aquí se guarda la información de quienes usan el sistema, como nombre completo, RUT, correo, contraseña cifrada y el rol que tienen (administrador o usuario). Esta tabla se encarga de manejar el acceso y los permisos dentro del sistema.

• clientes: Registra los datos de los clientes, ya sean personas naturales (nombre y apellidos) o empresas (razón social y giro). También incluye su información de contacto: RUT, dirección, comuna, ciudad, región, teléfono y correo. Se vincula directamente con la tabla de pagos pendientes.

• proveedores: Contiene los datos de quienes suministran productos, incluyendo su RUT, nombre, dirección, detalles bancarios (como banco, tipo y número de cuenta), además del nombre del encargado y medios de contacto.

• productos: Aquí se registran los productos que se venden, con información como nombre, variante, precio y tipo de medida (kilos o unidades). Esta tabla se conecta con las de tipos de producto, marcas y recepciones de stock.

• tipos_producto y marcas_producto: Estas dos tablas ayudan a clasificar los productos por tipo y marca, lo cual facilita su organización y búsqueda dentro del sistema.

• recepciones_stock: Lleva el control de las entradas de mercadería, anotando la cantidad recibida, el costo por unidad, la fecha de recepción y la fecha de vencimiento. Se relaciona con la tabla de productos para el manejo del inventario.

• animal_vara: Guarda los datos de los animales que llegan en vara, como la fecha en que llegaron, la temperatura al momento de llegada y el precio total. Esta tabla se conecta con la de cortes de carne.

• animal_corte: Aquí se listan los distintos cortes de carne, indicando el tipo de corte, su precio y cantidad. También sirve para definir los tipos de animales que se manejan.

• subproductos: Registra lo que se obtiene del proceso de faenado, incluyendo las fechas de faena y entrega, el número de animales procesados y las cantidades (y precios) de subproductos como hígado, guata, corazón, riñón, patas y charcha.

• mermas: Aquí se anotan las pérdidas de producto, detallando qué tipo fue (carne, subproducto, etc.), cuánto se perdió, por qué razón y otros datos relevantes. Esta tabla se conecta con varias otras como productos, subproductos, animal_vara, animal_corte y personal.

• personal: Guarda la información del equipo de trabajo de la carnicería: nombres, apellidos, RUT, área donde trabajan, teléfono y correo. Esta tabla se relaciona con los registros de higiene, trazabilidad y mermas.

• controles_higiene: Registra las revisiones diarias de higiene del personal, verificando aspectos como el uso de cofia, mascarilla, limpieza de manos, uñas cortas, rasurado, uniforme y ausencia de accesorios. También se anotan observaciones y acciones correctivas si hacen falta.

• documentos_trazabilidad y registros_trazabilidad: Estas tablas se encargan de llevar el control sobre la trazabilidad de la carne molida, incluyendo fechas, horarios, cantidades, tipos de corte usados y el responsable del proceso.

• documentos_temperatura y registros_temperatura: Aquí se controlan las temperaturas de los equipos, registrando fecha, hora, nombre del equipo, lectura de temperatura, su estado de funcionamiento, causas de fallos y medidas correctivas.

• pagos_pendientes: Administra las deudas de los clientes, con información sobre el monto, fechas de pedido y límite, estado del pago (pendiente, pagado o vencido) y número de factura. Esta tabla se relaciona con la de clientes.







## Casos de uso

### Actores

Los actores que interactúan con el sistema se detallan en la Tabla .

Tabla : Especificación de actores del sistema



En el caso de que existen generalizaciones de actores incluya los diagramas correspondientes.

### Diagrama de casos de uso

Incluya más de 1 diagrama para que quede claro el modelo.

Diagrama(s) de CU



















Ilustración 1: Diagrama de Casos de Uso publicaciones – ejemplo tesis Tomás Montecinos IECI



### Especificación de los Casos de Uso

Liste los CU que están en su (s) diagramas destacando cuales serán detallados.

Considerando funcionalidad RELEVANTE del negocio especifique con la tabla sólo los CU relacionados. Para los CU restantes sólo incluya una descripción y precondiciones.

Tabla : Especificación CU_01

Tabla : Especificación CU_02 crear publicación (mejorada desde Tesis Tomas Montecinos IECI)

Tabla 18 CU_03







Tabla 19 CU_04





















## Diseño interfaz y navegación

### Guías de estilos

La guía de estilo para la interfaz del administrador de la aplicación será esencial para garantizar que la gestión de la carnicería sea lo más sencilla y eficiente posible. El diseño se centrará en la simplicidad, la claridad y la facilidad de uso, con el fin de facilitar al administrador la tarea de gestionar productos, pedidos y clientes sin complicaciones. Dado que solo hay un administrador, la interfaz debe ser lo suficientemente intuitiva para que no requiera entrenamiento previo y permita realizar las acciones de manera rápida y directa.

El objetivo principal será ofrecer una experiencia visual que sea directa, accesible y eficiente, de modo que el administrador pueda navegar por la aplicación con facilidad. En esta sección, se detallarán los siguientes aspectos del diseño de la interfaz administrativa: logotipo, colores, tipografía y disposición de las interfaces.









Logotipo

El logotipo de la aplicación representa la empresa de la carnicería de manera simple pero poderosa. El diseño está basado en un Goval (forma ovalada) que simboliza la tradición, la naturaleza y la estabilidad del negocio. En el centro del Goval, se coloca la figura de un toro, que representa tanto la ganadería como la fuente principal de los productos que ofrece la carnicería.



Diseño del Logotipo

El logotipo estará compuesto por una forma goval en la que se encierra la figura de un toro, creado de forma estilizada pero clara. El toro será el elemento central, destacándose por su fortaleza y simbolismo, mientras que el Goval que lo rodea aporta una sensación de unión y equilibrio.



Goval (Forma Ovalada): La figura ovalada simboliza la armonía y continuidad del negocio familiar de la carnicería. Este goval puede ser sólido o con un borde suave, representando la naturaleza inclusiva y accesible de la empresa.



Toro Central: El toro es el elemento que da identidad y carácter al logotipo. Estilizado de manera que evoque la fuerza y la autenticidad de la ganadería, su presencia en el centro del goval transmite la idea de que la carnicería está directamente conectada con el origen de sus productos: carne fresca de calidad proveniente de la ganadería















Figura 1



### Guía de colores

La aplicación utiliza una paleta de colores sobria y profesional, basada principalmente en tonos oscuros con acentos en rojo, que reflejan la identidad de marca y se adaptan bien al entorno industrial de una carnicería. Esta selección está pensada para ofrecer una experiencia visual clara, funcional y coherente.

Colores Principales

Estos son los colores que predominan en las interfaces del sistema:

Negro Corporativo (#000000): Se usa como color base para menús de 		navegación y botones principales.

Gris Carbón (#2b2727): Ideal para encabezados de tablas y elementos que requieren énfasis visual sin perder sobriedad.

Rojo Goval (#e8272b): El color distintivo de la marca, utilizado en detalles clave e interacciones destacadas.

Rojo Oscuro (#e74c3c): Variante del rojo para estados hover y botones de acción.

Blanco (#ffffff): Presente en fondos y textos sobre colores oscuros para mejorar la legibilidad.

Grises Claros (#f4f6f8, #f8f8f8, #f8f9fa): Usados en fondos de contenedores, secciones y formularios para mantener claridad y limpieza visual.





Uso de Colores en la Interfaz

Los tonos oscuros como el Negro Corporativo y el Gris Carbón aportan una sensación de robustez y profesionalismo. Por su parte, el Rojo Goval y su variante más oscura se usan como colores de acento, llamando la atención en acciones importantes, botones y notificaciones clave. Los colores claros equilibran el diseño, brindando espacios limpios que facilitan la lectura y navegación.

Colores Funcionales

Además de la paleta base, se emplean colores funcionales asociados con acciones específicas:

Rojo de Eliminación (#d32f2f, #dc3545): Para botones y mensajes 		relacionados con acciones críticas como “Eliminar” o “Cancelar”.



Verde de Éxito (#2ecc71, #28a745): Para confirmar operaciones exitosas o 	mostrar estados positivos.





Amarillo de Advertencia (#f39c12, #ffc107): Para alertas preventivas y 		estados que requieren atención.



Azul de Información (#3498db, #17a2b8): Para enlaces secundarios y 		mensajes informativos.





Paleta para Estados y Notificaciones

La aplicación también emplea versiones traslúcidas de estos colores para mensajes contextuales:

Verde Éxito (rgba(46, 204, 113, 0.1)): Para confirmar acciones completadas.

Rojo Peligro (rgba(231, 76, 60, 0.1)): Para errores o advertencias importantes.

Amarillo Advertencia (rgba(243, 156, 18, 0.1)): Para alertas preventivas.

Azul Información (rgba(52, 152, 219, 0.1)): Para brindar detalles adicionales sin distraer.







Consideraciones de Diseño

La elección de esta paleta responde a varios objetivos clave:

Profesionalismo: Los tonos oscuros comunican seriedad y confiabilidad.

Legibilidad: El alto contraste asegura que los textos sean fáciles de leer en cualquier condición.

Consistencia: El uso constante del rojo Goval fortalece la identidad visual de la marca.

Funcionalidad: Cada color tiene un propósito claro, lo que facilita el aprendizaje y uso del sistema.

Accesibilidad: Las combinaciones están pensadas para cumplir con estándares de accesibilidad web.

En conjunto, esta paleta construye una imagen visual sólida, moderna y eficaz, alineada con el propósito de la aplicación: facilitar la gestión diaria en un entorno profesional como lo es una carnicería.



Figura 3

Tipografía

La tipografía utilizada es una combinación de fuentes modernas y legibles que garantizan claridad en el entorno profesional de gestión. Se ha optado por emplear fuentes gratuitas de alta calidad disponibles a través de Google Fonts.

Fuentes Principales

Montserrat es la fuente principal del sistema, utilizada en títulos, contenido general, navegación y botones. Esta tipografía sans-serif geométrica fue elegida por su excelente legibilidad en pantallas digitales y apariencia profesional.



Poppins se emplea como fuente complementaria en modales, formularios, notificaciones y elementos interactivos, aportando una sensación más amigable para la interacción del usuario.





La jerarquía tipográfica incluye:

Títulos principales: Montserrat, 2.2-2.8rem, peso 700-800

Contenido general: Montserrat, 1-1.1rem, peso 400-500

Elementos interactivos: Poppins en varios pesos

Números destacados: Arial Black para estadísticas importantes









Figura 4

### Composición de las interfaces



Figura 5

# Desarrollo del Trabajo

## Diseño de arquitectura

Especificar la decisión relacionada respecto a servidores de datos y aplicación (web)

Servidores propios,

Hosting,

Cloud, otros o mezcla de ellos.

Incluya un esquema que represente la integración de estos elementos, desde el punto de vista físico y lógico. Este diagrama debe ser explicado. Por ejemplo:

Tal como se representa en la ¡Error! No se encuentra el origen de la referencia. la arq. que da soporte al  sw “mi software” se divide en 2 servidores físicos, ATLANTA y MARCUS.

EL primero aloja el server web sobre un SO apache xxx, para el sw mio.midominio.cl , puerto ssh 999 u puerto apache 999. El segundo  servidor físico aloja 2 componentes lógicos, servidor de archivos user/carpeta/ y de base de datos con Mysql 192.168.l.0 (ejemplo). Los usuarios locales acceden a través de los sistemas distribuidos por red local y al sistema web vía internet…. etc.

El escenario es distinto si se trabaja con contenedores, si se utilizan servicios web, API, o la nube amazon ws, azure, etc



Figura 6: esquema arquitectura de sistemas para software





## Estructura del código

Si se utiliza framework o se programa en lenguaje web puro indicar la forma como se organizan físicamente los archivos y si estos respetan alguna arquitectura de programación como modelo vista controlador, o 3 capas, etc. Incluya una imagen del árbol de directorio.

### Backend

Tabla : Estructura de código – Backend ejemplo Tesis Tomas Montecinos IECI



Funcionalidad- Endpoints a utilizar:

1) Endpoints de Autenticación

) Registro de Usuarios

) URL:

() http://localhost:3000/api/auth/register

) Tipo de Petición:

() POST

) Parámetros:

() nombreCompleto

() Tipo: String

() Requerido: Sí

() Restricciones: Tamaño mínimo de 3 caracteres, tamaño 	máximo de 255 caracteres.

() rut

() Tipo: String

() Requerido: Sí

() Restricciones: Debe ser un RUT válido chileno, formato 	XX.XXX.XXX-X.

() email

() Tipo: String

() Requerido: Sí

() Restricciones: Tamaño mínimo de 5 caracteres, tamaño 	máximo de 255 caracteres, debe ser un email 			válido.

() password

() Tipo: String

() Requerido: Sí

() Restricciones: Tamaño mínimo de 6 caracteres.

() rol

() Tipo: String

() Requerido: Sí

() Restricciones: Debe ser "administrador" o "usuario".

) Inicio de Sesión

) URL:

() http://localhost:3000/api/auth/login

) Tipo de Petición:

() POST

) Parámetros:

() email

() Tipo: String

() Requerido: Sí

() Restricciones: Debe ser un email válido registrado.

() password

() Tipo: String

() Requerido: Sí

() Restricciones: Tamaño mínimo de 6 caracteres.



2) Endpoints de Administración de Productos

) Listar Productos

) URL:

() http://localhost:3000/api/productos

) Tipo de Petición:

() GET

) Parámetros: Ninguno

) Crear Producto

) URL:

() http://localhost:3000/api/productos

) Tipo de Petición:

() POST

) Parámetros:

() nombre

() Tipo: String

() Requerido: Sí

() Restricciones: Tamaño mínimo de 1 carácter, tamaño máximo de 100 caracteres.

() variante

() Tipo: String

() Requerido: No

() Restricciones: Tamaño máximo de 100 caracteres.

() precioVenta

() Tipo: Integer

() Requerido: Sí

() Restricciones: Debe ser un número entero positivo 	mayor a 0.

() tipoMedida

() Tipo: String

() Requerido: Sí

() Restricciones: Debe ser "kilos" o "unidades".

() tipoId

() Tipo: Integer

() Requerido: Sí

() Restricciones: Debe ser un identificador válido de tipo de producto.

() marcaId

() Tipo: Integer

() Requerido: Sí

() Restricciones: Debe ser un identificador válido de marca.

) Ver Producto

) URL:

() http://localhost:3000/api/productos/:id

) Tipo de Petición:

() GET

) Parámetros:

() id

() Tipo: Integer

() Requerido: Sí

() Restricciones: Debe ser un identificador válido de producto.

) Editar Producto

) URL:

() http://localhost:3000/api/productos/:id/editar

) Tipo de Petición:

() GET

) Parámetros:

() id

() Tipo: Integer

() Requerido: Sí

() Restricciones: Debe ser un identificador válido de 	p	roducto.

) Actualizar Producto

) URL:

() http://localhost:3000/api/productos/:id

) Tipo de Petición:

() PATCH

) Parámetros:

() id

() Tipo: Integer

() Requerido: Sí

() Restricciones: Debe ser un identificador válido de producto.

() nombre

() Tipo: String

() Requerido: No

() Restricciones: Tamaño mínimo de 1 carácter, tamaño máximo de 100 caracteres.

() variante

() Tipo: String

() Requerido: No

() Restricciones: Tamaño máximo de 100 caracteres.

() precioVenta

() Tipo: Integer

() Requerido: No

() Restricciones: Debe ser un número entero positivo mayor a 0.

() tipoMedida

() Tipo: String

() Requerido: No

() Restricciones: Debe ser "kilos" o "unidades".

) Eliminar Producto

) URL:

() http://localhost:3000/api/productos/:id

) Tipo de Petición:

() DELETE

) Parámetros:

() id

() Tipo: Integer

() Requerido: Sí

() Restricciones: Debe ser un identificador válido de producto.





3) Endpoints de Administración de Clientes

) Listar Clientes

) URL:

() http://localhost:3000/api/clientes

) Tipo de Petición:

() GET

) Parámetros: Ninguno

) Crear Cliente

) URL:

() http://localhost:3000/api/clientes

) Tipo de Petición:

() POST

) Parámetros:

() tipo Cliente

() Tipo: String

() Requerido: Sí

() Restricciones: Debe ser "Empresa" o "Persona".

() rut

() Tipo: String

() Requerido: Sí

() Restricciones: Debe ser un RUT válido chileno, formato XX.XXX.XXX-X.

() direccion

() Tipo: String

() Requerido: Sí

() Restricciones: Tamaño máximo de 100 caracteres.

() comuna

() Tipo: String

() Requerido: Sí

() Restricciones: Tamaño máximo de 50 caracteres.

() ciudad

() Tipo: String

() Requerido: Sí

() Restricciones: Tamaño máximo de 50 caracteres.

() razonSocial

() Tipo: String

() Requerido: No

() Restricciones: Tamaño máximo de 100 caracteres, requerido si tipoCliente es "Empresa".

() giro

() Tipo: String

() Requerido: No

() Restricciones: Tamaño máximo de 100 caracteres, requerido si tipoCliente es "Empresa".

() nombres

() Tipo: String

() Requerido: No

() Restricciones: Tamaño máximo de 50 caracteres, requerido si tipoCliente es "Persona".

() apellidos

() Tipo: String

() Requerido: No

() Restricciones: Tamaño máximo de 50 caracteres, requerido si tipoCliente es "Persona".

() email

() Tipo: String

() Requerido: No

() Restricciones: Debe ser un email válido, tamaño máximo de 100 caracteres.

() telefono

() Tipo: String

() Requerido: No

() Restricciones: Formato de teléfono válido, tamaño máximo de 20 caracteres.

) Ver Cliente

) URL:

() http://localhost:3000/api/clientes/:id

) Tipo de Petición:

() GET

) Parámetros:

() id

() Tipo: Integer

() Requerido: Sí

() Restricciones: Debe ser un identificador válido de cliente.

) Actualizar Cliente

) URL:

() http://localhost:3000/api/clientes/:id

) Tipo de Petición:

() PATCH

) Parámetros:

() id

() Tipo: Integer

() Requerido: Sí

() Restricciones: Debe ser un identificador válido de cliente.

) Eliminar Cliente

) URL:

() http://localhost:3000/api/clientes/:id

) Tipo de Petición:

() DELETE

) Parámetros:

() id

() Tipo: Integer

() Requerido: Sí

() Restricciones: Debe ser un identificador válido de cliente.

4) Endpoints de Gestión de Inventario

) Registrar Recepción de Stock

) URL:

() http://localhost:3000/api/inventario/recepciones

) Tipo de Petición:

() POST

) Parámetros:

() cantidad

() Tipo: Number

() Requerido: Sí

() Restricciones: Debe ser un número positivo mayor a 0.

() costoUnitario

() Tipo: Decimal

() Requerido: Sí

() Restricciones: Debe ser un número decimal positivo.

() fecha

() Tipo: Date

() Requerido: Sí

() Restricciones: Debe ser una fecha válida.

() fechaVencimiento

() Tipo: Date

() Requerido: No

() Restricciones: Debe ser posterior a la fecha de recepción.

() productoId

() Tipo: Integer

() Requerido: Sí

() Restricciones: Debe ser un identificador válido de producto.

) Consultar Stock

) URL:

() http://localhost:3000/api/inventario/stock

) Tipo de Petición:

() GET

) Parámetros: Ninguno

) Registrar Merma

) URL:

() http://localhost:3000/api/inventario/mermas

) Tipo de Petición:

() POST

) Parámetros:

() tipoProductoMerma

() Tipo: String

() Requerido: Sí

() Restricciones: Debe ser "carne", "producto" o "subproducto".

() cantidadPerdida

() Tipo: Number

() Requerido: Sí

() Restricciones: Debe ser un número positivo.

() causa

() Tipo: String

() Requerido: Sí

() Restricciones: Tamaño máximo de 255 caracteres.

() detalles

() Tipo: String

() Requerido: No

() Restricciones: Información adicional sobre la merma.

() personalId

() Tipo: Integer

() Requerido: Sí

() Restricciones: Debe ser un identificador válido de personal.

5) Endpoints de Gestión de Proveedores

) Listar Proveedores

) URL:

() http://localhost:3000/api/proveedores

) Tipo de Petición:

() GET

) Parámetros: Ninguno

) Crear Proveedor

) URL:

() http://localhost:3000/api/proveedores

) Tipo de Petición:

() POST

) Parámetros:

() rut

() Tipo: String

() Requerido: Sí

() Restricciones: Debe ser un RUT válido chileno, formato XX.XXX.XXX-X.

() nombre

() Tipo: String

() Requerido: Sí

() Restricciones: Tamaño mínimo de 3 caracteres, tamaño máximo de 255 caracteres.

() direccion

() Tipo: String

() Requerido: Sí

() Restricciones: Tamaño máximo de 255 caracteres.

() banco

() Tipo: String

() Requerido: Sí

() Restricciones: Tamaño máximo de 255 caracteres.

() numeroCuenta

() Tipo: String

() Requerido: Sí

() Restricciones: Tamaño máximo de 50 caracteres, solo números.

() tipoCuenta

() Tipo: String

() Requerido: Sí

() Restricciones: Debe ser "Corriente" o "Ahorro".

() nombreEncargado

() Tipo: String

() Requerido: Sí

() Restricciones: Tamaño máximo de 255 caracteres.

() telefonoEncargado

() Tipo: Array

() Requerido: Sí

() Restricciones: Array de números de teléfono válidos.

() movilEncargado

() Tipo: Array

() Requerido: Sí

() Restricciones: Array de números móviles válidos.

) Ver Proveedor

) URL:

() http://localhost:3000/api/proveedores/:id

) Tipo de Petición:

() GET

) Parámetros:

() id

() Tipo: Integer

() Requerido: Sí

() Restricciones: Debe ser un identificador válido de proveedor.

) Actualizar Proveedor

) URL:

() http://localhost:3000/api/proveedores/:id

) Tipo de Petición:

() PATCH

) Parámetros:

() id

() Tipo: Integer

() Requerido: Sí

() Restricciones: Debe ser un identificador válido de proveedor.

) Eliminar Proveedor

) URL:

() http://localhost:3000/api/proveedores/:id

) Tipo de Petición:

() DELETE

) Parámetros:

() id

() Tipo: Integer

() Requerido: Sí

() Restricciones: Debe ser un identificador válido de proveedor.

6) Endpoints de Control de Calidad

) Registrar Control de Higiene

) URL:

() http://localhost:3000/api/calidad/higiene

) Tipo de Petición:

() POST

) Parámetros:

() fecha

() Tipo: Date

() Requerido: Sí

() Restricciones: Debe ser una fecha válida.

() personalId

() Tipo: Integer

() Requerido: Sí

() Restricciones: Debe ser un identificador válido de personal.

() usoCofia

() Tipo: Boolean

() Requerido: Sí

() Restricciones: true o false.

() usoMascarilla

() Tipo: Boolean

() Requerido: Sí

() Restricciones: true o false.

() higieneManos

() Tipo: Boolean

() Requerido: Sí

() Restricciones: true o false.

() unasCortas

() Tipo: Boolean

() Requerido: Sí

() Restricciones: true o false.

() afeitado

() Tipo: Boolean

() Requerido: Sí

() Restricciones: true o false.

() uniformeLimpio

() Tipo: Boolean

() Requerido: Sí

() Restricciones: true o false.

() sinAccesorios

() Tipo: Boolean

() Requerido: Sí

() Restricciones: true o false.

() observacion

() Tipo: String

() Requerido: No

() Restricciones: Observaciones adicionales sobre el control.

() nroAccionCorrectiva

() Tipo: String

() Requerido: Sí

() Restricciones: Debe ser "ACC N°1", "ACC N°2", "ACC N°3", "ACC N°4", "ACC N°5", "ACC N°6", "ACC N°7" o "No Aplica".

() vbCumplimiento

() Tipo: String

() Requerido: Sí

() Restricciones: Debe ser "C" (Cumple) o "NC" (No Cumple).

) Listar Controles de Higiene

) URL:

() http://localhost:3000/api/calidad/higiene

) Tipo de Petición:

() GET

) Parámetros: Ninguno

) Registrar Control de Temperatura

) URL:

() http://localhost:3000/api/calidad/temperatura

) Tipo de Petición:

() POST

) Parámetros:

() fecha

() Tipo: Date

() Requerido: Sí

() Restricciones: Debe ser una fecha válida.

() hora

() Tipo: String

() Requerido: Sí

() Restricciones: Formato HH:MM.

() equipo

() Tipo: String

() Requerido: Sí

() Restricciones: Nombre del equipo, tamaño máximo de 100 caracteres.

() temperatura

() Tipo: Number

() Requerido: Sí

() Restricciones: Temperatura en grados Celsius.

() funcionamiento

() Tipo: String

() Requerido: Sí

() Restricciones: Debe ser "Correcto" o "Deficiente".

() motivos

() Tipo: String

() Requerido: No

() Restricciones: Motivos en caso de funcionamiento deficiente.

() accionesCorrectivas

() Tipo: String

() Requerido: No

() Restricciones: Acciones tomadas para corregir problemas.

7) Endpoints de Gestión de Personal

) Listar Personal

) URL:

() http://localhost:3000/api/personal

) Tipo de Petición:

() GET

) Parámetros: Ninguno

) Registrar Personal

) URL:

() http://localhost:3000/api/personal

) Tipo de Petición:

() POST

) Parámetros:

() nombre

() Tipo: String

() Requerido: Sí

() Restricciones: Tamaño mínimo de 3 caracteres, tamaño máximo de 100 caracteres.

() seccion

() Tipo: String

() Requerido: Sí

() Restricciones: Sección de trabajo, tamaño máximo de 100 caracteres.

) Ver Personal

) URL:

() http://localhost:3000/api/personal/:id

) Tipo de Petición:

() GET

) Parámetros:

() id

() Tipo: Integer

() Requerido: Sí

() Restricciones: Debe ser un identificador válido de personal.

) Actualizar Personal

) URL:

() http://localhost:3000/api/personal/:id

) Tipo de Petición:

() PATCH

) Parámetros:

() id

() Tipo: Integer

() Requerido: Sí

() Restricciones: Debe ser un identificador válido de personal.

) Eliminar Personal

) URL:

() http://localhost:3000/api/personal/:id

) Tipo de Petición:

() DELETE

) Parámetros:

() id

() Tipo: Integer

() Requerido: Sí

() Restricciones: Debe ser un identificador válido de personal.

8) Endpoints de Gestión de Tipos y Marcas de Productos

) Listar Tipos de Productos

) URL:

() http://localhost:3000/api/tipos-productos

) Tipo de Petición:

() GET

) Parámetros: Ninguno

) Crear Tipo de Producto

) URL:

() http://localhost:3000/api/tipos-productos

) Tipo de Petición:

() POST

) Parámetros:

() nombre

() Tipo: String

() Requerido: Sí

() Restricciones: Tamaño mínimo de 1 carácter, tamaño máximo de 50 caracteres, debe ser único.

) Listar Marcas de Productos

) URL:

() http://localhost:3000/api/marcas-productos

) Tipo de Petición:

() GET

) Parámetros: Ninguno

) Crear Marca de Producto

) URL:

() http://localhost:3000/api/marcas-productos

) Tipo de Petición:

() POST

) Parámetros:

() nombre

() Tipo: String

() Requerido: Sí

() Restricciones: Tamaño mínimo de 1 carácter, tamaño máximo de 50 caracteres, debe ser único.

9) Endpoints de Gestión de Pagos Pendientes

) Listar Pagos Pendientes

) URL:

() http://localhost:3000/api/pagos-pendientes

) Tipo de Petición:

() GET

) Parámetros: Ninguno

) Registrar Pago Pendiente

) URL:

() http://localhost:3000/api/pagos-pendientes

) Tipo de Petición:

() POST

) Parámetros:

() monto

() Tipo: Number

() Requerido: Sí

() Restricciones: Debe ser un número positivo mayor a 0.

() fechaPedido

() Tipo: Date

() Requerido: Sí

() Restricciones: Debe ser una fecha válida.

() fechaLimite

() Tipo: Date

() Requerido: Sí

() Restricciones: Debe ser posterior a la fecha de pedido.

() estado

() Tipo: String

() Requerido: Sí

() Restricciones: Debe ser "Pendiente", "Pagado" o "Vencido".

() factura

() Tipo: String

() Requerido: No

() Restricciones: Número de factura, tamaño máximo de 255 caracteres.

() clienteId

() Tipo: Integer

() Requerido: Sí

() Restricciones: Debe ser un identificador válido de cliente.

) Actualizar Estado de Pago

) URL:

() http://localhost:3000/api/pagos-pendientes/:id/estado

) Tipo de Petición:

() PATCH

) Parámetros:

() id

() Tipo: Integer

() Requerido: Sí

() Restricciones: Debe ser un identificador válido de pago pendiente.

() estado

() Tipo: String

() Requerido: Sí

() Restricciones: Debe ser "Pendiente", "Pagado" o "Vencido".

10) Endpoints de Reportes y Estadísticas

) Generar Reporte de Ventas

) URL:

() http://localhost:3000/api/reportes/ventas

) Tipo de Petición:

() GET

) Parámetros:

() fechaInicio

() Tipo: Date

() Requerido: No

() Restricciones: Debe ser una fecha válida.

() fechaFin

() Tipo: Date

() Requerido: No

() Restricciones: Debe ser posterior a fecha de inicio.

) Generar Reporte de Inventario

) URL:

() http://localhost:3000/api/reportes/inventario

) Tipo de Petición:

() GET

) Parámetros: Ninguno

) Obtener Estadísticas del Dashboard

) URL:

() http://localhost:3000/api/estadisticas/dashboard

) Tipo de Petición:

() GET

) Parámetros: Ninguno







### Frontend

Tabla : Estructura de código – Frontend ejemplo Tesis Tomas Montecinos IECI

# Implantación y puesta en marcha

## Plan de Capacitación/entrenamiento

La fase de implantación y puesta en marcha del sistema para la carnicería es crucial para garantizar que todas las funcionalidades desarrolladas operen de manera eficiente en el entorno de producción. Esta etapa incluye la configuración del entorno, migración de datos, pruebas finales y capacitación de los usuarios. A continuación, se detalla el plan y estado actual del proyecto.

1. Plan de Capacitación



Un plan de capacitación adecuado asegura que todos los usuarios puedan utilizar el sistema de manera efectiva. Se implementarán los siguientes métodos:



1.1 Manual del Usuario

- Descripción: Documento detallado con instrucciones paso a paso sobre cómo utilizar cada funcionalidad del sistema, acompañado de capturas de pantalla para facilitar su comprensión.



1.2 Vídeos Tutoriales

- Descripción: Serie de vídeos cortos que muestran la ejecución de tareas específicas, como la gestión de inventarios, registro de pedidos, y generación de documentos.



1.3 Sesiones de Capacitación Presenciales

- **Descripción**: Talleres prácticos dirigidos a los empleados, con ejercicios específicos para resolver dudas en tiempo real.

## Estrategia de implantación.

2.1 Preparación del Entorno de Producción

- Configuración del servidor de producción con los requisitos técnicos necesarios, como Node.js, PostgreSQL y servicios relacionados.

- Validación de conectividad y seguridad en el servidor.



2.2 Despliegue del Sistema

- Backend: Despliegue del backend, asegurando que los servicios y APIs estén operativos.

- Frontend: Implementación del frontend en el servidor de producción, verificando su accesibilidad y compatibilidad con diferentes navegadores.



2.3 Migración de Datos

- Realización de copias de seguridad del entorno de desarrollo.

- Migración de los datos a la base de datos de producción, con pruebas de consistencia para garantizar la integridad.



2.4 Pruebas Finales

- Pruebas de Funcionalidad: Validación de cada funcionalidad desarrollada para asegurar que opera correctamente.

- Pruebas de Rendimiento: Evaluación del sistema bajo condiciones de carga esperadas.



2.5 Formación de Usuarios

- Sesiones prácticas para enseñar a los usuarios (jefes y empleados) a utilizar el sistema.

- Distribución de guías y manuales para tareas comunes y resolución de problemas.



2.6 Puesta en Marcha

- Lanzamiento del sistema y monitoreo inicial para identificar y resolver problemas rápidamente.

- Provisión de soporte técnico continuo durante las primeras semanas.



2.7 Monitoreo y Mantenimiento

- Configuración de herramientas de monitoreo para supervisar el rendimiento y detectar problemas en tiempo real.

- Establecimiento de un plan de mantenimiento regular para garantizar la estabilidad del sistema.

## Estado del Proyecto

El desarrollo del sistema está en una etapa avanzada. Hasta el momento, se han logrado importantes avances en el backend y frontend:



3.1 Backend

- Configuración del servidor con Node.js y PostgreSQL.

- Definición de modelos de datos para animales en vara, cortes, proveedores y pedidos.

- Implementación de controladores para la lógica de negocio y las solicitudes HTTP.

- Configuración de sistemas de autenticación y autorización mediante JWT y roles definidos.



3.2 Frontend

- Organización de la estructura del proyecto utilizando React.

- Desarrollo de componentes reutilizables para formularios, vistas de productos y pedidos, y la barra de navegación.

- Implementación de rutas principales para las funcionalidades clave.

- Creación de servicios para la interacción con las APIs del backend.

- Aplicación de estilos CSS para garantizar una interfaz atractiva y funcional.

# Conclusión del proyecto

•	Capítulo IV: Conclusión del Proyecto

El proyecto desarrollado para la carnicería ha logrado importantes avances, incluyendo la implementación de un backend robusto para la gestión de inventarios y despostes, y un frontend intuitivo que facilita las operaciones diarias de la carnicería. La infraestructura se ha diseñado para soportar un despliegue eficiente y seguro, con capacidades de escalabilidad que garantizan el crecimiento futuro del negocio. Sin embargo, aún quedan pendientes tareas clave como pruebas exhaustivas, optimización del rendimiento y capacitación de los usuarios.



•	1. Trabajo Futuro

El trabajo futuro se enfocará en las siguientes áreas clave:

•	Optimización y Pruebas: Finalizar las pruebas unitarias, de integración y de rendimiento para asegurar que el sistema sea estable y eficiente.

•	Nuevas Funcionalidades: Incorporar módulos adicionales, como reportes avanzados de ganancias y pérdidas, y gestión de subproductos.

•	Monitoreo y Mantenimiento: Implementar herramientas de monitoreo en tiempo real y establecer un plan de mantenimiento periódico para garantizar la disponibilidad del sistema.

•	Capacitación Continua: Desarrollar recursos de aprendizaje y brindar apoyo técnico para garantizar que todos los usuarios puedan utilizar el sistema de manera efectiva.



•	2. Logro de Objetivos Específicos

Cada uno de los objetivos específicos del proyecto se ha abordado de manera efectiva, contribuyendo al logro del objetivo general:

1.	Diseño y Desarrollo del Sistema: Se diseñó y desarrolló un sistema integral que optimiza la gestión de inventarios, controla mermas y calcula ganancias estimadas. La elección de tecnologías modernas ha sido fundamental para alcanzar este objetivo.

2.	Implementación de Soluciones de Seguridad: Se implementaron medidas de seguridad como autenticación robusta, cifrado de datos y auditorías periódicas para proteger la información sensible de la carnicería.

3.	Automatización de Documentos y Reportes: Se desarrollaron herramientas para generar automáticamente documentos sanitarios y reportes de trazabilidad, cumpliendo con normativas regulatorias.

4.	Capacitación de Usuarios: Se diseñó un plan de capacitación inicial que incluye tutoriales y sesiones prácticas para los empleados, aunque su implementación completa está en curso.



•	3. Tiempo y Esfuerzo Estimado y Real

El desarrollo del proyecto ha requerido un esfuerzo significativo. Aunque las estimaciones iniciales plantearon ciertos plazos, desafíos técnicos como la integración de módulos complejos y ajustes en el diseño extendieron el tiempo total de desarrollo. A pesar de estos retos, la flexibilidad y adaptabilidad del equipo permitieron avanzar de manera sostenida, completando la mayoría de las tareas críticas en un marco de tiempo razonable.



•	4. Logro y Desarrollo de Competencias

Este proyecto ha permitido desarrollar competencias clave alineadas con el perfil de Ingeniería de Ejecución en Computación e Informática:

•	Desarrollo de Software: Habilidades avanzadas en el desarrollo de aplicaciones web utilizando el stack PERN (PostgreSQL, Express, React, Node.js).

•	Gestión de Proyectos: Planificación y ejecución efectiva de las etapas del proyecto, incluyendo el despliegue y la validación de funcionalidades.

•	Seguridad Informática: Implementación de estrategias para proteger los datos del sistema y garantizar la integridad de la información.

•	Colaboración en Equipo: Trabajo coordinado con stakeholders, como los carniceros y jefes, para alinear el sistema con las necesidades del negocio.



•	5. Percepciones y Opiniones Personales

El desarrollo de este proyecto ha sido una experiencia enriquecedora y desafiante. Ha sido gratificante transformar las ideas iniciales en una herramienta tangible que optimiza la gestión de la carnicería, impactando positivamente en su operación diaria. Además, la oportunidad de enfrentar problemas técnicos complejos y trabajar con tecnologías modernas ha contribuido al crecimiento profesional y personal.

En conclusión, el proyecto ha cumplido con la mayoría de sus objetivos específicos y está bien encaminado hacia su implementación final. Las habilidades desarrolladas y las lecciones aprendidas durante este proceso serán de gran valor en futuros proyectos y en el desarrollo profesional del tesista. A pesar de los desafíos, el sistema se perfila como una solución efectiva que mejorará significativamente la operación y administración de la carnicería.

# Referencias

* Utilizar Estilo IEEE para las referencias.



Anexos de Pruebas de aceptación

Tabla detalla de pruebas de funcionalidades

Anexos de recopilación de información

Este anexo presenta la recopilación de información que ha sido fundamental para el desarrollo del sistema para la carnicería. Se detalla la metodología utilizada para la recopilación de datos, las fuentes de información consultadas y los resultados obtenidos.



1. Metodología de Recopilación de Información

Para asegurar que el sistema desarrollado cumpliera con las necesidades y expectativas de la carnicería, se utilizó una combinación de técnicas de recopilación de información:

1.	Entrevistas:

Se llevaron a cabo reuniones con los jefes de la carnicería y los carniceros clave, como Juan Roque y Pablo Figueroa, para comprender sus necesidades y desafíos en la gestión diaria, incluyendo la despostada, el control de inventarios, y la trazabilidad de los productos.

2.	Observación Directa:

Se realizaron sesiones de observación en las instalaciones de la carnicería para analizar los procesos actuales, identificar áreas de mejora y entender los flujos de trabajo, desde la recepción de carne en vara hasta la venta de productos al cliente final.

3.	Análisis de Documentación:

Se revisaron documentos internos, como facturas de carne, registros de inventarios y control de mermas, para obtener un panorama claro de las operaciones actuales y los puntos críticos a optimizar.



2. Resultados Obtenidos

1. Necesidades Identificadas:

○ Automatización de Procesos:

Se identificó la necesidad de automatizar procesos manuales, como el cálculo de cantidades de carne despostada, la gestión de inventarios por cortes, y el control de mermas.

○ Generación de Reportes Automáticos:

Los jefes de la carnicería destacaron la importancia de generar documentos automáticos, como resoluciones sanitarias, registros de temperaturas de cámaras de frío y formularios de trazabilidad.

○ Gestión de Clientes y Proveedores:

La carnicería requiere un módulo para registrar clientes especiales y proveedores, incluyendo información de contacto, cuentas pendientes, y detalles de facturas.

○ Interfaz Intuitiva:

Se enfatizó la necesidad de una interfaz sencilla y amigable para usuarios con niveles variados de habilidad técnica, desde administrativos hasta los carniceros.

○ Notificaciones de Pedidos:

Se sugirió implementar un sistema de notificaciones para gestionar pedidos, recordatorios de entrega y control de pagos pendientes.

Anexo Diccionario de datos

Tabla de Diccionario de Datos: Productos

Tabla de Diccionario de Datos: Clientes



Tabla de Diccionario de Datos: AnimalCorte (Lista de Precios)



Tabla de Diccionario de Datos: AnimalVara



Tabla de Diccionario de Datos: Mermas



Tabla de Diccionario de Datos: Personal



Tabla de Diccionario de Datos: ControlHigiene



Tabla de Diccionario de Datos: ControlTemperatura



Tabla de Diccionario de Datos: RegistroTrazabilidad



Tabla de Diccionario de Datos: Proveedores



Tabla de Diccionario de Datos: RecepcionStock



Tabla de Diccionario de Datos: Subproductos



Tabla de Diccionario de Datos: TipoProducto



Tabla de Diccionario de Datos: MarcaProducto



Tabla de Diccionario de Datos: PagosPendientes



Tabla de Diccionario de Datos: Users (Autenticación)

Anexo aspectos de gestión de proyectos

















































Anexo Carta Gantt con línea base y desviaciones

Riesgos de Alto nivel (Amenazas), Impacto, estrategia.

1. Riesgos de Alto Nivel, Impacto y Estrategias

La identificación y gestión de riesgos es una parte crucial para asegurar el éxito del sistema desarrollado para la carnicería. A continuación, se presentan los principales riesgos, su posible impacto y las estrategias de mitigación correspondientes.



2. Riesgos de Alto Nivel



3. Falla del Sistem*

- Descripción: El sistema puede experimentar fallos debido a errores de programación, incompatibilidades de software o fallos en la infraestructura.

- Impacto: Alto

- Pérdida de datos críticos.

- Interrupción de las operaciones diarias de la carnicería.

- Estrategia de Mitigación:

- Implementar pruebas exhaustivas (unitarias, de integración, de rendimiento).

- Utilizar herramientas de monitoreo para detectar problemas proactivamente.

- Establecer un plan de recuperación ante desastres, incluyendo backups automáticos y restauración rápida.



4. Ataques de Seguridad

- Descripción: El sistema podría ser objetivo de ataques como inyecciones SQL, accesos no autorizados o ransomware.

- Impacto: Alto

- Pérdida de datos sensibles, como información de clientes y proveedores.

- Daño a la reputación de la carnicería.

- Posibles sanciones legales y costos financieros.

- Estrategia de Mitigación:

- Implementar medidas de seguridad, como autenticación multifactor, cifrado de datos y auditorías periódicas.

- Proteger el sistema contra vulnerabilidades comunes utilizando herramientas de análisis de seguridad.

- Educar a los empleados sobre buenas prácticas de seguridad digital.



5. Falta de Adopción por los Usuarios

- **Descripción**: Los empleados de la carnicería podrían resistirse a usar el nuevo sistema debido a la falta de capacitación o resistencia al cambio.

- *mpacto: Medio

- Baja utilización del sistema.

- Ineficiencias en la gestión de inventarios y operaciones.

- Estrategia de Mitigación:

- Diseñar un plan de capacitación integral para todos los empleados.

- Involucrar a los usuarios en el desarrollo mediante pruebas de usabilidad y retroalimentación.

- Proveer soporte técnico durante la transición y resolver problemas rápidamente.



6. **Pérdida de Datos**

- Descripción: Los datos críticos del negocio podrían perderse debido a fallos técnicos, errores humanos o desastres naturales.

- Impacto: Alto

- Pérdida de registros de inventarios y ventas.

- Interrupción de las operaciones diarias.

- Estrategia de Mitigación:

- Realizar copias de seguridad automáticas y regulares.

- Almacenar copias de seguridad en ubicaciones seguras y redundantes.

- Implementar procedimientos claros de recuperación de datos.



7. Escalabilidad Limitada

- Descripción: El sistema podría no manejar adecuadamente un crecimiento rápido en el volumen de datos o el número de usuarios.

- Impacto: Medio

- Degradación del rendimiento del sistema.

- Insatisfacción de los usuarios.

- Estrategia de Mitigación:

- Diseñar una arquitectura escalable desde el principio, utilizando herramientas y servicios en la nube.

- Implementar monitoreo constante del rendimiento del sistema.

- Optimizar consultas y procesos según sea necesario para soportar mayores volúmenes de datos.

Anexo Estimación CU

Estimación de tamaño de Sw: Puntos de Casos de Uso

Clasificar Actores

Clasificar casos de uso

Factores técnicos

Factores del entorno

Calcular puntos de Casos de uso





Calcular UUCP (Unadjusted Use Case Point)

UUCP= UAW+UUCW

Calcular  TCF (Technical Complexity Factor)

TCF=0.6+(0.01*TFactor)

Calcular  EF (Environmental Factor)

EF=1.4+(-0.03*EFactor)

UCP = UUCP * TCF * EF







Calculate TCF (Technical Complexity Factor)





Level of Effort. Schneider and Winters, proponen que: Si la suma entre (el número de factores de entorno (F1 a F6) inferiores a 3 y el número de factores de entorno (F7 a F8) superiores a 3).

es menor o igual a 2 entonces LOE=20,

es 3 o 4 LOE=28.

es mayor a 4 reconsiderar el proyecto. Por ejemplo, reducir los riesgos relacionados con los factores de entorno.

Anexo Resumen Esfuerzo

El final de este documento se debe indicar las horas destinadas en realizar cada una de las fases del desarrollo del software, las horas corresponden a la suma de las horas gastadas por cada integrante y del equipo en conjunto.





Resumen de Level of Effort

esfuerzo gastado en meses versus estimación CU, no importa si es distinto (está bien... porque ahora podrán sacar un cálculo real ..... por ejemplo:

puntos de casos de uso ajustados 60 UCP

mi esfuerzo me dio 320 hrs

Entonces 320/60 =5.33 hrsxCU





Anexo Retrospectiva Proyecto

Síntesis del porcentaje de cumplimiento de los requerimientos por cada módulo.

Análisis éxito/fracaso del proyecto

Riesgos que se concretaron en el proyecto y efectos/consecuencias

Análisis de ajuste entre planificación, esfuerzo real gastado y estimación de CU

Compare y analice los resultados extraídos desde los tiempos de la Gantt, de esfuerzo requerido y estimación de CU.

Concluya respecto a los resultados.

Anexo Iteraciones en el desarrollo

Este anexo describe las iteraciones realizadas durante el desarrollo del sistema para la carnicería. Cada iteración se enfocó en cumplir con un conjunto específico de objetivos, permitiendo una entrega incremental y asegurando la calidad y funcionalidad del sistema en cada etapa.



Iteración 1: Configuración Inicial y Diseño

Objetivos:



Configuración del entorno de desarrollo.

Diseño de la arquitectura del sistema.

Creación de la base de datos inicial.

Tareas Realizadas:



Instalación y configuración de Node.js, Express, PostgreSQL y React.

Definición de la arquitectura del sistema basada en el patrón Modelo-Vista-Controlador (MVC).

Creación de esquemas iniciales para las entidades AnimalCorte, AnimalVara, Proveedor y Categoria.

Resultados:



Entorno de desarrollo configurado.

Esquemas de base de datos definidos.

Plan de arquitectura aprobado.

Iteración 2: Implementación de Gestión de Proveedores

Objetivos:



Desarrollar la funcionalidad de registro y gestión de proveedores.

Implementar relaciones con las categorías de productos.

Tareas Realizadas:



Creación de endpoints para el registro, edición y eliminación de proveedores.

Implementación de la relación muchos-a-muchos entre proveedores y categorías.

Pruebas unitarias e integración para garantizar la funcionalidad.

Resultados:



Funcionalidad de gestión de proveedores operativa.

Relación proveedores-categorías implementada.

Pruebas aprobadas.

Iteración 3: Implementación de Gestión de Animales en Vara

Objetivos:



Registrar la llegada de animales en vara y calcular los cortes derivados.

Implementar validaciones para los datos ingresados.

Tareas Realizadas:



Desarrollo de formularios y vistas para el registro de animales en vara.

Creación de lógica para calcular los cortes obtenidos a partir de un animal completo.

Implementación de validaciones para la fecha y temperatura de llegada.

Resultados:



Funcionalidad de registro de animales en vara completa.

Validaciones implementadas.

Pruebas aprobadas.

Iteración 4: Implementación de Gestión de Pedidos

Objetivos:



Desarrollar la funcionalidad para registrar, editar y gestionar pedidos de clientes.

Implementar notificaciones para recordar entregas.

Tareas Realizadas:



Creación de vistas para registrar y editar pedidos.

Implementación de lógica para gestionar notificaciones automáticas de entregas.

Desarrollo de endpoints para CRUD de pedidos.

Resultados:



Gestión de pedidos operativa.

Notificaciones implementadas.

Pruebas unitarias y de integración aprobadas.

Iteración 5: Gestión de Inventarios y Mermas

Objetivos:



Implementar el control de inventarios de cortes y subproductos.

Registrar mermas de productos por descomposición.

Tareas Realizadas:



Desarrollo de lógica para actualizar inventarios tras cada despostada.

Implementación de funcionalidad para registrar mermas.

Creación de reportes automáticos de inventarios y mermas.

Resultados:



Control de inventarios operativo.

Registro de mermas implementado.

Pruebas exitosas.

Iteración 6: Automatización de Documentos Sanitarios

Objetivos:



Generar documentos sanitarios de manera automática.

Cumplir con las normativas de trazabilidad y registro de temperatura.

Tareas Realizadas:



Desarrollo de plantillas para resoluciones sanitarias y trazabilidad de carne.

Implementación de generación automática de documentos en PDF.

Pruebas de generación y validación de documentos.

Resultados:



Automatización de documentos sanitarios completa.

Documentos en conformidad con normativas.

Feedback positivo de los usuarios.

Conclusión

El enfoque iterativo en el desarrollo del sistema para la carnicería permitió una entrega incremental y continua de funcionalidades, asegurando la calidad y funcionalidad en cada etapa. Cada iteración abordó objetivos específicos, resolviendo desafíos y adaptando el desarrollo a las necesidades del cliente. Este enfoque facilitó la incorporación de feedback, la gestión de riesgos y la optimización del sistema, garantizando el éxito del proyecto.



## Tabla de Valorización de Tiempo Ahorrado por la Aplicación

Basado en Ingreso Mínimo Mensual: $529,000 CLP

### Cálculo de Valor Hora

Ingreso Mínimo Mensual: $529,000 CLP

Horas mensuales (180 horas): $529,000 ÷ 180 = $2,939 CLP/hora

Valor Hora Administrador (3x mínimo): $8,817 CLP/hora

## Tiempo Ahorrado por Módulo

## Resumen de Tiempo y Valor Económico Ahorrado

## Valorización por Escenarios Económicos

## Beneficios Adicionales Cuantificados

## ROI (Retorno de Inversión) Proyectado

### Costo de Desarrollo Estimado: $3,000,000 - $5,000,000 CLP

## Conclusión del Análisis Económico

Inversión Inicial: $3,000,000 - $5,000,000 CLP Ahorro Anual Solo en Tiempo: $2,939,000 - $13,225,500 CLP Beneficios Adicionales Anuales: $4,000,000 - $10,500,000 CLP Beneficio Total Anual: $6,939,000 - $23,725,500 CLP

Período de Recuperación: 3-9 meses ROI Primer Año: 197% - 386%

