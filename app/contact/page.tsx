"use client";

import React, { useState } from "react";
import emailjs from "@emailjs/browser";
import { toast } from "sonner";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  Check,
  ChevronRight,
  Copy,
  Github,
  Linkedin,
  Loader2,
  Mail,
  RotateCcw,
  Send,
} from "lucide-react";
import { appleSpring, fadeUp, scaleIn, staggerContainer } from "@/lib/animations/variants";
import { AVAILABILITY, SOCIAL } from "@/lib/site";

/*
    Redesign de /contact (canvas "Avaliação e Redesign do Portfólio", artboards 6 e 6b).

    Antes: três painéis redimensionáveis (árvore de contatos, formulário centralizado e
    prévia JavaScript), com o e-mail e as redes escondidos em pastas da lateral.

    Agora, de cima para baixo:
      1. Cabeçalho com o convite e a disponibilidade.
      2. Canais diretos em cards — e-mail com "Copiar", LinkedIn, GitHub. Quem só quer o
         endereço resolve aqui, sem rolar até o formulário.
      3. Formulário + prévia `message.ts` lado a lado (a prévia ao vivo é a assinatura da
         página antiga e foi mantida). No celular a prévia vira seção recolhível.
      4. Estado de sucesso no lugar do formulário, em vez de só um toast que some.

    Preservado: envio via EmailJS (mesmo serviço, template e chaves), validação, toasts.
*/

const MESSAGE_MAX = 2000;

const SUBJECTS = [
  { id: "vaga", label: "Vaga" },
  { id: "freela", label: "Projeto freela" },
  { id: "pesquisa", label: "Pesquisa" },
  { id: "outro", label: "Outro" },
] as const;

type SubjectId = (typeof SUBJECTS)[number]["id"];
type SendState = "idle" | "sending" | "sent";

const inputClass =
  "w-full min-h-12 px-3.5 rounded-[10px] border text-base transition-shadow " +
  "focus:outline-none focus:border-[var(--ide-accent)] focus:ring-[3px] focus:ring-[var(--accent-ring)]";

const inputStyle: React.CSSProperties = {
  backgroundColor: "var(--bg-primary)",
  borderColor: "var(--border-default)",
  color: "var(--text-primary)",
};

const kw = { color: "var(--syntax-keyword)" } as const;
const str = { color: "var(--syntax-string)" } as const;
const ty = { color: "var(--syntax-type)" } as const;
const mu = { color: "var(--text-muted)" } as const;

/** Escapa aspas e quebras para a prévia parecer um literal de string válido. */
const asLiteral = (value: string, max = 48) => {
  const flat = value.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\s+/g, " ");
  return flat.length > max ? `${flat.slice(0, max)}…` : flat;
};

