# 📖 MANUAL DE USO Y OPERACIÓN — APEX PERSONAL OS
**Sistema Operativo Personal de Alto Rendimiento para Brayan**  
*Versión 1.2 — Integración MySQL 8.0, Gemini Pro & Shadow Slave Dark Neumorphism*

---

## 1. 🏛️ Visión General y Filosofía del Sistema

**Apex Personal OS** es tu centro de comando autónomo, privado y local, diseñado para unificar los cinco pilares fundamentales de tu desarrollo personal, físico y profesional:

1. **Finanzas & Bóveda**: Control estricto del sueldo base (S/ 1,500), blindaje del aporte a casa (S/ 500), cálculo de *Daily Safe Spend* (Gasto Diario Seguro), módulos personalizados para almuerzos y antojos diarios, y registro de gastos con 1 solo clic.
2. **Skin Care & Cuidado Cutáneo**: Protocolo dermatológico estructurado (AM/PM) que recupera y protege la barrera de tu piel mixta/grasa mediante un administrador dinámico de productos en uso (sin fotos redundantes).
3. **Taller de Dibujo & Arte**: Entorno de estudio deliberado con temporizador interactivo (15 a 60 min), bitácora de práctica con calificaciones, banco de ideas categorizadas (anatomía, manos, estilo manhwa) y biblioteca de fundamentos visuales.
4. **Calistenia & Salud Postural**: Rutinas divididas en Tirón (Espalda/Bíceps), Empuje (Pecho/Tríceps) y Pierna/Core, con protocolos de corrección postural (*Chin Tucks* para contrarrestar el cuello adelantado por pantallas de consolas AV).
5. **Oráculo IA (Google Gemini)**: Auditorías de fugas de capital y prescripción inteligente de entrenamientos basada en tus datos reales almacenados en MySQL.

---

## 2. ⚡ Ciclo de Vida: Encendido, Apagado y Respaldo

Todo el sistema está optimizado para funcionar en tu laptop localmente, consumiendo cero recursos cuando no lo estás usando.

### 🟢 ¿Cómo Encender el Sistema?
Haz doble clic en el acceso directo de tu Escritorio:
```text
Iniciar_ApexOS.bat
```
* **¿Qué hace tras bambalinas?**
  1. Verifica si el servicio local de **MySQL 8.0** (`MySQL80`) está en ejecución; si está detenido, lo inicia automáticamente.
  2. Inicializa el servidor web de **Next.js** en el puerto `3000` con `npm run dev`.
  3. Espera a que el servidor responda y abre automáticamente tu navegador predeterminado en `http://localhost:3000`.

### 🔴 ¿Cómo Apagar el Sistema?
Cuando termines de registrar tus datos o estudiar, haz doble clic en tu Escritorio:
```text
Apagar_ApexOS.bat
```
* **¿Qué hace tras bambalinas?**
  1. Localiza y cierra de forma limpia todos los procesos de Node.js asociados a Next.js.
  2. Libera de inmediato la memoria RAM y los puertos de red de tu equipo.

### 💾 ¿Cómo Respaldar tu Base de Datos?
Haz doble clic en tu Escritorio:
```text
Backup_ApexOS.bat
```
* Genera un archivo `.sql` completo en la carpeta `apex-os/backups/` con el formato:  
  `backup_apex_personal_os_YYYY-MM-DD_HH-mm-ss.sql`
* Contiene todas tus transacciones, saldo en caja, rutinas de skincare, sesiones de dibujo y registros de entrenamiento.

---

## 3. 🧭 Nexo Central (Dashboard Maestro)

La pantalla principal (`/`) te da una perspectiva instantánea de tu día:
- **Ancla Sagrada del Sueño (22:50 PM)**: Cuenta regresiva visual hacia tu hora límite de descanso. Dormir a tiempo es la variable médica más importante para regular el sebo cutáneo y construir músculo.
- **Registro Rápido de Hábitos**:
  - `💧 Agua (Meta 2.5L)`: Añade +250 ml por pulsación con un clic.
  - `🧴 Skincare AM / PM`: Marca las rutinas de la mañana y de la noche directamente desde el Nexo.
  - `🧘 Pausas Posturales`: Registra pausas de retracción cervical (*chin tucks*) mientras trabajas en producción audiovisual o en la computadora.
