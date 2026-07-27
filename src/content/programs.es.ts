import type { ProgramContent } from "@/content/programs";

/**
 * Spanish copy for /programas/[slug]. Slugs mirror the English programs
 * (weight-management, longevity-vitality, ...) so that internal references
 * and Healthie env-var lookups stay consistent across locales.
 *
 * When Spanish SEO becomes a priority, add a slug-translation layer that
 * maps ProgramSlug → URL segment per locale rather than duplicating IDs.
 */
export const programsEs: ProgramContent[] = [
  {
    slug: "weight-management",
    title: "Manejo del Peso",
    eyebrow: "Programa · Control de peso médico",
    summary:
      "Apoyo médico para una pérdida de peso sostenible: opciones de medicación dirigidas por médico, coaching nutricional y seguimiento en el que puedes confiar. Diseñado alrededor de tu cuerpo, no de una plantilla.",
    honestFraming:
      "Marco directo: los GLP-1 funcionan, pero no son para todos. Hacemos laboratorios de base y rechazamos casos cuando el perfil de riesgo no es el adecuado.",
    heroImage: "/weight-management.jpg",
    heroImageAlt: "Programa de Manejo del Peso en Hello You Wellness Center",
    atAGlance: {
      duration: "Programa de 6 meses, mes a mes después",
      firstVisit: "Consulta 45–60 min + laboratorios de base",
      followUp: "Chequeos mensuales, ajustados por respuesta",
      priceAnchor: "Cotizado en su totalidad en consulta · sin precios en línea",
    },
    trustChips: ["Programa GLP-1", "Laboratorios antes de dosificar", "Clínica SW Miami"],
    primaryCtaLabel: "Iniciar mi intake",
    secondaryCtaLabel: "Hablar con una persona",
    ctaNote: "Consulta gratuita. Cotizamos programas en su totalidad antes de inscribirte.",
    benefits: [
      "Evaluación de elegibilidad y dosificación dirigida por médico",
      "Opciones GLP-1 (semaglutida, tirzepatida) cuando es clínicamente apropiado",
      "Coaching nutricional y de estilo de vida que complementa la terapia médica",
      "Cadencia de seguimiento definida — no es 'recetar y olvidar'",
    ],
    idealFor: [
      "Mujeres 40+ enfrentando cambios metabólicos en peri- o menopausia a pesar de entrenar y comer bien",
      "Adultos que buscan apoyo médicamente apropiado, más allá de dietas por cuenta propia",
      "Quien considera terapia GLP-1 con supervisión clínica real",
    ],
    notForYouIf: [
      "Buscas GLP-1 por correo sin visitas ni laboratorios",
      "Quieres pérdida de peso cosmética con IMC menor a 25 sin razón metabólica",
      "Quieres saltarte los laboratorios de base para empezar el mismo día",
    ],
    sessionNote:
      "La visita inicial cubre historial, metas, laboratorios y un plan escrito antes de que te comprometas con la terapia.",
    steps: [
      {
        title: "Intake",
        body: "Completa un cuestionario médico corto para que entendamos tu historial, metas y experiencia previa con pérdida de peso antes de conocernos.",
      },
      {
        title: "Evaluación médica",
        body: "Reúnete con nuestro equipo clínico para una evaluación personalizada. Laboratorios de base incluidos. Plan claro construido alrededor de tu perfil — sin plantillas.",
      },
      {
        title: "Programa + seguimiento",
        body: "Comienza tu protocolo con un cronograma de seguimiento definido. Ajustes de dosis, monitoreo de efectos secundarios y coaching de estilo de vida incluidos.",
      },
    ],
    includedServices: ["assisted-weight-loss", "peptide-therapy"],
    healthieEnvVar: "NEXT_PUBLIC_HEALTHIE_URL_WEIGHT_MANAGEMENT",
    finalCtaHeading: "¿Lista para comenzar tu programa de manejo de peso?",
    finalCtaBody:
      "Consultas disponibles en la misma semana. Respondemos dentro de un día hábil — sin llamadas de venta, sin upsells.",
  },
  {
    slug: "longevity-vitality",
    title: "Longevidad y Vitalidad",
    eyebrow: "Programa · Longevidad celular",
    summary:
      "Optimiza tu salud celular y hormonal para una vida más larga y plena. Protocolos diseñados por médico que combinan terapia con péptidos, apoyo IV y screening de detección temprana.",
    honestFraming:
      "El trabajo de longevidad se acumula. Una conversación hoy vale más que un tratamiento el próximo año — pero no prometemos revertir el envejecimiento que no podemos revertir.",
    heroImage: "/ting.jpg",
    heroImageAlt: "Programa de Longevidad y Vitalidad en Hello You Wellness Center",
    atAGlance: {
      duration: "Programa continuo — cadencia de revisión trimestral",
      firstVisit: "Consulta 60 min + panel integral opcional",
      followUp: "Revisión trimestral profunda, contactos mensuales",
      priceAnchor: "Panel + programa cotizados en consulta",
    },
    trustChips: ["Diseñado por médico", "Guiado por laboratorios", "Galleri opcional"],
    primaryCtaLabel: "Iniciar mi intake",
    secondaryCtaLabel: "Hablar con una persona",
    ctaNote: "Consulta gratuita. Detalles del panel y programa revisados en su totalidad antes de comprometerte.",
    benefits: [
      "Protocolos de regeneración celular diseñados por médico, administrados por APRN",
      "Apoyo IV (NAD+, glutatión) integrado con tu plan de péptidos",
      "Screening opcional Galleri de detección temprana multi-cáncer",
      "Enfoque en calidad de vida y función — no biohacks sobre-prometidos",
    ],
    idealFor: [
      "Adultos 40+ invirtiendo en 'health span', no solo esperanza de vida",
      "Pacientes que quieren apoyo a nivel celular con supervisión médica real",
      "Quien tiene curiosidad por péptidos y NAD+ hechos bien, no por cuenta propia",
    ],
    notForYouIf: [
      "Esperas que una sola infusión revierta una década de hábitos",
      "Quieres saltarte laboratorios y empezar protocolos el mismo día",
      "Buscas resultados cosméticos en vez de marcadores funcionales",
    ],
    sessionNote:
      "Las visitas iniciales cubren metas, historial de salud y los laboratorios necesarios antes de prescribir un protocolo.",
    steps: [
      {
        title: "Intake",
        body: "Comparte tus metas, salud actual y cómo se ve 'prosperar' para ti durante la próxima década.",
      },
      {
        title: "Laboratorios + diseño de protocolo",
        body: "Laboratorios integrales cuando corresponden. Tu protocolo se construye alrededor de los resultados — péptidos, cadencia IV y screening adicional si es apropiado.",
      },
      {
        title: "Optimización continua",
        body: "Chequeos regulares para ajustar dosis, revisar marcadores y agregar apoyo conforme evolucionan tus metas.",
      },
    ],
    includedServices: ["peptide-therapy", "iv-therapy"],
    healthieEnvVar: "NEXT_PUBLIC_HEALTHIE_URL_LONGEVITY_VITALITY",
    finalCtaHeading: "Invierte en los próximos 20 años, empezando hoy.",
    finalCtaBody:
      "El trabajo de longevidad se acumula. Una conversación hoy vale más que un tratamiento el próximo año.",
  },
  {
    slug: "skin-hair",
    title: "Piel y Cabello",
    eyebrow: "Programa · Piel y cabello",
    summary:
      "Calidad de piel refinada y cabello saludable a través de estética médica y apoyo dirigido con péptidos. Técnica conservadora, protocolos basados en evidencia, y un plan que puedes mantener.",
    honestFraming:
      "Te diremos cuando un tratamiento no sea adecuado para tu tipo de piel o patrón capilar — y qué hacer en su lugar. Hay meses en que recomendamos mantener, no más.",
    heroImage: "/skinwell.jpg",
    heroImageAlt: "Programa de Piel y Cabello en Hello You Wellness Center",
    atAGlance: {
      duration: "Plan de tratamiento de 3–6 meses, mantenimiento después",
      firstVisit: "Consulta 45 min + evaluación + plan escrito",
      followUp: "Cada 4–12 semanas según tratamiento",
      priceAnchor: "Precio por tratamiento compartido en consulta",
    },
    trustChips: ["Inyectora licenciada", "Apoyo con péptidos", "Técnica conservadora"],
    primaryCtaLabel: "Iniciar mi intake",
    secondaryCtaLabel: "Hablar con una persona",
    ctaNote: "Plan de tratamiento escrito antes de colocar cualquier inyectable.",
    benefits: [
      "Planes de tratamiento adaptados a tu tipo de piel y metas",
      "Apoyo con péptidos para cabello (GHK-Cu) y calidad de piel cuando es apropiado",
      "Técnica inyectable conservadora — refrescada, no exagerada",
      "Seguimiento fotográfico honesto de progreso antes/después",
    ],
    idealFor: [
      "Clientes manteniendo un look pulido y descansado",
      "Clientes primerizos de inyectables que quieren educación primero",
      "Quien está abordando pérdida temprana de volumen, líneas finas o adelgazamiento capilar",
    ],
    notForYouIf: [
      "Buscas transformación dramática en una sola visita",
      "Esperas que los inyectables sustituyan el cuidado de la piel, el sueño y la protección solar",
      "Buscas tratamientos que hemos rechazado en otro lugar por una razón",
    ],
    sessionNote: "Las consultas incluyen evaluación de candidatura y un plan escrito.",
    steps: [
      {
        title: "Intake",
        body: "Comparte tus preocupaciones de piel y cabello, tratamientos previos y cómo se ve para ti un refresh natural.",
      },
      {
        title: "Plan escrito",
        body: "Consulta con nuestra inyectora o esteticista. Recibe un plan escrito con servicios recomendados, cronogramas y expectativas realistas.",
      },
      {
        title: "Tratamiento + mantenimiento",
        body: "El tratamiento se realiza con precisión y una cadencia de mantenimiento que conserva resultados consistentes — no una serie de visitas de recuperación.",
      },
    ],
    includedServices: ["aesthetics-cosmetics", "peptide-therapy"],
    healthieEnvVar: "NEXT_PUBLIC_HEALTHIE_URL_SKIN_HAIR",
    finalCtaHeading: "Un look refrescado, hecho para durar.",
    finalCtaBody:
      "Priorizamos balance, seguridad y resultados que fotografían honestamente. Citas de toxina el mismo día a veces disponibles.",
  },
  {
    slug: "hormone-wellness",
    title: "Bienestar Hormonal",
    eyebrow: "Programa · Equilibrio hormonal",
    summary:
      "Cuidado hormonal en persona y supervisado por médico para hombres con testosterona baja y mujeres navegando perimenopausia y menopausia. Dosificado según tus laboratorios y síntomas, monitoreado con una cadencia real.",
    honestFraming:
      "La HRT es manejo de síntomas y calidad de vida — no prevención de enfermedad. Enmarcamos los resultados honestamente y monitoreamos con una cadencia real, no 'recetar y olvidar'.",
    heroImage: "/hormone.jpg",
    heroImageAlt: "Médico revisando resultados de laboratorio hormonal con paciente",
    atAGlance: {
      duration: "Evaluación de 6 semanas, luego protocolo rotativo",
      firstVisit: "Consulta 45–60 min + orden de laboratorios integrales",
      followUp: "6 semanas · 3 meses · rotativo",
      priceAnchor: "Precio del programa cotizado por adelantado · sin cargos recurrentes silenciosos",
    },
    trustChips: ["Supervisado por médico", "Guiado por laboratorios", "Atención en persona"],
    primaryCtaLabel: "Iniciar mi intake",
    secondaryCtaLabel: "Hablar con una persona",
    ctaNote: "Precio del programa cotizado por adelantado — sin cargos recurrentes silenciosos.",
    benefits: [
      "Protocolos supervisados por médico, dosificados según laboratorios y síntomas",
      "TRT para hombres, BHRT para mujeres — sin protocolos de plantilla",
      "Cadencia de monitoreo definida, no 'recetar y olvidar'",
      "Visitas y laboratorios en persona — no atención solo por telesalud",
    ],
    idealFor: [
      "Hombres 35+ con fatiga, baja libido, aplanamiento de ánimo o aumento de peso central",
      "Mujeres navegando síntomas de perimenopausia o menopausia",
      "Quien quiere cuidado hormonal en persona y monitoreo honesto",
    ],
    notForYouIf: [
      "Buscas testosterona por correo sin visitas ni laboratorios",
      "Esperas que la HRT arregle problemas que no son hormonales",
      "Buscas dosificación supra-fisiológica fuera de rangos basados en evidencia",
    ],
    sessionNote:
      "La consulta inicial dura 45–60 minutos — revisión de síntomas, historial de salud y conversación de metas. Sin presión para empezar el mismo día.",
    steps: [
      {
        title: "Intake",
        body: "Completa un cuestionario de síntomas para que el tiempo de consulta se dedique al matiz, no al papeleo.",
      },
      {
        title: "Consulta + laboratorios",
        body: "Consulta de 45–60 minutos con nuestro médico. Laboratorios integrales tomados en clínica o en laboratorio asociado.",
      },
      {
        title: "Protocolo + monitoreo",
        body: "Si la HRT es apropiada, discutimos opciones de administración y comenzamos un protocolo definido. Seguimientos a las 6 semanas, 3 meses, luego rotando.",
      },
    ],
    includedServices: ["hormone-therapy"],
    healthieEnvVar: "NEXT_PUBLIC_HEALTHIE_URL_HORMONE_WELLNESS",
    finalCtaHeading: "Cuidado hormonal que se presenta en persona.",
    finalCtaBody:
      "Enfoque honesto, monitoreo real y precios que ves por adelantado. Agenda la consulta antes de comprometerte con la terapia.",
  },
  {
    slug: "recovery-performance",
    title: "Recuperación y Rendimiento",
    eyebrow: "Programa · Recuperación y rendimiento",
    summary:
      "Terapia IV curada por médico y péptidos de recuperación para atletas, alto rendimiento y cualquiera cuyo cuerpo trabaje duro. Reposición estructurada, no bolsas misteriosas.",
    honestFraming:
      "La terapia IV es reposición, no cura. Decimos que no a insumos que no coinciden con tus metas — mezclas propietarias, bolsas misteriosas, péptidos por cuenta propia.",
    heroImage: "/recovv.jpg",
    heroImageAlt: "Programa de Recuperación y Rendimiento en Hello You Wellness Center",
    atAGlance: {
      duration: "Cadencia construida alrededor de tu ciclo de entrenamiento",
      firstVisit: "Screening 30 min + primera sesión IV",
      followUp: "Quincenal o mensual, según carga",
      priceAnchor: "Precio por sesión · guarda tu fórmula para reorden",
    },
    trustChips: ["Administrado por enfermera", "Origen rastreable", "Dirigido por APRN"],
    primaryCtaLabel: "Iniciar mi intake",
    secondaryCtaLabel: "Hablar con una persona",
    ctaNote: "Administración en clínica en SW Miami. Sin viales por cuenta propia.",
    benefits: [
      "Estándares de composición estéril e insumos de grado médico",
      "Péptidos de recuperación (BPC-157, GHK-Cu) con supervisión médica real",
      "Administración por enfermera con técnica orientada al confort",
      "Listas de ingredientes transparentes — sin mezclas propietarias, sin bolsas misteriosas",
    ],
    idealFor: [
      "Atletas buscando reposición estructurada en un ciclo de entrenamiento",
      "Alto rendimiento recuperando de viajes, eventos o semanas intensas",
      "Quien explora péptidos de recuperación en lugar de fuentes por cuenta propia",
    ],
    notForYouIf: [
      "Buscas una 'megadosis' IV supra-terapéutica que no coincide con tu bloodwork",
      "Traes péptidos por cuenta propia para que los administremos",
      "Esperas que una infusión sustituya el entrenamiento o el sueño",
    ],
    sessionNote: "La mayoría de visitas IV duran 45–60 minutos puerta a puerta.",
    steps: [
      {
        title: "Intake",
        body: "Comparte tu carga de entrenamiento, metas de recuperación y lo que estás haciendo actualmente — suplementos, sueño, uso previo de IV o péptidos.",
      },
      {
        title: "Protocolo + primera sesión",
        body: "La APRN revisa tu intake y te empareja con la mezcla IV correcta y (si es apropiado) protocolo de péptidos de recuperación.",
      },
      {
        title: "Recuperación continua",
        body: "Cadencia construida alrededor de tu calendario de entrenamiento o eventos. Guarda tu fórmula en archivo para reorden fácil en futuras visitas.",
      },
    ],
    includedServices: ["iv-therapy", "build-your-own-iv", "peptide-therapy"],
    healthieEnvVar: "NEXT_PUBLIC_HEALTHIE_URL_RECOVERY_PERFORMANCE",
    finalCtaHeading: "Recupérate como si el trabajo importara.",
    finalCtaBody:
      "Mezclas IV y péptidos de recuperación dosificados por un equipo licenciado — no una checklist de spa.",
  },
  {
    slug: "immune-support",
    title: "Apoyo Inmunológico",
    eyebrow: "Programa · Refuerzo inmunológico",
    summary:
      "Terapia IV y apoyo dirigido para quien viaja, se recupera de enfermedad o refuerza un sistema inmune exigido. Mezclas curadas por médico, fórmulas transparentes.",
    honestFraming:
      "La vitamina C o el zinc IV no son sustitutos del sueño, la vacuna contra la gripe o una visita al médico — y lo diremos. Lo que sí pueden hacer es sostenerte en una etapa exigente.",
    heroImage: "/IV infusion.jpg",
    heroImageAlt: "Enfermera administrando terapia IV en una suite privada",
    atAGlance: {
      duration: "Sesiones individuales o cadencia estacional",
      firstVisit: "Screening 20 min + primera sesión IV",
      followUp: "Según necesidad o cadencia programada",
      priceAnchor: "Precio por sesión · add-ons cotizados en intake",
    },
    trustChips: ["Administrado por enfermera", "Mezclas transparentes", "Visitas 45–60 min"],
    primaryCtaLabel: "Iniciar mi intake",
    secondaryCtaLabel: "Hablar con una persona",
    ctaNote: "Add-ons discutidos durante intake. Citas en la misma semana son comunes.",
    benefits: [
      "Mezclas inmunes curadas por médico — Myers' cocktail, vitamina C alta dosis, zinc, glutatión",
      "Administración por enfermera en suite privada de descanso",
      "Builds personalizados disponibles cuando tienes una meta específica",
      "Listas de ingredientes transparentes — sin bolsas misteriosas",
    ],
    idealFor: [
      "Refuerzo pre-viaje o recuperación post-viaje",
      "Recuperación de una enfermedad reciente o etapa exigente",
      "Quien construye una cadencia alrededor de temporadas de riesgo",
    ],
    notForYouIf: [
      "Estás activamente enfermo y no has visto un médico — te referimos primero",
      "Esperas que una IV reemplace una vacuna contra la gripe o antibióticos",
      "Quieres una mezcla propietaria sin lista de ingredientes",
    ],
    sessionNote: "Un screening breve antes de cada sesión confirma la mezcla correcta para ese día.",
    steps: [
      {
        title: "Intake",
        body: "Cuéntanos qué estás apoyando — viaje próximo, enfermedad reciente, o una cadencia continua — para recomendar la mezcla correcta.",
      },
      {
        title: "Screening + primera sesión",
        body: "Screening clínico rápido confirma que la mezcla es correcta para ti hoy. Administrado por enfermera en suite privada.",
      },
      {
        title: "Cadencia continua",
        body: "Para apoyo recurrente, construimos una cadencia alrededor de tu calendario y guardamos tu fórmula preferida en archivo.",
      },
    ],
    includedServices: ["iv-therapy", "build-your-own-iv"],
    healthieEnvVar: "NEXT_PUBLIC_HEALTHIE_URL_IMMUNE_SUPPORT",
    finalCtaHeading: "Adelántate a lo que anda circulando.",
    finalCtaBody:
      "Ya sea un vuelo la próxima semana o una temporada por delante, la cadencia correcta vence la carrera de último minuto.",
  },
];

export function getProgramEs(slug: string): ProgramContent | undefined {
  return programsEs.find((p) => p.slug === slug);
}
