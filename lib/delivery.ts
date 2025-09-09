// lib/delivery.ts

// 🔧 Defaults (seguro: usado quando não vier config do BD/API/ENV)
const DEFAULT_CFG = {
  UF: "MG",
  CITY: "Uberlândia",
  BAIRROS_ALLOW: [
    // comece com os confirmados; você pode acrescentar mais depois
    "Panorama",
    // Exemplos baseados no seu mapa (adicione/remova conforme necessidade):
    "Jardim Europa",
    "Jardim Canaã",
    "Jardim das Palmeiras",
    "Jardim Holanda",
    "Parque das Américas",
    "Uirapuru",
    "Monte Hebron",
    "Chácaras Rancho Alegre",
  ],
  CEP_PREFIXES_ALLOW: [] as string[], // opcional; deixe vazio no MVP
};

export type DeliveryConfig = typeof DEFAULT_CFG;

/** Retorna a config ativa priorizando fonte externa (window/ENV) e caindo no default */
export function getDeliveryConfig(): DeliveryConfig {
  // 1) (Futuro) BD/API pode hidratar window.__DELIVERY__ na página
  // @ts-expect-error global optional
  const injected = typeof window !== "undefined" ? window.__DELIVERY__ : undefined;

  // 2) (Opcional) ENV pode trazer strings simples
  const fromEnv = {
    UF: process.env.NEXT_PUBLIC_DELIVERY_UF,
    CITY: process.env.NEXT_PUBLIC_DELIVERY_CITY,
    BAIRROS_ALLOW: parseList(process.env.NEXT_PUBLIC_DELIVERY_BAIRROS),
    CEP_PREFIXES_ALLOW: parseList(process.env.NEXT_PUBLIC_DELIVERY_CEP_PREFIXES),
  };

  // Compose (prioridade: injected > ENV > default)
  return {
    UF: injected?.UF ?? fromEnv.UF ?? DEFAULT_CFG.UF,
    CITY: injected?.CITY ?? fromEnv.CITY ?? DEFAULT_CFG.CITY,
    BAIRROS_ALLOW: injected?.BAIRROS_ALLOW ?? fromEnv.BAIRROS_ALLOW ?? DEFAULT_CFG.BAIRROS_ALLOW,
    CEP_PREFIXES_ALLOW: injected?.CEP_PREFIXES_ALLOW ?? fromEnv.CEP_PREFIXES_ALLOW ?? DEFAULT_CFG.CEP_PREFIXES_ALLOW,
  };
}

/** Valida por UF/Cidade + (opcional) Bairros + (opcional) Prefixos de CEP */
export function matchRules(params: { uf?: string; cidade?: string; bairro?: string; cep?: string }) {
  const cfg = getDeliveryConfig();
  const ufOk = !cfg.UF || (normalize(params.uf) === normalize(cfg.UF));
  if (!ufOk) return { ok: false, msg: "Fora da UF de atendimento" };

  const cityOk = !cfg.CITY || (normalize(params.cidade) === normalize(cfg.CITY));
  if (!cityOk) return { ok: false, msg: "Fora da cidade de atendimento" };

  if (cfg.BAIRROS_ALLOW?.length) {
    const bairroOk = cfg.BAIRROS_ALLOW.some((b) => normalize(b) === normalize(params.bairro));
    if (!bairroOk) return { ok: false, msg: "Bairro fora da área de entrega" };
  }

  if (cfg.CEP_PREFIXES_ALLOW?.length && params.cep) {
    const p5 = params.cep.replace(/\D+/g, "").slice(0, 5);
    if (!cfg.CEP_PREFIXES_ALLOW.includes(p5)) {
      return { ok: false, msg: "CEP fora da área de entrega" };
    }
  }

  return { ok: true, msg: "Área atendida" };
}

/** Helpers */
function normalize(v?: string) {
  return (v ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove acentos
    .trim();
}

function parseList(v?: string) {
  // Ex.: "Panorama,Jardim Europa" -> ["Panorama","Jardim Europa"]
  return v ? v.split(",").map((s) => s.trim()).filter(Boolean) : undefined;
}
