"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { getDeliveryConfig, matchRules } from "@/lib/delivery";

export type Address = {
  nome: string;
  cep: string;       // somente dígitos
  rua: string;
  numero: string;
  bairro?: string;
  cidade: string;
  uf?: string;
  referencia?: string;
  telefone: string;  // WhatsApp
  complemento?: string;
};

type Props = {
  open: boolean;
  initial?: Partial<Address>;
  onClose: () => void;               // fecha no X ou Esc
  onConfirm: (addr: Address) => void; // envia endereço válido
};

export default function AddressModal({ open, initial, onClose, onConfirm }: Props) {
  const dialogRef = useRef<HTMLDivElement>(null);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [nome, _setNome] = useState(initial?.nome ?? "");
  const [cep, setCep] = useState(formatCEP(initial?.cep ?? ""));
  const [rua, setRua] = useState(initial?.rua ?? "");
  const [numero, setNumero] = useState(initial?.numero ?? "");
  const [complemento, setComplemento] = useState(initial?.complemento ?? "");
  const [bairro, setBairro] = useState(initial?.bairro ?? "");
  const [cidade, setCidade] = useState(initial?.cidade ?? "");
  const [uf, setUf] = useState(initial?.uf ?? "");
  const [referencia, setReferencia] = useState(initial?.referencia ?? "");
  const [telefone, setTelefone] = useState(initial?.telefone ?? "");
  const [cepValid, setCepValid] = useState<boolean | null>(null);
  const [eta, setEta] = useState<string>("");
  const [loadingCEP, setLoadingCEP] = useState(false);
  const [showOutOfArea, setShowOutOfArea] = useState(false);

  type CepAddressResult = {
    cep: string; logradouro: string; bairro: string; localidade: string; uf: string;
  };

  const [openFinder, setOpenFinder] = useState(false);
  const [ufFind, setUfFind] = useState(uf || "MG");        // defaulta UF atual se existir
  const [cityFind, setCityFind] = useState(cidade || "");   // idem cidade
  const [streetFind, setStreetFind] = useState("");         // logradouro
  const [findLoading, setFindLoading] = useState(false);
  const [findErr, setFindErr] = useState<string>("");
  const [findList, setFindList] = useState<CepAddressResult[]>([]);
  const [serviceable, setServiceable] = useState<boolean | null>(null);
  const [serviceMsg, setServiceMsg] = useState<string>("");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _deliveryCfg = useMemo(() => getDeliveryConfig(), []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape" && open) onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);


  useEffect(() => {
    if (cepValid === true && serviceable === false) {
      setShowOutOfArea(true);
    }
  }, [cepValid, serviceable]);

  // busca CEP (ViaCEP) quando tiver 8 dígitos
  useEffect(() => {
    const raw = onlyDigits(cep);
    if (raw.length !== 8) {
      setCepValid(null);
      return;
    }

    const ctrl = new AbortController();
    const t = setTimeout(async () => {
      try {
        setLoadingCEP(true);
        // ViaCEP
        const r1 = await fetch(`https://viacep.com.br/ws/${raw}/json/`, {
          signal: ctrl.signal,
          cache: "force-cache",
        });
        const data = await r1.json();
        if (!data || data.erro) throw new Error("CEP inválido");

        setRua(data.logradouro ?? "");
        setBairro(data.bairro ?? "");
        setCidade(data.localidade ?? "");
        setUf(data.uf ?? "");
        setCepValid(true);
        const chk = matchRules({
          uf: data.uf,
          cidade: data.localidade,
          bairro: data.bairro,
          cep: raw,
        });
        setServiceable(chk.ok);
        setServiceMsg(chk.msg);
        setEta("30–45 min");
      } catch {
        // fallback: BrasilAPI
        try {
          const r2 = await fetch(`https://brasilapi.com.br/api/cep/v2/${raw}`, {
            signal: ctrl.signal,
            cache: "force-cache",
          });
          const b = await r2.json();
          if (!b || b.errors) throw new Error("CEP inválido");
          setRua(b.street ?? "");
          setBairro(b.neighborhood ?? "");
          setCidade(b.city ?? "");
          setUf(b.state ?? "");
          setCepValid(true);
          const chk = matchRules({
            uf: b.state,
            cidade: b.city,
            bairro: b.neighborhood,
            cep: raw,
          });
          setServiceable(chk.ok);
          setServiceMsg(chk.msg);
          setEta("30–45 min");
        } catch {
          setCepValid(false);
          setEta("");
        }
      } finally {
        setLoadingCEP(false);
      }
    }, 250); // debounce

    return () => {
      clearTimeout(t);
      ctrl.abort();
    };
  }, [cep]);

  const canConfirm = useMemo(() => {
    return (
      !!nome &&
      cepValid === true &&
      serviceable === true && // 🔒 só habilita se dentro da área
      !!rua &&
      !!numero &&
      !!cidade &&
      !!telefone
    );
  }, [nome, cepValid, serviceable, rua, numero, cidade, telefone]);

  // Busca ViaCEP por endereço (UF / CIDADE / RUA) com debounce
  useEffect(() => {
    if (!openFinder) return;
    const ufOk = (ufFind || "").trim().length === 2;
    const cityOk = (cityFind || "").trim().length >= 2;
    const streetOk = (streetFind || "").trim().length >= 3;
    if (!ufOk || !cityOk || !streetOk) {
      setFindList([]);
      setFindErr("");
      return;
    }
    const ctrl = new AbortController();
    const t = setTimeout(async () => {
      try {
        setFindLoading(true);
        setFindErr("");
        const url = `https://viacep.com.br/ws/${encodeURIComponent(
          ufFind
        )}/${encodeURIComponent(cityFind)}/${encodeURIComponent(streetFind)}/json/`;
        const r = await fetch(url, { signal: ctrl.signal, cache: "force-cache" });
        const raw = (await r.json()) as unknown;

        // Tipagem do retorno ViaCEP quando busca por logradouro
        type ViaCepStreetItem = {
          cep: string;
          logradouro: string;
          bairro: string;
          localidade: string;
          uf: string;
          erro?: boolean;
        };

        if (!Array.isArray(raw)) {
          setFindList([]);
          setFindErr("Não encontramos este logradouro. Tente outro termo.");
          return;
        }

        const arr = raw as ViaCepStreetItem[];

        // ViaCEP às vezes devolve um array com um item contendo { erro: true }
        if (arr.length === 0 || (arr.length === 1 && arr[0]?.erro)) {
          setFindList([]);
          setFindErr("Não encontramos este logradouro. Tente outro termo.");
          return;
        }

        // Normaliza apenas os campos que nos interessam
        setFindList(
          arr.slice(0, 10).map((d) => ({
            cep: d.cep,
            logradouro: d.logradouro,
            bairro: d.bairro,
            localidade: d.localidade,
            uf: d.uf,
          }))
        );

      } catch {
        setFindErr("Falha na consulta. Verifique os dados e tente novamente.");
        setFindList([]);
      } finally {
        setFindLoading(false);
      }
    }, 300);
    return () => { clearTimeout(t); ctrl.abort(); };
  }, [openFinder, ufFind, cityFind, streetFind]);


  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center">
      {/* Backdrop (não fecha no clique) */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Conteúdo */}
      <div
        ref={dialogRef}
        className="relative z-10 w-[min(94vw,680px)] rounded-3xl bg-[#5b3b2e] text-white p-5 sm:p-6 shadow-2xl border border-white/15"
      >
        {/* Header */}
        <div className="flex items-start justify-between">
          <h2 className="text-2xl font-extrabold">Endereço de Entrega</h2>
          <button
            type="button"
            aria-label="Fechar"
            onClick={onClose}
            className="rounded-full w-9 h-9 grid place-items-center bg-white/10 border border-white/20 hover:bg-white/15"
          >
            ×
          </button>
        </div>

        {/* Form */}
        <div className="mt-4 space-y-3">
          <L
            label="CEP"
            required
            hint={
              cepValid === true && serviceable !== null
                ? (serviceable
                  ? `Área atendida — ${eta || "ok"}`
                  : "") // não mostra nada no topo quando for fora da área
                : (eta ? `Entrega estimada ${eta}` : "")
            }
            right={
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className="text-xs underline underline-offset-2 opacity-90 hover:opacity-100"
                  onClick={() => setOpenFinder((v) => !v)}
                  title="Localizar CEP pelo endereço"
                >
                  Não sabe o CEP?
                </button>
                <span aria-live="polite">
                  {cepValid === true
                    ? (serviceable === false ? "✖" : "✔")
                    : cepValid === false
                      ? "✖"
                      : loadingCEP
                        ? "…"
                        : ""}
                </span>
              </div>
            }
          >
            <input
              value={cep}
              onChange={(e) => setCep(formatCEP(e.target.value))}
              inputMode="numeric"
              maxLength={9}
              placeholder="12345-678"
              className="w-full rounded-xl bg-white/10 border border-white/20 px-3 py-2 outline-none"
            />

            {/* msg fora da área abaixo do input, sem quebrar o cabeçalho */}
            {cepValid === true && serviceable === false && (
              <p className="mt-1 text-xs text-rose-300">
                Fora da área — {serviceMsg}
              </p>
            )}
          </L>

          <L label="Rua" required>
            <input
              value={rua}
              onChange={(e) => setRua(e.target.value)}
              className="w-full rounded-xl bg-white/10 border border-white/20 px-3 py-2 outline-none"
              placeholder="Rua"
            />
            {openFinder && (
              <div className="mt-2 rounded-xl border border-white/20 bg-white/5 p-3">
                <div className="grid grid-cols-2 gap-2">
                  <div className="col-span-1">
                    <label className="text-xs opacity-85">UF</label>
                    <input
                      value={ufFind}
                      onChange={(e) => setUfFind(e.target.value.toUpperCase().slice(0, 2))}
                      className="mt-1 w-full rounded-lg bg-white/10 border border-white/20 px-2 py-1 outline-none"
                      placeholder="UF"
                    />
                  </div>
                  <div className="col-span-1">
                    <label className="text-xs opacity-85">Cidade</label>
                    <input
                      value={cityFind}
                      onChange={(e) => setCityFind(e.target.value)}
                      className="mt-1 w-full rounded-lg bg-white/10 border border-white/20 px-2 py-1 outline-none"
                      placeholder="Ex.: Uberlândia"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="text-xs opacity-85">Rua / Avenida</label>
                    <input
                      value={streetFind}
                      onChange={(e) => setStreetFind(e.target.value)}
                      className="mt-1 w-full rounded-lg bg-white/10 border border-white/20 px-2 py-1 outline-none"
                      placeholder="Digite ao menos 3 letras"
                    />
                  </div>
                </div>

                <div className="mt-2 text-xs opacity-85">
                  {findLoading ? "Buscando..." : findErr || (findList.length ? "Selecione seu endereço:" : " ")}
                </div>

                {!!findList.length && (
                  <ul className="mt-2 max-h-40 overflow-auto space-y-1">
                    {findList.map((r, idx) => (
                      <li key={`${r.cep}-${idx}`} className="flex items-center justify-between gap-2 rounded-lg bg-white/5 border border-white/15 px-2 py-2">
                        <div className="text-sm">
                          <div className="font-medium">{r.logradouro}</div>
                          <div className="opacity-85 text-xs">
                            {r.bairro} — {r.localidade}/{r.uf} • CEP {r.cep}
                          </div>
                        </div>
                        <button
                          type="button"
                          className="shrink-0 rounded-md bg-white/10 border border-white/20 px-2 py-1 text-xs hover:bg-white/15"
                          onClick={() => {
                            // Preenche os campos e fecha o painel
                            setCep(formatCEP(r.cep));
                            setRua(r.logradouro ?? "");
                            setBairro(r.bairro ?? "");
                            setCidade(r.localidade ?? "");
                            setUf(r.uf ?? "");
                            setOpenFinder(false);
                          }}
                        >
                          Usar
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </L>

          <div className="grid grid-cols-2 gap-3">
            <L label="Número" required>
              <input
                value={numero}
                onChange={(e) => setNumero(e.target.value)}
                className="w-full rounded-xl bg-white/10 border border-white/20 px-3 py-2 outline-none"
                placeholder="Número"
              />
            </L>
            <L label="Complemento (opcional)">
              <input
                value={complemento}
                onChange={(e) => setComplemento(e.target.value)}
                className="w-full rounded-xl bg-white/10 border border-white/20 px-3 py-2 outline-none"
                placeholder="Apto, bloco, torre…"
              />
            </L>
            <L label="Cidade" required>
              <input
                value={cidade}
                onChange={(e) => setCidade(e.target.value)}
                className="w-full rounded-xl bg-white/10 border border-white/20 px-3 py-2 outline-none"
                placeholder="Cidade"
              />
            </L>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <L label="Bairro">
              <input
                value={bairro}
                onChange={(e) => setBairro(e.target.value)}
                className="w-full rounded-xl bg-white/10 border border-white/20 px-3 py-2 outline-none"
                placeholder="Bairro"
              />
            </L>
            <L label="UF">
              <input
                value={uf}
                onChange={(e) => setUf(e.target.value.toUpperCase().slice(0, 2))}
                className="w-full rounded-xl bg-white/10 border border-white/20 px-3 py-2 outline-none"
                placeholder="UF"
              />
            </L>
          </div>

          <L label="Ponto de referência (opcional)">
            <input
              value={referencia}
              onChange={(e) => setReferencia(e.target.value)}
              className="w-full rounded-xl bg-white/10 border border-white/20 px-3 py-2 outline-none"
              placeholder="Perto de..."
            />
          </L>

          <L label="Telefone (WhatsApp)" required>
            <input
              value={telefone}
              onChange={(e) => setTelefone(formatPhone(e.target.value))}
              inputMode="tel"
              placeholder="(34) 90000-0000"
              className="w-full rounded-xl bg-white/10 border border-white/20 px-3 py-2 outline-none"
            />
          </L>

        </div>

        {/* Ações */}
        <div className="mt-5">
          <button
            type="button"
            disabled={!canConfirm}
            onClick={() =>
              onConfirm({
                nome,
                cep: onlyDigits(cep),
                rua,
                numero,
                bairro,
                cidade,
                uf,
                referencia,
                telefone: onlyDigits(telefone),
                complemento,
              })
            }
            className={`w-full rounded-2xl px-5 py-4 text-lg font-semibold shadow
              ${canConfirm
                ? "bg-[#E4572E] text-white hover:brightness-105"
                : "bg-neutral-500/40 text-white/70 cursor-not-allowed"}

            `}
          >
            Confirmar Endereço
          </button>
        </div>
      </div>
      {showOutOfArea && (
        <div className="fixed inset-0 z-[60] grid place-items-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="relative z-10 w-[min(92vw,520px)] rounded-2xl bg-[#5b3b2e] text-white p-5 border border-white/15 shadow-2xl">
            <h3 className="text-xl font-bold">Área ainda não atendida</h3>
            <p className="mt-3 text-sm opacity-90">
              No momento ainda não entregamos neste endereço. Estamos em expansão
              e trabalhando para atender mais áreas em breve. 🙏
            </p>
            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={() => setShowOutOfArea(false)}
                className="rounded-xl bg-white/10 border border-white/20 px-4 py-2 text-sm hover:bg-white/15"
              >
                Ok
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- helpers ---------- */
function onlyDigits(v: string) { return v.replace(/\D+/g, ""); }
function formatCEP(v: string) {
  const d = onlyDigits(v).slice(0, 8);
  return d.length > 5 ? `${d.slice(0, 5)}-${d.slice(5)}` : d;
}

function formatPhone(v: string) {
  const d = onlyDigits(v).slice(0, 11); // até 11 dígitos
  if (d.length <= 2) return `(${d}`;
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7, 11)}`;
}


function L({
  label,
  required,
  hint,
  right,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  right?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <div className="flex items-center justify-between mb-1 text-sm">
        <span className="opacity-90">
          {label} {required ? <span className="opacity-80">*</span> : null}
        </span>
        <div className="flex items-center gap-2 text-xs opacity-85">{hint ? <span>{hint}</span> : null}{right}</div>
      </div>
      {children}
    </label>
  );
}