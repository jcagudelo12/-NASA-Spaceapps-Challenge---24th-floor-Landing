/* Misión Equilibria · Landing para el jurado */

// Cambia esta ruta por la de la primera pantalla del juego (por ejemplo, "lanzamiento/index.html").
const URL_DEL_JUEGO = "https://sangarrafa.github.io/NASA-Spaceapps-Challenge---24th-floor/";

(function () {
  "use strict";

  const reduceMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Idioma: inglés por defecto (o el que se eligió en la portada), cambia con el botón rosado ---------- */
  const CLAVE_IDIOMA = "equilibria:landing:lang";
  let idioma = document.documentElement.lang === "es" ? "es" : "en";
  const t = (es, en) => (idioma === "en" ? en : es);

  /* ---------- Fondo de estrellas ---------- */
  const lienzo = document.getElementById("estrellas");
  const ctx = lienzo.getContext("2d");
  let estrellas = [];

  function prepararEstrellas() {
    const dpr = window.devicePixelRatio || 1;
    lienzo.width = window.innerWidth * dpr;
    lienzo.height = window.innerHeight * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const cantidad = Math.round((window.innerWidth * window.innerHeight) / 5000);
    estrellas = Array.from({ length: cantidad }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 1.4 + 0.3,
      fase: Math.random() * Math.PI * 2,
      vel: Math.random() * 0.02 + 0.005
    }));
  }

  function dibujarEstrellas(t) {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    for (const e of estrellas) {
      const brillo = reduceMovimiento ? 0.8 : 0.45 + 0.55 * Math.abs(Math.sin(e.fase + t * e.vel * 0.06));
      ctx.globalAlpha = brillo;
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(e.x, e.y, e.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    if (!reduceMovimiento) requestAnimationFrame(dibujarEstrellas);
  }

  prepararEstrellas();
  requestAnimationFrame(dibujarEstrellas);
  window.addEventListener("resize", () => {
    prepararEstrellas();
    if (reduceMovimiento) dibujarEstrellas(0);
  });

  /* ---------- Ánimo de LUNIA: de frágil a radiante ---------- */
  const narradora = document.getElementById("narradora");
  const boca = document.getElementById("boca");
  const cejaIzq = document.getElementById("ceja-izq");
  const cejaDer = document.getElementById("ceja-der");
  const ojos = Array.from(document.querySelectorAll(".lunia-ojos ellipse"));
  const etiquetaAnimo = document.getElementById("animo-etiqueta");

  const ANIMOS = [
    { nombre: "apagándose", nombreEn: "fading", boca: "M50 73 Q60 64 70 73", ceja: [46, 41], ojo: 6 },
    { nombre: "asustada", nombreEn: "scared", boca: "M50 72 Q60 67 70 72", ceja: [45, 42], ojo: 7 },
    { nombre: "con esperanza", nombreEn: "hopeful", boca: "M50 70 Q60 71 70 70", ceja: [44, 43], ojo: 8 },
    { nombre: "más tranquila", nombreEn: "calmer", boca: "M50 69 Q60 74 70 69", ceja: [42, 42], ojo: 8 },
    { nombre: "animada", nombreEn: "cheerful", boca: "M49 68 Q60 77 71 68", ceja: [40, 40], ojo: 9 },
    { nombre: "radiante", nombreEn: "radiant", boca: "M47 66 Q60 81 73 66", ceja: [39, 37], ojo: 9 }
  ];

  function aplicarAnimo(n) {
    const a = ANIMOS[n];
    narradora.dataset.animo = String(n);
    boca.setAttribute("d", a.boca);
    cejaIzq.setAttribute("d", "M38 " + a.ceja[0] + " L52 " + a.ceja[1]);
    cejaDer.setAttribute("d", "M82 " + a.ceja[0] + " L68 " + a.ceja[1]);
    ojos.forEach((o) => o.setAttribute("ry", a.ojo));
    etiquetaAnimo.textContent = t("Energía emocional: " + a.nombre, "Emotional energy: " + a.nombreEn);
    if (window.Sonido) Sonido.animo(n);
  }

  /* Capítulo 4: la barra del arco de LUNIA */
  const arco = document.getElementById("arco-misiones");
  const arcoNumero = document.getElementById("arco-numero");
  const arcoFrase = document.getElementById("arco-frase");
  const FRASES_ARCO = {
    es: [
      "«No me dejes sola… por favor. Tengo frío y mis luces tiemblan.»",
      "«¿De verdad vas a volver mañana? No quiero quedarme a oscuras.»",
      "«Hoy mis luces duraron un poco más. Gracias por quedarte.»",
      "«Creo que… ya no tiemblo tanto. Me gusta trabajar contigo.»",
      "«¡Mira cómo brillan mis paneles! Lo hicimos juntos.»",
      "«¡Ya no tengo miedo! ¿Y si ahora vamos juntos a Marte?»"
    ],
    en: [
      "“Please don't leave me alone… I'm cold and my lights are flickering.”",
      "“Will you really come back tomorrow? I don't want to be left in the dark.”",
      "“My lights lasted a little longer today. Thank you for staying.”",
      "“I think… I'm not trembling so much anymore. I like working with you.”",
      "“Look how my panels shine! We did this together.”",
      "“I'm not afraid anymore! What if we fly to Mars together?”"
    ]
  };

  function actualizarArco(hablar) {
    const n = Number(arco.value);
    arcoNumero.textContent = n;
    arcoFrase.textContent = FRASES_ARCO[idioma][n];
    aplicarAnimo(n);
    if (hablar) {
      clearTimeout(temporizadorTexto);
      dialogo.textContent = FRASES_ARCO[idioma][n].replace(/[«»“”]/g, "");
    }
  }

  let arcoPrevio = Number(arco.value);
  arco.addEventListener("input", () => {
    actualizarArco(true);
    const n = Number(arco.value);
    if (n !== arcoPrevio && window.Sonido) Sonido.efecto("arco", n);
    arcoPrevio = n;
  });

  /* ---------- Navegación por pasos ---------- */
  const pasos = Array.from(document.querySelectorAll(".paso"));
  const puntos = Array.from(document.querySelectorAll(".punto"));
  const btnAnterior = document.getElementById("anterior");
  const btnSiguiente = document.getElementById("siguiente");
  const contador = document.getElementById("contador");
  const dialogo = document.getElementById("dialogo");
  const lunia = document.querySelector(".lunia");
  let actual = 0;
  let temporizadorTexto = null;

  function escribir(texto) {
    clearTimeout(temporizadorTexto);
    if (reduceMovimiento) {
      dialogo.textContent = texto;
      return;
    }
    dialogo.textContent = "";
    let i = 0;
    (function siguienteLetra() {
      dialogo.textContent = texto.slice(0, i);
      if (window.Sonido && texto.charAt(i) !== " ") Sonido.voz();
      i += 2;
      if (i <= texto.length + 1) temporizadorTexto = setTimeout(siguienteLetra, 18);
      else dialogo.textContent = texto;
    })();
  }

  function irA(indice) {
    if (window.Sonido && indice !== actual && indice >= 0 && indice < pasos.length) Sonido.efecto(indice > actual ? "siguiente" : "anterior");
    actual = Math.max(0, Math.min(pasos.length - 1, indice));
    pasos.forEach((p, i) => p.classList.toggle("activo", i === actual));
    puntos.forEach((p, i) => {
      p.classList.toggle("actual", i === actual);
      p.classList.toggle("hecho", i < actual);
      if (i === actual) p.setAttribute("aria-current", "step");
      else p.removeAttribute("aria-current");
    });
    btnAnterior.disabled = false; // en el primer paso, "Atrás" vuelve a la portada
    btnSiguiente.classList.toggle("oculto", actual === pasos.length - 1);
    contador.textContent = t("Capítulo ", "Chapter ") + (actual + 1) + t(" de ", " of ") + pasos.length;
    const porcentaje = Math.round(((actual + 1) / pasos.length) * 100);
    document.getElementById("progreso-relleno").style.width = porcentaje + "%";
    document.getElementById("progreso-cohete").style.left = porcentaje + "%";
    const barraProgreso = document.getElementById("progreso");
    barraProgreso.setAttribute("aria-valuenow", String(porcentaje));
    barraProgreso.classList.toggle("completo", porcentaje === 100);
    escribir(idioma === "en" ? pasos[actual].dataset.dialogoEn : pasos[actual].dataset.dialogo);
    const animo = pasos[actual].dataset.animo;
    if (animo === "slider") actualizarArco(false);
    else aplicarAnimo(Number(animo || 0));
    lunia.classList.remove("habla");
    void lunia.offsetWidth;
    lunia.classList.add("habla");
  }

  btnAnterior.addEventListener("click", () => {
    if (actual === 0) window.location.href = "../index.html";
    else irA(actual - 1);
  });
  btnSiguiente.addEventListener("click", () => irA(actual + 1));
  puntos.forEach((p) => p.addEventListener("click", () => irA(Number(p.dataset.ir))));

  document.addEventListener("keydown", (e) => {
    if (e.target.closest(".pilar, input[type='range']")) return;
    if (e.key === "ArrowRight") irA(actual + 1);
    if (e.key === "ArrowLeft") irA(actual - 1);
  });

  // Deslizar con el dedo en pantallas táctiles
  let inicioX = null;
  document.addEventListener("touchstart", (e) => {
    if (e.target.closest("input, button, a")) { inicioX = null; return; }
    inicioX = e.touches[0].clientX;
  }, { passive: true });
  document.addEventListener("touchend", (e) => {
    if (inicioX === null) return;
    const dx = e.changedTouches[0].clientX - inicioX;
    if (Math.abs(dx) > 60) irA(actual + (dx < 0 ? 1 : -1));
    inicioX = null;
  });

  /* ---------- Capítulo 2: la balanza ---------- */
  const balanza = document.getElementById("balanza");
  const leyenda = document.getElementById("leyenda-balanza");
  const textosBalanza = {
    es: {
      diversion: "Muy divertido, pero no enseña nada real: los niños ven cohetes y explosiones, y no entienden qué hace falta para sobrevivir.",
      ciencia: "Muy preciso, pero lleno de datos sueltos y palabras difíciles: a los cinco minutos, el niño se aburre.",
      equilibrio: "Equilibria une las dos cosas: decisiones reales de una misión espacial, contadas como un juego para niños."
    },
    en: {
      diversion: "Lots of fun, but nothing real to learn: kids see rockets and explosions, yet never discover what it takes to survive.",
      ciencia: "Accurate, but packed with loose facts and hard words: five minutes in, kids tune out.",
      equilibrio: "Equilibria brings both together: the real decisions behind a space mission, told as a game made for kids."
    }
  };

  document.querySelectorAll(".opcion").forEach((boton) => {
    boton.addEventListener("click", () => {
      const modo = boton.dataset.modo;
      balanza.dataset.modo = modo;
      if (window.Sonido) Sonido.efecto("balanza");
      leyenda.textContent = textosBalanza[idioma][modo];
      document.querySelectorAll(".opcion").forEach((b) => b.classList.toggle("opcion-activa", b === boton));
    });
  });

  /* ---------- Capítulo 3: mapa de misiones ---------- */
  const detalleMision = document.getElementById("detalle-mision");
  const misiones = {
    es: {
      despegue: ["Despegue", "El viaje empieza en la Tierra: hay que encender el motor en el momento justo de la ventana de lanzamiento. Si se falla, el cohete sigue de largo y se vuelve a intentar, sin límite.", "Disponible en este demo"],
      vital: ["Soporte vital", "Aire, agua y temperatura para la tripulación que llegará. En el simulador, cada litro de agua y cada respiro dependen de la energía que el niño decida darles.", "Disponible en este demo"],
      blindaje: ["Blindaje", "Llega una tormenta solar real, registrada por la NASA. ¿Activar el escudo y gastar la energía de la noche, o arriesgar a la tripulación simulada?", "Llega en la siguiente versión"],
      energia: ["Energía", "Los paneles solares solo funcionan de día, y la noche lunar dura unos 14 días terrestres. Hay que planear antes de que oscurezca.", "Llega en la siguiente versión"],
      alimentos: ["Alimentos", "Un invernadero da comida y un poco de oxígeno, pero pide agua y energía. Cultivar más deja menos para todo lo demás.", "Llega en la siguiente versión"],
      comunicaciones: ["Comunicaciones", "Hablar con la Tierra solo es posible en ciertas ventanas. El niño aprende a planear cuando la ayuda no llega de inmediato.", "Llega en la siguiente versión"],
      marte: ["Marte", "Se desbloquea al completar las cinco misiones de la base lunar. Allá los mensajes a la Tierra tardan minutos, no segundos.", "Se desbloquea al terminar las cinco misiones"]
    },
    en: {
      despegue: ["Launch", "The journey begins on Earth: fire the engine at just the right moment of the launch window. Miss it, and the rocket sails past the Moon, so you try again, as many times as you need.", "Available in this demo"],
      vital: ["Life support", "Air, water and temperature for the crew that will one day arrive. In the simulator, every drop of water and every breath depends on the energy the child decides to give them.", "Available in this demo"],
      blindaje: ["Shielding", "A real solar storm, recorded by NASA, is on its way. Raise the shield and spend tonight's energy, or risk the simulated crew?", "Coming in the next version"],
      energia: ["Energy", "Solar panels only work in daylight, and a lunar night lasts about 14 Earth days. The child must plan before darkness falls.", "Coming in the next version"],
      alimentos: ["Food", "A greenhouse grows food and a little oxygen, but it demands water and energy. Growing more leaves less for everything else.", "Coming in the next version"],
      comunicaciones: ["Communications", "Talking to Earth is only possible during certain windows. The child learns to plan when help can't arrive right away.", "Coming in the next version"],
      marte: ["Mars", "Unlocks after completing all five lunar missions. Out there, messages to Earth take minutes, not seconds.", "Unlocks after the five missions"]
    }
  };
  let misionActual = document.querySelector(".mision.seleccionada");

  function mostrarMision(boton, conEfectos) {
    misionActual = boton;
    const clave = boton.dataset.mision;
    const [titulo, texto, estado] = misiones[idioma][clave];
    document.getElementById("detalle-titulo").textContent = titulo;
    document.getElementById("detalle-texto").textContent = texto;
    const etiquetaEstado = document.getElementById("detalle-estado");
    etiquetaEstado.textContent = estado;
    etiquetaEstado.classList.toggle("disponible", clave === "despegue" || clave === "vital");
    detalleMision.style.setProperty("--color-mision", getComputedStyle(boton).getPropertyValue("--color-mision"));
    document.querySelectorAll(".mision").forEach((m) => m.classList.toggle("seleccionada", m === boton));
    if (!conEfectos) return;
    detalleMision.classList.remove("cambio");
    void detalleMision.offsetWidth;
    detalleMision.classList.add("cambio");
    if (window.Sonido) Sonido.efecto(clave === "marte" ? "bloqueado" : "mision");
  }

  document.querySelectorAll(".mision").forEach((boton) => {
    boton.addEventListener("click", () => mostrarMision(boton, true));
  });

  /* ---------- Capítulo 4: pestañas de las ideas ---------- */
  const pestanas = Array.from(document.querySelectorAll(".pilar"));

  function abrirPestana(p) {
    pestanas.forEach((t) => {
      const activa = t === p;
      t.setAttribute("aria-selected", activa ? "true" : "false");
      t.tabIndex = activa ? 0 : -1;
      document.getElementById(t.getAttribute("aria-controls")).hidden = !activa;
    });
  }

  pestanas.forEach((t, i) => {
    t.addEventListener("click", () => {
      abrirPestana(t);
      if (window.Sonido) Sonido.efecto("pestana");
    });
    t.addEventListener("keydown", (e) => {
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        const siguiente = pestanas[(i + (e.key === "ArrowDown" ? 1 : -1) + pestanas.length) % pestanas.length];
        abrirPestana(siguiente);
        siguiente.focus();
      }
    });
  });

  /* ---------- Capítulo 6: entrar al juego ---------- */
  const aviso = document.getElementById("aviso");
  const entrar = document.getElementById("entrar");
  if (URL_DEL_JUEGO) entrar.href = URL_DEL_JUEGO;
  entrar.addEventListener("click", (e) => {
    const conSonido = window.Sonido && Sonido.activo;
    if (conSonido) Sonido.efecto("entrar");
    if (URL_DEL_JUEGO) return;   // abre el juego de una, sin esperar al efecto de sonido
    e.preventDefault();
    aviso.textContent = t("¡Despegue en preparación! Aquí se abrirá la primera misión del juego.", "Liftoff in progress! The game's first mission will open here.");
    aviso.hidden = false;
    setTimeout(() => { aviso.hidden = true; }, 3200);
  });

  /* ---------- Botón de sonido ---------- */
  const btnSonido = document.getElementById("btn-sonido");
  const textoSonido = document.getElementById("texto-sonido");
  function pintarSonido(encendido) {
    btnSonido.setAttribute("aria-pressed", encendido ? "true" : "false");
    btnSonido.classList.toggle("encendido", encendido);
    textoSonido.textContent = encendido ? t("Silenciar", "Mute") : t("Activar sonido", "Turn sound on");
  }

  // La música queda encendida por defecto. Los navegadores solo dejan sonar el audio
  // después del primer clic o tecla, así que arranca en la primera interacción.
  if (window.Sonido) {
    Sonido.encenderPorDefecto();
    const desbloquear = (e) => {
      if (e.target.closest && e.target.closest("#btn-sonido")) return;
      Sonido.desbloquear();
      ["pointerdown", "keydown", "touchstart"].forEach((t) => document.removeEventListener(t, desbloquear, true));
    };
    ["pointerdown", "keydown", "touchstart"].forEach((t) => document.addEventListener(t, desbloquear, true));
  }

  btnSonido.addEventListener("click", () => {
    if (!window.Sonido) return;
    const encendido = Sonido.alternar();
    pintarSonido(encendido);
  });

  /* ---------- Cambiar de idioma ---------- */
  const elementosAria = Array.from(document.querySelectorAll("[data-aria-en]"));
  elementosAria.forEach((el) => { el.dataset.ariaEs = el.getAttribute("aria-label"); });

  function cambiarIdioma(nuevo) {
    idioma = nuevo;
    document.documentElement.lang = idioma;
    try { localStorage.setItem(CLAVE_IDIOMA, idioma); } catch (e) { /* sin almacenamiento */ }
    document.title = t("Misión Equilibria", "Mission Equilibria");
    elementosAria.forEach((el) => el.setAttribute("aria-label", idioma === "en" ? el.dataset.ariaEn : el.dataset.ariaEs));
    leyenda.textContent = textosBalanza[idioma][balanza.dataset.modo];
    arcoFrase.textContent = FRASES_ARCO[idioma][Number(arco.value)];
    if (misionActual) mostrarMision(misionActual, false);
    pintarSonido(window.Sonido ? Sonido.activo : false);
    irA(actual); // vuelve a escribir el diálogo de LUNIA y el contador en el nuevo idioma
  }

  document.getElementById("btn-traducir").addEventListener("click", () => {
    cambiarIdioma(idioma === "es" ? "en" : "es");
    if (window.Sonido) Sonido.efecto("activar");
  });

  cambiarIdioma(idioma);   // deja títulos, etiquetas y textos del script en el idioma inicial
  irA(0);
})();
