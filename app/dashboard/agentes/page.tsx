"use client";
import { useState, useEffect } from "react";
import { createBrowserSupabase } from "@/lib/supabase-browser";

const T = "#0d9488";
const T_LIGHT = "#f0fdfa";
const T_DARK = "#0f766e";

const Label = ({ children, sub }: { children: React.ReactNode; sub?: React.ReactNode }) => (
  <label style={{ display: "block", fontSize: 12.5, fontWeight: 600, color: "#374151", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.04em" }}>
    {children} {sub && <span style={{ fontSize: 11, fontWeight: 400, color: "#9ca3af", textTransform: "none", letterSpacing: 0 }}>{sub}</span>}
  </label>
);

const Field = ({ value, onChange, placeholder, type = "text", mono }: { value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; placeholder?: string; type?: string; mono?: boolean }) => (
  <input type={type} value={value} onChange={onChange} placeholder={placeholder}
    style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: `1.5px solid ${value ? T : "#e5e7eb"}`, fontSize: 13.5, outline: "none", boxSizing: "border-box", fontFamily: mono ? "monospace" : "inherit", background: "white", transition: "border-color 0.2s" }} />
);

const TextArea = ({ value, onChange, placeholder, rows = 6 }: { value: string; onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void; placeholder?: string; rows?: number }) => (
  <textarea rows={rows} value={value} onChange={onChange} placeholder={placeholder}
    style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: `1.5px solid ${value ? T : "#e5e7eb"}`, fontSize: 13.5, outline: "none", boxSizing: "border-box", fontFamily: "inherit", resize: "vertical", lineHeight: 1.55, background: "white", transition: "border-color 0.2s" }} />
);

const InfoBox = ({ children, type = "info" }: { children: React.ReactNode; type?: "info" | "warning" }) => {
  const s = type === "warning"
    ? { bg: "#fff7ed", border: "#fed7aa", color: "#9a3412", icon: "⚠️" }
    : { bg: T_LIGHT, border: "#99f6e4", color: T_DARK, icon: "💡" };
  return (
    <div style={{ background: s.bg, border: `1px solid ${s.border}`, borderRadius: 9, padding: "10px 13px", display: "flex", gap: 8, alignItems: "flex-start" }}>
      <span style={{ fontSize: 13 }}>{s.icon}</span>
      <p style={{ margin: 0, fontSize: 13, color: s.color, lineHeight: 1.5 }}>{children}</p>
    </div>
  );
};

const Toggle = ({ checked, onChange, disabled }: { checked: boolean; onChange: (v: boolean) => void; disabled?: boolean }) => (
  <button onClick={() => !disabled && onChange(!checked)}
    style={{ width: 38, height: 21, borderRadius: 11, border: "none", cursor: disabled ? "not-allowed" : "pointer", background: disabled ? "#e5e7eb" : checked ? T : "#d1d5db", position: "relative", transition: "background 0.2s", flexShrink: 0 }}>
    <span style={{ position: "absolute", top: 2.5, left: checked ? 19 : 2.5, width: 16, height: 16, borderRadius: "50%", background: "white", transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }} />
  </button>
);

const CopyBtn = ({ text }: { text: string }) => {
  const [ok, setOk] = useState(false);
  return (
    <button onClick={() => { navigator.clipboard.writeText(text); setOk(true); setTimeout(() => setOk(false), 2000); }}
      style={{ background: ok ? T_LIGHT : "#f1f5f9", border: `1px solid ${ok ? "#99f6e4" : "#e5e7eb"}`, borderRadius: 6, padding: "3px 9px", fontSize: 12, color: ok ? T_DARK : "#6b7280", cursor: "pointer", fontWeight: 600, transition: "all 0.2s", flexShrink: 0 }}>
      {ok ? "✓" : "Copiar"}
    </button>
  );
};

