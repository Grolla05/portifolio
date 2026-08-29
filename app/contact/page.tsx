"use client";

import React, { useState, useRef } from "react";
import emailjs from "@emailjs/browser";
import { toast } from "sonner";
import {
  Mail,
  Phone,
  ChevronDown,
  ChevronRight,
  Copy,
  Check,
  Send,
  Trash2,
} from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  slideInLeft,
  fadeUp,
  staggerContainer,
  appleSpring,
} from "@/lib/animations/variants";
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuShortcut,
  ContextMenuSeparator,
} from "@/components/ui/context-menu";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { useIsBelow } from "@/hooks/use-mobile";
import { useSidebarToggle } from "@/hooks/use-sidebar-toggle";

function LinkedinSVG({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
      aria-hidden
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function GithubSVG({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
      aria-hidden
    >
      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c.998.005 2.004.138 2.943.404 2.29-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

const socialLinks = [
  {
    href: "https://www.linkedin.com/in/felipegrolla/",
    label: "LinkedIn",
    icon: LinkedinSVG,
    brandColor: "#0A66C2",
  },
  {
    href: "https://github.com/Grolla05",
    label: "GitHub",
    icon: GithubSVG,
    brandColor: "#797979",
  },
];

function SocialLink({
  href,
  label,
  icon: Icon,
  brandColor,
}: {
  href: string;
  label: string;
  icon: React.ElementType;
  brandColor: string;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      whileTap={{ scale: 0.98 }}
      className="flex items-center px-4 py-1.5 mx-1 rounded-md cursor-pointer text-xs font-medium"
      style={{
        color: hovered ? brandColor : "var(--text-secondary)",
        border: "1px solid",
        borderColor: hovered ? brandColor : "transparent",
        transition: "color 0.2s, border-color 0.2s",
      }}
    >
      <Icon className="w-3.5 h-3.5 mr-2 flex-shrink-0" />
      <span>{label}</span>
    </motion.a>
  );
}

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [date] = useState(
    new Date().toLocaleDateString("en-GB", {
      weekday: "short",
      day: "2-digit",
      month: "short",
    }),
  );
  const [copied, setCopied] = useState(false);
  const [openFolders, setOpenFolders] = useState({
    contacts: true,
    socials: true,
  });
  const prefersReduced = useReducedMotion();
  // Breakpoint `lg` (1024px): abaixo disso o layout de 3 painéis vira pilha vertical.
  const isCompact = useIsBelow(1024);
  const sidebarPanelRef = useSidebarToggle();
  const form = useRef<HTMLFormElement>(null);

  const toggleFolder = (folder: keyof typeof openFolders) => {
    setOpenFolders((prev) => ({ ...prev, [folder]: !prev[folder] }));
  };

  const handleCopyCode = () => {
    const code = `const button = document.querySelector('#sendBtn');\n\nconst message = {\n    name: "${name}",\n    email: "${email}",\n    message: "${message}",\n    date: "${date}"\n}\n\nbutton.addEventListener('click', () => {\n    form.send(message);\n})`;
    navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success("Código copiado para a área de transferência!");
    setTimeout(() => setCopied(false), 2000);
  };

  const clearForm = () => {
    setName("");
    setEmail("");
    setMessage("");
    toast.success("Formulário limpo");
  };

  const sendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      toast.error("Por favor, preencha todos os campos do formulário.");
      return;
    }

    if (form.current) {
      toast.loading("Enviando mensagem...");
      emailjs
        .sendForm("service_t1tmh03", "template_rpvclnm", form.current, {
          publicKey: "CE7O3eEe9VG24eQB4",
        })
        .then(
          () => {
            toast.dismiss();
            toast.success("Mensagem enviada com sucesso!");
            setName("");
            setEmail("");
            setMessage("");
          },
          (error) => {
            toast.dismiss();
            toast.error(`Falha ao enviar mensagem: ${error.text}`);
          },
        );
    }
  };

  const renderSidebar = () => (
    <motion.aside
      className="w-full h-full flex flex-col transition-colors duration-300 flex-shrink-0 select-none overflow-hidden"
      style={{
        backgroundColor: "var(--bg-secondary)",
        borderColor: "var(--border-default)",
      }}
      variants={prefersReduced ? {} : slideInLeft}
      initial="hidden"
      animate="visible"
    >
      <div
        className="h-10 flex items-center px-4 border-b transition-colors duration-300 select-none flex-shrink-0"
        style={{ borderColor: "var(--border-default)" }}
      >
        <ChevronDown
          className="w-4 h-4 mr-2"
          style={{ color: "var(--text-muted)" }}
        />
        <span
          className="text-xs font-semibold tracking-tight uppercase"
          style={{ color: "var(--text-secondary)" }}
        >
          contacts
        </span>
      </div>

      <motion.div
        className="flex-1 overflow-y-auto py-2 text-xs font-medium"
        variants={prefersReduced ? {} : staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {/* Contacts Folder */}
        <motion.div variants={prefersReduced ? {} : fadeUp}>
          <motion.button
            onClick={() => toggleFolder("contacts")}
            whileTap={prefersReduced ? {} : { scale: 0.98 }}
            className="w-full flex items-center px-4 py-1.5 transition-colors hover:bg-black/5 dark:hover:bg-white/5 rounded-md"
          >
            <motion.span
              animate={{ rotate: openFolders.contacts ? 90 : 0 }}
              transition={{ duration: 0.15 }}
              className="inline-flex"
            >
              <ChevronRight
                className="w-3 h-3 mr-2"
                style={{ color: "var(--text-muted)" }}
              />
            </motion.span>
            <span style={{ color: "var(--text-secondary)" }}>contacts</span>
          </motion.button>
          <AnimatePresence>
            {openFolders.contacts && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                style={{ overflow: "hidden" }}
                className="ml-4 pl-0 mt-1 space-y-1"
              >
                <div
                  onClick={() => {
                    navigator.clipboard.writeText("fegrolla0210@gmail.com");
                    toast.success("E-mail copiado!");
                  }}
                  className="flex items-center px-4 py-1.5 cursor-pointer transition-colors hover:bg-black/5 dark:hover:bg-white/5 rounded-md"
                  style={{ color: "var(--text-secondary)" }}
                >
                  <Mail className="w-3.5 h-3.5 mr-2 flex-shrink-0" />
                  <span className="text-xs truncate">
                    fegrolla0210@gmail.com
                  </span>
                </div>
                <div
                  onClick={() => {
                    navigator.clipboard.writeText("+5511997705370");
                    toast.success("Telefone copiado!");
                  }}
                  className="flex items-center px-4 py-1.5 cursor-pointer transition-colors hover:bg-black/5 dark:hover:bg-white/5 rounded-md"
                  style={{ color: "var(--text-secondary)" }}
                >
                  <Phone className="w-3.5 h-3.5 mr-2 flex-shrink-0" />
                  <span className="text-xs">+55 (11) 99770-5370</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Socials Folder */}
        <motion.div className="mt-4" variants={prefersReduced ? {} : fadeUp}>
          <motion.button
            onClick={() => toggleFolder("socials")}
            whileTap={prefersReduced ? {} : { scale: 0.98 }}
            className="w-full flex items-center px-4 py-1.5 transition-colors hover:bg-black/5 dark:hover:bg-white/5 rounded-md"
          >
            <motion.span
              animate={{ rotate: openFolders.socials ? 90 : 0 }}
              transition={{ duration: 0.15 }}
              className="inline-flex"
            >
              <ChevronRight
                className="w-3 h-3 mr-2"
                style={{ color: "var(--text-muted)" }}
              />
            </motion.span>
            <span style={{ color: "var(--text-secondary)" }}>
              find-me-also-in
            </span>
          </motion.button>
          <AnimatePresence>
            {openFolders.socials && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                style={{ overflow: "hidden" }}
                className="ml-4 pl-0 mt-1 space-y-1"
              >
                {socialLinks.map((link) => (
                  <SocialLink key={link.label} {...link} />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </motion.aside>
  );

  const renderForm = () => (
    <main className="flex-1 h-full flex flex-col overflow-hidden">
      <div
        className="h-10 flex items-center px-4 border-b transition-colors duration-300 flex-shrink-0"
        style={{ borderColor: "var(--border-default)" }}
      >
        <span
          className="text-xs font-semibold tracking-tight uppercase"
          style={{ color: "var(--text-secondary)" }}
        >
          Formulário de Contato
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-6 md:p-12 flex items-center justify-center">
        <motion.form
          ref={form}
          onSubmit={sendEmail}
          className="w-full max-w-md space-y-6"
          variants={prefersReduced ? {} : staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            className="space-y-2"
            variants={prefersReduced ? {} : fadeUp}
            custom={0}
          >
            <label
              htmlFor="name"
              className="block text-xs font-medium"
              style={{ color: "var(--text-secondary)" }}
            >
              name:
            </label>
            <input
              type="text"
              id="name"
              name="user_name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border text-sm font-normal transition-all outline-none focus:ring-2 focus:ring-[var(--ide-accent-text)] focus:border-transparent"
              style={{
                backgroundColor: "var(--bg-secondary)",
                borderColor: "var(--border-default)",
                color: "var(--text-primary)",
              }}
              placeholder="Seu nome"
              required
            />
          </motion.div>

          <motion.div
            className="space-y-2"
            variants={prefersReduced ? {} : fadeUp}
            custom={1}
          >
            <label
              htmlFor="email"
              className="block text-xs font-medium"
              style={{ color: "var(--text-secondary)" }}
            >
              email:
            </label>
            <input
              type="email"
              id="email"
              name="user_email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border text-sm font-normal transition-all outline-none focus:ring-2 focus:ring-[var(--ide-accent-text)] focus:border-transparent"
              style={{
                backgroundColor: "var(--bg-secondary)",
                borderColor: "var(--border-default)",
                color: "var(--text-primary)",
              }}
              placeholder="seu.email@exemplo.com"
              required
            />
          </motion.div>

          <motion.div
            className="space-y-2"
            variants={prefersReduced ? {} : fadeUp}
            custom={2}
          >
            <label
              htmlFor="message"
              className="block text-xs font-medium"
              style={{ color: "var(--text-secondary)" }}
            >
              message:
            </label>
            <textarea
              id="message"
              name="message"
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border text-sm font-normal transition-all outline-none focus:ring-2 focus:ring-[var(--ide-accent-text)] focus:border-transparent resize-none"
              style={{
                backgroundColor: "var(--bg-secondary)",
                borderColor: "var(--border-default)",
                color: "var(--text-primary)",
              }}
              placeholder="Digite sua mensagem aqui..."
              required
            />
          </motion.div>

          <motion.div variants={prefersReduced ? {} : fadeUp} custom={3}>
            <Tooltip>
              <TooltipTrigger asChild>
                <motion.button
                  type="submit"
                  className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer border elevation-1 bg-primary text-primary-foreground hover:opacity-95"
                  whileHover={prefersReduced ? {} : { scale: 1.02 }}
                  whileTap={prefersReduced ? {} : { scale: 0.97 }}
                  transition={appleSpring}
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Enviar mensagem</span>
                </motion.button>
              </TooltipTrigger>
              <TooltipContent>
                Enviar mensagem diretamente por e-mail
              </TooltipContent>
            </Tooltip>
          </motion.div>
        </motion.form>
      </div>
    </main>
  );

  const renderCodePreview = () => (
    <aside
      className="w-full h-full flex flex-col transition-colors duration-300 overflow-hidden"
      style={{ borderColor: "var(--border-default)" }}
    >
      <div
        className="h-10 flex items-center justify-between px-4 border-b transition-colors duration-300 flex-shrink-0"
        style={{ borderColor: "var(--border-default)" }}
      >
        <span
          className="text-xs font-semibold tracking-tight uppercase"
          style={{ color: "var(--text-secondary)" }}
        >
          Preview JavaScript
        </span>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={handleCopyCode}
              className="flex items-center gap-1 text-[11px] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
              aria-label="Copiar código"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-green-500" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
              <span>{copied ? "Copiado!" : "Copiar"}</span>
            </button>
          </TooltipTrigger>
          <TooltipContent>Copiar snippet gerado</TooltipContent>
        </Tooltip>
      </div>

      <ContextMenu>
        <ContextMenuTrigger asChild>
          <div
            className="flex-1 p-6 overflow-y-auto transition-colors duration-300 cursor-context-menu"
            style={{ backgroundColor: "var(--bg-primary)" }}
          >
            <div className="relative group">
              <div className="flex font-mono text-sm leading-relaxed">
                <div
                  className="flex flex-col text-right pr-6 select-none border-r mr-6 flex-shrink-0"
                  style={{
                    color: "var(--syntax-comment)",
                    borderColor: "var(--border-default)",
                  }}
                >
                  {Array.from({ length: 12 }, (_, i) => (
                    <span key={i + 1}>{i + 1}</span>
                  ))}
                </div>

                <div className="flex-1 overflow-x-auto whitespace-pre-wrap break-words">
                  <span style={{ color: "var(--ide-accent-purple)" }}>
                    const
                  </span>{" "}
                  <span style={{ color: "var(--ide-accent-text)" }}>button</span>{" "}
                  <span style={{ color: "var(--syntax-type)" }}>=</span>{" "}
                  <span style={{ color: "var(--ide-accent-text)" }}>document</span>
                  <span style={{ color: "var(--text-muted)" }}>.</span>
                  <span style={{ color: "var(--ide-accent-text)" }}>
                    querySelector
                  </span>
                  <span style={{ color: "var(--text-muted)" }}>(</span>
                  <span style={{ color: "var(--syntax-string)" }}>
                    &apos;#sendBtn&apos;
                  </span>
                  <span style={{ color: "var(--text-muted)" }}>);</span>
                  {"\n\n"}
                  <span style={{ color: "var(--ide-accent-purple)" }}>
                    const
                  </span>{" "}
                  <span style={{ color: "var(--ide-accent-text)" }}>message</span>{" "}
                  <span style={{ color: "var(--syntax-type)" }}>=</span>{" "}
                  <span style={{ color: "var(--text-muted)" }}>{"{"}</span>
                  {"\n"}
                  <span style={{ color: "var(--text-muted)" }} className="pl-4">
                    name:
                  </span>{" "}
                  <span style={{ color: "var(--syntax-string)" }}>
                    &quot;{name}&quot;
                  </span>
                  <span style={{ color: "var(--text-muted)" }}>,</span>
                  {"\n"}
                  <span style={{ color: "var(--text-muted)" }} className="pl-4">
                    email:
                  </span>{" "}
                  <span style={{ color: "var(--syntax-string)" }}>
                    &quot;{email}&quot;
                  </span>
                  <span style={{ color: "var(--text-muted)" }}>,</span>
                  {"\n"}
                  <span style={{ color: "var(--text-muted)" }} className="pl-4">
                    message:
                  </span>{" "}
                  <span style={{ color: "var(--syntax-string)" }}>
                    &quot;{message.substring(0, 30)}
                    {message.length > 30 ? "..." : ""}&quot;
                  </span>
                  <span style={{ color: "var(--text-muted)" }}>,</span>
                  {"\n"}
                  <span style={{ color: "var(--text-muted)" }} className="pl-4">
                    date:
                  </span>{" "}
                  <span style={{ color: "var(--syntax-string)" }}>
                    &quot;{date}&quot;
                  </span>
                  {"\n"}
                  <span style={{ color: "var(--text-muted)" }}>{"}"}</span>
                  {"\n\n"}
                  <span style={{ color: "var(--ide-accent-text)" }}>button</span>
                  <span style={{ color: "var(--text-muted)" }}>.</span>
                  <span style={{ color: "var(--ide-accent-text)" }}>
                    addEventListener
                  </span>
                  <span style={{ color: "var(--text-muted)" }}>(</span>
                  <span style={{ color: "var(--syntax-string)" }}>
                    &apos;click&apos;
                  </span>
                  <span style={{ color: "var(--text-muted)" }}>,</span>{" "}
                  <span style={{ color: "var(--text-muted)" }}>()</span>{" "}
                  <span style={{ color: "var(--ide-accent-purple)" }}>
                    {"=>"}
                  </span>{" "}
                  <span style={{ color: "var(--text-muted)" }}>{"{"}</span>
                  {"\n"}
                  <span style={{ color: "var(--ide-accent-text)" }} className="pl-4">
                    form
                  </span>
                  <span style={{ color: "var(--text-muted)" }}>.</span>
                  <span style={{ color: "var(--ide-accent-text)" }}>send</span>
                  <span style={{ color: "var(--text-muted)" }}>(</span>
                  <span style={{ color: "var(--ide-accent-text)" }}>message</span>
                  <span style={{ color: "var(--text-muted)" }}>);</span>
                  {"\n"}
                  <span style={{ color: "var(--text-muted)" }}>
                    {"}" + ")"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem onClick={handleCopyCode}>
            <Copy className="w-3.5 h-3.5 mr-2 text-[var(--text-muted)]" />
            Copiar Código JavaScript
            <ContextMenuShortcut>⌘C</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem onClick={clearForm}>
            <Trash2 className="w-3.5 h-3.5 mr-2 text-destructive" />
            Limpar Formulário
            <ContextMenuShortcut>⌘⌫</ContextMenuShortcut>
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </aside>
  );

  return (
    <TooltipProvider>
      <div
        /*
            Desktop usa ALTURA DEFINIDA (`h-`), não `min-h-`: `h-full` dos filhos resolve
            contra `height` do pai; só com `min-height` a porcentagem vira `auto` e o split
            view colapsa na altura do conteúdo, cortando a interface no meio.
            Abaixo de `lg` a pilha precisa crescer, então lá continua `min-h-`.
        */
        className={`w-full flex flex-col transition-colors duration-300 ${
          isCompact ? "min-h-[calc(100vh-var(--chrome-height))]" : "h-[calc(100vh-var(--chrome-height))]"
        }`}
        style={{ backgroundColor: "var(--bg-primary)" }}
      >
        {/*
            Render ÚNICO da árvore.
            Antes havia dois blocos irmãos (`hidden lg:flex` + `flex lg:hidden`) que montavam
            sidebar e formulário duas vezes no DOM, contando apenas com CSS para ocultar um
            deles — o que duplicava a interface na tela. Agora só uma variante é montada,
            escolhida em runtime por `useIsBelow(1024)`.
        */}
        {isCompact ? (
          /* Tablet / Mobile: pilha vertical, sem o painel de preview de código */
          <div className="flex flex-1 min-h-0 flex-col w-full">
            {renderSidebar()}
            {renderForm()}
          </div>
        ) : (
          /* Desktop: 3 painéis redimensionáveis — `min-h-0` deixa o filho encolher dentro do flex */
          <div className="flex flex-1 min-h-0 w-full">
            <ResizablePanelGroup
              direction="horizontal"
              className="w-full h-full"
              autoSaveId="contact-layout"
            >
              <ResizablePanel
                ref={sidebarPanelRef}
                defaultSize={18}
                minSize={14}
                maxSize={28}
                collapsible
                collapsedSize={0}
                className="min-w-0"
              >
                {renderSidebar()}
              </ResizablePanel>
              <ResizableHandle withHandle />
              <ResizablePanel defaultSize={47}>{renderForm()}</ResizablePanel>
              <ResizableHandle withHandle />
              <ResizablePanel defaultSize={35} minSize={25} maxSize={50}>
                {renderCodePreview()}
              </ResizablePanel>
            </ResizablePanelGroup>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}
