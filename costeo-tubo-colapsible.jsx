import { useState, useMemo, useEffect } from "react";
import { Plus, Trash2, Factory, ChevronDown, ChevronRight, Settings, Layers, Gauge, ClipboardList, Copy, Check } from "lucide-react";

const fmt0 = (n) =>
  new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(isFinite(n) ? n : 0);
const fmt2 = (n) =>
  new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(isFinite(n) ? n : 0);
const num = (n, d = 2) =>
  new Intl.NumberFormat("es-CO", { maximumFractionDigits: d }).format(isFinite(n) ? n : 0);

const uid = () => Math.random().toString(36).slice(2, 9);

const S = {
  ink: "#1B2B3A",
  steel: "#44607A",
  line: "#C7D2DB",
  bg: "#E9EDF0",
  accent: "#E8630A",
  ok: "#1E7A46",
};

const COLORES = ["#1E7A46", "#7A4460", "#B08A2E", "#5A7A9E", "#8F5E3C", "#44607A", "#A34A6B"];

const inputStyle = {
  border: `1px solid ${S.line}`,
  borderRadius: 6,
  padding: "7px 9px",
  fontSize: 13.5,
  fontFamily: "'IBM Plex Mono', monospace",
  color: S.ink,
  background: "#fff",
  width: "100%",
  boxSizing: "border-box",
};

function Field({ label, children, flex = 1, minW = 100 }) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 4, flex, minWidth: minW }}>
      <span style={{ fontSize: 10.5, letterSpacing: "0.07em", textTransform: "uppercase", color: S.steel, fontWeight: 600 }}>
        {label}
      </span>
      {children}
    </label>
  );
}

function NumInput({ value, onChange, min = 0, step = "any" }) {
  return (
    <input
      type="number"
      min={min}
      step={step}
      value={value}
      onChange={(e) => onChange(e.target.value === "" ? "" : Number(e.target.value))}
      style={inputStyle}
    />
  );
}

function RowShell({ children, onRemove }) {
  return (
    <div style={{ display: "flex", gap: 8, alignItems: "flex-end", flexWrap: "wrap" }}>
      {children}
      <button
        onClick={onRemove}
        title="Eliminar"
        style={{ border: "none", background: "transparent", color: "#B04434", cursor: "pointer", padding: 7 }}
      >
        <Trash2 size={15} />
      </button>
    </div>
  );
}

function AddBtn({ onClick, children }) {
  return (
    <button
      onClick={onClick}
      style={{
        alignSelf: "flex-start",
        display: "flex",
        alignItems: "center",
        gap: 6,
        border: `1px dashed ${S.steel}`,
        background: "transparent",
        color: S.steel,
        borderRadius: 6,
        padding: "5px 10px",
        fontSize: 12.5,
        fontWeight: 600,
        cursor: "pointer",
      }}
    >
      <Plus size={14} /> {children}
    </button>
  );
}

function Seccion({ id, icono, titulo, subtitulo, dato, abierta, onToggle, children, color = S.steel, onRemove }) {
  return (
    <section id={id} style={{ background: "#fff", border: `1px solid ${S.line}`, borderLeft: `5px solid ${color}`, borderRadius: 10, overflow: "hidden", scrollMarginTop: 16 }}>
      <header
        onClick={onToggle}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "13px 16px",
          background: "#F6F8FA",
          borderBottom: abierta ? `1px solid ${S.line}` : "none",
          cursor: "pointer",
        }}
      >
        {abierta ? <ChevronDown size={18} color={S.steel} /> : <ChevronRight size={18} color={S.steel} />}
        {icono}
        <div style={{ minWidth: 0 }}>
          <div style={{ fontWeight: 800, fontSize: 15 }}>{titulo}</div>
          {subtitulo && <div style={{ fontSize: 11.5, color: S.steel }}>{subtitulo}</div>}
        </div>
        <span style={{ marginLeft: "auto", fontFamily: "'IBM Plex Mono', monospace", fontWeight: 600, fontSize: 14.5, whiteSpace: "nowrap" }}>{dato}</span>
        {onRemove && (
          <button
            onClick={(e) => { e.stopPropagation(); onRemove(); }}
            title="Eliminar"
            style={{ border: "none", background: "transparent", color: "#B04434", cursor: "pointer", padding: 6 }}
          >
            <Trash2 size={16} />
          </button>
        )}
      </header>
      {abierta && <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 14 }}>{children}</div>}
    </section>
  );
}

function SubBloque({ titulo, dato, children }) {
  return (
    <div style={{ border: `1px solid ${S.line}`, borderRadius: 8, overflow: "hidden" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 8,
          flexWrap: "wrap",
          padding: "8px 12px",
          background: "#F6F8FA",
          borderBottom: `1px solid ${S.line}`,
          fontSize: 11.5,
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          color: S.steel,
        }}
      >
        <span>{titulo}</span>
        <span style={{ fontFamily: "'IBM Plex Mono', monospace" }}>{dato}</span>
      </div>
      <div style={{ padding: 12, display: "flex", flexDirection: "column", gap: 10 }}>{children}</div>
    </div>
  );
}

function Kpi({ label, valor, destacado }) {
  return (
    <div style={{ minWidth: 150 }}>
      <div style={{ fontSize: 10.5, color: "#AEC0CE", textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</div>
      <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 20, fontWeight: 600, color: destacado || "#fff" }}>{valor}</div>
    </div>
  );
}

/* ====== datos iniciales ====== */
const ID_EXT = "eq-extrusora";
const ID_INY = "eq-inyectora";
const ID_AUT = "eq-automatica";
const ID_SEL = "eq-selladora";
const ID_ETI = "eq-etiquetadora";
const ID_SER = "eq-serigrafia";
const ID_HOT = "eq-hotstamping";

const energiaBase = (propio) => [
  propio,
  { id: uid(), nombre: "Chiller", kw: 2.3, compartido: 2 },
  { id: uid(), nombre: "Bombas torre", kw: 0.15, compartido: 2 },
  { id: uid(), nombre: "Compresor", kw: 4, compartido: 8 },
  { id: uid(), nombre: "Luminaria", kw: 0.15, compartido: 12 },
  { id: uid(), nombre: "Molino", kw: 4, compartido: 2 },
  { id: uid(), nombre: "Mezclador", kw: 6, compartido: 2 },
];

const energiaAutomatica = () => [
  { id: uid(), nombre: "Terminadora (automática)", kw: 14, compartido: 1 },
  { id: uid(), nombre: "Compresor", kw: 4, compartido: 8 },
  { id: uid(), nombre: "Luminaria", kw: 0.15, compartido: 12 },
];

const energiaSelladora = () => [
  { id: uid(), nombre: "Selladora", kw: 0.5, compartido: 1 },
  { id: uid(), nombre: "Compresor", kw: 4, compartido: 8 },
  { id: uid(), nombre: "Luminaria", kw: 0.15, compartido: 12 },
];

const operariosBase = () => [
  { id: uid(), cargo: "Operario de producción", salario: 2896400, regla: 1 },
  { id: uid(), cargo: "Operario de máquina", salario: 3158000, regla: 1 },
];

/* ===== Maestro de parámetros: persistencia en Google Sheets ===== */
const MAESTRO_API_URL = "https://script.google.com/macros/s/AKfycbx1XmzHf4OvnuhLVCGaf_PUOyHWOfXePTRNr4rAmu4wmWR_aa2_orH_vVAKGmGBtn9Jgg/exec";
const MAESTRO_KEY_CACHE = "costeo-maestro-cache-v2"; // caché local por si no hay internet

// Leer caché local (fallback cuando no hay conexión)
const leerMaestroCache = () => {
  try {
    const raw = localStorage.getItem(MAESTRO_KEY_CACHE);
    if (!raw) return { versiones: [] };
    const parsed = JSON.parse(raw);
    return { versiones: Array.isArray(parsed.versiones) ? parsed.versiones : [] };
  } catch (e) {
    return { versiones: [] };
  }
};

const guardarMaestroCache = (data) => {
  try {
    localStorage.setItem(MAESTRO_KEY_CACHE, JSON.stringify(data));
    return true;
  } catch (e) {
    return false;
  }
};

// Normaliza una versión del backend al formato interno
const normalizarVersion = (v) => ({
  id: v.id,
  fecha: v.fecha,
  nota: v.nota || "",
  datos: {
    horasDia: v.horasDia !== "" && v.horasDia != null ? Number(v.horasDia) : "",
    diasMes: v.diasMes !== "" && v.diasMes != null ? Number(v.diasMes) : "",
    costoKwh: v.costoKwh !== "" && v.costoKwh != null ? Number(v.costoKwh) : "",
    equiposFacturan: Array.isArray(v.equiposFacturan_json) ? v.equiposFacturan_json : [],
    costosFijos: Array.isArray(v.costosFijos_json) ? v.costosFijos_json : [],
    nominaAdmin: Array.isArray(v.nominaAdmin_json) ? v.nominaAdmin_json : [],
    salariosOperarios: Array.isArray(v.salariosOperarios_json) ? v.salariosOperarios_json : [],
  },
});

// Cargar todas las versiones desde Google Sheets
const cargarVersionesDesdeSheets = async () => {
  const r = await fetch(MAESTRO_API_URL + "?accion=maestro_listar");
  const data = await r.json();
  const versiones = (data.versiones || []).map(normalizarVersion).reverse(); // orden cronológico
  guardarMaestroCache({ versiones });
  return versiones;
};

// Guardar una nueva versión en Google Sheets
const guardarVersionEnSheets = async (version) => {
  const params = new URLSearchParams();
  params.set("accion", "maestro_guardar");
  params.set("id", version.id);
  params.set("fecha", version.fecha);
  params.set("nota", version.nota);
  params.set("horasDia", String(version.datos.horasDia ?? ""));
  params.set("diasMes", String(version.datos.diasMes ?? ""));
  params.set("costoKwh", String(version.datos.costoKwh ?? ""));
  params.set("equiposFacturan", JSON.stringify(version.datos.equiposFacturan || []));
  params.set("costosFijos", JSON.stringify(version.datos.costosFijos || []));
  params.set("nominaAdmin", JSON.stringify(version.datos.nominaAdmin || []));
  params.set("salariosOperarios", JSON.stringify(version.datos.salariosOperarios || []));
  await fetch(MAESTRO_API_URL + "?" + params.toString(), { mode: "no-cors" });
};

// Plantilla vacía del formulario del maestro — arranca sin valores
const maestroVacio = () => ({
  horasDia: "",
  diasMes: "",
  costoKwh: "",
  equiposFacturan: [{ id: uid(), nombre: "" }],
  costosFijos: [{ id: uid(), concepto: "", valor: "" }],
  nominaAdmin: [{ id: uid(), concepto: "", valor: "" }],
  salariosOperarios: [
    { id: uid(), cargo: "Operario de producción", salario: "" },
    { id: uid(), cargo: "Operario de máquina", salario: "" },
  ],
});