const StepBar = ({ current }: { current: number }) => {
  const steps = ["Conecta WhatsApp", "Configura el agente", "Activar"];
  return (
    <div style={{ display: "flex", alignItems: "center", marginBottom: 26 }}>
      {steps.map((s, i) => {
        const n = i + 1; const done = n < current; const active = n === current;
        return (
          <div key={n} style={{ display: "flex", alignItems: "center", flex: i < 2 ? 1 : "none" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <div style={{ width: 25, height: 25, borderRadius: "50%", background: done || active ? T : "#e5e7eb", color: done || active ? "white" : "#9ca3af", fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.25s", flexShrink: 0 }}>
                {done ? "✓" : n}
              </div>
              <span style={{ fontSize: 13, fontWeight: active ? 600 : 400, color: active ? "#111827" : done ? T : "#9ca3af", whiteSpace: "nowrap" }}>{s}</span>
            </div>
            {i < 2 && <div style={{ flex: 1, height: 1.5, background: done ? T : "#e5e7eb", margin: "0 10px", minWidth: 12, transition: "background 0.3s" }} />}
          </div>
        );
      })}
    </div>
  );
};

type WaData = { apiKey: string; phone_number: string; userId: string };
type AgData = { agent_name: string; system_prompt: string; reengagement: boolean; analytics: boolean; advanced_memory: boolean };

function Step1({ data, set }: { data: WaData; set: (d: WaData) => void }) {
  const webhook = `https://revly.app/api/webhook/${data.userId || "tu-id"}`;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <div>
        <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: "#111827" }}>Conecta tu WhatsApp Business</h3>
        <p style={{ margin: "5px 0 0", fontSize: 13.5, color: "#6b7280" }}>Revly usa la API oficial de WhatsApp a través de YCloud.</p>
      </div>
      <div style={{ border: "1px solid #e5e7eb", borderRadius: 10, overflow: "hidden" }}>
        {[
          { n: 1, title: "Crea cuenta gratuita en YCloud", body: "Sin tarjeta de crédito.", link: { href: "https://app.ycloud.com/register", label: "Ir a YCloud →" } },
          { n: 2, title: "Conecta tu número", body: "YCloud → WhatsApp → Números." },
          { n: 3, title: "Copia tu API Key", body: "YCloud → Developers → API Keys." },
          { n: 4, title: "Añade el webhook de Revly", body: "YCloud → Developers → Webhooks → pega esta URL:", webhook },
        ].map(({ n, title, body, link, webhook: wh }: { n: number; title: string; body: string; link?: { href: string; label: string }; webhook?: string }, idx, arr) => (
          <div key={n} style={{ display: "flex", gap: 12, padding: "12px 15px", background: "white", borderBottom: idx < arr.length - 1 ? "1px solid #f3f4f6" : "none" }}>
            <div style={{ width: 21, height: 21, borderRadius: "50%", background: T_LIGHT, color: T, fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>{n}</div>
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontSize: 13.5, fontWeight: 600, color: "#1f2937" }}>{title}</p>
              <p style={{ margin: "2px 0 0", fontSize: 13, color: "#6b7280" }}>{body}</p>
              {link && <a href={link.href} target="_blank" rel="noreferrer" style={{ display: "inline-flex", marginTop: 5, fontSize: 12.5, color: T, fontWeight: 600, textDecoration: "none" }}>{link.label}</a>}
              {wh && (
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 7, background: "#f8fafc", border: "1px solid #e5e7eb", borderRadius: 7, padding: "6px 10px" }}>
                  <code style={{ flex: 1, fontSize: 11.5, color: "#374151", fontFamily: "monospace", wordBreak: "break-all" }}>{wh}</code>
                  <CopyBtn text={wh} />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
        <div>
          <Label>API Key de YCloud <span style={{ color: "#ef4444" }}>*</span></Label>
          <Field type="password" value={data.apiKey} onChange={(e) => set({ ...data, apiKey: e.target.value })} placeholder="yc_live_xxxxxxxxxxxxxxxxxxxx" mono />
        </div>
        <div>
          <Label>Número de WhatsApp Business <span style={{ color: "#ef4444" }}>*</span></Label>
          <Field value={data.phone_number} onChange={(e) => set({ ...data, phone_number: e.target.value })} placeholder="+34612345678" />
        </div>
      </div>
      <InfoBox>Tu API Key se guarda encriptada.</InfoBox>
    </div>
  );
}

const TEMPLATES: Record<string, string> = {
  sales: `Eres {nombre}, el asistente de ventas de {empresa}. Tu objetivo es resolver dudas y guiar al cliente para agendar una llamada comercial.\n\nTono: profesional y cercano.`,
  support: `Eres {nombre}, el agente de soporte de {empresa}. Ayuda a los clientes a resolver incidencias de forma rápida.\n\nSi requiere datos internos, indica que un agente humano contactará pronto.`,
  booking: `Eres {nombre}, el asistente de reservas de {empresa}. Gestiona citas: consulta disponibilidad y confirma reservas.\n\nPide nombre, fecha y teléfono. Confirma con resumen antes de cerrar.`,
};

const PLAN_FEATURES: Record<string, { reengagement: boolean; analytics: boolean; advanced_memory: boolean }> = {
  essential: { reengagement: false, analytics: false, advanced_memory: false },
  growth:    { reengagement: true,  analytics: true,  advanced_memory: false },
  partner:   { reengagement: true,  analytics: true,  advanced_memory: true  },
};

function Step2({ data, set, plan }: { data: AgData; set: (d: AgData) => void; plan: string }) {
  const [tpl, setTpl] = useState<string | null>(null);
  const allowed = PLAN_FEATURES[plan] ?? PLAN_FEATURES.essential;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <div>
        <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: "#111827" }}>Configura tu agente</h3>
        <p style={{ margin: "5px 0 0", fontSize: 13.5, color: "#6b7280" }}>Ponle nombre y define cómo se comportará.</p>
      </div>
      <div>
        <Label>Nombre del agente <span style={{ color: "#ef4444" }}>*</span></Label>
        <Field value={data.agent_name} onChange={(e) => set({ ...data, agent_name: e.target.value })} placeholder="Ej: Sofía, Asistente Virtual…" />
      </div>
      <div>
        <Label>Punto de partida</Label>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 12 }}>
          {[{ k: "sales", l: "Ventas", i: "🎯" }, { k: "support", l: "Soporte", i: "🛟" }, { k: "booking", l: "Reservas", i: "📅" }].map(({ k, l, i }) => (
            <button key={k} onClick={() => { setTpl(k); set({ ...data, system_prompt: TEMPLATES[k] }); }}
              style={{ padding: "10px 8px", borderRadius: 9, border: `1.5px solid ${tpl === k ? T : "#e5e7eb"}`, background: tpl === k ? T_LIGHT : "white", cursor: "pointer", textAlign: "center" }}>
              <div style={{ fontSize: 18 }}>{i}</div>
              <div style={{ fontSize: 12.5, fontWeight: 600, color: tpl === k ? T_DARK : "#374151", marginTop: 3 }}>{l}</div>
            </button>
          ))}
        </div>
        <Label sub="(system_prompt)">Instrucciones del agente <span style={{ color: "#ef4444" }}>*</span></Label>
        <TextArea value={data.system_prompt} onChange={(e) => set({ ...data, system_prompt: e.target.value })} placeholder="Describe el comportamiento de tu agente…" />
      </div>
      <div>
        <Label>Funciones avanzadas</Label>
        <div style={{ border: "1px solid #e5e7eb", borderRadius: 10, overflow: "hidden" }}>
          {([
            { key: "reengagement" as const, label: "Reengagement automático", desc: "Reactiva contactos que no han respondido", req: "growth" },
            { key: "analytics" as const, label: "Analíticas detalladas", desc: "Métricas de conversión y satisfacción", req: "growth" },
            { key: "advanced_memory" as const, label: "Memoria avanzada", desc: "El agente recuerda contexto entre sesiones", req: "partner" },
          ]).map(({ key, label, desc, req }, idx) => {
            const on = allowed[key];
            return (
              <div key={key} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "11px 14px", background: on ? "white" : "#fafafa", borderBottom: idx < 2 ? "1px solid #f3f4f6" : "none" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                    <span style={{ fontSize: 13.5, fontWeight: 600, color: on ? "#1f2937" : "#9ca3af" }}>{label}</span>
                    {!on && <span style={{ fontSize: 11, background: "#f1f5f9", color: "#64748b", padding: "2px 7px", borderRadius: 20, fontWeight: 600 }}>Plan {req}</span>}
                  </div>
                  <p style={{ margin: "2px 0 0", fontSize: 12.5, color: on ? "#6b7280" : "#c0c9d4" }}>{desc}</p>
                </div>
                <Toggle checked={!!data[key]} onChange={(v) => set({ ...data, [key]: v })} disabled={!on} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

const PLAN_LABELS: Record<string, string> = { essential: "Starter", growth: "Growth", partner: "Enterprise" };
const MAX_CONV: Record<string, string | number> = { essential: 500, growth: 1500, partner: "∞" };

function Step3({ whatsapp, agent, plan, userId }: { whatsapp: WaData; agent: AgData; plan: string; userId: string }) {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const checks = [
    { label: "API Key de YCloud", value: whatsapp.apiKey ? "••••" + whatsapp.apiKey.slice(-4) : null },
    { label: "Número de WhatsApp", value: whatsapp.phone_number || null },
    { label: "Nombre del agente", value: agent.agent_name || null },
    { label: "Instrucciones configuradas", value: agent.system_prompt ? `${agent.system_prompt.length} caracteres` : null },
  ];
  const allOk = checks.every(c => c.value);

  const activate = async () => {
    setLoading(true);
    setError("");
    try {
      const supabase = createBrowserSupabase();
      await supabase.from("agents").upsert({
        user_id: userId,
        whatsapp_number: whatsapp.phone_number,
        name: agent.agent_name,
        system_prompt: agent.system_prompt,
        reengagement: agent.reengagement,
        analytics: agent.analytics,
        advanced_memory: agent.advanced_memory,
        status: "active",
      }, { onConflict: "user_id" });
      const res = await fetch("/api/provision", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customer_id: userId }),
      });
      if (!res.ok) throw new Error("provision failed");
      setDone(true);
    } catch {
      setError("Error activando el agente. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  if (done) return (
    <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 16, padding: "12px 0" }}>
      <div style={{ width: 56, height: 56, borderRadius: "50%", background: T_LIGHT, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <svg width="26" height="26" viewBox="0 0 26 26" fill="none"><path d="M4 13l6 6 12-12" stroke={T} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </div>
      <div>
        <h3 style={{ margin: 0, fontSize: 19, fontWeight: 700, color: "#111827" }}>¡Agente activado!</h3>
        <p style={{ margin: "5px 0 0", fontSize: 13.5, color: "#6b7280" }}><strong style={{ color: "#111827" }}>{agent.agent_name}</strong> escuchando en <strong style={{ color: "#111827" }}>{whatsapp.phone_number}</strong></p>
      </div>
      <div style={{ width: "100%", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        <div style={{ background: T_LIGHT, borderRadius: 9, padding: "12px 14px", border: "1px solid #99f6e4" }}>
          <div style={{ fontSize: 11, color: T_DARK, fontWeight: 700, textTransform: "uppercase" }}>Plan activo</div>
          <div style={{ fontSize: 17, fontWeight: 700, color: "#111827", marginTop: 3 }}>{PLAN_LABELS[plan]}</div>
        </div>
        <div style={{ background: "#f8fafc", borderRadius: 9, padding: "12px 14px", border: "1px solid #e5e7eb" }}>
          <div style={{ fontSize: 11, color: "#64748b", fontWeight: 700, textTransform: "uppercase" }}>Conversaciones / mes</div>
          <div style={{ fontSize: 17, fontWeight: 700, color: "#111827", marginTop: 3 }}>{MAX_CONV[plan]}</div>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 15 }}>
      <div>
        <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: "#111827" }}>Revisión y activación</h3>
        <p style={{ margin: "5px 0 0", fontSize: 13.5, color: "#6b7280" }}>Comprueba que todo esté listo.</p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {checks.map(({ label, value }) => (
          <div key={label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 13px", background: "#f9fafb", borderRadius: 8, border: "1px solid #e5e7eb" }}>
            <div>
              <div style={{ fontSize: 11, color: "#9ca3af", fontWeight: 700, textTransform: "uppercase" }}>{label}</div>
              <div style={{ fontSize: 13.5, color: value ? "#1f2937" : "#ef4444", marginTop: 2 }}>{value || "Sin configurar"}</div>
            </div>
            <div style={{ width: 20, height: 20, borderRadius: "50%", background: value ? T : "#fee2e2", display: "flex", alignItems: "center", justifyContent: "center" }}>
              {value
                ? <svg width="11" height="11" viewBox="0 0 11 11" fill="none"><path d="M2 5.5l2.5 2.5 5-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                : <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 2l6 6M8 2l-6 6" stroke="#ef4444" strokeWidth="1.6" strokeLinecap="round" /></svg>}
            </div>
          </div>
        ))}
      </div>
      {error && <InfoBox type="warning">{error}</InfoBox>}
      {!allOk ? <InfoBox type="warning">Hay campos incompletos. Vuelve a los pasos anteriores.</InfoBox> : <InfoBox>Todo listo. Al activar, el agente empezará a responder mensajes.</InfoBox>}
      <button onClick={activate} disabled={!allOk || loading}
        style={{ padding: "12px", borderRadius: 9, border: "none", background: !allOk ? "#e5e7eb" : T, color: !allOk ? "#9ca3af" : "white", fontSize: 14.5, fontWeight: 700, cursor: !allOk || loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
        {loading ? "Activando…" : "Activar agente →"}
      </button>
    </div>
  );
}

export default function MiAgentePage() {
  const [plan, setPlan] = useState("essential");
  const [userId, setUserId] = useState("demo");
  const [step, setStep] = useState(1);
  const [wa, setWa] = useState<WaData>({ apiKey: "", phone_number: "", userId: "demo" });
  const [ag, setAg] = useState<AgData>({ agent_name: "", system_prompt: "", reengagement: false, analytics: false, advanced_memory: false });

  useEffect(() => {
    const load = async () => {
      const supabase = createBrowserSupabase();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setUserId(user.id);
      setWa(w => ({ ...w, userId: user.id }));
      const { data } = await supabase.from("subscriptions").select("plan").eq("user_id", user.id).single();
      if (data?.plan) setPlan(data.plan);
    };
    load();
  }, []);

  const canNext = step === 1
    ? wa.apiKey.trim() !== "" && wa.phone_number.trim() !== ""
    : ag.agent_name.trim() !== "" && ag.system_prompt.trim() !== "";

  return (
    <div style={{ padding: "2rem", maxWidth: 640 }}>
      <div style={{ marginBottom: 22 }}>
        <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#111827" }}>Mi agente</h2>
        <p style={{ margin: "4px 0 0", fontSize: 14, color: "#6b7280" }}>Configura y activa tu agente de ventas en WhatsApp.</p>
      </div>
      <div style={{ background: "white", borderRadius: 14, border: "1px solid #e5e7eb", padding: "24px", boxShadow: "0 1px 8px rgba(0,0,0,0.05)" }}>
        <StepBar current={step} />
        {step === 1 && <Step1 data={wa} set={setWa} />}
        {step === 2 && <Step2 data={ag} set={setAg} plan={plan} />}
        {step === 3 && <Step3 whatsapp={wa} agent={ag} plan={plan} userId={userId} />}
        {step < 3 && (
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 22, paddingTop: 18, borderTop: "1px solid #f3f4f6" }}>
            <button onClick={() => setStep(s => s - 1)} disabled={step === 1}
              style={{ padding: "8px 18px", borderRadius: 8, border: "1.5px solid #e5e7eb", background: "white", fontSize: 13.5, fontWeight: 500, color: step === 1 ? "#d1d5db" : "#374151", cursor: step === 1 ? "not-allowed" : "pointer" }}>
              ← Atrás
            </button>
            <button onClick={() => setStep(s => s + 1)} disabled={!canNext}
              style={{ padding: "8px 22px", borderRadius: 8, border: "none", background: canNext ? T : "#e5e7eb", color: canNext ? "white" : "#9ca3af", fontSize: 13.5, fontWeight: 600, cursor: canNext ? "pointer" : "not-allowed" }}>
              Guardar y continuar →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