- **Acceso Directo a Especialidades**: Tarjetas de un vistazo para el **Taller de Dibujo** y el **Control de Piel**.

---

## 4. 💰 Módulo de Finanzas: Control Total & 1 Clic

Accede desde el menú a **Finanzas & Metas** (`/finanzas`). Cuenta con 4 pestañas especializadas:

### Pestaña 1: Control Diario & Caja
1. **Dinero Real Actual (Caja / Billetera / Bancos)**:
   - Muestra el dinero líquido que tienes disponible en mano hoy (efectivo + saldos en Yape/Plin o cuentas bancarias).
   - Puedes actualizarlo en cualquier momento haciendo clic en el icono del lápiz (**Editar Saldo Real**).
2. **⚡ Registro Rápido de Antojos & Comidas (1 Clic)**:
   - Botones instantáneos para los gastos frecuentes que realizas en la calle o en tu trabajo de AV:
     - 🥟 **Empanada**: S/ 3.50
     - 🥪 **Sándwich**: S/ 4.00
     - 💧 **Agua Mineral**: S/ 1.50
     - 🍱 **Almuerzo Trabajo**: S/ 12.00
     - 🚌 **Pasaje Extra**: S/ 3.00
     - 🍫 **Dulce / Snack**: S/ 2.50
     - ☕ **Café / Bebida**: S/ 3.00
     - ➕ **Personalizado**: Abre un formulario rápido de 2 campos para compras no listadas.
   - **Selector de método de pago**: Alterna entre **Efectivo** 💵 y **Yape/Plin** 📱 antes de pulsar. Al hacer clic, se descuenta automáticamente de tu saldo real en caja y se registra en MySQL.
3. **Daily Safe Spend (Gasto Diario Seguro)**:
   - Algoritmo que divide tu dinero variable restante entre los días que le quedan al mes. Te indica con luces de advertencia cuánto puedes gastar por día sin tocar tus ahorros ni el apoyo en casa.

### Pestaña 2: Módulos de Gasto & Ahorro
Aquí gestionas los límites de tus categorías mensuales con seguimiento en vivo:
- **Seguimiento en Tiempo Real de Topes**:
  - **Gastado este mes**: Cuánto dinero se ha registrado acumulado en ese módulo en el mes activo.
  - **Cuánto falta para el tope (Disponible)**: Te indica con precisión `Quedan S/ XX.XX` o `¡Excedido por S/ XX.XX!` en rojo si superaste el límite asignado.
  - **Barra de Progreso Dinámica**: Visualiza el % consumido (Verde < 75%, Ámbar 75-99%, Rojo >= 100%).
- **¿Se Pagó o No? (Gastos Fijos)**:
  - Si un gasto fijo (ej. Apoyo a Casa S/ 500 o Plan Móvil S/ 28) ya fue pagado, muestra la insignia `✓ Pagado este mes`.
  - Si está pendiente, muestra el botón **`✓ Pagar S/ XXX`** para registrar el pago con 1 solo clic y descontarlo de tu saldo.
- **Registro Rápido por Módulo**:
  - Pulsa **`+ Registrar`** en cualquier tarjeta para abrir un modal express con esa categoría pre-seleccionada (indicando monto, descripción y método de pago).
- **Eliminar y Editar Módulos**:
  - Cada tarjeta cuenta con el icono de lápiz para editar su nombre, tope mensual y etiquetas.
  - El icono de papelera te permite **eliminar cualquier módulo que no uses** de forma limpia; sus transacciones históricas se reasignan automáticamente evitando cualquier fallo en el sistema.

### Pestaña 3: Grimorio de Metas SMART
- **Creación y Seguimiento**: Crea metas con categoría, horizonte temporal (corto, mediano o largo plazo) y monto objetivo.
- **Edición Completa**: Pulsa el **icono del lápiz** en cualquier tarjeta para modificar su título, descripción, categoría, monto objetivo, monto acumulado actual o estado (`En Marcha`, `Lograda`, `Pausada`).
- **Eliminación Segura**: Pulsa el **icono de papelera** para borrar metas obsoletas junto a sus aportes.
- **Aportes Rápidos**: Pulsa `+S/ 20`, `+S/ 50` o `Otro` para aportar dinero en un clic descontándolo de tu caja.

