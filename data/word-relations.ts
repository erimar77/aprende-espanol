// Synonyms and antonyms for Spanish vocabulary
// Used in flashcards to provide additional learning context

export interface WordRelation {
  synonyms?: string[];  // Similar meaning words
  antonyms?: string[];  // Opposite meaning words
}

// Map of Spanish words to their relations
export const wordRelations: Record<string, WordRelation> = {
  // ============================================
  // ADJECTIVES - Size & Physical
  // ============================================
  'grande': { synonyms: ['enorme', 'amplio', 'vasto'], antonyms: ['pequeño', 'diminuto', 'chico'] },
  'pequeño': { synonyms: ['diminuto', 'chico', 'minúsculo'], antonyms: ['grande', 'enorme', 'inmenso'] },
  'alto': { synonyms: ['elevado', 'erguido'], antonyms: ['bajo', 'corto'] },
  'bajo': { synonyms: ['corto', 'chaparro'], antonyms: ['alto', 'elevado'] },
  'largo': { synonyms: ['extenso', 'prolongado'], antonyms: ['corto', 'breve'] },
  'corto': { synonyms: ['breve', 'reducido'], antonyms: ['largo', 'extenso'] },
  'ancho': { synonyms: ['amplio', 'espacioso'], antonyms: ['estrecho', 'angosto'] },
  'estrecho': { synonyms: ['angosto', 'ajustado'], antonyms: ['ancho', 'amplio'] },
  'gordo': { synonyms: ['obeso', 'grueso', 'corpulento'], antonyms: ['delgado', 'flaco', 'esbelto'] },
  'delgado': { synonyms: ['flaco', 'esbelto', 'fino'], antonyms: ['gordo', 'grueso', 'obeso'] },
  'enorme': { synonyms: ['gigante', 'inmenso', 'colosal'], antonyms: ['diminuto', 'minúsculo', 'pequeño'] },
  'diminuto': { synonyms: ['minúsculo', 'pequeñito', 'microscópico'], antonyms: ['enorme', 'gigante', 'inmenso'] },
  'mediaño': { synonyms: ['regular', 'intermedio'], antonyms: ['extremo'] },

  // ============================================
  // ADJECTIVES - Colors
  // ============================================
  'claro': { synonyms: ['luminoso', 'pálido', 'brillante'], antonyms: ['oscuro', 'sombrío'] },
  'oscuro': { synonyms: ['sombrío', 'tenebroso', 'opaco'], antonyms: ['claro', 'luminoso', 'brillante'] },
  'negro': { antonyms: ['blanco'] },
  'blanco': { antonyms: ['negro'] },
  'dorado': { synonyms: ['áureo'] },
  'plateado': { synonyms: ['argentádo'] },

  // ============================================
  // ADJECTIVES - Personality & Character
  // ============================================
  'bueno': { synonyms: ['bondadoso', 'amable', 'benevolente'], antonyms: ['malo', 'malvado', 'perverso'] },
  'malo': { synonyms: ['malvado', 'perverso', 'dañino'], antonyms: ['bueno', 'bondadoso', 'benevolente'] },
  'amable': { synonyms: ['simpático', 'cordial', 'afable'], antonyms: ['antipático', 'grosero', 'desagradable'] },
  'simpático': { synonyms: ['amable', 'agradable', 'encantador'], antonyms: ['antipático', 'desagradable'] },
  'antipático': { synonyms: ['desagradable', 'grosero', 'hostil'], antonyms: ['simpático', 'amable', 'agradable'] },
  'inteligente': { synonyms: ['listo', 'astuto', 'brillante'], antonyms: ['tonto', 'estúpido', 'necio'] },
  'tonto': { synonyms: ['estúpido', 'bobo', 'necio'], antonyms: ['inteligente', 'listo', 'astuto'] },
  'trabajador': { synonyms: ['diligente', 'aplicado', 'laborioso'], antonyms: ['perezoso', 'vago', 'holgazán'] },
  'perezoso': { synonyms: ['vago', 'holgazán', 'ocioso'], antonyms: ['trabajador', 'diligente', 'activo'] },
  'generoso': { synonyms: ['dadivoso', 'esplendido', 'altruista'], antonyms: ['tacáño', 'avaro', 'mezquino'] },
  'tacáño': { synonyms: ['avaro', 'mezquino', 'cicatero'], antonyms: ['generoso', 'dadivoso', 'esplendido'] },
  'honesto': { synonyms: ['sincero', 'recto', 'íntegro'], antonyms: ['deshonesto', 'mentiroso', 'falso'] },
  'timido': { synonyms: ['vergonzoso', 'reservado', 'cohibido'], antonyms: ['atrevido', 'audaz', 'extrovertido'] },
  'valiente': { synonyms: ['valeroso', 'audaz', 'intrépido'], antonyms: ['cobarde', 'miedoso', 'temeroso'] },
  'cobarde': { synonyms: ['miedoso', 'pusilánime', 'temeroso'], antonyms: ['valiente', 'audaz', 'valeroso'] },
  'serio': { synonyms: ['formal', 'solemne', 'grave'], antonyms: ['divertido', 'gracioso', 'bromista'] },
  'divertido': { synonyms: ['gracioso', 'cómico', 'entretenido'], antonyms: ['aburrido', 'serio', 'tedioso'] },
  'aburrido': { synonyms: ['tedioso', 'monótono', 'pesado'], antonyms: ['divertido', 'entretenido', 'interesante'] },
  'tranquilo': { synonyms: ['calmado', 'sereno', 'pacífico'], antonyms: ['nervioso', 'inquieto', 'agitado'] },
  'nervioso': { synonyms: ['inquieto', 'ansioso', 'agitado'], antonyms: ['tranquilo', 'calmado', 'sereno'] },
  'responsable': { synonyms: ['serio', 'confiable', 'formal'], antonyms: ['irresponsable', 'informal'] },
  'irresponsable': { synonyms: ['informal', 'descuidado'], antonyms: ['responsable', 'serio', 'confiable'] },

  // ============================================
  // ADJECTIVES - Emotions & States
  // ============================================
  'feliz': { synonyms: ['contento', 'alegre', 'dichoso'], antonyms: ['triste', 'infeliz', 'desgraciado'] },
  'triste': { synonyms: ['apenado', 'afligido', 'melancólico'], antonyms: ['feliz', 'alegre', 'contento'] },
  'contento': { synonyms: ['satisfecho', 'feliz', 'alegre'], antonyms: ['descontento', 'triste', 'infeliz'] },
  'enojado': { synonyms: ['enfadado', 'furioso', 'irritado'], antonyms: ['contento', 'calmado', 'tranquilo'] },
  'enfadado': { synonyms: ['enojado', 'molesto', 'irritado'], antonyms: ['contento', 'tranquilo', 'feliz'] },
  'preocupado': { synonyms: ['inquieto', 'angustiado', 'ansioso'], antonyms: ['tranquilo', 'despreocupado', 'relajado'] },
  'sorprendido': { synonyms: ['asombrado', 'atónito', 'pasmado'], antonyms: ['indiferente'] },
  'asustado': { synonyms: ['aterrorizado', 'espantado', 'atemorizado'], antonyms: ['tranquilo', 'sereno', 'valiente'] },
  'emocionado': { synonyms: ['entusiasmado', 'ilusiónado', 'exaltado'], antonyms: ['indiferente', 'apático', 'desanimado'] },
  'cansado': { synonyms: ['agotado', 'fatigado', 'exhausto'], antonyms: ['descansado', 'energético', 'fresco'] },
  'ocupado': { synonyms: ['atareado', 'activo'], antonyms: ['libre', 'desocupado', 'disponible'] },
  'confundido': { synonyms: ['perplejo', 'desconcertado', 'desorientado'], antonyms: ['seguro', 'claro', 'decidido'] },
  'seguro': { synonyms: ['confiado', 'cierto', 'convencido'], antonyms: ['inseguro', 'dudoso', 'incierto'] },
  'orgulloso': { synonyms: ['satisfecho', 'ufaño'], antonyms: ['avergonzado', 'humilde'] },
  'avergonzado': { synonyms: ['apenado', 'sonrojado'], antonyms: ['orgulloso', 'satisfecho'] },

  // ============================================
  // ADJECTIVES - Physical Appearance
  // ============================================
  'guapo': { synonyms: ['atractivo', 'apuesto', 'bello'], antonyms: ['feo', 'horrible'] },
  'bonito': { synonyms: ['lindo', 'hermoso', 'bello'], antonyms: ['feo', 'horrible', 'espantoso'] },
  'hermoso': { synonyms: ['bello', 'precioso', 'magnífico'], antonyms: ['feo', 'horrible', 'espantoso'] },
  'feo': { synonyms: ['horrible', 'espantoso', 'desagradable'], antonyms: ['bonito', 'hermoso', 'bello'] },
  'joven': { synonyms: ['juvenil', 'mocito'], antonyms: ['viejo', 'anciaño', 'mayor'] },
  'viejo': { synonyms: ['anciaño', 'mayor', 'antiguo'], antonyms: ['joven', 'nuevo', 'moderno'] },
  'nuevo': { synonyms: ['reciente', 'moderno', 'fresco'], antonyms: ['viejo', 'antiguo', 'usado'] },
  'fuerte': { synonyms: ['robusto', 'potente', 'vigoroso'], antonyms: ['debil', 'flojo', 'fragil'] },
  'debil': { synonyms: ['flojo', 'fragil', 'endeble'], antonyms: ['fuerte', 'robusto', 'potente'] },
  'saño': { synonyms: ['saludable', 'bien'], antonyms: ['enfermo', 'malo'] },
  'enfermo': { synonyms: ['malo', 'doliente', 'indispuesto'], antonyms: ['saño', 'saludable'] },
  'rubio': { antonyms: ['moreno', 'negro'] },
  'moreno': { antonyms: ['rubio', 'pálido'] },

  // ============================================
  // ADJECTIVES - Quality & Condition
  // ============================================
  'fácil': { synonyms: ['sencillo', 'simple', 'elemental'], antonyms: ['difícil', 'complicado', 'arduo'] },
  'difícil': { synonyms: ['complicado', 'duro', 'arduo'], antonyms: ['fácil', 'sencillo', 'simple'] },
  'importante': { synonyms: ['relevante', 'significativo', 'trascendente'], antonyms: ['insignificante', 'trivial'] },
  'necesario': { synonyms: ['indispensable', 'esencial', 'preciso'], antonyms: ['innecesario', 'superfluo'] },
  'posible': { synonyms: ['factible', 'viable', 'realizable'], antonyms: ['imposible', 'irrealizable'] },
  'imposible': { synonyms: ['irrealizable', 'inalcanzable'], antonyms: ['posible', 'factible', 'viable'] },
  'perfecto': { synonyms: ['ideal', 'impecable', 'excelente'], antonyms: ['imperfecto', 'defectuoso'] },
  'excelente': { synonyms: ['magnífico', 'sobresaliente', 'estupendo'], antonyms: ['pésimo', 'terrible', 'malo'] },
  'terrible': { synonyms: ['horrible', 'espantoso', 'pésimo'], antonyms: ['excelente', 'maravilloso'] },
  'normal': { synonyms: ['común', 'corriente', 'habitual'], antonyms: ['raro', 'extraño', 'añormal'] },
  'especial': { synonyms: ['singular', 'único', 'extraordinario'], antonyms: ['común', 'normal', 'corriente'] },
  'común': { synonyms: ['corriente', 'ordinario', 'habitual'], antonyms: ['raro', 'especial', 'único'] },
  'raro': { synonyms: ['extraño', 'inusual', 'peculiar'], antonyms: ['común', 'normal', 'frecuente'] },
  'diferente': { synonyms: ['distinto', 'diverso', 'otro'], antonyms: ['igual', 'idéntico', 'mismo'] },
  'igual': { synonyms: ['idéntico', 'mismo', 'equivalente'], antonyms: ['diferente', 'distinto', 'diverso'] },
  'similar': { synonyms: ['parecido', 'semejante', 'análogo'], antonyms: ['diferente', 'distinto'] },
  'verdadero': { synonyms: ['real', 'auténtico', 'cierto'], antonyms: ['falso', 'ficticio', 'mentiroso'] },
  'falso': { synonyms: ['ficticio', 'mentiroso', 'inexacto'], antonyms: ['verdadero', 'real', 'auténtico'] },
  'correcto': { synonyms: ['acertado', 'exacto', 'adecuado'], antonyms: ['incorrecto', 'erróneo', 'equivocado'] },
  'incorrecto': { synonyms: ['erróneo', 'equivocado', 'inexacto'], antonyms: ['correcto', 'acertado', 'exacto'] },
  'abierto': { synonyms: ['destapado', 'franco'], antonyms: ['cerrado', 'clausurado'] },
  'cerrado': { synonyms: ['clausurado', 'tapado'], antonyms: ['abierto', 'destapado'] },
  'libre': { synonyms: ['independiente', 'suelto'], antonyms: ['ocupado', 'preso', 'atado'] },
  'disponible': { synonyms: ['accesible', 'libre'], antonyms: ['ocupado', 'no disponible'] },
  'caro': { synonyms: ['costoso', 'valioso'], antonyms: ['barato', 'economico'] },
  'barato': { synonyms: ['economico', 'asequible'], antonyms: ['caro', 'costoso'] },
  'favorito': { synonyms: ['preferido', 'predilecto'] },
  'popular': { synonyms: ['conocido', 'celebre'], antonyms: ['desconocido', 'impopular'] },
  'famoso': { synonyms: ['celebre', 'conocido', 'renombrado'], antonyms: ['desconocido', 'añonimo'] },

  // ============================================
  // ADJECTIVES - Temperature & Sensations
  // ============================================
  'caliente': { synonyms: ['ardiente', 'calido', 'hirviente'], antonyms: ['frío', 'helado', 'gelido'] },
  'frío': { synonyms: ['helado', 'gelido', 'glacial'], antonyms: ['caliente', 'calido', 'tibio'] },
  'tibio': { synonyms: ['templado', 'calido'], antonyms: ['frío', 'helado'] },
  'fresco': { synonyms: ['refrescante', 'nuevo'], antonyms: ['caliente', 'viejo'] },
  'seco': { synonyms: ['árido', 'desiértico'], antonyms: ['mojado', 'húmedo'] },
  'mojado': { synonyms: ['húmedo', 'empapado'], antonyms: ['seco', 'árido'] },
  'suave': { synonyms: ['blando', 'tierno', 'delicado'], antonyms: ['duro', 'áspero', 'rígido'] },
  'duro': { synonyms: ['firme', 'resistente', 'rígido'], antonyms: ['blando', 'suave', 'tierno'] },
  'limpio': { synonyms: ['aseado', 'pulcro', 'higienico'], antonyms: ['sucio', 'manchado', 'mugriento'] },
  'sucio': { synonyms: ['manchado', 'mugriento', 'inmundo'], antonyms: ['limpio', 'aseado', 'pulcro'] },

  // ============================================
  // ADJECTIVES - Food & Taste
  // ============================================
  'delicioso': { synonyms: ['sabroso', 'exquisito', 'rico'], antonyms: ['asqueroso', 'horrible', 'malo'] },
  'rico': { synonyms: ['sabroso', 'delicioso', 'exquisito'], antonyms: ['malo', 'insipido'] },
  'dulce': { synonyms: ['azucarado', 'meloso'], antonyms: ['amargo', 'agrio', 'salado'] },
  'salado': { synonyms: ['sazonado'], antonyms: ['dulce', 'insipido'] },
  'amargo': { synonyms: ['acre'], antonyms: ['dulce', 'azucarado'] },
  'picante': { synonyms: ['condimentado'], antonyms: ['suave', 'insipido'] },
  'agrio': { synonyms: ['acido', 'avinagrado'], antonyms: ['dulce'] },

  // ============================================
  // ADJECTIVES - Speed & Time
  // ============================================
  'rápido': { synonyms: ['veloz', 'pronto', 'acelerado'], antonyms: ['lento', 'despacio', 'pausado'] },
  'lento': { synonyms: ['pausado', 'despacio', 'tardo'], antonyms: ['rápido', 'veloz', 'pronto'] },
  'tempraño': { synonyms: ['pronto', 'adelantado'], antonyms: ['tarde', 'retrasado'] },
  'tarde': { synonyms: ['retrasado', 'atrásado'], antonyms: ['tempraño', 'pronto'] },
  'próximo': { synonyms: ['siguiente', 'cercaño'], antonyms: ['anterior', 'pasado'] },
  'último': { synonyms: ['final', 'postrero'], antonyms: ['primero', 'inicial'] },
  'primero': { synonyms: ['inicial', 'principal'], antonyms: ['último', 'final'] },

  // ============================================
  // ADJECTIVES - Position & Quantity
  // ============================================
  'cercaño': { synonyms: ['próximo', 'inmediato'], antonyms: ['lejaño', 'distante', 'remoto'] },
  'lejaño': { synonyms: ['distante', 'remoto', 'apartado'], antonyms: ['cercaño', 'próximo'] },
  'derecho': { synonyms: ['recto', 'directo'], antonyms: ['izquierdo', 'torcido'] },
  'izquierdo': { antonyms: ['derecho'] },
  'interior': { synonyms: ['interno', 'de adentro'], antonyms: ['exterior', 'externo'] },
  'exterior': { synonyms: ['externo', 'de afuera'], antonyms: ['interior', 'interno'] },
  'superior': { synonyms: ['alto', 'mejor'], antonyms: ['inferior', 'bajo', 'peor'] },
  'inferior': { synonyms: ['bajo', 'peor'], antonyms: ['superior', 'alto', 'mejor'] },
  'mucho': { synonyms: ['bastante', 'abundante'], antonyms: ['poco', 'escaso'] },
  'poco': { synonyms: ['escaso', 'reducido'], antonyms: ['mucho', 'abundante'] },
  'bastante': { synonyms: ['suficiente', 'considerable'], antonyms: ['poco', 'insuficiente'] },
  'demasiado': { synonyms: ['excesivo', 'exagerado'], antonyms: ['poco', 'insuficiente'] },
  'suficiente': { synonyms: ['bastante', 'adecuado'], antonyms: ['insuficiente', 'escaso'] },
  'lleno': { synonyms: ['repleto', 'completo', 'colmado'], antonyms: ['vacío', 'desocupado'] },
  'vacío': { synonyms: ['desocupado', 'hueco'], antonyms: ['lleno', 'repleto', 'completo'] },
  'completo': { synonyms: ['entero', 'total', 'íntegro'], antonyms: ['incompleto', 'parcial'] },

  // ============================================
  // VERBS - Common Actions
  // ============================================
  'ser': { synonyms: ['existir'] },
  'estar': { synonyms: ['encontrarse', 'hallarse'] },
  'tener': { synonyms: ['poseer', 'contar con'] },
  'hacer': { synonyms: ['realizar', 'efectuar', 'crear'] },
  'ir': { synonyms: ['partir', 'marchar', 'dirigirse'], antonyms: ['venir', 'llegar', 'regresar'] },
  'venir': { synonyms: ['llegar', 'acudir', 'acercarse'], antonyms: ['ir', 'partir', 'marcharse'] },
  'poder': { synonyms: ['lograr', 'conseguir'] },
  'decir': { synonyms: ['expresar', 'manifestar', 'comunicar'], antonyms: ['callar', 'silenciar'] },
  'ver': { synonyms: ['mirar', 'observar', 'contemplar'] },
  'dar': { synonyms: ['entregar', 'ofrecer', 'otorgar'], antonyms: ['recibir', 'tomar', 'quitar'] },
  'saber': { synonyms: ['conocer', 'entender'], antonyms: ['ignorar', 'desconocer'] },
  'querer': { synonyms: ['desear', 'anhelar', 'amar'], antonyms: ['rechazar', 'odiar'] },
  'llegar': { synonyms: ['arribar', 'alcanzar', 'venir'], antonyms: ['partir', 'salir', 'irse'] },
  'pasar': { synonyms: ['transcurrir', 'ocurrir', 'suceder'] },
  'deber': { synonyms: ['tener qué'] },
  'poner': { synonyms: ['colocar', 'situar', 'ubicar'], antonyms: ['quitar', 'sacár'] },
  'parecer': { synonyms: ['aparentar', 'lucir', 'verse'] },
  'quedar': { synonyms: ['permanecer', 'quedarse'] },
  'creer': { synonyms: ['pensar', 'opinar', 'considerar'], antonyms: ['dudar', 'desconfiar'] },
  'hablar': { synonyms: ['conversar', 'platicar', 'charlar'], antonyms: ['callar', 'silenciar'] },
  'llevar': { synonyms: ['transportar', 'cargar', 'portar'], antonyms: ['traer'] },
  'traer': { synonyms: ['aportar', 'acercar'], antonyms: ['llevar'] },
  'dejar': { synonyms: ['abandonar', 'soltar'], antonyms: ['tomar', 'coger', 'agarrar'] },
  'seguir': { synonyms: ['continuar', 'proseguir'], antonyms: ['parar', 'detenerse'] },
  'encontrar': { synonyms: ['hallar', 'descubrir', 'localizar'], antonyms: ['perder'] },
  'llamar': { synonyms: ['nombrar', 'denominar'] },
  'pensar': { synonyms: ['reflexionar', 'meditar', 'considerar'] },
  'salir': { synonyms: ['partir', 'marcharse', 'irse'], antonyms: ['entrar', 'llegar'] },
  'entrar': { synonyms: ['ingresar', 'acceder', 'penetrar'], antonyms: ['salir', 'partir'] },
  'volver': { synonyms: ['regresar', 'retornar', 'tornar'], antonyms: ['ir', 'partir'] },
  'tomar': { synonyms: ['coger', 'agarrar', 'asir'], antonyms: ['soltar', 'dejar'] },
  'conocer': { synonyms: ['saber', 'reconocer'], antonyms: ['desconocer', 'ignorar'] },
  'vivir': { synonyms: ['existir', 'habitar', 'residir'], antonyms: ['morir'] },
  'morir': { synonyms: ['fallecer', 'perecer', 'expirar'], antonyms: ['nacer', 'vivir'] },
  'nacer': { synonyms: ['surgir', 'originarse'], antonyms: ['morir', 'fallecer'] },
  'sentir': { synonyms: ['percibir', 'experimentar', 'notar'] },
  'tratar': { synonyms: ['intentar', 'procurar'] },
  'mirar': { synonyms: ['observar', 'ver', 'contemplar'] },
  'contar': { synonyms: ['narrar', 'relatar', 'enumerar'] },
  'empezar': { synonyms: ['comenzar', 'iniciar', 'principiar'], antonyms: ['terminar', 'acábar', 'finalizar'] },
  'comenzar': { synonyms: ['empezar', 'iniciar', 'principiar'], antonyms: ['terminar', 'acábar', 'finalizar'] },
  'terminar': { synonyms: ['acábar', 'finalizar', 'concluir'], antonyms: ['empezar', 'comenzar', 'iniciar'] },
  'acábar': { synonyms: ['terminar', 'finalizar', 'concluir'], antonyms: ['empezar', 'comenzar'] },
  'esperar': { synonyms: ['aguardar', 'desear'] },
  'buscar': { synonyms: ['indagar', 'rastrear', 'investigar'], antonyms: ['encontrar', 'hallar'] },
  'existir': { synonyms: ['ser', 'haber', 'vivir'] },
  'escribir': { synonyms: ['redactar', 'componer'] },
  'leer': { synonyms: ['estudiar', 'repasar'] },
  'perder': { synonyms: ['extraviar'], antonyms: ['encontrar', 'hallar', 'ganar'] },
  'ganar': { synonyms: ['obtener', 'conseguir', 'lograr'], antonyms: ['perder'] },
  'aparecer': { synonyms: ['surgir', 'presentarse', 'manifestarse'], antonyms: ['desaparecer'] },
  'desaparecer': { synonyms: ['esfumarse', 'perderse'], antonyms: ['aparecer', 'surgir'] },
  'crear': { synonyms: ['producir', 'inventar', 'generar'], antonyms: ['destruir'] },
  'destruir': { synonyms: ['demoler', 'arruinar', 'devastar'], antonyms: ['crear', 'construir'] },
  'cambiar': { synonyms: ['modificar', 'alterar', 'transformar'], antonyms: ['mantener', 'conservar'] },
  'mantener': { synonyms: ['conservar', 'preservar', 'sostener'], antonyms: ['cambiar', 'abandonar'] },
  'abrir': { synonyms: ['destapar', 'descubrir'], antonyms: ['cerrar', 'clausurar'] },
  'cerrar': { synonyms: ['clausurar', 'tapar'], antonyms: ['abrir', 'destapar'] },
  'subir': { synonyms: ['ascender', 'elevar', 'trepar'], antonyms: ['bajar', 'descender'] },
  'bajar': { synonyms: ['descender', 'disminuir'], antonyms: ['subir', 'ascender'] },
  'comprar': { synonyms: ['adquirir', 'obtener'], antonyms: ['vender'] },
  'vender': { synonyms: ['comerciar'], antonyms: ['comprar', 'adquirir'] },
  'recibir': { synonyms: ['obtener', 'aceptar', 'admitir'], antonyms: ['dar', 'entregar'] },
  'recordar': { synonyms: ['acordarse', 'rememorar', 'evocar'], antonyms: ['olvidar'] },
  'olvidar': { synonyms: ['descuidar'], antonyms: ['recordar', 'acordarse'] },
  'dormir': { synonyms: ['descansar', 'reposar'], antonyms: ['despertar', 'levantarse'] },
  'despertar': { synonyms: ['levantarse'], antonyms: ['dormir', 'dormirse'] },
  'reír': { synonyms: ['carcajearse'], antonyms: ['llorar'] },
  'llorar': { synonyms: ['sollozar', 'lamentarse'], antonyms: ['reír'] },
  'callar': { synonyms: ['silenciar', 'enmudecer'], antonyms: ['hablar', 'decir'] },
  'preguntar': { synonyms: ['interrogar', 'consultar'], antonyms: ['responder', 'contestar'] },
  'responder': { synonyms: ['contestar', 'replicar'], antonyms: ['preguntar'] },
  'amar': { synonyms: ['querer', 'adorar', 'estimar'], antonyms: ['odiar', 'detestar'] },
  'odiar': { synonyms: ['detestar', 'aborrecer', 'despreciar'], antonyms: ['amar', 'querer', 'adorar'] },
  'ayudar': { synonyms: ['auxiliar', 'asistir', 'colaborar'], antonyms: ['perjudicar', 'danar'] },
  'trabajar': { synonyms: ['laborar', 'ocuparse'] },
  'jugar': { synonyms: ['divertirse', 'entretenerse'] },
  'correr': { synonyms: ['trotar', 'apresurarse'], antonyms: ['caminar', 'pasear'] },
  'caminar': { synonyms: ['andar', 'pasear'], antonyms: ['correr', 'detenerse'] },
  'caer': { synonyms: ['desplomarse', 'precipitarse'], antonyms: ['levantarse'] },
  'levantar': { synonyms: ['alzar', 'elevar', 'erguir'], antonyms: ['bajar'] },
  'sentar': { synonyms: ['acomodar'], antonyms: ['levantar', 'parar'] },
  'aprender': { synonyms: ['estudiar', 'instruirse'], antonyms: ['olvidar', 'ignorar'] },
  'enseñar': { synonyms: ['instruir', 'educar', 'mostrar'] },
  'comer': { synonyms: ['alimentarse', 'ingerir'] },
  'beber': { synonyms: ['tomar', 'ingerir'] },
  'cocinar': { synonyms: ['preparar', 'guisar'] },

  // ============================================
  // ADVERBS - Time
  // ============================================
  'ahora': { synonyms: ['actualmente', 'en este momento'], antonyms: ['luego', 'después'] },
  'hoy': { antonyms: ['ayer', 'mañana'] },
  'ayer': { antonyms: ['hoy', 'mañana'] },
  'mañana': { antonyms: ['ayer', 'hoy'] },
  'antes': { synonyms: ['anteriormente', 'previamente'], antonyms: ['después', 'luego'] },
  'después': { synonyms: ['luego', 'posteriormente'], antonyms: ['antes', 'anteriormente'] },
  'pronto': { synonyms: ['enseguida', 'rápidamente'], antonyms: ['tarde'] },
  'todavía': { synonyms: ['aun'] },
  'ya': { synonyms: ['ahora mismo'] },
  'nunca': { synonyms: ['jamas'], antonyms: ['siempre'] },
  'siempre': { synonyms: ['constantemente', 'perpetuamente'], antonyms: ['nunca', 'jamas'] },
  'luego': { synonyms: ['después', 'posteriormente'], antonyms: ['antes'] },
  'entonces': { synonyms: ['luego', 'por tanto'] },

  // ============================================
  // ADVERBS - Frequency
  // ============================================
  'frecuentemente': { synonyms: ['a menudo', 'seguido'], antonyms: ['raramente', 'pocas veces'] },
  'raramente': { synonyms: ['pocas veces', 'rara vez'], antonyms: ['frecuentemente', 'a menudo'] },
  'normalmente': { synonyms: ['generalmente', 'usualmente'] },
  'generalmente': { synonyms: ['normalmente', 'usualmente'] },

  // ============================================
  // ADVERBS - Manner
  // ============================================
  'bien': { synonyms: ['correctamente', 'adecuadamente'], antonyms: ['mal', 'incorrectamente'] },
  'mal': { synonyms: ['incorrectamente', 'equivocadamente'], antonyms: ['bien', 'correctamente'] },
  'rápidamente': { synonyms: ['velozmente', 'pronto'], antonyms: ['lentamente', 'despacio'] },
  'lentamente': { synonyms: ['despacio', 'pausadamente'], antonyms: ['rápidamente', 'velozmente'] },
  'fácilmente': { synonyms: ['sencillamente'], antonyms: ['difícilmente'] },
  'difícilmente': { synonyms: ['apenas'], antonyms: ['fácilmente'] },
  'claramente': { synonyms: ['evidentemente', 'obviamente'] },
  'tranquilamente': { synonyms: ['calmadamente', 'serenamente'] },
  'completamente': { synonyms: ['totalmente', 'enteramente'], antonyms: ['parcialmente'] },
  'perfectamente': { synonyms: ['impecablemente'] },

  // ============================================
  // ADVERBS - Place
  // ============================================
  'aquí': { synonyms: ['acá'], antonyms: ['allí', 'allá'] },
  'allí': { synonyms: ['allá'], antonyms: ['aquí', 'acá'] },
  'acá': { synonyms: ['aquí'], antonyms: ['allá', 'allí'] },
  'allá': { synonyms: ['allí'], antonyms: ['acá', 'aquí'] },
  'cerca': { synonyms: ['próximo'], antonyms: ['lejos', 'distante'] },
  'lejos': { synonyms: ['distante'], antonyms: ['cerca', 'próximo'] },
  'dentro': { synonyms: ['adentro', 'en el interior'], antonyms: ['fuera', 'afuera'] },
  'fuera': { synonyms: ['afuera', 'en el exterior'], antonyms: ['dentro', 'adentro'] },
  'arriba': { synonyms: ['encima'], antonyms: ['abajo', 'debajo'] },
  'abajo': { synonyms: ['debajo'], antonyms: ['arriba', 'encima'] },
  'adelante': { synonyms: ['enfrente', 'al frente'], antonyms: ['atrás', 'detrás'] },
  'atrás': { synonyms: ['detrás'], antonyms: ['adelante', 'enfrente'] },
  'encima': { synonyms: ['arriba', 'sobre'], antonyms: ['debajo', 'bajo'] },
  'debajo': { synonyms: ['abajo', 'bajo'], antonyms: ['encima', 'arriba'] },

  // ============================================
  // ADVERBS - Quantity/Degree
  // ============================================
  'muy': { synonyms: ['bastante', 'sumamente'] },
  'más': { antonyms: ['menos'] },
  'menos': { antonyms: ['más'] },
  'casi': { synonyms: ['aproximadamente'] },
  'solo': { synonyms: ['unicamente', 'solamente'] },
  'totalmente': { synonyms: ['completamente', 'enteramente'], antonyms: ['parcialmente'] },
  'nada': { antonyms: ['todo', 'mucho'] },
  'algo': { synonyms: ['un poco'] },

  // ============================================
  // ADVERBS - Affirmation/Negation
  // ============================================
  'si': { antonyms: ['no'] },
  'no': { antonyms: ['si'] },
  'también': { synonyms: ['igualmente', 'además'], antonyms: ['tampoco'] },
  'tampoco': { antonyms: ['también'] },
  'quizas': { synonyms: ['tal vez', 'probablemente', 'acáso'] },
  'probablemente': { synonyms: ['posiblemente', 'quizas'] },
  'seguramente': { synonyms: ['ciertamente', 'indudablemente'] },
  'realmente': { synonyms: ['verdaderamente', 'efectivamente'] },

  // ============================================
  // NOUNS - Family
  // ============================================
  'padre': { synonyms: ['papá', 'progenitor'], antonyms: ['madre'] },
  'madre': { synonyms: ['mama', 'progenitora'], antonyms: ['padre'] },
  'hijo': { antonyms: ['hija'] },
  'hija': { antonyms: ['hijo'] },
  'hermaño': { antonyms: ['hermana'] },
  'hermana': { antonyms: ['hermaño'] },
  'abuelo': { antonyms: ['abuela'] },
  'abuela': { antonyms: ['abuelo'] },
  'tío': { antonyms: ['tía'] },
  'tía': { antonyms: ['tío'] },
  'primo': { antonyms: ['prima'] },
  'prima': { antonyms: ['primo'] },
  'sobrino': { antonyms: ['sobrina'] },
  'sobrina': { antonyms: ['sobrino'] },
  'nieto': { antonyms: ['nieta'] },
  'nieta': { antonyms: ['nieto'] },
  'esposo': { synonyms: ['marido'], antonyms: ['esposa'] },
  'esposa': { synonyms: ['mujer'], antonyms: ['esposo'] },
  'suegro': { antonyms: ['suegra'] },
  'suegra': { antonyms: ['suegro'] },
  'cunado': { antonyms: ['cunada'] },
  'cunada': { antonyms: ['cunado'] },
  'padrino': { antonyms: ['madrina'] },
  'madrina': { antonyms: ['padrino'] },
  'niño': { synonyms: ['chico', 'muchacho'], antonyms: ['niña', 'adulto'] },
  'niña': { synonyms: ['chica', 'muchacha'], antonyms: ['niño', 'adulta'] },
  'bebe': { synonyms: ['nene', 'criatura'] },

  // ============================================
  // NOUNS - Food & Meals
  // ============================================
  'comida': { synonyms: ['alimento', 'vianda'] },
  'desayuno': { antonyms: ['cena'] },
  'almuerzo': { synonyms: ['comida'] },
  'cena': { antonyms: ['desayuno'] },
  'agua': { synonyms: ['liquido'] },
  'café': { synonyms: ['cafecito'] },
  'cerveza': { synonyms: ['birra'] },

  // ============================================
  // NOUNS - Animals
  // ============================================
  'perro': { synonyms: ['can', 'chucho'], antonyms: ['gato'] },
  'gato': { synonyms: ['minino', 'felino'], antonyms: ['perro'] },
  'pájaro': { synonyms: ['ave'] },
  'gallína': { antonyms: ['gallo'] },
  'gallo': { antonyms: ['gallína'] },
  'león': { synonyms: ['rey de la selva'] },
  'raton': { synonyms: ['ratoncito'] },

  // ============================================
  // NOUNS - Body Parts
  // ============================================
  'cabeza': { synonyms: ['craneo'] },
  'maño': { synonyms: ['palma'] },
  'pie': { synonyms: ['pata'] },
  'ojo': { synonyms: ['vista'] },

  // ============================================
  // NOUNS - Places
  // ============================================
  'casa': { synonyms: ['hogar', 'vivienda', 'residencia'] },
  'apartamento': { synonyms: ['piso', 'departamento'] },
  'ciudad': { synonyms: ['urbe', 'metrópolis'], antonyms: ['campo', 'pueblo'] },
  'pueblo': { synonyms: ['aldea', 'villa'], antonyms: ['ciudad'] },
  'tienda': { synonyms: ['comercio', 'almacén'] },
  'calle': { synonyms: ['via', 'avenida'] },
  'parque': { synonyms: ['jardín', 'plaza'] },
  'playa': { synonyms: ['costa', 'litoral'] },
  'montaña': { synonyms: ['cerro', 'monte'], antonyms: ['valle'] },
  'valle': { antonyms: ['montaña'] },
  'río': { synonyms: ['corriente', 'arroyo'] },
  'mar': { synonyms: ['oceaño'] },
  'bosque': { synonyms: ['selva', 'floresta'] },
  'campo': { antonyms: ['ciudad'] },

  // ============================================
  // NOUNS - Time
  // ============================================
  'día': { antonyms: ['noche'] },
  'noche': { antonyms: ['día'] },
  'hora': { synonyms: ['momento', 'tiempo'] },
  'semana': { synonyms: ['septena'] },
  'mes': { synonyms: ['mensualidad'] },
  'año': { synonyms: ['anualidad'] },
  'primavera': { antonyms: ['otoño'] },
  'veraño': { antonyms: ['invierno'] },
  'otoño': { antonyms: ['primavera'] },
  'invierno': { antonyms: ['veraño'] },

  // ============================================
  // NOUNS - Weather
  // ============================================
  'sol': { antonyms: ['luna', 'lluvia'] },
  'luna': { antonyms: ['sol'] },
  'lluvia': { synonyms: ['precipitacion'], antonyms: ['sol', 'sequía'] },
  'nieve': { synonyms: ['nevada'] },
  'viento': { synonyms: ['brisa', 'aire'] },
  'tormenta': { synonyms: ['tempestad', 'temporal'] },
  'calor': { antonyms: ['frío'] },

  // ============================================
  // NOUNS - Emotions & Abstract
  // ============================================
  'amor': { synonyms: ['cariño', 'afecto', 'querer'], antonyms: ['odio'] },
  'odio': { synonyms: ['rencor', 'aversion'], antonyms: ['amor', 'cariño'] },
  'felicidad': { synonyms: ['dicha', 'alegría', 'gozo'], antonyms: ['tristeza', 'infelicidad'] },
  'tristeza': { synonyms: ['pena', 'dolor', 'melancolía'], antonyms: ['felicidad', 'alegría'] },
  'alegría': { synonyms: ['felicidad', 'gozo', 'jubilo'], antonyms: ['tristeza', 'pena'] },
  'miedo': { synonyms: ['temor', 'pavor', 'terror'], antonyms: ['valor', 'coraje'] },
  'sorpresa': { synonyms: ['asombro'] },
  'enojo': { synonyms: ['enfado', 'ira', 'rabia'], antonyms: ['calma', 'tranquilidad'] },
  'esperanza': { synonyms: ['ilusión', 'fe'], antonyms: ['desesperanza'] },
  'paz': { synonyms: ['tranquilidad', 'calma', 'serenidad'], antonyms: ['guerra', 'conflicto'] },
  'guerra': { synonyms: ['conflicto', 'combate'], antonyms: ['paz'] },
  'vida': { synonyms: ['existencia'], antonyms: ['muerte'] },
  'muerte': { synonyms: ['fallecimiento', 'deceso'], antonyms: ['vida', 'nacimiento'] },
  'verdad': { synonyms: ['realidad', 'certeza'], antonyms: ['mentira', 'falsedad'] },
  'mentira': { synonyms: ['falsedad', 'embuste'], antonyms: ['verdad'] },
  'ruido': { synonyms: ['sonido', 'estruendo'], antonyms: ['silencio'] },
  'silencio': { synonyms: ['quietud', 'calma'], antonyms: ['ruido'] },
  'luz': { synonyms: ['claridad', 'luminosidad'], antonyms: ['oscuridad', 'sombra'] },
  'oscuridad': { synonyms: ['sombra', 'tinieblas'], antonyms: ['luz', 'claridad'] },
  'principio': { synonyms: ['inicio', 'comienzo', 'origen'], antonyms: ['fin', 'final'] },
  'fin': { synonyms: ['final', 'terminó', 'conclusion'], antonyms: ['principio', 'inicio'] },
  'pregunta': { synonyms: ['cuestión', 'interrogante'], antonyms: ['respuesta'] },
  'respuesta': { synonyms: ['contestacion', 'replica'], antonyms: ['pregunta'] },
  'problema': { synonyms: ['dificultad', 'conflicto'], antonyms: ['solución'] },
  'solución': { synonyms: ['respuesta', 'remedio'], antonyms: ['problema'] },
  'entrada': { synonyms: ['acceso', 'ingreso'], antonyms: ['salida'] },
  'salida': { synonyms: ['egreso'], antonyms: ['entrada'] },

  // ============================================
  // NOUNS - Professions
  // ============================================
  'doctor': { synonyms: ['médico', 'facultativo'], antonyms: ['doctora'] },
  'doctora': { synonyms: ['médica'], antonyms: ['doctor'] },
  'profesor': { synonyms: ['maestro', 'docente'], antonyms: ['profesora', 'alumno'] },
  'profesora': { synonyms: ['maestra', 'docente'], antonyms: ['profesor', 'alumna'] },
  'estudiante': { synonyms: ['alumno', 'aprendiz'] },
  'alumno': { synonyms: ['estudiante', 'discipulo'], antonyms: ['profesor', 'maestro'] },
  'amigo': { synonyms: ['compañero', 'camarada'], antonyms: ['enemigo'] },
  'enemigo': { synonyms: ['adversario', 'rival'], antonyms: ['amigo'] },

  // ============================================
  // NOUNS - Transportation
  // ============================================
  'coche': { synonyms: ['auto', 'carro', 'vehículo'] },
  'autobus': { synonyms: ['bus', 'ómnibus', 'camión'] },
  'avión': { synonyms: ['aeronave', 'aeroplaño'] },
  'barco': { synonyms: ['nave', 'embarcacion', 'buque'] },
  'bicicleta': { synonyms: ['bici'] },
  'moto': { synonyms: ['motocicleta'] },

  // ============================================
  // NOUNS - Objects
  // ============================================
  'libro': { synonyms: ['texto', 'obra', 'volumen'] },
  'teléfono': { synonyms: ['móvil', 'celular'] },
  'dinero': { synonyms: ['plata', 'efectivo'] },
  'regalo': { synonyms: ['obsequio', 'presente'] },
  'trabajo': { synonyms: ['empleo', 'labor', 'ocupación'] },
  'llave': { synonyms: ['clave'] },
  'puerta': { antonyms: ['ventana'] },

  // ============================================
  // NOUNS - Nature
  // ============================================
  'árbol': { synonyms: ['planta'] },
  'flor': { synonyms: ['florecilla'] },
  'tierra': { synonyms: ['suelo', 'terreno'] },
  'piedra': { synonyms: ['roca'] },
  'fuego': { synonyms: ['llama', 'incendio'], antonyms: ['agua'] },
  'aire': { synonyms: ['viento', 'atmósfera'] },
  'cielo': { synonyms: ['firmamento'], antonyms: ['tierra'] },
  'estrella': { synonyms: ['astro'] },
};

// Helper function to get relations for a word
export function getWordRelations(spanish: string): WordRelation | null {
  // Normalize the word (lowercase, remove accents for matching)
  const normalized = spanish.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  // Try exact match first
  if (wordRelations[spanish]) {
    return wordRelations[spanish];
  }

  // Try normalized match
  for (const [key, value] of Object.entries(wordRelations)) {
    const normalizedKey = key.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    if (normalizedKey === normalized) {
      return value;
    }
  }

  return null;
}
