# 🏛️ Apex Personal OS - Centro de Mando de Alto Rendimiento

> **Usuario:** Brayan (Bry) • 22 años • Lima, Perú  
> **Especialidad:** Técnico de Integración AV (Crestron / Q-SYS / Extron) • Estudiante de 9no ciclo de Ing. de Sistemas  
> **Filosofía de Diseño:** *Shadow Slave (Dark Neumorphism)* con iluminación dual, tipografías Cinzel / JetBrains Mono e Inter, y resplandor de esencia (Cyan, Gold, Purple, Crimson).  
> **Base de Datos:** MySQL Server 8.0 (Servicio local `MySQL80`, base `apex_personal_os`)  
> **Motor de IA:** Google AI Studio (Free Tier con Gemini 2.5 Flash / 2.0 Flash)

---

## 🧭 1. Resumen Ejecutivo del Sistema

**Apex Personal OS** es una aplicación web local de alto rendimiento diseñada para centralizar y gobernar los 5 pilares de tu desarrollo personal sin depender de servicios en la nube de pago ni suscripciones:

1. **Finanzas & Bóveda de Metas:** Control estricto del presupuesto de S/ 1,500 mensuales, protección innegociable de los **S/ 500 para apoyo del hogar**, cálculo en tiempo real del **Daily Safe Spend** (Gasto Diario Seguro), detección de **Gastos Hormiga 🐜** y aportes rápidos a Metas SMART.
2. **Fitness, Calistenia & Postura:** Registro en vivo de series en barra fija (dominadas pronas, fondos, flexiones, lastre, RPE y fallo), temporizador de descanso interactivo, monitoreo de **Molestia en Cuello / Text Neck (0-10)** y protocolos de retracción escapular y Chin Tucks para contrarrestar las horas de trabajo en laptop y campo técnico AV.
3. **Grooming & Skincare Yanbal C10:** Protocolo matutino (limpiador detox + hidratante matificante + bloqueador SPF 50+) y nocturno (limpieza + crema reparadora de barrera cutánea) sincronizado con tu historial diario y galería de evolución fotográfica con 13 fotos reales.
4. **Ancla Sagrada del Sueño (7 Horas):** Cuenta regresiva automática a las **22:50 PM** para garantizar el descanso reparador (05:50 AM despertar) que erradica ojeras, fatiga cognitiva y maximiza la hipertrofia magra.
5. **Oráculo de Inteligencia Artificial (Gemini 2.5 Flash):** Chat interactivo de alto rendimiento con todo tu perfil inyectado, auditoría de finanzas, análisis de sobrecarga progresiva en barra, neurobiología del sueño y forja de metas SMART, guardando todos los diagnósticos en MySQL (`insights_ia`).

---

## 🗂️ 2. Arquitectura de Carpetas y Código Limpio