### Pestaña 4: Historial de Transacciones
- Lista completa de todos los ingresos y gastos registrados, con filtros, métodos de pago y fecha exacta.

---

## 5. 🧴 Módulo de Skin Care & Protocolo Cutáneo

Accede desde el menú a **Skin Care** (`/cuidado`):

### Pestaña 1: Rutinas Activas (AM / PM)
- **Rutina AM (06:00 - 06:15 AM)**: Generada automáticamente con los productos activos marcados para la mañana. Por defecto:
  1. *Limpiador Detox Yanbal*: Lavar con agua tibia sin frotar con fuerza.
  2. *Hidratante Matificante*: Textura gel ligera sin aceites para la zona T.
  3. *Protector Solar SPF 50+*: Regla de los 2 dedos obligatoria.
- **Rutina PM (22:30 - 22:45 PM)**:
  1. *Doble Limpieza*: Retira smog acumulado del transporte y protector solar.
  2. *Reparador de Barrera*: Fórmula con ceramidas para calmar rojeces durante las 7 horas de sueño.
- Botones de **"Marcar Hecha"** que sincronizan tu hábito diario en tiempo real.

### Pestaña 2: Administrador de Productos
- **Inventario Cutáneo en Vivo**: Lista de todos los productos dermatológicos guardados en MySQL.
- **Botón "En Uso / Pausado"**: Permite pausar temporalmente un producto que se te terminó o que cambiaste de marca, sin borrar su registro histórico.
- **Botón "Añadir a la Lista"**: Permite ingresar nuevos productos con:
  - Nombre del producto y marca/laboratorio (ej. CeraVe, Yanbal, Eucerin).
  - Número de paso en el orden de aplicación (1, 2, 3...).
  - Momento: Solo Mañana (AM), Solo Noche (PM), o Ambos (AM y PM).
  - Categoría: Limpiador, Hidratante, Protector Solar, Reparador de Barrera, Activo/Tratamiento o Corporal.
  - Precio estimado, instrucciones de aplicación y notas personales.

### Pestaña 3: Diagnóstico Cutáneo & Pautas Clínicas
- Consulta tu perfil dermatológico consolidado: piel mixta a grasa con reactividad moderada y cuero cabelludo ondulado (2B).
- Lista de **Anti-Metas**: cero exfoliantes mecánicos agresivos, cero tocarse el rostro durante horas de trabajo AV, y cero omitir el protector solar.

---

## 6. 🎨 Módulo de Taller de Dibujo & Arte

Accede desde el menú a **Taller Dibujo** (`/dibujo`):

### Pestaña 1: Práctica Diaria & Cronómetro
- **Temporizador de Práctica Deliberada**:
  - Selecciona un preset rápido de tiempo: **15 min**, **30 min**, **45 min** o **60 min**.
  - Selecciona tu área de enfoque para hoy:
    - *Anatomía del Torso (V-Taper)*
    - *Rostros & Método Loomis*
    - *Estructura 3D de Manos & Dedos*
    - *Gestual Dinámico (Poses rápidas de 30-60 seg)*
    - *Estilo Manhwa & Ropa/Pliegues*
    - *Perspectiva & Escorzo*
  - Inicia o pausa el cronómetro con un clic.
- **Bitácora de Sesión**:
  - Al concluir, califica tu sesión del 1 al 10 en la escala de estrellas.
  - Escribe tus notas y aprendizajes (ej. *"Buena soltura en clavículas, vigilar el arco de nudillos"*).
  - Guarda la práctica en tu historial permanente en MySQL.

### Pestaña 2: Banco de Ideas & Retos
- Colección de desafíos y prompts para dibujar cuando sientas bloqueo creativo.
- Filtra por categorías: **Anatomía**, **Manos**, **Gesto**, **Personajes Manhwa**, **Sombreado & Luz**.
- Cada reto incluye nivel de dificultad (**Fácil**, **Medio**, **Avanzado**) y checkbox para marcarlo como completado.
- Botón **"Añadir Nueva Idea"** para guardar referencias de Pinterest o ideas que se te ocurran.