export default function CosteoTuboColapsible() {
  /* ===== encabezado general ===== */
  const [horasDia, setHorasDia] = useState(24);
  const [diasMes, setDiasMes] = useState(24);
  const [costoKwh, setCostoKwh] = useState(850);

  const [equiposFacturan, setEquiposFacturan] = useState([
    "Extrusora", "Inyectora", "Automática", "Screen 1", "Screen 2", "Screen 3", "Etiquetadora", "Selladora", "Hot Stamping",
  ].map((n) => ({ id: uid(), nombre: n })));

  const [costosFijos, setCostosFijos] = useState([
    { id: uid(), concepto: "Arriendo", valor: 10000000 },
    { id: uid(), concepto: "Costos de funcionamiento", valor: 10000000 },
    { id: uid(), concepto: "Gastos financieros (impuestos y otros)", valor: 10000000 },
    { id: uid(), concepto: "Pago a préstamo", valor: 7000000 },
    { id: uid(), concepto: "Amortización", valor: 6864433 },
  ]);

  const [nominaAdmin, setNominaAdmin] = useState([
    { id: uid(), concepto: "Personal administrativo", valor: 26102624 },
  ]);

  /* ===== Maestro de parámetros ===== */
  const [maestroVersiones, setMaestroVersiones] = useState(() => leerMaestroCache().versiones);
  const [maestroForm, setMaestroForm] = useState(() => maestroVacio());
  const [maestroNota, setMaestroNota] = useState("");
  const [vistaMaestro, setVistaMaestro] = useState(false); // false = vista costeo, true = vista maestro
  const [verDetalleVersion, setVerDetalleVersion] = useState(null); // id de la versión a inspeccionar
  const [mensajeMaestro, setMensajeMaestro] = useState("");
  const [cargandoMaestro, setCargandoMaestro] = useState(false);

  // Versión vigente = la última guardada
  const versionVigente = maestroVersiones.length > 0 ? maestroVersiones[maestroVersiones.length - 1] : null;

  // Al cargar la app, trae las versiones desde Sheets (si hay internet)
  useEffect(() => {
    (async () => {
      try {
        setCargandoMaestro(true);
        const versiones = await cargarVersionesDesdeSheets();
        setMaestroVersiones(versiones);
      } catch (e) {
        // Sin conexión: se queda con el caché local
        console.log("Sin conexión al maestro, usando caché local");
      } finally {
        setCargandoMaestro(false);
      }
    })();
  }, []);

  // Recargar desde Sheets cuando se abre el maestro
  const recargarMaestro = async () => {
    try {
      setCargandoMaestro(true);
      const versiones = await cargarVersionesDesdeSheets();
      setMaestroVersiones(versiones);
      setMensajeMaestro("Versiones actualizadas desde Google Sheets ✓");
      setTimeout(() => setMensajeMaestro(""), 2500);
    } catch (e) {
      setMensajeMaestro("No se pudo conectar con Google Sheets. Usando datos locales.");
      setTimeout(() => setMensajeMaestro(""), 3500);
    } finally {
      setCargandoMaestro(false);
    }
  };

  const guardarNuevaVersion = async () => {
    const nueva = {
      id: uid(),
      fecha: new Date().toISOString(),
      nota: maestroNota || `Versión ${maestroVersiones.length + 1}`,
      datos: JSON.parse(JSON.stringify(maestroForm)),
    };
    // Optimista: guardamos localmente y mandamos al Sheets
    const nuevas = [...maestroVersiones, nueva];
    setMaestroVersiones(nuevas);
    guardarMaestroCache({ versiones: nuevas });
    setMaestroNota("");
    setMensajeMaestro("Guardando en Google Sheets…");

    try {
      await guardarVersionEnSheets(nueva);
      setMensajeMaestro("Nueva versión guardada en Google Sheets ✓");
      // Opcional: recargar del Sheets para confirmar
      setTimeout(async () => {
        try {
          const versiones = await cargarVersionesDesdeSheets();
          setMaestroVersiones(versiones);
        } catch (_) {}
      }, 1500);
    } catch (e) {
      setMensajeMaestro("⚠ Guardado local, pero no se pudo sincronizar con Google Sheets.");
    }
    setTimeout(() => setMensajeMaestro(""), 3000);
  };

  const cargarVersionEnFormulario = (versionId) => {
    const v = maestroVersiones.find((x) => x.id === versionId);
    if (!v) return;
    // Regeneramos los IDs internos para evitar colisiones
    const d = v.datos;
    setMaestroForm({
      horasDia: d.horasDia ?? "",
      diasMes: d.diasMes ?? "",
      costoKwh: d.costoKwh ?? "",
      equiposFacturan: (d.equiposFacturan || []).map((x) => ({ id: uid(), nombre: x.nombre })),
      costosFijos: (d.costosFijos || []).map((x) => ({ id: uid(), concepto: x.concepto, valor: x.valor })),
      nominaAdmin: (d.nominaAdmin || []).map((x) => ({ id: uid(), concepto: x.concepto, valor: x.valor })),
      salariosOperarios: (d.salariosOperarios || []).map((x) => ({ id: uid(), cargo: x.cargo, salario: x.salario })),
    });
    setMensajeMaestro(`Versión "${v.nota}" cargada en el formulario`);
    setTimeout(() => setMensajeMaestro(""), 2500);
  };

  const eliminarVersion = (versionId) => {
    if (!confirm("¿Eliminar esta versión del histórico? Esta acción no se puede deshacer.")) return;
    persistirVersiones(maestroVersiones.filter((x) => x.id !== versionId));
    if (verDetalleVersion === versionId) setVerDetalleVersion(null);
  };

  const aplicarMaestroAlCosteo = () => {
    if (!versionVigente) {
      alert("No hay ninguna versión guardada en el maestro todavía.");
      return;
    }
    const d = versionVigente.datos;
    if (d.horasDia !== "" && d.horasDia != null) setHorasDia(Number(d.horasDia));
    if (d.diasMes !== "" && d.diasMes != null) setDiasMes(Number(d.diasMes));
    if (d.costoKwh !== "" && d.costoKwh != null) setCostoKwh(Number(d.costoKwh));
    if (d.equiposFacturan && d.equiposFacturan.length > 0) {
      setEquiposFacturan(d.equiposFacturan.filter((x) => (x.nombre || "").trim() !== "").map((x) => ({ id: uid(), nombre: x.nombre })));
    }
    if (d.costosFijos && d.costosFijos.length > 0) {
      setCostosFijos(d.costosFijos.filter((x) => (x.concepto || "").trim() !== "").map((x) => ({ id: uid(), concepto: x.concepto, valor: Number(x.valor) || 0 })));
    }
    if (d.nominaAdmin && d.nominaAdmin.length > 0) {
      setNominaAdmin(d.nominaAdmin.filter((x) => (x.concepto || "").trim() !== "").map((x) => ({ id: uid(), concepto: x.concepto, valor: Number(x.valor) || 0 })));
    }
    // Salarios de operarios: actualizamos los salarios por cargo en todos los equipos
    if (d.salariosOperarios && d.salariosOperarios.length > 0) {
      const mapaSalarios = {};
      d.salariosOperarios.forEach((s) => {
        if (s.cargo && s.salario !== "" && s.salario != null) {
          mapaSalarios[s.cargo.trim().toLowerCase()] = Number(s.salario) || 0;
        }
      });
      setEquipos((eqs) => eqs.map((eq) => ({
        ...eq,
        operarios: eq.operarios.map((op) => {
          const nuevoSal = mapaSalarios[(op.cargo || "").trim().toLowerCase()];
          return nuevoSal != null ? { ...op, salario: nuevoSal } : op;
        }),
      })));
    }
    alert(`Parámetros actualizados desde la versión "${versionVigente.nota}" (${new Date(versionVigente.fecha).toLocaleDateString("es-CO")})`);
  };

  /* ===== equipos productivos ===== */
  const [equipos, setEquipos] = useState([
    {
      id: ID_EXT,
      nombre: "Extrusora",
      energia: energiaBase({ id: uid(), nombre: "Extrusora", kw: 50, compartido: 1 }),
      operarios: operariosBase(),
    },
    {
      id: ID_INY,
      nombre: "Inyectora",
      energia: energiaBase({ id: uid(), nombre: "Inyectora", kw: 14, compartido: 1 }),
      operarios: operariosBase(),
    },
    {
      id: ID_AUT,
      nombre: "Automática",
      energia: energiaAutomatica(),
      operarios: operariosBase(),
    },
    {
      id: ID_SEL,
      nombre: "Selladora",
      energia: energiaSelladora(),
      operarios: operariosBase(),
    },
    {
      id: ID_ETI,
      nombre: "Etiquetadora",
      energia: [
        { id: uid(), nombre: "Etiquetadora", kw: 0.5, compartido: 1 },
        { id: uid(), nombre: "Compresor", kw: 4, compartido: 8 },
        { id: uid(), nombre: "Luminaria", kw: 0.15, compartido: 12 },
      ],
      operarios: operariosBase(),
    },
    {
      id: ID_SER,
      nombre: "Serigrafía (Screen)",
      energia: [
        { id: uid(), nombre: "Screen", kw: 1.125, compartido: 1 },
        { id: uid(), nombre: "Compresor", kw: 4, compartido: 8 },
        { id: uid(), nombre: "Luminaria", kw: 0.15, compartido: 12 },
      ],
      operarios: operariosBase(),
    },
    {
      id: ID_HOT,
      nombre: "Hot Stamping",
      energia: [
        { id: uid(), nombre: "Hot Stamping", kw: 2, compartido: 1 },
        { id: uid(), nombre: "Compresor", kw: 4, compartido: 8 },
        { id: uid(), nombre: "Luminaria", kw: 0.15, compartido: 12 },
      ],
      operarios: operariosBase(),
    },
  ]);

  /* ===== partes del tubo ===== */
  const [partes, setPartes] = useState([
    {
      id: uid(),
      nombre: "Manga",
      codigo: "pp015",
      producto: "Manga 50X160 mm Blanco",
      equipoId: ID_EXT,
      peso: 4.75,
      rama: 0,
      merma: 30,
      segUnd: 2,
      capas: [
        {
          id: uid(), nombre: "Capa interna", pct: 80,
          materiales: [
            { id: uid(), nombre: "PEBAJA", pct: 70, precio: 7.5 },
            { id: uid(), nombre: "PEALTA", pct: 30, precio: 6.5 },
            { id: uid(), nombre: "PIGMENTO", pct: 30, modo: "grkg", precio: 18 },
          ],
        },
        {
          id: uid(), nombre: "Capa externa", pct: 20,
          materiales: [
            { id: uid(), nombre: "PEBAJA", pct: 90, precio: 6.8 },
            { id: uid(), nombre: "PEALTA", pct: 10, precio: 5.8 },
            { id: uid(), nombre: "PIGMENTO", pct: 30, modo: "grkg", precio: 18 },
          ],
        },
      ],
    },
    {
      id: uid(),
      nombre: "Hombro",
      codigo: "PP025",
      producto: "Hombro M15 Negro",
      equipoId: ID_INY,
      peso: 4,
      rama: 0.31,
      merma: 50,
      segUnd: 3.5,
      capas: [
        {
          id: uid(), nombre: "Materia prima", pct: 100,
          materiales: [
            { id: uid(), nombre: "PEALTA", pct: 100, precio: 5.8 },
            { id: uid(), nombre: "PIGMENTO", pct: 0.03, precio: 18 },
          ],
        },
      ],
    },
    {
      id: uid(),
      nombre: "Ensamble tubo",
      codigo: "PT047",
      producto: "Tubo 35X80mm M15/5 Blanco TPF Blanco DR. MELAXIN",
      equipoId: ID_AUT,
      peso: 0,
      rama: 0,
      merma: 0,
      segUnd: 2,
      capas: [
        {
          id: uid(), nombre: "Componentes", pct: 100,
          materiales: [
            { id: uid(), nombre: "Liner inducción", pct: 1, modo: "und", precio: 8 },
            { id: uid(), nombre: "Tapa", pct: 1, modo: "und", precio: 280 },
          ],
        },
      ],
    },
    {
      id: uid(),
      nombre: "Sellado",
      codigo: "PT028",
      producto: "Sellado final del tubo",
      equipoId: ID_SEL,
      peso: 0,
      rama: 0,
      merma: 0,
      segUnd: 2,
      capas: [],
    },
    {
      id: uid(),
      nombre: "Etiquetado",
      codigo: "",
      producto: "Etiquetado del tubo",
      equipoId: ID_ETI,
      peso: 0,
      rama: 0,
      merma: 0,
      segUnd: 2,
      capas: [
        {
          id: uid(), nombre: "Componentes", pct: 100,
          materiales: [
            { id: uid(), nombre: "Etiqueta", pct: 1, modo: "und", precio: 0 },
          ],
        },
      ],
    },
    {
      id: uid(),
      tipo: "serigrafia",
      nombre: "Serigrafía",
      codigo: "",
      producto: "Impresión serigráfica del tubo",
      equipoId: ID_SER,
      // parámetros específicos de serigrafía
      golpes: 1,
      segUnd: 2,       // seg/und por golpe
      setupSeg: 1800,  // 30 min por golpe
      // tinta
      tintaGr: 40,     // g por lote de referencia
      tintaUnds: 500,  // unds del lote de referencia
      tintaPrecio: 0,  // $/g
      // preprensa
      positivo: 0,     // $ total (÷ escala)
      malla: 0,        // $ total (÷ vidaMalla)
      vidaMalla: 30000,
      marco: 0,        // $ total (÷ vidaMarco)
      vidaMarco: 150000,
      // datos genéricos que no aplican (para no romper otras partes del render)
      peso: 0, rama: 0, merma: 0, capas: [],
    },
    {
      id: uid(),
      nombre: "Hot Stamping",
      codigo: "",
      producto: "Estampado en caliente del tubo",
      equipoId: ID_HOT,
      peso: 0,
      rama: 0,
      merma: 0,
      segUnd: 2,
      capas: [
        {
          id: uid(), nombre: "Componentes", pct: 100,
          materiales: [
            { id: uid(), nombre: "Foil / lámina", pct: 1, modo: "und", precio: 0 },
          ],
        },
      ],
    },
    {
      id: uid(),
      tipo: "logistica",
      nombre: "Logística",
      codigo: "PT002",
      producto: "Empaque · transporte · exportación",
      equipoId: "",
      undsPorCaja: 714,
      empaque: [
        { id: uid(), nombre: "Caja", cantidad: 1, precio: 6500 },
        { id: uid(), nombre: "Bolsa", cantidad: 2, precio: 500 },
      ],
      transportePorCaja: 20000,
      exportacion: 0,
      // datos genéricos no aplican
      peso: 0, rama: 0, merma: 0, segUnd: 0, capas: [],
    },
  ]);

  const [abiertas, setAbiertas] = useState({});
  const isOpen = (k) => abiertas[k] !== false;
  const toggle = (k) => setAbiertas((a) => ({ ...a, [k]: !isOpen(k) }));

  const [compacto, setCompacto] = useState(false);
  const [ocultarParams, setOcultarParams] = useState(true);
  const [copiado, setCopiado] = useState(false);
  const [rentabilidadPct, setRentabilidadPct] = useState(30);

  const hoyISO = () => new Date().toISOString().slice(0, 10);
  const [ficha, setFicha] = useState({
    codigo: "PT047",
    producto: "Tubo 35X80mm M15/5 Blanco TPF Blanco DR. MELAXIN",
    fecha: hoyISO(),
    escala: 5000,
  });

  const expandirTodo = () => {
    const idsLogistica = partes.filter((p) => p.tipo === "logistica").map((p) => p.id);
    const keys = ["params", ...equipos.map((e) => e.id), ...idsLogistica];
    const nuevo = {};
    keys.forEach((k) => { nuevo[k] = true; });
    setAbiertas(nuevo);
  };
  const colapsarTodo = () => {
    const idsLogistica = partes.filter((p) => p.tipo === "logistica").map((p) => p.id);
    const keys = ["params", ...equipos.map((e) => e.id), ...idsLogistica];
    const nuevo = {};
    keys.forEach((k) => { nuevo[k] = false; });
    setAbiertas(nuevo);
  };

  const irA = (id) => {
    setAbiertas((a) => ({ ...a, [id]: true }));
    if (id === "params") setOcultarParams(false);
    setTimeout(() => {
      document.getElementById(`sec-${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  /* ===== cálculos ===== */
  const calc = useMemo(() => {
    const segMes = (Number(horasDia) || 0) * (Number(diasMes) || 0) * 3600;
    const regla = equiposFacturan.length || 1;

    const totalFijosMes = costosFijos.reduce((s, c) => s + (Number(c.valor) || 0), 0);
    const fijosSeg = segMes ? totalFijosMes / regla / segMes : 0;
    const totalAdminMes = nominaAdmin.reduce((s, c) => s + (Number(c.valor) || 0), 0);
    const adminSeg = segMes ? totalAdminMes / regla / segMes : 0;
    const cargaFijaSeg = fijosSeg + adminSeg;

    const equiposCalc = equipos.map((eq) => {
      const energiaRows = eq.energia.map((e) => {
        const hora = (Number(e.kw) || 0) * (Number(costoKwh) || 0);
        const seg = hora / 3600 / (Number(e.compartido) || 1);
        return { ...e, hora, seg };
      });
      const energiaSeg = energiaRows.reduce((s, e) => s + e.seg, 0);
      const operariosRows = eq.operarios.map((o) => ({
        ...o,
        seg: segMes ? (Number(o.salario) || 0) / (Number(o.regla) || 1) / segMes : 0,
      }));
      const operariosSeg = operariosRows.reduce((s, o) => s + o.seg, 0);
      return { ...eq, energiaRows, energiaSeg, operariosRows, operariosSeg, tarifa: cargaFijaSeg + energiaSeg + operariosSeg };
    });

    const tarifaDe = (id) => equiposCalc.find((e) => e.id === id)?.tarifa || 0;
    const nombreEq = (id) => equiposCalc.find((e) => e.id === id)?.nombre || "—";

    const partesCalc = partes.map((p) => {
      const tarifa = tarifaDe(p.equipoId);
      const nombreEquipo = nombreEq(p.equipoId);

      // === CASO ESPECIAL: LOGÍSTICA ===
      if (p.tipo === "logistica") {
        const unds = Number(p.undsPorCaja) || 1;
        const empaqueRows = (p.empaque || []).map((m) => {
          const totalPorCaja = (Number(m.cantidad) || 0) * (Number(m.precio) || 0);
          const porTubo = totalPorCaja / unds;
          return { ...m, totalPorCaja, porTubo };
        });
        const empaquePorTubo = empaqueRows.reduce((s, m) => s + m.porTubo, 0);
        const transportePorTubo = (Number(p.transportePorCaja) || 0) / unds;
        const exportacionPorTubo = Number(p.exportacion) || 0;
        const total = empaquePorTubo + transportePorTubo + exportacionPorTubo;
        return {
          ...p, base: 0, consumoTotal: 0, capasCalc: [], totalMP: total,
          tarifa: 0, nombreEquipo: "Logística", costoProceso: 0,
          total, empaqueRows, empaquePorTubo, transportePorTubo, exportacionPorTubo,
        };
      }

      // === CASO ESPECIAL: SERIGRAFÍA ===
      if (p.tipo === "serigrafia") {
        const escala = Number(ficha.escala) || 1;
        const golpes = Number(p.golpes) || 0;
        const gTintaPorTubo = ((Number(p.tintaGr) || 0) / (Number(p.tintaUnds) || 1));
        const costoTintaPorGolpe = gTintaPorTubo * (Number(p.tintaPrecio) || 0);
        const costoProcesoPorGolpe = (Number(p.segUnd) || 0) * tarifa;
        const costoSetupPorGolpe = ((Number(p.setupSeg) || 0) * tarifa) / escala;
        const costoPositivoPorGolpe = (Number(p.positivo) || 0) / escala;
        const costoMallaPorGolpe = (Number(p.malla) || 0) / (Number(p.vidaMalla) || 1);
        const costoMarcoPorGolpe = (Number(p.marco) || 0) / (Number(p.vidaMarco) || 1);
        const costoPorGolpe = costoTintaPorGolpe + costoProcesoPorGolpe + costoSetupPorGolpe + costoPositivoPorGolpe + costoMallaPorGolpe + costoMarcoPorGolpe;
        const total = costoPorGolpe * golpes;
        const desglose = {
          tinta: costoTintaPorGolpe * golpes,
          proceso: costoProcesoPorGolpe * golpes,
          setup: costoSetupPorGolpe * golpes,
          positivo: costoPositivoPorGolpe * golpes,
          malla: costoMallaPorGolpe * golpes,
          marco: costoMarcoPorGolpe * golpes,
        };
        return {
          ...p, base: 0, consumoTotal: 0, capasCalc: [], totalMP: desglose.tinta,
          tarifa, nombreEquipo, costoProceso: desglose.proceso,
          total, desglose, gTintaPorTubo, costoPorGolpe,
        };
      }

      // === CASO GENERAL: peso/gramos + capas ===
      const base = (Number(p.peso) || 0) + (Number(p.rama) || 0);
      const consumoTotal = base * (1 + (Number(p.merma) || 0) / 100);
      const capasCalc = p.capas.map((c) => {
        const gramos = consumoTotal * ((Number(c.pct) || 0) / 100);
        const materiales = c.materiales.map((m) => {
          let cons, costo;
          if (m.modo === "und") {
            cons = Number(m.pct) || 0;
            costo = cons * (Number(m.precio) || 0);
          } else if (m.modo === "grkg") {
            cons = (gramos * (Number(m.pct) || 0)) / 1000;
            costo = cons * (Number(m.precio) || 0);
          } else {
            cons = gramos * ((Number(m.pct) || 0) / 100);
            costo = cons * (Number(m.precio) || 0);
          }
          return { ...m, cons, costo };
        });
        return { ...c, gramos, materiales, costo: materiales.reduce((s, m) => s + m.costo, 0) };
      });
      const totalMP = capasCalc.reduce((s, c) => s + c.costo, 0);
      const costoProceso = (Number(p.segUnd) || 0) * tarifa;
      return { ...p, base, consumoTotal, capasCalc, totalMP, tarifa, nombreEquipo, costoProceso, total: totalMP + costoProceso };
    });

    const totalTubo = partesCalc.reduce((s, p) => s + p.total, 0);

    return { segMes, regla, totalFijosMes, fijosSeg, totalAdminMes, adminSeg, cargaFijaSeg, equiposCalc, partesCalc, totalTubo };
  }, [horasDia, diasMes, costoKwh, equiposFacturan, costosFijos, nominaAdmin, equipos, partes, ficha]);

  // ===== EXPORTAR A GOOGLE SHEETS =====
  // Misma URL que el maestro: el nuevo script v3 maneja ambos (costeos + maestro)
  const WEBHOOK_URL = MAESTRO_API_URL;
  const [enviando, setEnviando] = useState(false);
  const [modoEnvio, setModoEnvio] = useState("automatico"); // "automatico" o "copiar"

  const construirDatos = () => {
    const costoDe = (nombre) => {
      const p = calc.partesCalc.find((x) => (x.nombre || "").toLowerCase() === nombre.toLowerCase());
      return p ? p.total : 0;
    };
    const tarifaDe = (nombre) => {
      const e = calc.equiposCalc.find((x) => (x.nombre || "").toLowerCase().includes(nombre.toLowerCase()));
      return e ? e.tarifa : 0;
    };
    const precioMP = (nombre) => {
      for (const p of partes) {
        for (const c of (p.capas || [])) {
          for (const m of (c.materiales || [])) {
            if ((m.nombre || "").toLowerCase() === nombre.toLowerCase()) return Number(m.precio) || 0;
          }
        }
      }
      return 0;
    };
    const serigrafia = partes.find((p) => p.tipo === "serigrafia");
    const golpes = serigrafia ? (Number(serigrafia.golpes) || 0) : 0;
    const precioTinta = serigrafia ? (Number(serigrafia.tintaPrecio) || 0) : 0;

    return {
      fecha: ficha.fecha,
      codigo: ficha.codigo,
      producto: ficha.producto,
      escala: ficha.escala,
      manga: costoDe("Manga"),
      hombro: costoDe("Hombro"),
      ensamble: costoDe("Ensamble tubo"),
      sellado: costoDe("Sellado"),
      etiquetado: costoDe("Etiquetado"),
      serigrafia: costoDe("Serigrafía"),
      logistica: costoDe("Logística"),
      costoTotal: calc.totalTubo,
      kwh: Number(costoKwh) || 0,
      cargaFija: calc.cargaFijaSeg,
      tarifaExtrusora: tarifaDe("Extrusora"),
      tarifaInyectora: tarifaDe("Inyectora"),
      pebaja: precioMP("PEBAJA"),
      pealta: precioMP("PEALTA"),
      pigmento: precioMP("PIGMENTO"),
      precioTinta,
      golpes,
      notas: "",
      // Rentabilidad y precio calculado (markup sobre costo)
      rentabilidadPct: Number(rentabilidadPct) || 0,
      precioVenta: calc.totalTubo * (1 + (Number(rentabilidadPct) || 0) / 100),
      utilidadTubo: calc.totalTubo * ((Number(rentabilidadPct) || 0) / 100),
      utilidadLote: calc.totalTubo * ((Number(rentabilidadPct) || 0) / 100) * (Number(ficha.escala) || 0),
    };
  };

  const exportarFila = async () => {
    const datos = construirDatos();

    if (modoEnvio === "automatico") {
      setEnviando(true);
      try {
        // Construir URL con los datos como parámetros GET
        const params = new URLSearchParams();
        for (const key in datos) {
          params.append(key, datos[key]);
        }
        const url = WEBHOOK_URL + "?" + params.toString();

        // GET simple con no-cors (funciona con Google Apps Script)
        await fetch(url, {
          method: "GET",
          mode: "no-cors",
        });

        setCopiado(true);
        setTimeout(() => setCopiado(false), 3000);
      } catch (error) {
        alert("Error al enviar a Google Sheets:\n\n" + error.message);
      } finally {
        setEnviando(false);
      }
    } else {
      // Modo copiar/pegar (fallback)
      // El consecutivo lo genera el script del Sheets automáticamente; en modo copiar queda vacío (se puede llenar a mano)
      const orden = ["fecha","codigo","producto","escala","manga","hombro","ensamble","sellado","etiquetado","serigrafia","logistica","costoTotal","kwh","cargaFija","tarifaExtrusora","tarifaInyectora","pebaja","pealta","pigmento","precioTinta","golpes","notas","rentabilidadPct","precioVenta","utilidadTubo","utilidadLote"];
      const tsv = orden.map((k) => {
        const v = datos[k];
        if (typeof v === "number") return v.toLocaleString("es-CO", { maximumFractionDigits: 4, useGrouping: false });
        return String(v ?? "").replace(/\t/g, " ").replace(/\n/g, " ");
      }).join("\t");
      navigator.clipboard.writeText(tsv).then(() => {
        setCopiado(true);
        setTimeout(() => setCopiado(false), 2500);
      });
    }
  };

  /* ===== helpers de edición ===== */
  const upList = (setter) => (id, key, val) => setter((rows) => rows.map((r) => (r.id === id ? { ...r, [key]: val } : r)));
  const rmList = (setter) => (id) => setter((rows) => rows.filter((r) => r.id !== id));
  const upFijo = upList(setCostosFijos);
  const upAdmin = upList(setNominaAdmin);
  const upEqF = upList(setEquiposFacturan);

  const setEquipo = (id, fn) => setEquipos((es) => es.map((e) => (e.id === id ? fn(e) : e)));
  const upEnergia = (eqId, rowId, key, val) =>
    setEquipo(eqId, (e) => ({ ...e, energia: e.energia.map((r) => (r.id === rowId ? { ...r, [key]: val } : r)) }));
  const upOperario = (eqId, rowId, key, val) =>
    setEquipo(eqId, (e) => ({ ...e, operarios: e.operarios.map((r) => (r.id === rowId ? { ...r, [key]: val } : r)) }));

  const setParte = (id, fn) => setPartes((ps) => ps.map((p) => (p.id === id ? fn(p) : p)));
  const upParte = (id, key, val) => setParte(id, (p) => ({ ...p, [key]: val }));
  const upCapa = (parteId, capaId, key, val) =>
    setParte(parteId, (p) => ({ ...p, capas: p.capas.map((c) => (c.id === capaId ? { ...c, [key]: val } : c)) }));
  const upMat = (parteId, capaId, matId, key, val) =>
    setParte(parteId, (p) => ({
      ...p,
      capas: p.capas.map((c) =>
        c.id === capaId ? { ...c, materiales: c.materiales.map((m) => (m.id === matId ? { ...m, [key]: val } : m)) } : c
      ),
    }));

  const monoSm = { fontFamily: "'IBM Plex Mono', monospace", fontSize: 12.5 };

  return (
    <div style={{ minHeight: "100vh", background: S.bg, fontFamily: "'Archivo', sans-serif", color: S.ink }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Archivo:wght@400;600;700;900&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
        input:focus, select:focus { outline: 2px solid ${S.accent}; outline-offset: 1px; }
        button:focus-visible { outline: 2px solid ${S.accent}; outline-offset: 2px; }
        @media (max-width: 900px) {
          .app-wrap { flex-direction: column !important; }
          .app-sidebar { width: 100% !important; position: static !important; max-height: none !important; }
        }
      `}</style>

      {/* ============================================================= */}
      {/* ============= MAESTRO DE PARÁMETROS (modal) ================= */}
      {/* ============================================================= */}
      {vistaMaestro && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(27, 43, 58, 0.75)",
          zIndex: 1000, overflowY: "auto", padding: 20,
        }}>
          <div style={{
            maxWidth: 1100, margin: "0 auto", background: S.bg,
            borderRadius: 12, overflow: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
          }}>
            {/* Header del maestro */}
            <header style={{
              background: S.ink, color: "#fff", padding: "18px 24px",
              display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap",
            }}>
              <Settings size={22} color={S.accent} />
              <div style={{ flex: 1, minWidth: 200 }}>
                <h2 style={{ margin: 0, fontSize: 17, fontWeight: 900, letterSpacing: "0.02em" }}>
                  MAESTRO DE PARÁMETROS
                </h2>
                <p style={{ margin: 0, fontSize: 12, color: "#AEC0CE", fontFamily: "'IBM Plex Mono', monospace" }}>
                  Tabla maestra · versión vigente + histórico de cambios
                </p>
              </div>
              <button
                onClick={() => setVistaMaestro(false)}
                style={{
                  background: "transparent", color: "#fff", border: "1px solid #AEC0CE",
                  borderRadius: 6, padding: "7px 14px", fontSize: 12.5, cursor: "pointer",
                  fontFamily: "inherit", fontWeight: 700,
                }}
              >
                Cerrar · volver al costeo
              </button>
            </header>

            {/* Mensaje flash */}
            {mensajeMaestro && (
              <div style={{
                background: S.ok, color: "#fff", padding: "10px 24px",
                fontSize: 13, fontWeight: 700,
              }}>
                {mensajeMaestro}
              </div>
            )}

            <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 16 }}>

              {/* ===== SECCIÓN 1: Formulario (versión en edición) ===== */}
              <section style={{
                background: "#fff", border: `1px solid ${S.line}`, borderRadius: 10, overflow: "hidden",
              }}>
                <div style={{
                  padding: "12px 16px", background: "#F6F8FA",
                  borderBottom: `1px solid ${S.line}`,
                  display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, flexWrap: "wrap",
                }}>
                  <h3 style={{ margin: 0, fontSize: 14, fontWeight: 800 }}>Versión en edición</h3>
                  <span style={{ ...monoSm, color: S.steel }}>
                    Edita los valores y guarda una nueva versión cuando apliquen
                  </span>
                </div>

                <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 14 }}>

                  {/* Capacidad y kWh */}
                  <div>
                    <div style={{ fontSize: 11.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: S.steel, marginBottom: 8 }}>
                      Capacidad y energía
                    </div>
                    <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                      <Field label="Horas por día" minW={90}>
                        <NumInput value={maestroForm.horasDia} onChange={(v) => setMaestroForm({ ...maestroForm, horasDia: v })} />
                      </Field>
                      <Field label="Días por mes" minW={90}>
                        <NumInput value={maestroForm.diasMes} onChange={(v) => setMaestroForm({ ...maestroForm, diasMes: v })} />
                      </Field>
                      <Field label="Costo kWh" minW={110}>
                        <NumInput value={maestroForm.costoKwh} onChange={(v) => setMaestroForm({ ...maestroForm, costoKwh: v })} />
                      </Field>
                    </div>
                  </div>

                  {/* Equipos que facturan */}
                  <div>
                    <div style={{ fontSize: 11.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: S.steel, marginBottom: 8 }}>
                      Equipos que aportan facturación
                    </div>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      {maestroForm.equiposFacturan.map((e) => (
                        <div key={e.id} style={{ display: "flex", alignItems: "center", gap: 4, border: `1px solid ${S.line}`, borderRadius: 6, padding: "4px 6px", background: "#F6F8FA" }}>
                          <input
                            style={{ ...inputStyle, border: "none", background: "transparent", width: 120, padding: "2px 4px" }}
                            value={e.nombre}
                            placeholder="Nombre"
                            onChange={(ev) => setMaestroForm({
                              ...maestroForm,
                              equiposFacturan: maestroForm.equiposFacturan.map((x) => x.id === e.id ? { ...x, nombre: ev.target.value } : x),
                            })}
                          />
                          <button
                            onClick={() => setMaestroForm({
                              ...maestroForm,
                              equiposFacturan: maestroForm.equiposFacturan.filter((x) => x.id !== e.id),
                            })}
                            style={{ border: "none", background: "transparent", color: "#B04434", cursor: "pointer", padding: 2 }}
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      ))}
                      <AddBtn onClick={() => setMaestroForm({
                        ...maestroForm,
                        equiposFacturan: [...maestroForm.equiposFacturan, { id: uid(), nombre: "" }],
                      })}>Agregar equipo</AddBtn>
                    </div>
                  </div>

                  {/* Costos fijos */}
                  <div>
                    <div style={{ fontSize: 11.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: S.steel, marginBottom: 8 }}>
                      Costos fijos mensuales
                    </div>
                    {maestroForm.costosFijos.map((c) => (
                      <RowShell key={c.id} onRemove={() => setMaestroForm({
                        ...maestroForm,
                        costosFijos: maestroForm.costosFijos.filter((x) => x.id !== c.id),
                      })}>
                        <Field label="Concepto" flex={2}>
                          <input
                            style={inputStyle}
                            value={c.concepto}
                            placeholder="Arriendo, préstamo, etc."
                            onChange={(ev) => setMaestroForm({
                              ...maestroForm,
                              costosFijos: maestroForm.costosFijos.map((x) => x.id === c.id ? { ...x, concepto: ev.target.value } : x),
                            })}
                          />
                        </Field>
                        <Field label="Valor mensual">
                          <NumInput value={c.valor} onChange={(v) => setMaestroForm({
                            ...maestroForm,
                            costosFijos: maestroForm.costosFijos.map((x) => x.id === c.id ? { ...x, valor: v } : x),
                          })} />
                        </Field>
                      </RowShell>
                    ))}
                    <AddBtn onClick={() => setMaestroForm({
                      ...maestroForm,
                      costosFijos: [...maestroForm.costosFijos, { id: uid(), concepto: "", valor: "" }],
                    })}>Agregar concepto</AddBtn>
                  </div>

                  {/* Nómina administrativa */}
                  <div>
                    <div style={{ fontSize: 11.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: S.steel, marginBottom: 8 }}>
                      Nómina administrativa
                    </div>
                    {maestroForm.nominaAdmin.map((c) => (
                      <RowShell key={c.id} onRemove={() => setMaestroForm({
                        ...maestroForm,
                        nominaAdmin: maestroForm.nominaAdmin.filter((x) => x.id !== c.id),
                      })}>
                        <Field label="Concepto" flex={2}>
                          <input
                            style={inputStyle}
                            value={c.concepto}
                            placeholder="Personal administrativo"
                            onChange={(ev) => setMaestroForm({
                              ...maestroForm,
                              nominaAdmin: maestroForm.nominaAdmin.map((x) => x.id === c.id ? { ...x, concepto: ev.target.value } : x),
                            })}
                          />
                        </Field>
                        <Field label="Valor mensual">
                          <NumInput value={c.valor} onChange={(v) => setMaestroForm({
                            ...maestroForm,
                            nominaAdmin: maestroForm.nominaAdmin.map((x) => x.id === c.id ? { ...x, valor: v } : x),
                          })} />
                        </Field>
                      </RowShell>
                    ))}
                    <AddBtn onClick={() => setMaestroForm({
                      ...maestroForm,
                      nominaAdmin: [...maestroForm.nominaAdmin, { id: uid(), concepto: "", valor: "" }],
                    })}>Agregar concepto</AddBtn>
                  </div>

                  {/* Salarios de operarios */}
                  <div>
                    <div style={{ fontSize: 11.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: S.steel, marginBottom: 8 }}>
                      Salarios de operarios (por cargo)
                    </div>
                    <div style={{ fontSize: 11.5, color: S.steel, marginBottom: 8 }}>
                      Estos salarios se aplican a todos los equipos donde exista ese cargo.
                    </div>
                    {maestroForm.salariosOperarios.map((s) => (
                      <RowShell key={s.id} onRemove={() => setMaestroForm({
                        ...maestroForm,
                        salariosOperarios: maestroForm.salariosOperarios.filter((x) => x.id !== s.id),
                      })}>
                        <Field label="Cargo" flex={2}>
                          <input
                            style={inputStyle}
                            value={s.cargo}
                            placeholder="Operario de producción"
                            onChange={(ev) => setMaestroForm({
                              ...maestroForm,
                              salariosOperarios: maestroForm.salariosOperarios.map((x) => x.id === s.id ? { ...x, cargo: ev.target.value } : x),
                            })}
                          />
                        </Field>
                        <Field label="Salario mensual">
                          <NumInput value={s.salario} onChange={(v) => setMaestroForm({
                            ...maestroForm,
                            salariosOperarios: maestroForm.salariosOperarios.map((x) => x.id === s.id ? { ...x, salario: v } : x),
                          })} />
                        </Field>
                      </RowShell>
                    ))}
                    <AddBtn onClick={() => setMaestroForm({
                      ...maestroForm,
                      salariosOperarios: [...maestroForm.salariosOperarios, { id: uid(), cargo: "", salario: "" }],
                    })}>Agregar cargo</AddBtn>
                  </div>

                  {/* Guardar nueva versión */}
                  <div style={{
                    marginTop: 8, padding: 14,
                    background: "#F6F8FA", border: `1px dashed ${S.steel}`, borderRadius: 8,
                    display: "flex", gap: 10, flexWrap: "wrap", alignItems: "flex-end",
                  }}>
                    <Field label="Nota de la versión (ej: Ajuste anual 2027)" flex={2}>
                      <input
                        style={inputStyle}
                        value={maestroNota}
                        onChange={(e) => setMaestroNota(e.target.value)}
                        placeholder="Describe por qué guardas esta versión"
                      />
                    </Field>
                    <button
                      onClick={guardarNuevaVersion}
                      style={{
                        background: S.accent, color: "#fff", border: "none", borderRadius: 6,
                        padding: "9px 18px", fontSize: 13, fontWeight: 700, cursor: "pointer",
                        fontFamily: "inherit",
                      }}
                    >
                      Guardar nueva versión
                    </button>
                  </div>
                </div>
              </section>

              {/* ===== SECCIÓN 2: Histórico ===== */}
              <section style={{
                background: "#fff", border: `1px solid ${S.line}`, borderRadius: 10, overflow: "hidden",
              }}>
                <div style={{
                  padding: "12px 16px", background: "#F6F8FA",
                  borderBottom: `1px solid ${S.line}`,
                  display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, flexWrap: "wrap",
                }}>
                  <h3 style={{ margin: 0, fontSize: 14, fontWeight: 800 }}>
                    Histórico de versiones ({maestroVersiones.length})
                  </h3>
                  <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                    {versionVigente && (
                      <span style={{ ...monoSm, color: S.ok, fontWeight: 700 }}>
                        Vigente: {versionVigente.nota}
                      </span>
                    )}
                    <button
                      onClick={recargarMaestro}
                      disabled={cargandoMaestro}
                      style={{
                        background: "transparent", border: `1px solid ${S.steel}`,
                        color: S.steel, borderRadius: 5, padding: "5px 10px",
                        fontSize: 11.5, cursor: cargandoMaestro ? "wait" : "pointer",
                        fontFamily: "inherit", fontWeight: 700,
                        opacity: cargandoMaestro ? 0.6 : 1,
                      }}
                    >
                      {cargandoMaestro ? "Cargando…" : "↻ Recargar de Sheets"}
                    </button>
                  </div>
                </div>

                <div style={{ padding: 16 }}>
                  {maestroVersiones.length === 0 ? (
                    <div style={{ textAlign: "center", padding: 24, color: S.steel, fontSize: 13 }}>
                      Todavía no has guardado ninguna versión.
                      <br />
                      Llena el formulario de arriba, ponle una nota (ej: "Versión inicial 2026")
                      y pulsa <strong>Guardar nueva versión</strong>.
                    </div>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {[...maestroVersiones].reverse().map((v, idx) => {
                        const esVigente = v.id === versionVigente?.id;
                        const detalleAbierto = verDetalleVersion === v.id;
                        return (
                          <div key={v.id} style={{
                            border: `1px solid ${esVigente ? S.ok : S.line}`,
                            borderLeft: `4px solid ${esVigente ? S.ok : S.steel}`,
                            borderRadius: 8, overflow: "hidden",
                          }}>
                            <div style={{
                              padding: "10px 14px", display: "flex", alignItems: "center",
                              gap: 10, flexWrap: "wrap",
                              background: esVigente ? "#F0F6EF" : "#fff",
                            }}>
                              <div style={{ flex: 1, minWidth: 200 }}>
                                <div style={{ fontWeight: 700, fontSize: 13 }}>
                                  {v.nota}
                                  {esVigente && (
                                    <span style={{
                                      marginLeft: 8, fontSize: 10.5, color: "#fff",
                                      background: S.ok, padding: "2px 6px", borderRadius: 4,
                                      textTransform: "uppercase", letterSpacing: "0.08em",
                                    }}>
                                      Vigente
                                    </span>
                                  )}
                                </div>
                                <div style={{ ...monoSm, color: S.steel }}>
                                  {new Date(v.fecha).toLocaleString("es-CO")}
                                </div>
                              </div>
                              <button
                                onClick={() => setVerDetalleVersion(detalleAbierto ? null : v.id)}
                                style={{
                                  background: "transparent", border: `1px solid ${S.line}`,
                                  color: S.ink, borderRadius: 5, padding: "5px 10px",
                                  fontSize: 11.5, cursor: "pointer", fontFamily: "inherit",
                                }}
                              >
                                {detalleAbierto ? "Ocultar detalle" : "Ver detalle"}
                              </button>
                              <button
                                onClick={() => cargarVersionEnFormulario(v.id)}
                                style={{
                                  background: "transparent", border: `1px solid ${S.steel}`,
                                  color: S.steel, borderRadius: 5, padding: "5px 10px",
                                  fontSize: 11.5, cursor: "pointer", fontFamily: "inherit", fontWeight: 700,
                                }}
                              >
                                Cargar en formulario
                              </button>
                              <button
                                onClick={() => eliminarVersion(v.id)}
                                title="Eliminar versión"
                                style={{
                                  background: "transparent", border: "none",
                                  color: "#B04434", cursor: "pointer", padding: 4,
                                }}
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                            {detalleAbierto && (
                              <div style={{
                                padding: 14, background: "#F6F8FA",
                                borderTop: `1px solid ${S.line}`, ...monoSm,
                              }}>
                                <div><strong>Capacidad:</strong> {v.datos.horasDia}h × {v.datos.diasMes}d · kWh {fmt0(Number(v.datos.costoKwh) || 0)}</div>
                                <div style={{ marginTop: 6 }}>
                                  <strong>Equipos que facturan ({(v.datos.equiposFacturan || []).length}):</strong>{" "}
                                  {(v.datos.equiposFacturan || []).map((x) => x.nombre).filter(Boolean).join(" · ")}
                                </div>
                                <div style={{ marginTop: 6 }}>
                                  <strong>Costos fijos:</strong>
                                  <ul style={{ margin: "4px 0 0 20px", padding: 0 }}>
                                    {(v.datos.costosFijos || []).map((c, i) => (
                                      <li key={i}>{c.concepto}: {fmt0(Number(c.valor) || 0)}</li>
                                    ))}
                                  </ul>
                                </div>
                                <div style={{ marginTop: 6 }}>
                                  <strong>Nómina administrativa:</strong>
                                  <ul style={{ margin: "4px 0 0 20px", padding: 0 }}>
                                    {(v.datos.nominaAdmin || []).map((c, i) => (
                                      <li key={i}>{c.concepto}: {fmt0(Number(c.valor) || 0)}</li>
                                    ))}
                                  </ul>
                                </div>
                                <div style={{ marginTop: 6 }}>
                                  <strong>Salarios de operarios:</strong>
                                  <ul style={{ margin: "4px 0 0 20px", padding: 0 }}>
                                    {(v.datos.salariosOperarios || []).map((s, i) => (
                                      <li key={i}>{s.cargo}: {fmt0(Number(s.salario) || 0)}</li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </section>

            </div>
          </div>
        </div>
      )}

      <header style={{ background: S.ink, color: "#fff", padding: "20px 24px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <Factory size={26} color={S.accent} />
          <div>
            <h1 style={{ margin: 0, fontSize: 19, fontWeight: 900, letterSpacing: "0.02em" }}>COSTEO TUBO COLAPSIBLE</h1>
            <p style={{ margin: 0, fontSize: 12, color: "#AEC0CE", fontFamily: "'IBM Plex Mono', monospace" }}>
              {ficha.producto || "—"} · {ficha.fecha}
            </p>
          </div>
          <div style={{ marginLeft: "auto", display: "flex", gap: 22, flexWrap: "wrap" }}>
            <Kpi label="Partes costeadas" valor={calc.partesCalc.length} />
            <Kpi label="Costo tubo / und (acumulado)" valor={fmt2(calc.totalTubo)} destacado="#FFB36B" />
          </div>
        </div>
      </header>

      <div className="app-wrap" style={{ maxWidth: 1280, margin: "0 auto", padding: 24, display: "flex", gap: 20, alignItems: "flex-start" }}>

        {/* ===== SIDEBAR ===== */}
        <aside className="app-sidebar" style={{ width: 220, flexShrink: 0, position: "sticky", top: 16, alignSelf: "flex-start", maxHeight: "calc(100vh - 32px)", overflowY: "auto" }}>
          <nav style={{ background: "#fff", border: `1px solid ${S.line}`, borderRadius: 10, overflow: "hidden" }}>
            <div style={{ padding: "10px 14px", borderBottom: `1px solid ${S.line}`, background: "#F6F8FA", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: S.steel }}>
              Índice
            </div>
            <button
              onClick={() => irA("params")}
              style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", textAlign: "left", padding: "10px 14px", border: "none", background: "transparent", borderBottom: `1px solid ${S.line}`, cursor: "pointer", fontSize: 13, fontFamily: "inherit", color: S.ink }}
            >
              <Settings size={14} color={S.steel} /> Parámetros generales
            </button>
            <button
              onClick={() => setVistaMaestro(true)}
              style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", textAlign: "left", padding: "10px 14px", border: "none", background: "transparent", borderBottom: `1px solid ${S.line}`, cursor: "pointer", fontSize: 13, fontFamily: "inherit", color: S.ink, borderLeft: `3px solid ${S.ok}` }}
            >
              <Settings size={14} color={S.ok} /> Maestro de parámetros
              {versionVigente && (
                <span style={{ marginLeft: "auto", fontSize: 10, color: S.ok, fontWeight: 700 }}>
                  {maestroVersiones.length}
                </span>
              )}
            </button>
            <button
              onClick={() => {
                document.getElementById("sec-ficha")?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", textAlign: "left", padding: "10px 14px", border: "none", background: "transparent", borderBottom: `1px solid ${S.line}`, cursor: "pointer", fontSize: 13, fontFamily: "inherit", color: S.ink, fontWeight: 700 }}
            >
              <ClipboardList size={14} color={S.accent} /> Ficha del producto
            </button>
            {equipos.map((eq, idx) => {
              const partesEq = calc.partesCalc.filter((p) => p.equipoId === eq.id);
              return (
                <button
                  key={eq.id}
                  onClick={() => irA(eq.id)}
                  style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 2, width: "100%", textAlign: "left", padding: "10px 14px", border: "none", background: "transparent", borderBottom: `1px solid ${S.line}`, cursor: "pointer", fontSize: 13, fontFamily: "inherit", color: S.ink, borderLeft: `3px solid ${COLORES[idx % COLORES.length]}` }}
                >
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontWeight: 700 }}>
                    <Gauge size={13} color={S.accent} /> {eq.nombre || "Equipo"}
                  </span>
                  {partesEq.length > 0 && (
                    <span style={{ fontSize: 11, color: S.steel, marginLeft: 19 }}>
                      {partesEq.map((p) => p.nombre || "—").join(" · ")}
                    </span>
                  )}
                </button>
              );
            })}
            {calc.partesCalc.filter((p) => p.tipo === "logistica").map((p) => (
              <button
                key={p.id}
                onClick={() => irA(p.id)}
                style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 2, width: "100%", textAlign: "left", padding: "10px 14px", border: "none", background: "transparent", borderBottom: `1px solid ${S.line}`, cursor: "pointer", fontSize: 13, fontFamily: "inherit", color: S.ink, borderLeft: `3px solid #7A4460` }}
              >
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontWeight: 700 }}>
                  <ClipboardList size={13} color="#7A4460" /> {p.nombre || "Logística"}
                </span>
                <span style={{ fontSize: 11, color: S.steel, marginLeft: 19 }}>
                  Empaque · transporte
                </span>
              </button>
            ))}
            <div style={{ padding: 10, display: "flex", flexDirection: "column", gap: 6, background: "#F6F8FA" }}>
              <button onClick={expandirTodo} style={{ padding: "6px 10px", border: `1px solid ${S.line}`, borderRadius: 5, background: "#fff", fontSize: 11.5, fontFamily: "inherit", cursor: "pointer", color: S.ink }}>Expandir todo</button>
              <button onClick={colapsarTodo} style={{ padding: "6px 10px", border: `1px solid ${S.line}`, borderRadius: 5, background: "#fff", fontSize: 11.5, fontFamily: "inherit", cursor: "pointer", color: S.ink }}>Colapsar todo</button>
              <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11.5, color: S.ink, cursor: "pointer", padding: "4px 0" }}>
                <input type="checkbox" checked={compacto} onChange={(e) => setCompacto(e.target.checked)} /> Modo compacto
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11.5, color: S.ink, cursor: "pointer", padding: "4px 0" }}>
                <input type="checkbox" checked={ocultarParams} onChange={(e) => setOcultarParams(e.target.checked)} /> Ocultar parámetros
              </label>
            </div>
          </nav>
        </aside>

        <main style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: compacto ? 10 : 16, fontSize: compacto ? 12.5 : 14 }}>

        {/* ===== 1. PARÁMETROS GENERALES ===== */}
        {!ocultarParams && (
        <Seccion
          id="sec-params"
          icono={<Settings size={17} color={S.steel} />}
          titulo="Parámetros generales"
          subtitulo="Base para todos los equipos · actualizable por mes / año"
          dato={`Carga fija: ${fmt2(calc.cargaFijaSeg)}/seg`}
          abierta={isOpen("params")}
          onToggle={() => toggle("params")}
        >
          {/* --- Banda: fuente de datos (maestro) --- */}
          <div style={{
            display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center",
            padding: "10px 14px",
            background: versionVigente ? "#F0F6EF" : "#FFF4EA",
            border: `1px solid ${versionVigente ? "#C7DBC2" : "#F0D6B5"}`,
            borderRadius: 8,
          }}>
            <div style={{ fontSize: 12, color: S.ink, flex: 1, minWidth: 220 }}>
              {versionVigente ? (
                <>
                  <strong>Maestro vigente:</strong> {versionVigente.nota}
                  <span style={{ color: S.steel, marginLeft: 6, ...monoSm }}>
                    ({new Date(versionVigente.fecha).toLocaleDateString("es-CO")})
                  </span>
                </>
              ) : (
                <><strong>Maestro de parámetros:</strong> todavía no hay versiones guardadas.</>
              )}
            </div>
            <button
              onClick={aplicarMaestroAlCosteo}
              disabled={!versionVigente}
              style={{
                border: "none",
                background: versionVigente ? S.ok : S.line,
                color: "#fff",
                borderRadius: 6,
                padding: "7px 14px",
                fontSize: 12.5,
                fontWeight: 700,
                cursor: versionVigente ? "pointer" : "not-allowed",
                fontFamily: "inherit",
              }}
            >
              Actualizar desde maestro
            </button>
            <button
              onClick={() => setVistaMaestro(true)}
              style={{
                border: `1px solid ${S.steel}`,
                background: "#fff",
                color: S.steel,
                borderRadius: 6,
                padding: "7px 14px",
                fontSize: 12.5,
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              Abrir maestro
            </button>
          </div>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Field label="Horas por día" minW={90}><NumInput value={horasDia} onChange={setHorasDia} /></Field>
            <Field label="Días por mes" minW={90}><NumInput value={diasMes} onChange={setDiasMes} /></Field>
            <Field label="Costo kWh (toda la planta)" minW={130}><NumInput value={costoKwh} onChange={setCostoKwh} /></Field>
            <div style={{ ...monoSm, alignSelf: "flex-end", paddingBottom: 8, color: S.steel }}>
              → {num(calc.segMes, 0)} seg/mes por equipo
            </div>
          </div>

          <SubBloque titulo="Equipos que aportan facturación" dato={`Regla de reparto: ÷${calc.regla}`}>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {equiposFacturan.map((e) => (
                <div key={e.id} style={{ display: "flex", alignItems: "center", gap: 4, border: `1px solid ${S.line}`, borderRadius: 6, padding: "4px 6px", background: "#F6F8FA" }}>
                  <input
                    style={{ ...inputStyle, border: "none", background: "transparent", width: 110, padding: "2px 4px" }}
                    value={e.nombre}
                    onChange={(ev) => upEqF(e.id, "nombre", ev.target.value)}
                  />
                  <button onClick={() => rmList(setEquiposFacturan)(e.id)} style={{ border: "none", background: "transparent", color: "#B04434", cursor: "pointer", padding: 2 }}>
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
              <AddBtn onClick={() => setEquiposFacturan((r) => [...r, { id: uid(), nombre: "" }])}>Agregar equipo</AddBtn>
            </div>
          </SubBloque>

          <SubBloque titulo="Costos fijos mensuales" dato={`${fmt0(calc.totalFijosMes)}/mes → ${fmt2(calc.fijosSeg)}/seg`}>
            {costosFijos.map((c) => (
              <RowShell key={c.id} onRemove={() => rmList(setCostosFijos)(c.id)}>
                <Field label="Concepto" flex={2}>
                  <input style={inputStyle} value={c.concepto} onChange={(e) => upFijo(c.id, "concepto", e.target.value)} />
                </Field>
                <Field label="Valor mensual">
                  <NumInput value={c.valor} onChange={(v) => upFijo(c.id, "valor", v)} />
                </Field>
                <div style={{ ...monoSm, minWidth: 95, textAlign: "right", paddingBottom: 9, color: S.steel }}>
                  {fmt2((Number(c.valor) || 0) / calc.regla / (calc.segMes || 1))}/seg
                </div>
              </RowShell>
            ))}
            <AddBtn onClick={() => setCostosFijos((r) => [...r, { id: uid(), concepto: "", valor: "" }])}>Agregar concepto</AddBtn>
          </SubBloque>

          <SubBloque titulo="Nómina administrativa" dato={`${fmt0(calc.totalAdminMes)}/mes → ${fmt2(calc.adminSeg)}/seg`}>
            {nominaAdmin.map((c) => (
              <RowShell key={c.id} onRemove={() => rmList(setNominaAdmin)(c.id)}>
                <Field label="Concepto" flex={2}>
                  <input style={inputStyle} value={c.concepto} onChange={(e) => upAdmin(c.id, "concepto", e.target.value)} />
                </Field>
                <Field label="Valor mensual">
                  <NumInput value={c.valor} onChange={(v) => upAdmin(c.id, "valor", v)} />
                </Field>
              </RowShell>
            ))}
            <AddBtn onClick={() => setNominaAdmin((r) => [...r, { id: uid(), concepto: "", valor: "" }])}>Agregar concepto</AddBtn>
          </SubBloque>

          <div style={{ ...monoSm, background: "#F6F8FA", border: `1px dashed ${S.line}`, borderRadius: 8, padding: "10px 12px", color: S.steel }}>
            Carga fija que hereda cada equipo = (fijos + admin) ÷ {calc.regla} equipos ÷ {num(calc.segMes, 0)} seg
            = <strong style={{ color: S.ink }}>{fmt2(calc.cargaFijaSeg)}/seg</strong>
          </div>
        </Seccion>
        )}

        {/* Resumen compacto cuando los parámetros están ocultos */}
        {ocultarParams && (
          <div
            style={{
              background: "#fff",
              border: `1px solid ${S.line}`,
              borderRadius: 10,
              padding: "10px 14px",
              display: "flex",
              alignItems: "center",
              gap: 14,
              flexWrap: "wrap",
              fontSize: 12.5,
              color: S.steel,
            }}
          >
            <Settings size={14} color={S.steel} />
            <span style={{ fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", fontSize: 11 }}>
              Parámetros generales
            </span>
            <span style={monoSm}>
              {horasDia}h × {diasMes}d · kWh {fmt0(costoKwh)} · {calc.regla} equipos ·
              carga fija <strong style={{ color: S.ink }}>{fmt2(calc.cargaFijaSeg)}/seg</strong>
            </span>
            <button
              onClick={() => setOcultarParams(false)}
              style={{
                marginLeft: "auto",
                border: `1px solid ${S.line}`,
                background: "#fff",
                borderRadius: 5,
                padding: "4px 10px",
                fontSize: 12,
                fontFamily: "inherit",
                cursor: "pointer",
                color: S.ink,
              }}
            >
              Editar
            </button>
          </div>
        )}

        {/* ===== FICHA DEL PRODUCTO A COSTEAR ===== */}
        <section
          id="sec-ficha"
          style={{
            background: S.ink,
            color: "#fff",
            borderRadius: 10,
            padding: 18,
            display: "flex",
            gap: 14,
            flexWrap: "wrap",
            alignItems: "flex-end",
            scrollMarginTop: 16,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <span style={{ fontSize: 10.5, letterSpacing: "0.12em", textTransform: "uppercase", color: "#AEC0CE", fontWeight: 700 }}>
              Ficha de costeo
            </span>
            <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12.5, color: "#AEC0CE" }}>
              Datos del producto que se está liquidando
            </span>
          </div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", flex: 1, minWidth: 320 }}>
            <label style={{ display: "flex", flexDirection: "column", gap: 4, flex: 2, minWidth: 220 }}>
              <span style={{ fontSize: 10.5, letterSpacing: "0.07em", textTransform: "uppercase", color: "#AEC0CE", fontWeight: 600 }}>
                Producto
              </span>
              <input
                style={{ ...inputStyle, background: "#0F1C28", color: "#fff", border: "1px solid #33475A", fontFamily: "'Archivo', sans-serif" }}
                value={ficha.producto}
                onChange={(e) => setFicha({ ...ficha, producto: e.target.value })}
              />
            </label>
            <label style={{ display: "flex", flexDirection: "column", gap: 4, minWidth: 140 }}>
              <span style={{ fontSize: 10.5, letterSpacing: "0.07em", textTransform: "uppercase", color: "#AEC0CE", fontWeight: 600 }}>
                Fecha de costeo
              </span>
              <input
                type="date"
                style={{ ...inputStyle, background: "#0F1C28", color: "#fff", border: "1px solid #33475A" }}
                value={ficha.fecha}
                onChange={(e) => setFicha({ ...ficha, fecha: e.target.value })}
              />
            </label>
            <label style={{ display: "flex", flexDirection: "column", gap: 4, minWidth: 140 }}>
              <span style={{ fontSize: 10.5, letterSpacing: "0.07em", textTransform: "uppercase", color: "#AEC0CE", fontWeight: 600 }}>
                Escala de producción
              </span>
              <select
                style={{ ...inputStyle, background: "#0F1C28", color: "#fff", border: "1px solid #33475A", fontFamily: "'IBM Plex Mono', monospace" }}
                value={ficha.escala}
                onChange={(e) => setFicha({ ...ficha, escala: Number(e.target.value) })}
              >
                <option value={500}>500 und</option>
                <option value={1000}>1.000 und</option>
                <option value={3000}>3.000 und</option>
                <option value={5000}>5.000 und</option>
                <option value={10000}>10.000 und</option>
              </select>
            </label>
          </div>
        </section>

        {/* ===== 2. EQUIPOS PRODUCTIVOS (con su mano de obra y materia prima) ===== */}
        {calc.equiposCalc.map((eq, eqIdx) => {
          const partesEq = calc.partesCalc.filter((p) => p.equipoId === eq.id);
          const colorEq = COLORES[eqIdx % COLORES.length];
          return (
            <Seccion
              key={eq.id}
              id={`sec-${eq.id}`}
              icono={<Gauge size={17} color={S.accent} />}
              titulo={
                <span style={{ display: "inline-flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                  <input
                    style={{ ...inputStyle, width: 180, padding: "3px 8px", fontFamily: "'Archivo', sans-serif", fontWeight: 800 }}
                    value={eq.nombre}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => setEquipo(eq.id, (x) => ({ ...x, nombre: e.target.value }))}
                  />
                  {partesEq.length > 0 && (
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, color: colorEq, fontSize: 13, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                      <span style={{ opacity: 0.5 }}>·</span>
                      {partesEq.map((p) => (p.nombre || "—").toUpperCase()).join(" · ")}
                    </span>
                  )}
                </span>
              }
              subtitulo="Energía · mano de obra productiva · materia prima"
              dato={`Tarifa: ${fmt2(eq.tarifa)}/seg`}
              abierta={isOpen(eq.id)}
              onToggle={() => toggle(eq.id)}
              color={S.accent}
              onRemove={() => setEquipos((es) => es.filter((x) => x.id !== eq.id))}
            >
              {/* --- Energía --- */}
              <SubBloque titulo="Energía (equipos consumidores)" dato={`${fmt2(eq.energiaSeg)}/seg`}>
                {eq.energiaRows.map((e) => (
                  <RowShell key={e.id} onRemove={() => setEquipo(eq.id, (x) => ({ ...x, energia: x.energia.filter((r) => r.id !== e.id) }))}>
                    <Field label="Equipo" flex={1.6}>
                      <input style={inputStyle} value={e.nombre} onChange={(ev) => upEnergia(eq.id, e.id, "nombre", ev.target.value)} />
                    </Field>
                    <Field label="kW promedio" minW={85}>
                      <NumInput value={e.kw} onChange={(v) => upEnergia(eq.id, e.id, "kw", v)} />
                    </Field>
                    <Field label="Compartido entre" minW={85}>
                      <NumInput value={e.compartido} onChange={(v) => upEnergia(eq.id, e.id, "compartido", v)} min={1} step={1} />
                    </Field>
                    <div style={{ ...monoSm, minWidth: 150, textAlign: "right", paddingBottom: 9, color: S.steel }}>
                      {fmt0(e.hora)}/h → <strong style={{ color: S.ink }}>{fmt2(e.seg)}/seg</strong>
                    </div>
                  </RowShell>
                ))}
                <AddBtn onClick={() => setEquipo(eq.id, (x) => ({ ...x, energia: [...x.energia, { id: uid(), nombre: "", kw: "", compartido: 1 }] }))}>
                  Agregar equipo consumidor
                </AddBtn>
              </SubBloque>

              {/* --- Mano de obra productiva --- */}
              <SubBloque titulo="Mano de obra productiva" dato={`${fmt2(eq.operariosSeg)}/seg`}>
                {eq.operariosRows.map((o) => (
                  <RowShell key={o.id} onRemove={() => setEquipo(eq.id, (x) => ({ ...x, operarios: x.operarios.filter((r) => r.id !== o.id) }))}>
                    <Field label="Cargo" flex={1.6}>
                      <input style={inputStyle} value={o.cargo} onChange={(e) => upOperario(eq.id, o.id, "cargo", e.target.value)} />
                    </Field>
                    <Field label="Salario mensual">
                      <NumInput value={o.salario} onChange={(v) => upOperario(eq.id, o.id, "salario", v)} />
                    </Field>
                    <Field label="Regla de reparto" minW={85}>
                      <NumInput value={o.regla} onChange={(v) => upOperario(eq.id, o.id, "regla", v)} min={1} step={1} />
                    </Field>
                    <div style={{ ...monoSm, minWidth: 95, textAlign: "right", paddingBottom: 9, color: S.steel }}>
                      {fmt2(o.seg)}/seg
                    </div>
                  </RowShell>
                ))}
                <AddBtn onClick={() => setEquipo(eq.id, (x) => ({ ...x, operarios: [...x.operarios, { id: uid(), cargo: "", salario: "", regla: 1 }] }))}>
                  Agregar operario
                </AddBtn>
              </SubBloque>

              <div style={{ ...monoSm, background: "#FFF4EA", border: `1px dashed ${S.accent}`, borderRadius: 8, padding: "10px 12px", color: S.ink }}>
                Tarifa {eq.nombre || "equipo"} = carga fija {fmt2(calc.cargaFijaSeg)} + energía {fmt2(eq.energiaSeg)} + mano de obra {fmt2(eq.operariosSeg)}
                = <strong style={{ fontSize: 14 }}>{fmt2(eq.tarifa)}/seg</strong>
              </div>

              {/* --- Materia prima (partes que produce este equipo) --- */}
              <div style={{ borderTop: `2px solid ${S.line}`, margin: "4px 0 0", paddingTop: 14, display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: colorEq, display: "flex", alignItems: "center", gap: 8 }}>
                  <Layers size={15} color={colorEq} /> Materia prima
                </div>

                {partesEq.length === 0 && (
                  <div style={{ ...monoSm, color: S.steel, fontStyle: "italic" }}>
                    Sin partes asignadas a este equipo todavía.
                  </div>
                )}

                {partesEq.map((p) => (
                  <div key={p.id} style={{ border: `1px solid ${S.line}`, borderLeft: `4px solid ${colorEq}`, borderRadius: 8, padding: 14, display: "flex", flexDirection: "column", gap: 12 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                      <input
                        style={{ ...inputStyle, width: 150, padding: "4px 8px", fontFamily: "'Archivo', sans-serif", fontWeight: 800 }}
                        value={p.nombre}
                        onChange={(e) => upParte(p.id, "nombre", e.target.value)}
                      />
                      <span style={{ color: S.steel, fontSize: 12.5, fontFamily: "'IBM Plex Mono', monospace", opacity: 0.5 }}>·</span>
                      <input
                        style={{ ...inputStyle, flex: 1, minWidth: 200, padding: "4px 8px", fontFamily: "'Archivo', sans-serif", fontWeight: 500, color: S.steel, background: "transparent", border: `1px dashed ${S.line}` }}
                        value={p.producto}
                        placeholder="Nombre del producto"
                        onChange={(e) => upParte(p.id, "producto", e.target.value)}
                      />
                      <span style={{ ...monoSm, fontWeight: 600 }}>{fmt2(p.total)}/und</span>
                      <button
                        onClick={() => setPartes((ps) => ps.filter((x) => x.id !== p.id))}
                        title="Eliminar parte"
                        style={{ border: "none", background: "transparent", color: "#B04434", cursor: "pointer", padding: 4 }}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>

                    <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                      <Field label="Código" minW={80}>
                        <input style={inputStyle} value={p.codigo} onChange={(e) => upParte(p.id, "codigo", e.target.value)} />
                      </Field>
                      <Field label="Equipo" minW={130}>
                        <select
                          style={{ ...inputStyle, fontFamily: "'Archivo', sans-serif" }}
                          value={p.equipoId}
                          onChange={(e) => upParte(p.id, "equipoId", e.target.value)}
                        >
                          {equipos.map((eqO) => (
                            <option key={eqO.id} value={eqO.id}>{eqO.nombre}</option>
                          ))}
                        </select>
                      </Field>
                    </div>
                    {p.tipo === "serigrafia" ? (
                      <>
                        <div style={{ ...monoSm, background: "#F6F8FA", border: `1px dashed ${S.line}`, borderRadius: 8, padding: "8px 12px", color: S.steel }}>
                          Escala del pedido: <strong style={{ color: S.ink }}>{num(ficha.escala, 0)} und</strong> (se define en la ficha del producto)
                        </div>

                        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                          <Field label="Golpes / colores" minW={95}>
                            <NumInput value={p.golpes} onChange={(v) => upParte(p.id, "golpes", v)} min={0} step={1} />
                          </Field>
                          <Field label="Estándar (seg/und por golpe)" minW={140}>
                            <NumInput value={p.segUnd} onChange={(v) => upParte(p.id, "segUnd", v)} />
                          </Field>
                          <Field label="Setup por golpe (seg)" minW={120}>
                            <NumInput value={p.setupSeg} onChange={(v) => upParte(p.id, "setupSeg", v)} />
                          </Field>
                          <div style={{ ...monoSm, alignSelf: "flex-end", paddingBottom: 8, color: S.steel }}>
                            Setup = {num((Number(p.setupSeg) || 0) / 60, 1)} min · Tarifa Screen: <strong style={{ color: S.ink }}>{fmt2(p.tarifa)}/seg</strong>
                          </div>
                        </div>

                        <SubBloque titulo="Tinta" dato={fmt2(p.desglose?.tinta || 0)}>
                          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                            <Field label="Gramos por lote" minW={90}>
                              <NumInput value={p.tintaGr} onChange={(v) => upParte(p.id, "tintaGr", v)} />
                            </Field>
                            <Field label="Unds por lote" minW={90}>
                              <NumInput value={p.tintaUnds} onChange={(v) => upParte(p.id, "tintaUnds", v)} />
                            </Field>
                            <Field label="Precio tinta ($/g)" minW={110}>
                              <NumInput value={p.tintaPrecio} onChange={(v) => upParte(p.id, "tintaPrecio", v)} />
                            </Field>
                            <div style={{ ...monoSm, alignSelf: "flex-end", paddingBottom: 8, color: S.steel }}>
                              Consumo: <strong style={{ color: S.ink }}>{num(p.gTintaPorTubo || 0, 4)} g/tubo/golpe</strong>
                            </div>
                          </div>
                        </SubBloque>

                        <SubBloque titulo="Preprensa (positivo · malla · marco)" dato={fmt2((p.desglose?.positivo || 0) + (p.desglose?.malla || 0) + (p.desglose?.marco || 0))}>
                          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "flex-end" }}>
                            <Field label="Positivo ($ total)" minW={110}>
                              <NumInput value={p.positivo} onChange={(v) => upParte(p.id, "positivo", v)} />
                            </Field>
                            <div style={{ ...monoSm, paddingBottom: 8, color: S.steel, minWidth: 130 }}>
                              ÷ escala {num(ficha.escala, 0)} → {fmt2((Number(p.positivo) || 0) / (Number(ficha.escala) || 1))}/golpe
                            </div>
                          </div>
                          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "flex-end" }}>
                            <Field label="Malla ($ total)" minW={110}>
                              <NumInput value={p.malla} onChange={(v) => upParte(p.id, "malla", v)} />
                            </Field>
                            <Field label="Vida malla (golpes)" minW={120}>
                              <NumInput value={p.vidaMalla} onChange={(v) => upParte(p.id, "vidaMalla", v)} />
                            </Field>
                            <div style={{ ...monoSm, paddingBottom: 8, color: S.steel, minWidth: 130 }}>
                              → {fmt2((Number(p.malla) || 0) / (Number(p.vidaMalla) || 1))}/golpe
                            </div>
                          </div>
                          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "flex-end" }}>
                            <Field label="Marco ($ total)" minW={110}>
                              <NumInput value={p.marco} onChange={(v) => upParte(p.id, "marco", v)} />
                            </Field>
                            <Field label="Vida marco (golpes)" minW={120}>
                              <NumInput value={p.vidaMarco} onChange={(v) => upParte(p.id, "vidaMarco", v)} />
                            </Field>
                            <div style={{ ...monoSm, paddingBottom: 8, color: S.steel, minWidth: 130 }}>
                              → {fmt2((Number(p.marco) || 0) / (Number(p.vidaMarco) || 1))}/golpe
                            </div>
                          </div>
                        </SubBloque>

                        <div style={{ background: S.ink, color: "#fff", borderRadius: 8, padding: 16, display: "flex", flexDirection: "column", gap: 8 }}>
                          <div style={{ fontSize: 11, color: "#AEC0CE", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700 }}>
                            Desglose por golpe × {p.golpes || 0} golpes
                          </div>
                          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 10, fontFamily: "'IBM Plex Mono', monospace", fontSize: 12.5 }}>
                            <div><span style={{ color: "#AEC0CE" }}>Tinta</span><br/>{fmt2(p.desglose?.tinta || 0)}</div>
                            <div><span style={{ color: "#AEC0CE" }}>Proceso</span><br/>{fmt2(p.desglose?.proceso || 0)}</div>
                            <div><span style={{ color: "#AEC0CE" }}>Setup</span><br/>{fmt2(p.desglose?.setup || 0)}</div>
                            <div><span style={{ color: "#AEC0CE" }}>Positivo</span><br/>{fmt2(p.desglose?.positivo || 0)}</div>
                            <div><span style={{ color: "#AEC0CE" }}>Malla</span><br/>{fmt2(p.desglose?.malla || 0)}</div>
                            <div><span style={{ color: "#AEC0CE" }}>Marco</span><br/>{fmt2(p.desglose?.marco || 0)}</div>
                          </div>
                          <div style={{ borderTop: "1px solid #33475A", paddingTop: 8, marginTop: 4, display: "flex", justifyContent: "space-between", fontWeight: 700 }}>
                            <span>Total serigrafía</span>
                            <span style={{ color: "#7FD6A4", fontFamily: "'IBM Plex Mono', monospace" }}>{fmt2(p.total)}/und</span>
                          </div>
                        </div>
                      </>
                    ) : (
                    <>
                    {(() => {
                      const soloComponentes =
                        p.capas.length === 0 ||
                        p.capas.every((c) => c.materiales.length > 0 && c.materiales.every((m) => m.modo === "und"));
                      if (soloComponentes) {
                        return (
                          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                            <Field label="Estándar (seg/und)" minW={95}>
                              <NumInput value={p.segUnd} onChange={(v) => upParte(p.id, "segUnd", v)} />
                            </Field>
                            <div style={{ ...monoSm, alignSelf: "flex-end", paddingBottom: 8, color: S.steel }}>
                              Ensamble por componentes (sin cálculo por peso)
                            </div>
                          </div>
                        );
                      }
                      return (
                        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                          <Field label="Peso pieza (g)" minW={90}>
                            <NumInput value={p.peso} onChange={(v) => upParte(p.id, "peso", v)} />
                          </Field>
                          <Field label="Peso rama (g)" minW={90}>
                            <NumInput value={p.rama} onChange={(v) => upParte(p.id, "rama", v)} />
                          </Field>
                          <Field label="Merma (%)" minW={80}>
                            <NumInput value={p.merma} onChange={(v) => upParte(p.id, "merma", v)} />
                          </Field>
                          <Field label="Estándar (seg/und)" minW={95}>
                            <NumInput value={p.segUnd} onChange={(v) => upParte(p.id, "segUnd", v)} />
                          </Field>
                          <div style={{ ...monoSm, alignSelf: "flex-end", paddingBottom: 8, color: S.steel }}>
                            Base {num(p.base, 3)} g + merma → <strong style={{ color: S.ink }}>{num(p.consumoTotal, 3)} g/und</strong>
                          </div>
                        </div>
                      );
                    })()}

                    {p.capasCalc.map((c) => {
                      const capaComponentes = c.materiales.length > 0 && c.materiales.every((m) => m.modo === "und");
                      return (
                      <SubBloque
                        key={c.id}
                        titulo={
                          <span style={{ display: "inline-flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                            <input
                              style={{ ...inputStyle, width: 130, padding: "3px 6px", fontFamily: "'Archivo', sans-serif", fontWeight: 700, textTransform: "none" }}
                              value={c.nombre}
                              onChange={(e) => upCapa(p.id, c.id, "nombre", e.target.value)}
                            />
                            {!capaComponentes && (
                              <span style={{ display: "inline-flex", alignItems: "center", gap: 4, textTransform: "none" }}>
                                <input
                                  type="number"
                                  style={{ ...inputStyle, width: 58, padding: "3px 6px" }}
                                  value={c.pct}
                                  onChange={(e) => upCapa(p.id, c.id, "pct", e.target.value === "" ? "" : Number(e.target.value))}
                                />
                                % del consumo → {num(c.gramos, 3)} g
                              </span>
                            )}
                            <button
                              onClick={() => setParte(p.id, (x) => ({ ...x, capas: x.capas.filter((k) => k.id !== c.id) }))}
                              title="Eliminar capa"
                              style={{ border: "none", background: "transparent", color: "#B04434", cursor: "pointer", padding: 2 }}
                            >
                              <Trash2 size={13} />
                            </button>
                          </span>
                        }
                        dato={fmt2(c.costo)}
                      >
                        {c.materiales.map((m) => (
                          <RowShell key={m.id} onRemove={() => setParte(p.id, (x) => ({ ...x, capas: x.capas.map((k) => (k.id === c.id ? { ...k, materiales: k.materiales.filter((mm) => mm.id !== m.id) } : k)) }))}>
                            <Field label="Materia prima" flex={1.6}>
                              <input style={inputStyle} value={m.nombre} onChange={(e) => upMat(p.id, c.id, m.id, "nombre", e.target.value)} />
                            </Field>
                            <Field label={m.modo === "grkg" ? "Dosis (g/Kg)" : m.modo === "und" ? "Uds / tubo" : "% consumo"} minW={80}>
                              <NumInput value={m.pct} onChange={(v) => upMat(p.id, c.id, m.id, "pct", v)} />
                            </Field>
                            <Field label="Unidad" minW={100}>
                              <select
                                style={{ ...inputStyle, fontFamily: "'Archivo', sans-serif" }}
                                value={m.modo === "grkg" ? "grkg" : m.modo === "und" ? "und" : "pct"}
                                onChange={(e) => upMat(p.id, c.id, m.id, "modo", e.target.value)}
                              >
                                <option value="pct">% consumo</option>
                                <option value="grkg">g/Kg</option>
                                <option value="und">Componente/ud</option>
                              </select>
                            </Field>
                            <Field label={m.modo === "und" ? "Precio $/ud" : "Precio $/g"} minW={90}>
                              <NumInput value={m.precio} onChange={(v) => upMat(p.id, c.id, m.id, "precio", v)} />
                            </Field>
                            <div style={{ ...monoSm, minWidth: 160, textAlign: "right", paddingBottom: 9, color: S.steel }}>
                              {m.modo === "und" ? `${num(m.cons, 2)} ud` : `${num(m.cons, 4)} g`} → <strong style={{ color: S.ink }}>{fmt2(m.costo)}</strong>
                            </div>
                          </RowShell>
                        ))}
                        <AddBtn onClick={() => setParte(p.id, (x) => ({ ...x, capas: x.capas.map((k) => (k.id === c.id ? { ...k, materiales: [...k.materiales, { id: uid(), nombre: "", pct: "", precio: "" }] } : k)) }))}>
                          Agregar materia prima
                        </AddBtn>
                      </SubBloque>
                    );})}
                    <AddBtn onClick={() => setParte(p.id, (x) => ({ ...x, capas: [...x.capas, { id: uid(), nombre: `Capa ${x.capas.length + 1}`, pct: "", materiales: [{ id: uid(), nombre: "", pct: "", precio: "" }] }] }))}>
                      Agregar capa
                    </AddBtn>

                    <div style={{ background: S.ink, color: "#fff", borderRadius: 8, padding: 16, display: "flex", gap: 26, flexWrap: "wrap" }}>
                      <Kpi label="Materia prima" valor={fmt2(p.totalMP)} />
                      <Kpi label={`Proceso (${p.segUnd || 0} seg × ${fmt2(p.tarifa)})`} valor={fmt2(p.costoProceso)} />
                      <Kpi label={`Total fabricación ${p.nombre || "parte"}`} valor={fmt2(p.total)} destacado="#7FD6A4" />
                    </div>
                    </>
                    )}
                  </div>
                ))}

                <AddBtn onClick={() => setPartes((ps) => [...ps, { id: uid(), nombre: "Nueva parte", codigo: "", producto: "", equipoId: eq.id, peso: "", rama: 0, merma: "", segUnd: "", capas: [{ id: uid(), nombre: "Materia prima", pct: 100, materiales: [{ id: uid(), nombre: "", pct: "", precio: "" }] }] }])}>
                  Agregar parte a {eq.nombre || "este equipo"}
                </AddBtn>
              </div>
            </Seccion>
          );
        })}

        <AddBtn onClick={() => setEquipos((es) => [...es, { id: uid(), nombre: "Nuevo equipo", energia: [{ id: uid(), nombre: "", kw: "", compartido: 1 }], operarios: [{ id: uid(), cargo: "", salario: "", regla: 1 }] }])}>
          Agregar equipo productivo
        </AddBtn>

        {/* ===== LOGÍSTICA (partes tipo logística, sin equipo) ===== */}
        {calc.partesCalc.filter((p) => p.tipo === "logistica").map((p) => (
          <Seccion
            key={p.id}
            id={`sec-${p.id}`}
            icono={<ClipboardList size={17} color="#7A4460" />}
            titulo={
              <span style={{ display: "inline-flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                <input
                  style={{ ...inputStyle, width: 160, padding: "3px 8px", fontFamily: "'Archivo', sans-serif", fontWeight: 800 }}
                  value={p.nombre}
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) => upParte(p.id, "nombre", e.target.value)}
                />
                <span style={{ color: "#7A4460", fontSize: 13, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                  <span style={{ opacity: 0.5 }}>·</span> Empaque + transporte + exportación
                </span>
              </span>
            }
            subtitulo="Prorrateo por caja de empaque + fijos por tubo"
            dato={`${fmt2(p.total)}/und`}
            abierta={isOpen(p.id)}
            onToggle={() => toggle(p.id)}
            color="#7A4460"
            onRemove={() => setPartes((ps) => ps.filter((x) => x.id !== p.id))}
          >
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Field label="Código" minW={90}>
                <input style={inputStyle} value={p.codigo} onChange={(e) => upParte(p.id, "codigo", e.target.value)} />
              </Field>
              <Field label="Producto" flex={2}>
                <input style={inputStyle} value={p.producto} onChange={(e) => upParte(p.id, "producto", e.target.value)} />
              </Field>
              <Field label="Unds por caja" minW={110}>
                <NumInput value={p.undsPorCaja} onChange={(v) => upParte(p.id, "undsPorCaja", v)} min={1} step={1} />
              </Field>
            </div>

            <SubBloque titulo="Materiales de empaque (se prorratean por caja)" dato={fmt2(p.empaquePorTubo || 0)}>
              {(p.empaqueRows || []).map((m) => (
                <RowShell key={m.id} onRemove={() => upParte(p.id, "empaque", p.empaque.filter((x) => x.id !== m.id))}>
                  <Field label="Concepto" flex={1.6}>
                    <input
                      style={inputStyle}
                      value={m.nombre}
                      onChange={(e) => upParte(p.id, "empaque", p.empaque.map((x) => x.id === m.id ? { ...x, nombre: e.target.value } : x))}
                    />
                  </Field>
                  <Field label="Cantidad / caja" minW={100}>
                    <NumInput value={m.cantidad} onChange={(v) => upParte(p.id, "empaque", p.empaque.map((x) => x.id === m.id ? { ...x, cantidad: v } : x))} />
                  </Field>
                  <Field label="Precio unitario" minW={100}>
                    <NumInput value={m.precio} onChange={(v) => upParte(p.id, "empaque", p.empaque.map((x) => x.id === m.id ? { ...x, precio: v } : x))} />
                  </Field>
                  <div style={{ ...monoSm, minWidth: 170, textAlign: "right", paddingBottom: 9, color: S.steel }}>
                    {fmt2(m.totalPorCaja)}/caja → <strong style={{ color: S.ink }}>{fmt2(m.porTubo)}/und</strong>
                  </div>
                </RowShell>
              ))}
              <AddBtn onClick={() => upParte(p.id, "empaque", [...(p.empaque || []), { id: uid(), nombre: "", cantidad: 1, precio: 0 }])}>
                Agregar material de empaque
              </AddBtn>
            </SubBloque>

            <SubBloque titulo="Transporte y exportación" dato={fmt2((p.transportePorTubo || 0) + (p.exportacionPorTubo || 0))}>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "flex-end" }}>
                <Field label="Transporte por caja" minW={130}>
                  <NumInput value={p.transportePorCaja} onChange={(v) => upParte(p.id, "transportePorCaja", v)} />
                </Field>
                <div style={{ ...monoSm, paddingBottom: 8, color: S.steel, minWidth: 160 }}>
                  ÷ {p.undsPorCaja || 0} und/caja → <strong style={{ color: S.ink }}>{fmt2(p.transportePorTubo || 0)}/und</strong>
                </div>
              </div>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "flex-end" }}>
                <Field label="Exportación por tubo (fijo)" minW={160}>
                  <NumInput value={p.exportacion} onChange={(v) => upParte(p.id, "exportacion", v)} />
                </Field>
                <div style={{ ...monoSm, paddingBottom: 8, color: S.steel, minWidth: 160 }}>
                  {(Number(p.exportacion) || 0) === 0 ? "Aplica solo cuando el pedido es de exportación" : `Cargo fijo → ${fmt2(p.exportacionPorTubo || 0)}/und`}
                </div>
              </div>
            </SubBloque>

            <div style={{ background: S.ink, color: "#fff", borderRadius: 8, padding: 16, display: "flex", gap: 26, flexWrap: "wrap" }}>
              <Kpi label="Empaque" valor={fmt2(p.empaquePorTubo || 0)} />
              <Kpi label="Transporte" valor={fmt2(p.transportePorTubo || 0)} />
              <Kpi label="Exportación" valor={fmt2(p.exportacionPorTubo || 0)} />
              <Kpi label="Total logística" valor={fmt2(p.total)} destacado="#FFB36B" />
            </div>
          </Seccion>
        ))}

        {/* ===== 4. RESUMEN ===== */}
        <section style={{ background: S.ink, color: "#fff", borderRadius: 10, padding: 20 }}>
          <h2 style={{ margin: "0 0 12px", fontSize: 13, letterSpacing: "0.1em", textTransform: "uppercase", color: "#AEC0CE", display: "flex", alignItems: "center", gap: 8 }}>
            <ClipboardList size={15} /> Resumen · costo del tubo por unidad
          </h2>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ textAlign: "left", color: "#AEC0CE", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  <th style={{ padding: "8px 6px" }}>Parte</th>
                  <th style={{ padding: "8px 6px" }}>Equipo</th>
                  <th style={{ textAlign: "right", padding: "8px 6px" }}>Materia prima</th>
                  <th style={{ textAlign: "right", padding: "8px 6px" }}>Proceso</th>
                  <th style={{ textAlign: "right", padding: "8px 6px" }}>Total / und</th>
                </tr>
              </thead>
              <tbody style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
                {calc.partesCalc.map((p, idx) => (
                  <tr key={p.id} style={{ borderTop: "1px solid #33475A" }}>
                    <td style={{ padding: "8px 6px", fontFamily: "'Archivo', sans-serif" }}>
                      <span style={{ width: 10, height: 10, borderRadius: 2, background: COLORES[idx % COLORES.length], display: "inline-block", marginRight: 8 }} />
                      {p.nombre || `Parte ${idx + 1}`}
                    </td>
                    <td style={{ padding: "8px 6px", fontFamily: "'Archivo', sans-serif", color: "#AEC0CE" }}>{p.nombreEquipo}</td>
                    <td style={{ textAlign: "right", padding: "8px 6px" }}>{fmt2(p.totalMP)}</td>
                    <td style={{ textAlign: "right", padding: "8px 6px" }}>{fmt2(p.costoProceso)}</td>
                    <td style={{ textAlign: "right", padding: "8px 6px", fontWeight: 600 }}>{fmt2(p.total)}</td>
                  </tr>
                ))}
                <tr style={{ borderTop: "2px solid #AEC0CE", fontWeight: 600 }}>
                  <td colSpan={4} style={{ padding: "10px 6px", fontFamily: "'Archivo', sans-serif" }}>COSTO ACUMULADO DEL TUBO</td>
                  <td style={{ textAlign: "right", padding: "10px 6px", fontSize: 16, color: "#FFB36B" }}>{fmt2(calc.totalTubo)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* ===== CALCULADORA DE RENTABILIDAD ===== */}
          {(() => {
            const costo = calc.totalTubo;
            const r = (Number(rentabilidadPct) || 0) / 100;
            const escala = Number(ficha.escala) || 0;
            // Markup sobre costo: PV = Costo × (1 + r)
            const pv = costo * (1 + r);
            const util = pv - costo;
            const utilLote = util * escala;
            const ventaLote = pv * escala;

            return (
              <div style={{
                marginTop: 16,
                padding: 16,
                borderTop: "1px solid #33475A",
                borderRadius: 8,
                background: "linear-gradient(180deg, #152532 0%, #0F1C28 100%)",
              }}>
                <h3 style={{
                  margin: "0 0 12px",
                  fontSize: 13,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "#AEC0CE",
                  fontWeight: 700,
                }}>
                  💰 Calculadora de rentabilidad
                </h3>

                <div style={{ display: "flex", gap: 14, alignItems: "center", flexWrap: "wrap", marginBottom: 14 }}>
                  <label style={{ display: "flex", flexDirection: "column", gap: 4, minWidth: 150 }}>
                    <span style={{ fontSize: 10.5, letterSpacing: "0.07em", textTransform: "uppercase", color: "#AEC0CE", fontWeight: 600 }}>
                      Rentabilidad esperada (%)
                    </span>
                    <input
                      type="number"
                      value={rentabilidadPct}
                      onChange={(e) => setRentabilidadPct(e.target.value === "" ? "" : Number(e.target.value))}
                      min={0}
                      max={999}
                      step={1}
                      style={{
                        background: "#0F1C28",
                        color: "#fff",
                        border: "1px solid #33475A",
                        borderRadius: 6,
                        padding: "8px 10px",
                        fontSize: 15,
                        fontFamily: "'IBM Plex Mono', monospace",
                        fontWeight: 700,
                        width: 100,
                      }}
                    />
                  </label>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    step={1}
                    value={Number(rentabilidadPct) || 0}
                    onChange={(e) => setRentabilidadPct(Number(e.target.value))}
                    style={{ flex: 1, minWidth: 180, accentColor: S.accent }}
                  />
                  <div style={{ fontSize: 11.5, color: "#AEC0CE", fontFamily: "'IBM Plex Mono', monospace" }}>
                    Costo base: <strong style={{ color: "#FFB36B" }}>{fmt2(costo)}/und</strong>
                  </div>
                </div>

                <div style={{
                  background: "#0F1C28",
                  borderRadius: 8,
                  padding: 16,
                  borderLeft: `3px solid #FFB36B`,
                }}>
                  <div style={{ fontSize: 10.5, letterSpacing: "0.08em", textTransform: "uppercase", color: "#AEC0CE", fontWeight: 700 }}>
                    Markup sobre costo
                  </div>
                  <div style={{ fontSize: 10, color: "#8FA3B3", fontFamily: "'IBM Plex Mono', monospace", marginBottom: 14 }}>
                    PV = Costo × (1 + r)
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: 16 }}>
                    <div>
                      <div style={{ fontSize: 10.5, color: "#AEC0CE", textTransform: "uppercase", letterSpacing: "0.07em" }}>
                        Precio venta / tubo
                      </div>
                      <div style={{ fontSize: 24, fontWeight: 700, color: "#FFB36B", fontFamily: "'IBM Plex Mono', monospace" }}>
                        {fmt2(pv)}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: 10.5, color: "#AEC0CE", textTransform: "uppercase", letterSpacing: "0.07em" }}>
                        Utilidad / tubo
                      </div>
                      <div style={{ fontSize: 20, color: "#7FD6A4", fontFamily: "'IBM Plex Mono', monospace", fontWeight: 700 }}>
                        {fmt2(util)}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: 10.5, color: "#AEC0CE", textTransform: "uppercase", letterSpacing: "0.07em" }}>
                        Venta total lote ({num(escala, 0)} und)
                      </div>
                      <div style={{ fontSize: 16, color: "#fff", fontFamily: "'IBM Plex Mono', monospace", fontWeight: 600 }}>
                        {fmt0(ventaLote)}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: 10.5, color: "#AEC0CE", textTransform: "uppercase", letterSpacing: "0.07em" }}>
                        Utilidad / lote
                      </div>
                      <div style={{ fontSize: 16, color: "#7FD6A4", fontFamily: "'IBM Plex Mono', monospace", fontWeight: 600 }}>
                        {fmt0(utilLote)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}

          <div style={{ marginTop: 16, borderTop: "1px solid #33475A", paddingTop: 14, display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
            <button
              onClick={exportarFila}
              disabled={enviando}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: copiado ? S.ok : (enviando ? "#666" : S.accent),
                color: "#fff",
                border: "none",
                borderRadius: 8,
                padding: "10px 16px",
                fontSize: 13,
                fontWeight: 700,
                fontFamily: "inherit",
                cursor: enviando ? "wait" : "pointer",
                letterSpacing: "0.02em",
                opacity: enviando ? 0.8 : 1,
              }}
            >
              {copiado
                ? (modoEnvio === "automatico" ? <><Check size={15} /> ¡Enviado a Google Sheets!</> : <><Check size={15} /> Copiado — pega en Google Sheets</>)
                : (enviando
                    ? <><Copy size={15} /> Enviando…</>
                    : (modoEnvio === "automatico" ? <><Copy size={15} /> Enviar a Google Sheets</> : <><Copy size={15} /> Copiar para Google Sheets</>)
                  )
              }
            </button>
            <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11.5, color: "#AEC0CE", cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={modoEnvio === "automatico"}
                onChange={(e) => setModoEnvio(e.target.checked ? "automatico" : "copiar")}
              />
              Envío automático
            </label>
            <div style={{ fontSize: 12, color: "#AEC0CE", fontFamily: "'IBM Plex Mono', monospace", flex: 1, minWidth: 200 }}>
              {ficha.fecha} · {ficha.producto || "—"} · escala {num(ficha.escala, 0)} · total {fmt2(calc.totalTubo)}
            </div>
          </div>
        </section>
        </main>
      </div>
    </div>
  );
}