```
apex-os/
├── prisma/
│   ├── schema.prisma              <- Definición de las 17 tablas relacionales en MySQL 8.0
│   └── seed.ts                    <- Script con tus datos biográficos, rutinas, categorías y metas
├── backups/                       <- Copias de seguridad automáticas generadas en formato .sql (en .gitignore)
├── logs/                          <- Registro de logs del servidor (en .gitignore)
├── src/
│   ├── app/                       <- Next.js App Router (Páginas y Controladores API)
│   │   ├── layout.tsx             <- Layout raíz con Navbar, ToastContainer y viewport responsivo
│   │   ├── page.tsx               <- Nexo Central (Dashboard diario, ancla 22:50, agua, hábitos)
│   │   ├── finanzas/page.tsx      <- Bóveda Financiera (Triada de Liquidez, Daily Safe Spend, Metas)
│   │   ├── fitness/page.tsx       <- Calistenia en barra, series, timer, protocolo text-neck
│   │   ├── cuidado/page.tsx       <- Skin Care e inventario cutáneo activo AM/PM
│   │   ├── dibujo/page.tsx        <- Taller de Dibujo (Cronómetro deliberado, ideas y fundamentos)
│   │   ├── oraculo/page.tsx       <- Oráculo IA (Chat, Forja de Metas, Auditorías, Historial)
│   │   └── api/                   <- Endpoints REST (finanzas, ahorro, metas, fitness, habitos, dibujo, ia)
│   ├── components/                <- Componentes Neumórficos Reutilizables
│   │   ├── common/Navbar.tsx      <- Barra de navegación con pills de estado y modal de manual
│   │   ├── common/Toast.tsx       <- Sistema global de notificaciones toast reactivas
│   │   ├── finanzas/              <- LiquidityVaultHeader, FixedObligationsCard, QuickExpenseBar, BudgetModulesManager, GoalsManager
│   │   ├── fitness/               <- WorkoutTracker (series, descanso timer, slider cervical)
│   │   ├── cuidado/               <- Timelines e inventario de productos de Skin Care
│   │   └── dibujo/                <- Cronómetro interactivo, calificaciones y biblioteca de ideas
│   ├── services/                  <- Capa de Lógica de Negocio (Domain Services)
│   │   ├── finance.service.ts     <- Bóveda de liquidez, ahorro blindado, Daily Safe Spend, presupuestos
│   │   ├── fitness.service.ts     <- Rutinas Tipo A/B/C, cálculo de series y sobrecarga
│   │   ├── habits.service.ts      <- Monitoreo de agua, calidad de sueño y pausas
│   │   └── ai.service.ts          <- Prompts estructurados con Google GenAI SDK (Gemini)
│   └── lib/
│       ├── prisma.ts              <- Singleton seguro de Prisma Client
│       ├── gemini.ts              <- Inicialización oficial del cliente GoogleGenAI
│       └── utils.ts               <- Formateador PEN (S/), fechas en español y utilidades
└── package.json                   <- Scripts y dependencias de última generación
```

---

## 🗄️ 3. Diccionario del Modelo de Datos (MySQL 8.0)

La base de datos `apex_personal_os` cuenta con **12 tablas normalizadas**:

| Tabla | Propósito Clave |
| :--- | :--- |
| `usuarios` | Expediente maestro de Brayan: peso inicial/actual/meta, estatura (180 cm), porcentaje de grasa, sueldo base (S/ 1,500), meta de horas de sueño (7.0h). |
| `presupuestos_mensuales` | Presupuesto del mes: fijos bloqueados (apoyo a casa S/ 500, transporte S/ 120, plan móvil S/ 28), meta de ahorro (S/ 200) y margen variable máximo (S/ 652). |
| `categorias_finanzas` | Categorías de gastos/ingresos con banderas booleanas `esGastoHormiga`, colores hex e iconos neumórficos. |
| `transacciones` | Registro detallado de cada ingreso o salida, método de pago (Yape/Plin, Efectivo, Tarjeta, Transferencia), fecha y vínculo opcional con metas. |
| `metas` | Metas SMART clasificadas por horizonte (Corto 1-3m, Mediano 3-6m, Largo 1-3a), categoría, monto objetivo y monto acumulado. |
| `aportes_metas` | Registro de cada abono a una meta de ahorro, vinculado con la transacción correspondiente. |
| `ejercicios_catalogo` | Catálogo de calistenia y postura (dominadas pronas, fondos, flexiones declinadas, sentadillas búlgaras, chin tucks, retracción escapular). |
| `rutinas_ejercicio` | Rutinas maestras (`TORSO_A` para martes tipo B, `PIERNA_CORE` para jueves tipo B, `FULL_BODY_SABADO` para sábado). |
| `registros_entrenamiento` | Sesiones ejecutadas: duración en minutos, RPE de esfuerzo general (1-10) y nivel de molestia cervical (0-10). |
| `series_entrenamiento` | Detalle serie por serie: número de serie, repeticiones logradas, peso de lastre (+kg), RPE y si hubo fallo muscular. |
| `registros_habitos_diarios` | Hábitos diarios con fecha única: litros de agua consumidos, checkboxes de Skincare AM/PM, horas dormidas, calidad de sueño y pausas posturales. |
| `insights_ia` | Memoria de diagnósticos y recomendaciones emitidas por Gemini 2.5 Flash, con bandera de `aplicado` para seguimiento. |

---

## 💰 4. Módulo de Finanzas: El Algoritmo "Daily Safe Spend"

