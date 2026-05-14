"use client";

import React, { useState, useRef } from "react";
import emailjs from "@emailjs/browser";
import {
  Terminal,
  Gamepad2,
  Mail,
  Phone,
  ChevronDown,
  ChevronRight,
  Copy,
  Check,
} from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  slideInLeft,
  fadeUp,
  staggerContainer,
} from "@/lib/animations/variants";

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
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="flex items-center px-4 py-1.5 mx-1 rounded-md cursor-pointer"
      style={{
        color: hovered ? brandColor : "var(--text-secondary)",
        border: "1px solid",
        borderColor: hovered ? brandColor : "transparent",
        transition: "color 0.2s, border-color 0.2s",
      }}
    >
      <Icon className="w-3.5 h-3.5 mr-2 flex-shrink-0" />
      <span className="text-xs">{label}</span>
    </a>
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
  const form = useRef<HTMLFormElement>(null);

  const toggleFolder = (folder: keyof typeof openFolders) => {
    setOpenFolders((prev) => ({ ...prev, [folder]: !prev[folder] }));
  };

  const handleCopyCode = () => {
    const code = `const button = document.querySelector('#sendBtn');\n\nconst message = {\n    name: "${name}",\n    email: "${email}",\n    message: "${message}",\n    date: "${date}"\n}\n\nbutton.addEventListener('click', () => {\n    form.send(message);\n})`;
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const sendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.current) {
      emailjs
        .sendForm("service_t1tmh03", "template_rpvclnm", form.current, {
          publicKey: "CE7O3eEe9VG24eQB4",
        })
        .then(
          () => alert("Message sent successfully!"),
          (error) => alert(`Failed to send message: ${error.text}`),
        );
    }
  };

  return (
    <div
      className="min-h-screen w-full flex flex-col md:flex-row transition-colors duration-300 font-mono"
      style={{ backgroundColor: "var(--bg-primary)" }}
    >
      {/* FAR LEFT ICON SIDEBAR */}
      <aside
        className="hidden md:flex flex-col w-12 border-r items-center py-4 gap-6 transition-colors duration-300"
        style={{
          backgroundColor: "var(--bg-primary)",
          borderColor: "var(--border-default)",
        }}
      >
        <Terminal
          className="w-5 h-5 cursor-pointer"
          style={{ color: "var(--text-muted)" }}
        />
        <div
          className="w-5 h-5 rounded-full opacity-50"
          style={{ backgroundColor: "var(--text-muted)" }}
        />
        <Gamepad2
          className="w-5 h-5 cursor-pointer"
          style={{ color: "var(--text-muted)" }}
        />
      </aside>

      {/* EXPLORER SIDEBAR */}
      <motion.aside
        className="w-full md:w-[220px] lg:w-[260px] border-r flex flex-col transition-colors duration-300"
        style={{
          backgroundColor: "var(--bg-secondary)",
          borderColor: "var(--border-default)",
        }}
        variants={prefersReduced ? {} : slideInLeft}
        initial="hidden"
        animate="visible"
      >
        <div
          className="h-10 flex items-center px-4 border-b transition-colors duration-300"
          style={{ borderColor: "var(--border-default)" }}
        >
          <ChevronDown
            className="w-4 h-4 mr-2"
            style={{ color: "var(--text-muted)" }}
          />
          <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
            contacts
          </span>
        </div>

        <motion.div
          className="flex-1 overflow-y-auto py-2 text-sm"
          variants={prefersReduced ? {} : staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {/* Contacts Folder */}
          <motion.div variants={prefersReduced ? {} : fadeUp}>
            <button
              onClick={() => toggleFolder("contacts")}
              className="w-full flex items-center px-4 py-1 transition-colors hover:bg-black/5 dark:hover:bg-white/5"
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
            </button>
            <AnimatePresence>
              {openFolders.contacts && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  style={{ overflow: "hidden" }}
                  className="ml-4 pl-0 mt-1 space-y-2"
                >
                  <div
                    className="flex items-center px-4 py-1 cursor-pointer transition-colors hover:bg-black/5 dark:hover:bg-white/5"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    <Mail className="w-3.5 h-3.5 mr-2 flex-shrink-0" />
                    <span className="text-xs truncate">
                      fegrolla0210@gmail.com
                    </span>
                  </div>
                  <div
                    className="flex items-center px-4 py-1 cursor-pointer transition-colors hover:bg-black/5 dark:hover:bg-white/5"
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
            <button
              onClick={() => toggleFolder("socials")}
              className="w-full flex items-center px-4 py-1 transition-colors hover:bg-black/5 dark:hover:bg-white/5"
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
            </button>
            <AnimatePresence>
              {openFolders.socials && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  style={{ overflow: "hidden" }}
                  className="ml-4 pl-0 mt-1 space-y-2"
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

      {/* CENTER - FORM */}
      <main
        className="flex-1 flex flex-col border-r overflow-hidden"
        style={{ borderColor: "var(--border-default)" }}
      >
        <div
          className="h-10 flex border-b transition-colors duration-300"
          style={{ borderColor: "var(--border-default)" }}
        >
          <div
            className="px-6 flex items-center border-r text-sm transition-colors duration-300"
            style={{
              backgroundColor: "var(--bg-secondary)",
              borderColor: "var(--border-default)",
              color: "var(--text-primary)",
            }}
          >
            <span>contacts</span>
            <div
              className="w-3 h-3 ml-3 rounded-full cursor-pointer"
              style={{ backgroundColor: "var(--bg-tertiary)" }}
            />
          </div>
        </div>

        <div
          className="flex-1 flex items-center justify-center p-6 overflow-y-auto transition-colors duration-300"
          style={{ backgroundColor: "var(--bg-primary)" }}
        >
          <motion.form
            ref={form}
            onSubmit={sendEmail}
            className="w-full max-w-sm space-y-6"
            variants={prefersReduced ? {} : staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {[
              {
                label: "_name:",
                name: "user_name",
                type: "text",
                value: name,
                setter: setName,
                placeholder: "Seu nome",
              },
              {
                label: "_email:",
                name: "user_email",
                type: "email",
                value: email,
                setter: setEmail,
                placeholder: "seu@email.com",
              },
            ].map((field, i) => (
              <motion.div
                key={field.name}
                className="space-y-2"
                variants={prefersReduced ? {} : fadeUp}
                custom={i}
              >
                <label
                  className="text-sm"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {field.label}
                </label>
                <input
                  type={field.type}
                  name={field.name}
                  value={field.value}
                  onChange={(e) => field.setter(e.target.value)}
                  className="w-full rounded-lg p-3 text-sm focus:outline-none transition-colors shadow-sm border"
                  style={{
                    backgroundColor: "var(--bg-secondary)",
                    borderColor: "var(--border-default)",
                    color: "var(--text-primary)",
                  }}
                  placeholder={field.placeholder}
                />
              </motion.div>
            ))}

            <motion.div
              className="space-y-2"
              variants={prefersReduced ? {} : fadeUp}
              custom={2}
            >
              <label
                className="text-sm"
                style={{ color: "var(--text-secondary)" }}
              >
                _message:
              </label>
              <textarea
                name="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={6}
                className="w-full rounded-lg p-3 text-sm focus:outline-none transition-colors shadow-sm resize-none border"
                style={{
                  backgroundColor: "var(--bg-secondary)",
                  borderColor: "var(--border-default)",
                  color: "var(--text-primary)",
                }}
                placeholder="Sua mensagem..."
              />
            </motion.div>

            <motion.div variants={prefersReduced ? {} : fadeUp} custom={3}>
              <motion.button
                type="submit"
                className="px-4 py-2 rounded-lg text-sm transition-colors cursor-pointer border"
                style={{
                  backgroundColor: "var(--bg-secondary)",
                  borderColor: "var(--border-default)",
                  color: "var(--text-primary)",
                }}
                whileHover={prefersReduced ? {} : { scale: 1.02 }}
                whileTap={prefersReduced ? {} : { scale: 0.97 }}
              >
                submit-message
              </motion.button>
            </motion.div>
          </motion.form>
        </div>
      </main>

      {/* RIGHT - CODE PREVIEW */}
      <aside
        className="hidden xl:flex w-[500px] flex-col border-l transition-colors duration-300"
        style={{ borderColor: "var(--border-default)" }}
      >
        <div
          className="h-10 flex items-center px-4 border-b transition-colors duration-300"
          style={{ borderColor: "var(--border-default)" }}
        >
          <span
            className="text-sm font-mono"
            style={{ color: "var(--text-secondary)" }}
          >
            // Code snippet
          </span>
        </div>

        <div
          className="flex-1 p-6 overflow-y-auto transition-colors duration-300"
          style={{ backgroundColor: "var(--bg-primary)" }}
        >
          <div className="relative group">
            <button
              onClick={handleCopyCode}
              className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              {copied ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : (
                <Copy
                  className="w-4 h-4"
                  style={{ color: "var(--text-muted)" }}
                />
              )}
            </button>

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
                <span style={{ color: "var(--ide-accent-purple)" }}>const</span>{" "}
                <span style={{ color: "var(--ide-accent)" }}>button</span>{" "}
                <span style={{ color: "var(--syntax-type)" }}>=</span>{" "}
                <span style={{ color: "var(--ide-accent)" }}>document</span>
                <span style={{ color: "var(--text-muted)" }}>.</span>
                <span style={{ color: "var(--ide-accent)" }}>
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
                <span style={{ color: "var(--ide-accent)" }}>message</span>{" "}
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
                <span style={{ color: "var(--ide-accent)" }}>button</span>
                <span style={{ color: "var(--text-muted)" }}>.</span>
                <span style={{ color: "var(--ide-accent)" }}>
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
                <span style={{ color: "var(--ide-accent)" }} className="pl-4">
                  form
                </span>
                <span style={{ color: "var(--text-muted)" }}>.</span>
                <span style={{ color: "var(--ide-accent)" }}>send</span>
                <span style={{ color: "var(--text-muted)" }}>(</span>
                <span style={{ color: "var(--ide-accent)" }}>message</span>
                <span style={{ color: "var(--text-muted)" }}>);</span>
                {"\n"}
                <span style={{ color: "var(--text-muted)" }}>{"}" + ")"}</span>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
