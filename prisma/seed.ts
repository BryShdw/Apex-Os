import { PrismaClient, TipoCategoria, TipoTransaccion, MetodoPago, CategoriaMeta, HorizonteMeta, EstadoMeta, GrupoMuscular, DiaSemana } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('--- Iniciando Seed con Migración de Markdown a MySQL ---');

  // 1. Usuario con datos del Expediente Maestro
  const usuario = await prisma.usuario.upsert({
    where: { id: 1 },
    update: {
      nombre: 'Brayan',
      alias: 'Bry',
      edad: 22,
      pesoActualKg: 70.0,
      pesoMetaKg: 75.5,
      estaturaCm: 180,
      porcentajeGrasa: 15.5,
      sueldoBase: 1500.0,
      dineroActualCaja: 450.0,
      metaHorasSueno: 7.0,
      ocupacion: 'Técnico de Integración AV (Crestron SIMPL/Construct, Q-SYS, Extron) / Estudiante de 9no ciclo de Ing. de Sistemas',
      horarioLaboral: 'Lunes a Sábado de 8:30 am a 5:30 pm (Sábados jornada corta ~1:00 pm)',
      tipoPiel: 'Mixta / Reactiva (exceso de sebo en zona T, barrera cutánea en recuperación)',
      tipoCabello: 'Ondulado (2A/2B) | Cuero cabelludo graso (<24h), puntas secas',
      velloFacial: 'Barba dispersa / irregular. Irritación al rasurar con rastrillo común',
      posturaDetalle: 'Síndrome cruzado superior: cuello adelantado (text neck), cifosis torácica leve y hombros rotados al frente',
      digestion: 'Regular, intolerancia leve a leche entera',
      filosofia: 'Mejorar habilidades en trabajo técnico AV, culminar carrera de sistemas y forjar un físico atlético en V con disciplina estoica.',
      antiMetas: 'Cero procrastinación nocturna en redes sociales, erradicar gastos hormiga no planificados y proteger las 7 horas sagradas de sueño.',
    },
    create: {
      id: 1,
      nombre: 'Brayan',
      alias: 'Bry',
      edad: 22,
      pesoActualKg: 70.0,
      pesoMetaKg: 75.5,
      estaturaCm: 180,
      porcentajeGrasa: 15.5,
      sueldoBase: 1500.0,
      dineroActualCaja: 450.0,
      metaHorasSueno: 7.0,
      ocupacion: 'Técnico de Integración AV (Crestron SIMPL/Construct, Q-SYS, Extron) / Estudiante de 9no ciclo de Ing. de Sistemas',
      horarioLaboral: 'Lunes a Sábado de 8:30 am a 5:30 pm (Sábados jornada corta ~1:00 pm)',
      tipoPiel: 'Mixta / Reactiva (exceso de sebo en zona T, barrera cutánea en recuperación)',
      tipoCabello: 'Ondulado (2A/2B) | Cuero cabelludo graso (<24h), puntas secas',
      velloFacial: 'Barba dispersa / irregular. Irritación al rasurar con rastrillo común',
      posturaDetalle: 'Síndrome cruzado superior: cuello adelantado (text neck), cifosis torácica leve y hombros rotados al frente',
      digestion: 'Regular, intolerancia leve a leche entera',
      filosofia: 'Mejorar habilidades en trabajo técnico AV, culminar carrera de sistemas y forjar un físico atlético en V con disciplina estoica.',
      antiMetas: 'Cero procrastinación nocturna en redes sociales, erradicar gastos hormiga no planificados y proteger las 7 horas sagradas de sueño.',
    },
  });
  console.log(`[OK] Usuario y Expediente Maestro: ${usuario.nombre} (${usuario.alias})`);

  // 2. Diagnósticos Iniciales migrados de Markdown (Tests 01 al 05)
  const diagnosticosData = [
    {
      numeroTest: 1,
      codigo: 'TEST_01_ESTILO_VIDA',
      titulo: 'Test 01: Estilo de Vida, Horarios, Energía y Rutinas',
      categoria: 'ESTILO_DE_VIDA',
      resumen: 'Despierta 5:30 AM, duerme 11:30 PM/1:00 AM (déficit crónico). Trabajo 8:30-17:30 + Uni 19:30-22:30 (3 días). Mayor pico de energía 10 AM-6 PM. Distracción principal: TikTok/Reels al llegar a casa.',
      respuestasJson: {
        horaDespertarHabitual: '5:30 am',
        horaDormirHabitual: '11:30 PM a 1:00 AM',
        tiempoLevantarseCama: '< 5 minutos (rápido)',
        horarioLaboral: '8:30 AM a 5:30 PM',
        horarioUniversidad: '7:30 PM a 10:30 PM (3 días/semana)',
        trasladoIdaVueltaMinutos: 100,
        picoEnergia: 'Mediodía y tarde (10:00 AM - 6:00 PM)',
        calidadDescansoPercibida: 'Regular / Fatiga frecuente',
        hobbies: 'Videojuegos, manhwas, series, música',
      },
    },
    {
      numeroTest: 2,
      codigo: 'TEST_02_CUIDADO_FISICO',
      titulo: 'Test 02: Cuidado Personal, Facial y Físico',
      categoria: 'CUIDADO_PERSONAL',
      resumen: 'Piel mixta reactiva con acné leve y manchas post-inflamatorias. Cuero cabelludo graso con puntas secas. Postura con cuello adelantado (text neck) y hombros rotados por trabajo en laptop/AV.',
      respuestasJson: {
        tipoPielFacial: 'Mixta reactiva (sebo en zona T, mejillas sensibles)',
        problemasCutaneos: ['Acné inflamatorio leve', 'Marcas post-acné', 'Ojeras por falta de sueño'],
        patronLavadoCabello: 'Diario o interdiario (grasa antes de 24h)',
        afeitado: 'Irritación con rastrillos desechables estándar',
        postura: 'Síndrome cruzado superior (cabeza adelantada ~3-4 cm, cifosis leve)',
      },
    },
    {
      numeroTest: 3,
      codigo: 'TEST_03_NUTRICION',
      titulo: 'Test 03: Nutrición, Hidratación y Hábitos',
      categoria: 'NUTRICION',
      resumen: 'Comida casera en general. Desayuno a veces omitido por prisa. Consumo de agua ~1.5L-2L. Intolerancia leve a lácteos enteros. Necesidad de aumentar proteína magra (huevos, atún, pollo) para hipertrofia.',
      respuestasJson: {
        tipoDieta: 'Casera peruana (arroz, guisos, menestras)',
        ingestaAguaLitros: 1.8,
        intolerancias: 'Leche entera',
        objetivoCalorico: 'Superávit limpio moderado (+300 kcal) para pasar de 70kg a 75kg magros',
      },
    },
    {
      numeroTest: 4,
      codigo: 'TEST_04_ESTUDIO_PRODUCTIVIDAD',
      titulo: 'Test 04: Estudio, Aprendizaje y Productividad',
      categoria: 'ESTUDIO',
      resumen: 'Estudio pasivo previo con retención baja. Foco prioritario: Crestron SIMPL/Construct y materias de sistemas. Solución: Usar NotebookLM para consultas teóricas y bloques Deep Work 45/10.',
      respuestasJson: {
        enfoquePrincipal: 'Programación AV (Crestron SIMPL, Construct, Q-SYS) e Ing. Sistemas 9no ciclo',
        metodoAnterior: 'Lectura pasiva y resúmenes largos (poca retención)',
        metodoAcordado: 'NotebookLM para lectura y consultas, Apex OS para disciplina y tiempo',
        bloquesFoco: '45 minutos foco / 10 minutos pausa activa',
      },
    },
    {
      numeroTest: 5,
      codigo: 'TEST_05_FINANZAS_RECURSOS',
      titulo: 'Test 05: Finanzas Personales, Gastos y Presupuesto',
      categoria: 'FINANZAS',
      resumen: 'Ingreso S/ 1,500. Aporte a casa S/ 500 obligatorio. Transporte S/ 120, plan móvil S/ 28. Fugas en snacks callejeros (gastos hormiga). Margen variable de S/ 652 con meta de ahorro de S/ 200.',
      respuestasJson: {
        sueldoNeto: 1500.0,
        aporteFamiliarFijo: 500.0,
        transporteFijo: 120.0,
        planMovilFijo: 28.0,
        gastoHormigaFrecuente: 'Empanadas, galletas, sándwiches y gaseosas en paraderos',
        metaAhorroMensual: 200.0,
      },
    },
  ];

  for (const diag of diagnosticosData) {
    await prisma.diagnosticoInicial.upsert({
      where: { codigo: diag.codigo },
      update: diag,
      create: {
        usuarioId: 1,
        ...diag,
      },
    });
  }
  console.log('[OK] 5 Diagnósticos iniciales migrados a MySQL.');

  // 3. Bloques de Horario Maestro Semanal migrados desde Markdown
  await prisma.horarioBloque.deleteMany({ where: { usuarioId: 1 } });
  const bloquesHorario = [
    { diaSemana: DiaSemana.LUNES, franjaHoraria: '05:50 - 06:15', actividad: 'Despertar + 500ml Agua + Skincare AM', tipoDia: 'TIPO_A', categoria: 'RUTINA_MANANA' },
    { diaSemana: DiaSemana.LUNES, franjaHoraria: '06:40 - 08:25', actividad: 'Traslado al trabajo AV (podcasts técnicos o descanso)', tipoDia: 'TIPO_A', categoria: 'TRANSPORTE' },
    { diaSemana: DiaSemana.LUNES, franjaHoraria: '08:30 - 13:00', actividad: 'Trabajo Técnico de Integraciones AV', tipoDia: 'TIPO_A', categoria: 'TRABAJO' },
    { diaSemana: DiaSemana.LUNES, franjaHoraria: '13:00 - 14:00', actividad: 'Almuerzo casero + caminata postural 10m', tipoDia: 'TIPO_A', categoria: 'ALMUERZO' },
    { diaSemana: DiaSemana.LUNES, franjaHoraria: '14:00 - 17:30', actividad: 'Trabajo Técnico de Integraciones AV', tipoDia: 'TIPO_A', categoria: 'TRABAJO' },
    { diaSemana: DiaSemana.LUNES, franjaHoraria: '17:30 - 19:25', actividad: 'Retorno a casa (Metropolitano/Buses)', tipoDia: 'TIPO_A', categoria: 'TRANSPORTE' },
    { diaSemana: DiaSemana.LUNES, franjaHoraria: '19:30 - 22:30', actividad: 'Clases Universidad Ing. Sistemas (3 bloques)', tipoDia: 'TIPO_A', categoria: 'UNIVERSIDAD' },
    { diaSemana: DiaSemana.LUNES, franjaHoraria: '22:30 - 22:50', actividad: 'Skincare PM + Chin Tucks cervicales', tipoDia: 'TIPO_A', categoria: 'RUTINA_NOCHE' },
    { diaSemana: DiaSemana.LUNES, franjaHoraria: '22:50 - 05:50', actividad: 'Ancla de Sueño Sagrada (7 Horas)', tipoDia: 'TIPO_A', categoria: 'SUENO' },

    // Martes (Tipo B - Entreno)
    { diaSemana: DiaSemana.MARTES, franjaHoraria: '05:50 - 06:15', actividad: 'Despertar + Agua + Skincare AM', tipoDia: 'TIPO_B', categoria: 'RUTINA_MANANA' },
    { diaSemana: DiaSemana.MARTES, franjaHoraria: '08:30 - 17:30', actividad: 'Trabajo Técnico de Integraciones AV', tipoDia: 'TIPO_B', categoria: 'TRABAJO' },
    { diaSemana: DiaSemana.MARTES, franjaHoraria: '19:30 - 20:20', actividad: 'Calistenia en Barra: Torso A (Dominadas/Fondos)', tipoDia: 'TIPO_B', categoria: 'ENTRENAMIENTO' },
    { diaSemana: DiaSemana.MARTES, franjaHoraria: '20:20 - 21:00', actividad: 'Ducha + Cena alta en proteína', tipoDia: 'TIPO_B', categoria: 'NUTRICION' },
    { diaSemana: DiaSemana.MARTES, franjaHoraria: '21:00 - 22:30', actividad: 'Estudio Crestron / Proyectos / Hobbies', tipoDia: 'TIPO_B', categoria: 'ESTUDIO' },
    { diaSemana: DiaSemana.MARTES, franjaHoraria: '22:50 - 05:50', actividad: 'Ancla de Sueño Sagrada (7 Horas)', tipoDia: 'TIPO_B', categoria: 'SUENO' },
  ];

  for (const b of bloquesHorario) {
    await prisma.horarioBloque.create({
      data: {
        usuarioId: 1,
        ...b,
      },
    });
  }
  console.log('[OK] Bloques de horario maestro guardados en MySQL.');

  // 4. Catálogo y Administrador de Productos de Skincare
  await prisma.productoSkincare.deleteMany({ where: { usuarioId: 1 } });
  const productosData = [
    {
      nombre: 'Limpiador Facial Detox Suave',
      marca: 'Personal / Recomendado',
      pasoNumero: 1,
      momento: 'AM_PM',
      categoria: 'LIMPIADOR',
      enUso: true,
      precio: 35.0,
      instrucciones: 'Lavar el rostro con agua tibia haciendo suave espuma. Sin frotar fuerte para proteger la barrera.',
      notas: 'Excelente para retirar el sebo nocturno y la polución tras los viajes en autobús.',
    },
    {
      nombre: 'Gel Hidratante Matificante Libre de Aceite',
      marca: 'Personal / Recomendado',
      pasoNumero: 2,
      momento: 'AM',
      categoria: 'HIDRATANTE',
      enUso: true,
      precio: 42.0,
      instrucciones: 'Aplicar una avellana en frente, nariz y mejillas. Se absorbe en 30 segundos.',
      notas: 'Aporta agua sin generar brillos grasos en la zona T.',
    },
    {
      nombre: 'Protector Solar Toque Seco SPF 50+',
      marca: 'Personal / Recomendado',
      pasoNumero: 3,
      momento: 'AM',
      categoria: 'PROTECTOR_SOLAR',
      enUso: true,
      precio: 45.0,
      instrucciones: 'Regla de los 2 dedos. Aplicar 15 minutos antes de salir al trabajo.',
      notas: 'Esencial para evitar que las marcas post-acné se oscurezcan por radiación solar.',
    },
    {
      nombre: 'Crema Reparadora de Barrera Cutánea con Ceramidas',
      marca: 'Personal / Recomendado',
      pasoNumero: 2,
      momento: 'PM',
      categoria: 'REPARADOR_BARRERA',
      enUso: true,
      precio: 48.0,
      instrucciones: 'Aplicar por la noche tras el limpiador antes de dormir a las 22:50 PM.',
      notas: 'Repara rojeces y calma la piel mientras descansas tus 7 horas.',
    },
  ];

  for (const p of productosData) {
    await prisma.productoSkincare.create({
      data: {
        usuarioId: 1,
        ...p,
      },
    });
  }
  console.log('[OK] 4 Productos de Skincare registrados en lista activa.');

  // 5. Módulo de Dibujo (Base y Fundamentos)
  await prisma.ideaDibujo.deleteMany({ where: { usuarioId: 1 } });
  const ideasDibujo = [
    {
      titulo: 'Estudio Anatómico de Torso y Escápulas en V',
      categoria: 'ANATOMIA',
      dificultad: 'MEDIO',
      descripcion: 'Dibujar la estructura ósea y muscular: clavículas, caja torácica, dorsal ancho y serratos en vista frontal y posterior.',
      completada: false,
    },
    {
      titulo: 'Construcción de Manos en Cajas 3D y Perspectiva',
      categoria: 'MANOS',
      dificultad: 'MEDIO',
      descripcion: 'Dibujar la palma como una cuña 3D y articular los nudillos con cilindros para dedos en 5 poses cotidianas.',
      completada: false,
    },
    {
      titulo: 'Líneas de Acción y Gesto Dinámico (Poses de 60 segundos)',
      categoria: 'GESTO',
      dificultad: 'FACIL',
      descripcion: 'Capturar el movimiento y la energía de una figura con una sola curva de acción sin entrar en detalles musculares.',
      completada: true,
    },
    {
      titulo: 'Diseño de Personaje Estilo Manhwa / Webtoon',
      categoria: 'PERSONAJES_MANHWA',
      dificultad: 'AVANZADO',
      descripcion: 'Silueta estilizada, mirada expresiva, cabello con mechones principales e iluminación de alto contraste.',
      completada: false,
    },
    {
      titulo: 'Estudio de Cabeza en Método Loomis (Ángulo 3/4)',
      categoria: 'ANATOMIA',
      dificultad: 'MEDIO',
      descripcion: 'Esfera con cortes laterales, cruz facial para ojos y nariz, y alineación de orejas con el arco cigomático.',
      completada: false,
    },
  ];

  for (const idea of ideasDibujo) {
    await prisma.ideaDibujo.create({
      data: {
        usuarioId: 1,
        ...idea,
      },
    });
  }

  await prisma.practicaDibujo.create({
    data: {
      usuarioId: 1,
      minutos: 35,
      enfoque: 'Líneas de acción, elipses y estructura básica de torso',
      calificacion: 8,
      notas: 'Buena fluidez en trazos iniciales. Seguir practicando proporción de caja torácica vs pelvis.',
    },
  });
  console.log('[OK] Ideas y fundamentos del Taller de Dibujo inicializados.');

  // 6. Categorías Financieras Ampliadas con Almuerzos, Antojos y Salidas
  const categoriasDetalladas = [
    { nombre: 'Aporte a Casa (Familia)', tipo: TipoCategoria.FIJO, colorHex: '#dc2626', icono: 'home', esAporteHogar: true, esGastoHormiga: false, presupuestoEstimado: 500.0 },
    { nombre: 'Transporte (Metropolitano/Buses)', tipo: TipoCategoria.FIJO, colorHex: '#f59e0b', icono: 'bus', esGastoHormiga: false, presupuestoEstimado: 120.0 },
    { nombre: 'Plan Móvil', tipo: TipoCategoria.FIJO, colorHex: '#8b5cf6', icono: 'smartphone', esGastoHormiga: false, presupuestoEstimado: 28.0 },
    { nombre: 'Almuerzos en Trabajo AV', tipo: TipoCategoria.VARIABLE, colorHex: '#06b6d4', icono: 'utensils', esComidaDiaria: true, esGastoHormiga: false, presupuestoEstimado: 180.0 },
    { nombre: 'Antojos Diarios (Empanadas, Sándwiches, Snacks)', tipo: TipoCategoria.VARIABLE, colorHex: '#ef4444', icono: 'cookie', esComidaDiaria: true, esGastoHormiga: true, presupuestoEstimado: 60.0 },
    { nombre: 'Agua / Bebidas de Calle', tipo: TipoCategoria.VARIABLE, colorHex: '#38bdf8', icono: 'droplet', esComidaDiaria: true, esGastoHormiga: true, presupuestoEstimado: 25.0 },
    { nombre: 'Productos de Skin Care & Higiene', tipo: TipoCategoria.VARIABLE, colorHex: '#ec4899', icono: 'sparkles', esGastoHormiga: false, presupuestoEstimado: 40.0 },
    { nombre: 'Salidas y Ocio de Fin de Semana', tipo: TipoCategoria.VARIABLE, colorHex: '#3b82f6', icono: 'gamepad-2', esSalidaOcio: true, esGastoHormiga: false, presupuestoEstimado: 120.0 },
    { nombre: 'Módulo Ahorro: Fondo de Emergencia', tipo: TipoCategoria.AHORRO_INVERSION, colorHex: '#10b981', icono: 'piggy-bank', esModuloAhorro: true, esGastoHormiga: false, presupuestoEstimado: 150.0 },
    { nombre: 'Módulo Ahorro: Equipamiento / Laptop', tipo: TipoCategoria.AHORRO_INVERSION, colorHex: '#6366f1', icono: 'laptop', esModuloAhorro: true, esGastoHormiga: false, presupuestoEstimado: 50.0 },
    { nombre: 'Sueldo Técnico de Integración AV', tipo: TipoCategoria.INGRESO, colorHex: '#22c55e', icono: 'briefcase', esGastoHormiga: false, presupuestoEstimado: 1500.0 },
  ];

  for (const cat of categoriasDetalladas) {
    const existing = await prisma.categoriaFinanzas.findFirst({
      where: { nombre: cat.nombre },
    });
    if (existing) {
      await prisma.categoriaFinanzas.update({
        where: { id: existing.id },
        data: cat,
      });
    } else {
      await prisma.categoriaFinanzas.create({ data: cat });
    }
  }
  console.log('[OK] 11 Categorías financieras detalladas (almuerzo, antojos, casa, ahorro).');

  console.log('--- Migración y Seed Completados con Éxito ---');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