Para evitar que llegues a fin de mes con desvíos presupuestarios o que los gastos impulsivos en el transporte afecten a tu familia, la aplicación ejecuta la siguiente fórmula reactiva:

$$\text{Daily Safe Spend} = \frac{\text{Margen Variable Mensual} - \text{Gastos Variables Acumulados}}{\text{Días Restantes del Mes}}$$

- **Si hoy gastas menos:** El monto seguro diario aumenta para los días siguientes.
- **Si ocurre un imprevisto:** La barra visual te avisa cuántos soles debes ajustar al día para no comprometer los S/ 500 de casa ni tus S/ 200 de ahorro.

---

## ⚡ 5. Control de Encendido, Apagado, Respaldo y Restauración (1 Clic)

En tu **Escritorio de Windows** (`C:\Users\braya\Desktop`) y en la raíz del proyecto dispones de lanzadores ultrarrobustos:

### 1. `Iniciar_ApexOS.bat` (Encender Sistema)
- Arranca en modo silencioso y seguro a través de PowerShell.
- Verifica si el servicio de Windows `MySQL80` está activo y lo enciende si estuviera dormido.
- Libera el puerto 3000 si había algún proceso colgado previo.
- Detecta tu dirección IP local de Wi-Fi para que puedas conectarte desde tu smartphone.
- Inicia el servidor web y **espera activamente a que el servidor responda HTTP 200 antes de abrir tu navegador**.
- Abre automáticamente `http://localhost:3000`.

### 2. `Apagar_ApexOS.bat` (Apagado Limpio)
- Cierra inmediatamente el proceso en el puerto 3000 y libera el 100% de la memoria RAM de tu laptop.
- Tu base de datos MySQL permanece intacta y segura.

### 3. `Backup_ApexOS.bat` (Copia de Seguridad Automatizada)
- Ejecuta una exportación instantánea con `mysqldump` directo a `apex-os/backups/backup_YYYY-MM-DD_HH-mm-ss.sql` y actualiza `database_backup.sql`.
- Protege todos tus registros de saldo real, ahorro blindado, ejercicios, series y metas en segundos.

### 4. `Restaurar_Backup.bat` (Restauración Tras Formateo de PC)
- **Si vas a formatear tu PC**: El archivo `database_backup.sql` contiene todos tus datos guardados en el repositorio.
- **Tras formatear e instalar Node.js y MySQL Server 8.0**:
  1. Clona el repositorio: `git clone https://github.com/BryShdw/Apex-Os.git`
  2. Entra a la carpeta y crea tu `.env` a partir de `.env.example`.
  3. Ejecuta `npm install`.
  4. Haz doble clic en **`Restaurar_Backup.bat`** (o corre `mysql -u root -proot apex_personal_os < database_backup.sql`).
  5. ¡Listo! Todo tu historial, dinero en caja, ahorro blindado intocable y rutinas estarán 100% restablecidos.

---

## 📱 6. Conexión desde tu Celular (Misma Red Wi-Fi)

Para marcar tus series mientras estás en la barra de tu cuarto o tildar tu skincare en el baño:

1. Asegúrate de que tu laptop y tu celular estén conectados a la misma red Wi-Fi de tu casa.
2. Al ejecutar `Iniciar_ApexOS.bat`, verás una línea similar a:  
   `📱 Acceso en tu Celular: http://192.168.1.XX:3000`
3. Abre esa URL en Chrome o Safari en tu teléfono.
4. *(Opcional)* Si Windows Firewall bloqueara la conexión entrante desde el móvil, ejecuta este comando en PowerShell como Administrador una sola vez:
   ```powershell
   New-NetFirewallRule -DisplayName "Apex OS Local" -Direction Inbound -LocalPort 3000 -Protocol TCP -Action Allow
   ```

---

## 🧠 7. Integración con Google AI Studio (Gemini 2.5 Flash)

La clave API de Google AI Studio configurada en `.env` te brinda acceso ilimitado al **Free Tier**:
- **15 solicitudes por minuto (RPM)** y **1,000,000 de tokens por minuto**, más que suficiente para tu uso personal diario.
- Todas las llamadas se realizan desde el backend de Next.js (`src/services/ai.service.ts`), por lo que tu clave jamás queda expuesta en el navegador del cliente.