### Pestaña 3: Biblioteca de Fundamentos (Manhwa & Anatomía)
Fichas técnicas con principios anatómicos esenciales:
1. **Silueta Heroica Manhwa & Torso en V**: Proporción de 8 cabezas, movimiento independiente del tórax respecto a la pelvis, y clavículas en forma de manubrio de bicicleta.
2. **Método Loomis para Rostros Angulares**: La esfera dividida en tercios iguales (frente a cejas, cejas a base de la nariz, base al mentón).
3. **Manos en Cajas 3D**: La cuña curva de la palma, el arco de los nudillos y el movimiento angular independiente del pulgar.
4. **Líneas de Acción**: Curvas dinámicas en 'C' y en 'S' para erradicar las poses rígidas.

---

## 7. 🏋️ Módulo de Calistenia & Postura

Accede desde el menú a **Calistenia** (`/fitness`):
- **Rutina A (Tirón)**: Dominadas pronas, remos invertidos, chin tucks y curl de bíceps en barra baja.
- **Rutina B (Empuje)**: Fondos en paralelas, flexiones declinadas, extensiones de tríceps y retracciones escapulares.
- **Rutina C (Piernas & Core)**: Sentadillas búlgaras, zancadas, elevaciones de piernas en barra y plancha hollow body.
- **Registro de Progresión**: Anota tus series y repeticiones para asegurar la sobrecarga progresiva semana tras semana.

---

## 8. 🔮 Módulo de Oráculo IA (Google Gemini Pro)

Accede desde el menú a **Oráculo IA** (`/oraculo`):
- **Auditoría Financiera**: Analiza en segundos tus transacciones del mes, alertando si tus gastos en antojos o comidas superan el margen diario seguro.
- **Ajuste de Calistenia**: Recomienda si debes aumentar repeticiones o tomar un día de descarga en función de tus horas de sueño registradas.
- **Chat Contextual**: Consulta dudas específicas; la IA tiene acceso directo a tus métricas de MySQL para responder con base en tu realidad económica y física.

---

## 9. 🗄️ Estructura Técnica y Mantenimiento de la Base de Datos

- **Motor**: MySQL 8.0 local (puerto `3306`).
- **Base de datos**: `apex_personal_os`.
- **Tablas principales**:
  - `usuarios`: Datos personales, sueldo base y `dinero_actual_caja`.
  - `presupuestos_mensuales`: Presupuesto activo por año y mes.
  - `categorias_finanzas`: Módulos de gasto y ahorro con sus banderas de control (`es_comida_diaria`, `es_gasto_hormiga`, etc.).
  - `transacciones`: Historial de movimientos monetarios.
  - `metas` y `aportes_metas`: Grimorio de metas SMART.
  - `productos_skincare`: Inventario de productos activos y pausados.
  - `ideas_dibujo` y `practicas_dibujo`: Sistema del taller de dibujo.
  - `registros_habitos_diarios`: Registro diario de agua, sueño y skincare.
  - `diagnosticos_iniciales`: Evaluaciones médicas migradas desde los archivos markdown originales.
  - `horarios_bloques`: Franjas horarias maestras de la semana.

---

## 10. 💾 Copias de Seguridad y Restauración (Especial Formateo de PC)

El sistema incluye herramientas autónomas para respaldar y restaurar la base de datos sin comandos complejos:

1. **`Backup_ApexOS.bat`**: Ejecuta una copia completa de MySQL 8.0 y actualiza `database_backup.sql`.
2. **`database_backup.sql`**: Archivo de respaldo íntegro subido a tu repositorio GitHub con toda tu información real (dinero en caja, ahorro blindado intocable, rutinas, metas, etc.).
3. **`Restaurar_Backup.bat` (Al formatear tu PC)**:
   - Tras instalar Windows, Node.js y MySQL Server 8.0:
   - Clonas el repositorio: `git clone https://github.com/BryShdw/Apex-Os.git`
   - Ejecutas `npm install`.
   - Creas tu `.env` con la clave de Gemini.
   - Haces doble clic en **`Restaurar_Backup.bat`**. En 5 segundos se recreará la base de datos `apex_personal_os` y se poblarán todos tus datos históricos exactamente como los dejaste.

---

*¡Apex OS está listo para acompañarte en tu disciplina diaria, blindar tu patrimonio y acelerar tu maestría en el dibujo y la calistenia!*