function MessagePreview({
  name,
  email,
  subject,
  message,
  sentAt,
  compact = false,
}: {
  name: string;
  email: string;
  subject: SubjectId;
  message: string;
  sentAt: string;
  compact?: boolean;
}) {
  const prefersReduced = useReducedMotion();
  return (
    <pre
      className={`m-0 font-mono overflow-x-auto ${compact ? "text-xs leading-7 px-4 pb-4" : "text-sm leading-[1.85] p-6 sm:p-7 flex-1"}`}
      style={{ color: "var(--text-secondary)" }}
      aria-label="Prévia da mensagem como código"
    >
      <code>
        {!compact && (
          <>
            <span style={mu}>{"// enquanto você digita, isto se escreve sozinho"}</span>
            {"\n"}
          </>
        )}
        <span style={kw}>const</span> <span style={ty}>message</span> <span style={mu}>= {"{"}</span>
        {"\n  "}name<span style={mu}>:</span> <span style={str}>&quot;{asLiteral(name)}&quot;</span>
        <span style={mu}>,</span>
        {!compact && (
          <>
            {"\n  "}email<span style={mu}>:</span> <span style={str}>&quot;{asLiteral(email)}&quot;</span>
            <span style={mu}>,</span>
          </>
        )}
        {"\n  "}subject<span style={mu}>:</span> <span style={str}>&quot;{subject}&quot;</span>
        <span style={mu}>,</span>
        {"\n  "}body<span style={mu}>:</span> <span style={str}>&quot;{asLiteral(message, compact ? 24 : 40)}&quot;</span>
        <span style={mu}>,</span>
        {!compact && (
          <>
            {"\n  "}sentAt<span style={mu}>:</span> <span style={str}>&quot;{sentAt}&quot;</span>
            <span style={mu}>,</span>
          </>
        )}
        {"\n"}
        <span style={mu}>{"};"}</span>
        {!compact && (
          <>
            {"\n\n"}
            <span style={kw}>await</span> felipe<span style={mu}>.</span>
            <span style={{ color: "var(--accent-purple-text)" }}>inbox</span>
            <span style={mu}>(</span>message<span style={mu}>);</span>
            <motion.span
              aria-hidden="true"
              className="inline-block w-[9px] h-[1.1em] align-text-bottom ml-0.5"
              style={{ backgroundColor: "var(--ide-accent)" }}
              animate={prefersReduced ? undefined : { opacity: [1, 0, 1] }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          </>
        )}
      </code>
    </pre>
  );
}

export default function ContactPage() {
  const prefersReduced = useReducedMotion();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState<SubjectId>("vaga");
  const [message, setMessage] = useState("");
  const [state, setState] = useState<SendState>("idle");
  const [emailCopied, setEmailCopied] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);
  const [sentAt] = useState(() =>
    new Date().toLocaleDateString("pt-BR", { weekday: "short", day: "2-digit", month: "short" }),
  );

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(SOCIAL.email);
      setEmailCopied(true);
      toast.success("E-mail copiado!");
      setTimeout(() => setEmailCopied(false), 2000);
    } catch {
      toast.error("Não consegui copiar. O endereço é " + SOCIAL.email);
    }
  };

  const copyCode = () => {
    const code =
      `const message = {\n  name: "${name}",\n  email: "${email}",\n  subject: "${subject}",\n` +
      `  body: "${message}",\n  sentAt: "${sentAt}",\n};\n\nawait felipe.inbox(message);`;
    navigator.clipboard.writeText(code);
    setCodeCopied(true);
    toast.success("Código copiado para a área de transferência!");
    setTimeout(() => setCodeCopied(false), 2000);
  };

  const clearForm = () => {
    setName("");
    setEmail("");
    setMessage("");
    setSubject("vaga");
  };

  const sendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      toast.error("Por favor, preencha nome, e-mail e mensagem.");
      return;
    }

    setState("sending");
    const subjectLabel = SUBJECTS.find((s) => s.id === subject)?.label ?? subject;
    /*
        `send` com parâmetros em vez de `sendForm`: o assunto não existe no template do
        EmailJS, então ele vai prefixado no corpo — o template continua o mesmo e nenhum
        e-mail chega sem saber do que se trata. Os nomes de campo (user_name, user_email,
        message) são os que o template já usava.
    */
    emailjs
      .send(
        "service_t1tmh03",
        "template_rpvclnm",
        {
          user_name: name,
          user_email: email,
          subject: subjectLabel,
          message: `[${subjectLabel}] ${message}`,
        },
        { publicKey: "CE7O3eEe9VG24eQB4" },
      )
      .then(
        () => {
          setState("sent");
          clearForm();
        },
        (error: { text?: string }) => {
          setState("idle");
          toast.error(`Falha ao enviar mensagem${error?.text ? `: ${error.text}` : "."} Tente pelo e-mail direto.`);
        },
      );
  };

  return (
    <div
      className="min-h-[calc(100vh-var(--chrome-height))] w-full transition-colors duration-300"
      style={{ backgroundColor: "var(--bg-primary)", color: "var(--text-primary)" }}
    >
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 md:px-12 pt-8 sm:pt-[72px] pb-28 flex flex-col gap-7 sm:gap-14">
        {/* CABEÇALHO */}
        <motion.header
          className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5 lg:gap-8"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <div className="flex flex-col gap-3.5 sm:gap-4 max-w-2xl">
            <motion.p variants={fadeUp} className="font-mono text-[13px]" style={{ color: "var(--syntax-comment)" }}>
              {"// contact.ts"}
            </motion.p>
            <motion.h1
              variants={fadeUp}
              className="text-[38px] sm:text-[56px] leading-[1.05] font-medium tracking-tight"
            >
              Vamos conversar.
            </motion.h1>
            <motion.p
              variants={fadeUp}
              className="text-base sm:text-lg leading-relaxed"
              style={{ color: "var(--text-secondary)" }}
            >
              Vaga, projeto ou só uma dúvida sobre algo que eu publiquei. Escolha o canal que
              preferir.
            </motion.p>
          </div>
          {/* Selo só quando AVAILABILITY está preenchido em lib/site.ts (nada inventado). */}
          {AVAILABILITY && (
            <motion.p
              variants={fadeUp}
              className="self-start lg:self-auto inline-flex items-center gap-2.5 px-4 py-2 rounded-full border text-sm"
              style={{ borderColor: "var(--border-default)", color: "var(--text-secondary)" }}
            >
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: "var(--status-ok)" }} aria-hidden="true" />
              {AVAILABILITY}
            </motion.p>
          )}
        </motion.header>

        {/* CANAIS DIRETOS — cards no desktop, lista compacta no celular */}
        <motion.section
          aria-label="Canais diretos"
          className="grid md:grid-cols-3 rounded-xl md:rounded-none border md:border-0 overflow-hidden md:overflow-visible md:gap-4"
          style={{ borderColor: "var(--border-default)" }}
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            variants={fadeUp}
            className="flex md:flex-col items-center md:items-stretch gap-3 md:gap-3.5 pl-4 pr-1.5 py-2.5 md:p-6 md:rounded-xl md:border border-b md:border-b"
            style={{ backgroundColor: "var(--bg-secondary)", borderColor: "var(--border-default)" }}
          >
            <div className="flex items-center justify-between">
              <Mail className="w-5 h-5 md:w-[22px] md:h-[22px]" style={{ color: "var(--ide-accent)" }} aria-hidden="true" />
              <span className="hidden md:inline font-mono text-xs" style={{ color: "var(--text-muted)" }}>
                mais rápido
              </span>
            </div>
            <div className="flex-1 min-w-0 flex flex-col gap-0.5 md:gap-1">
              <span className="text-xs md:text-[13px]" style={{ color: "var(--text-secondary)" }}>E-mail</span>
              <span className="text-sm md:text-[17px] font-medium truncate">{SOCIAL.email}</span>
            </div>
            <div className="flex items-center gap-2 md:mt-auto">
              <button
                type="button"
                onClick={copyEmail}
                aria-label={emailCopied ? "E-mail copiado" : "Copiar e-mail"}
                className="inline-flex items-center justify-center gap-2 w-11 h-11 md:w-auto md:min-h-11 md:px-4 rounded-[10px] md:border text-sm transition-colors hover:bg-black/5 dark:hover:bg-white/5"
                style={{ borderColor: "var(--border-default)", color: "var(--text-primary)" }}
              >
                {/* Morph Copy → Check: o ícone sai girando e o check entra com mola e um
                    "ping" de escala — o retorno do clique é físico, não só a troca de glifo. */}
                <span className="relative inline-flex w-4 h-4" aria-hidden="true">
                  <AnimatePresence mode="popLayout" initial={false}>
                    {emailCopied ? (
                      <motion.span
                        key="check"
                        className="absolute inset-0"
                        initial={{ scale: 0.3, opacity: 0, rotate: -45 }}
                        animate={{ scale: [0.3, 1.25, 1], opacity: 1, rotate: 0 }}
                        exit={{ scale: 0.3, opacity: 0 }}
                        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <Check className="w-4 h-4" style={{ color: "var(--status-ok)" }} />
                      </motion.span>
                    ) : (
                      <motion.span
                        key="copy"
                        className="absolute inset-0"
                        initial={{ scale: 0.3, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1, rotate: 0 }}
                        exit={{ scale: 0.3, opacity: 0, rotate: 45 }}
                        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <Copy className="w-4 h-4" />
                      </motion.span>
                    )}
                  </AnimatePresence>
                </span>
                <span className="hidden md:inline">{emailCopied ? "Copiado" : "Copiar"}</span>
              </button>
              <a
                href={`mailto:${SOCIAL.email}`}
                className="hidden md:inline-flex items-center gap-1 min-h-11 px-3 text-sm hover:underline underline-offset-4"
                style={{ color: "var(--ide-accent-text)" }}
              >
                Abrir no app <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </a>
            </div>
          </motion.div>

          {[
            { href: SOCIAL.linkedin, label: "LinkedIn", handle: "/in/felipegrolla", cta: "Ver perfil", icon: Linkedin },
            { href: SOCIAL.github, label: "GitHub", handle: "@Grolla05", cta: "Ver repositórios", icon: Github },
          ].map(({ href, label, handle, cta, icon: Icon }, i) => (
            <motion.a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              variants={fadeUp}
              whileHover={{ y: -2 }}
              className={`group flex md:flex-col items-center md:items-stretch gap-3 md:gap-3.5 min-h-16 px-4 md:p-6 md:rounded-xl md:border ${i === 0 ? "border-b md:border-b" : ""} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--ide-accent)]`}
              style={{ backgroundColor: "var(--bg-secondary)", borderColor: "var(--border-default)", color: "var(--text-primary)" }}
            >
              <Icon className="w-5 h-5 md:w-[22px] md:h-[22px]" style={{ color: "var(--ide-accent)" }} aria-hidden="true" />
              <div className="flex-1 flex flex-col gap-0.5 md:gap-1">
                <span className="text-xs md:text-[13px]" style={{ color: "var(--text-secondary)" }}>{label}</span>
                <span className="text-sm md:text-[17px] font-medium">{handle}</span>
              </div>
              <span className="hidden md:inline-flex items-center gap-1 min-h-11 mt-auto text-sm group-hover:underline underline-offset-4" style={{ color: "var(--ide-accent-text)" }}>
                {cta} <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </span>
              <ChevronRight className="md:hidden w-4 h-4" style={{ color: "var(--text-muted)" }} aria-hidden="true" />
              <span className="sr-only"> (abre em nova aba)</span>
            </motion.a>
          ))}
        </motion.section>

        {/* FORMULÁRIO + PRÉVIA */}
        <section
          aria-label="Formulário de contato"
          className="flex flex-col lg:flex-row rounded-xl border overflow-hidden"
          style={{ backgroundColor: "var(--bg-secondary)", borderColor: "var(--border-default)" }}
        >
          <div className="flex-1 min-w-0 p-5 sm:p-10">
            <AnimatePresence mode="wait" initial={false}>
              {state === "sent" ? (
                <motion.div
                  key="sent"
                  variants={scaleIn}
                  initial="hidden"
                  animate="visible"
                  exit={prefersReduced ? undefined : { opacity: 0 }}
                  className="h-full flex flex-col justify-center gap-5 py-6"
                  role="status"
                >
                  <span
                    className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: "var(--accent-soft)" }}
                  >
                    <Check className="w-6 h-6" style={{ color: "var(--status-ok)" }} aria-hidden="true" />
                  </span>
                  <div className="flex flex-col gap-2">
                    <h2 className="text-2xl font-medium tracking-tight">Mensagem enviada.</h2>
                    <p className="text-[15px] leading-relaxed max-w-md" style={{ color: "var(--text-secondary)" }}>
                      Obrigado pelo contato! Respondo no e-mail que você informou.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setState("idle")}
                    className="self-start inline-flex items-center gap-2 min-h-11 px-4 rounded-[10px] border text-sm transition-colors hover:bg-black/5 dark:hover:bg-white/5"
                    style={{ borderColor: "var(--border-default)", color: "var(--text-primary)" }}
                  >
                    <RotateCcw className="w-4 h-4" aria-hidden="true" />
                    Enviar outra mensagem
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={sendEmail}
                  className="flex flex-col gap-5 sm:gap-[22px]"
                  variants={fadeUp}
                  initial="hidden"
                  animate="visible"
                  exit={prefersReduced ? undefined : { opacity: 0 }}
                  noValidate
                >
                  <div className="flex flex-col gap-1.5">
                    <h2 className="text-xl sm:text-2xl font-medium tracking-tight">Mande uma mensagem</h2>
                    <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                      Chega direto na minha caixa de entrada.
                    </p>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <label htmlFor="name" className="text-[13px] font-medium" style={{ color: "var(--text-secondary)" }}>
                        Nome
                      </label>
                      <input
                        id="name"
                        name="user_name"
                        type="text"
                        autoComplete="name"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Seu nome"
                        className={inputClass}
                        style={inputStyle}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label htmlFor="email" className="text-[13px] font-medium" style={{ color: "var(--text-secondary)" }}>
                        E-mail
                      </label>
                      <input
                        id="email"
                        name="user_email"
                        type="email"
                        autoComplete="email"
                        inputMode="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="voce@empresa.com"
                        className={inputClass}
                        style={inputStyle}
                      />
                    </div>
                  </div>

                  <fieldset className="flex flex-col">
                    <legend className="pb-2.5 text-[13px] font-medium" style={{ color: "var(--text-secondary)" }}>
                      Assunto
                    </legend>
                    <div className="flex flex-wrap gap-2">
                      {SUBJECTS.map(({ id, label }) => {
                        const active = subject === id;
                        return (
                          <button
                            key={id}
                            type="button"
                            onClick={() => setSubject(id)}
                            aria-pressed={active}
                            className="min-h-10 px-3.5 rounded-full border text-[13px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ide-accent)]"
                            style={{
                              borderColor: active ? "var(--ide-accent)" : "var(--border-default)",
                              backgroundColor: active ? "var(--accent-soft)" : "transparent",
                              color: active ? "var(--text-primary)" : "var(--text-secondary)",
                              fontWeight: active ? 500 : 400,
                            }}
                          >
                            {label}
                          </button>
                        );
                      })}
                    </div>
                  </fieldset>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="message" className="text-[13px] font-medium" style={{ color: "var(--text-secondary)" }}>
                      Mensagem
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={6}
                      required
                      maxLength={MESSAGE_MAX}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Conte um pouco do contexto…"
                      aria-describedby="message-count"
                      className={`${inputClass} py-3 leading-relaxed resize-y`}
                      style={inputStyle}
                    />
                    <span id="message-count" className="self-end font-mono text-xs" style={{ color: "var(--text-muted)" }}>
                      {message.length} / {MESSAGE_MAX}
                    </span>
                  </div>

                  {/* Celular: a prévia ao vivo vira uma seção recolhível abaixo dos campos. */}
                  <details
                    className="lg:hidden rounded-[10px] border overflow-hidden"
                    style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--surface-sunken)" }}
                  >
                    <summary
                      className="flex items-center justify-between min-h-11 px-4 font-mono text-xs cursor-pointer"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      message.ts
                      <span style={{ color: "var(--status-ok)" }}>● ao vivo</span>
                    </summary>
                    <MessagePreview name={name} email={email} subject={subject} message={message} sentAt={sentAt} compact />
                  </details>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <motion.button
                      type="submit"
                      disabled={state === "sending"}
                      whileTap={{ scale: 0.98 }}
                      transition={appleSpring}
                      className="inline-flex items-center justify-center gap-2.5 min-h-12 px-6 rounded-[10px] text-[15px] font-medium bg-[var(--cta-bg)] text-[var(--cta-fg)] hover:opacity-90 disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ide-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-secondary)]"
                    >
                      {state === "sending" ? (
                        <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                      ) : (
                        <Send className="w-4 h-4" aria-hidden="true" />
                      )}
                      {state === "sending" ? "Enviando…" : "Enviar mensagem"}
                    </motion.button>
                    <button
                      type="button"
                      onClick={clearForm}
                      className="min-h-12 px-4 rounded-[10px] text-sm transition-opacity hover:opacity-75"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      Limpar
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>

          {/* Prévia ao vivo — desktop. */}
          <aside
            className="hidden lg:flex flex-col w-[44%] border-l"
            style={{ backgroundColor: "var(--surface-sunken)", borderColor: "var(--border-subtle)" }}
            aria-label="Prévia ao vivo"
          >
            <div className="flex items-center justify-between pl-5 pr-2 h-14 border-b" style={{ borderColor: "var(--border-subtle)" }}>
              <div className="flex items-center gap-2.5 font-mono">
                <span className="text-[13px]">message.ts</span>
                <span className="text-[11px]" style={{ color: "var(--status-ok)" }}>● ao vivo</span>
              </div>
              <button
                type="button"
                onClick={copyCode}
                aria-label={codeCopied ? "Código copiado" : "Copiar código"}
                title="Copiar snippet gerado"
                className="w-11 h-11 rounded-lg flex items-center justify-center transition-colors hover:bg-black/5 dark:hover:bg-white/5"
                style={{ color: "var(--text-secondary)" }}
              >
                {codeCopied ? (
                  <Check className="w-4 h-4" style={{ color: "var(--status-ok)" }} aria-hidden="true" />
                ) : (
                  <Copy className="w-4 h-4" aria-hidden="true" />
                )}
              </button>
            </div>
            <MessagePreview name={name} email={email} subject={subject} message={message} sentAt={sentAt} />
            <div
              className="px-6 py-4 border-t font-mono text-xs"
              style={{ borderColor: "var(--border-subtle)", color: "var(--text-muted)" }}
              aria-live="polite"
            >
              TERMINAL ›{" "}
              {state === "sending" ? "enviando…" : state === "sent" ? "✓ 200 OK — mensagem entregue" : "aguardando envio…"}
            </div>
          </aside>
        </section>
      </main>
    </div>
  );
}
