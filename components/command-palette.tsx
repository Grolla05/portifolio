"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import {
  Home,
  User,
  FolderGit2,
  Mail,
  FileText,
  FileCode,
  Sun,
  Moon,
  Copy,
  ExternalLink,
  Phone,
  Search,
  Sparkles,
  TerminalSquare,
  FileDown,
} from "lucide-react";
import { toast } from "sonner";
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
} from "@/components/ui/command";

export function CommandPalette() {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      // Cmd+K or Ctrl+K
      if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      // Cmd+1 to Cmd+4 for fast navigation
      if ((e.metaKey || e.ctrlKey) && !e.shiftKey && !e.altKey) {
        if (e.key === "1") {
          e.preventDefault();
          router.push("/");
          toast.success("Navegando para Início");
        } else if (e.key === "2") {
          e.preventDefault();
          router.push("/about");
          toast.success("Navegando para Sobre");
        } else if (e.key === "3") {
          e.preventDefault();
          router.push("/projects");
          toast.success("Navegando para Projetos");
        } else if (e.key === "4") {
          e.preventDefault();
          router.push("/contact");
          toast.success("Navegando para Contato");
        } else if (e.key === "t" || e.key === "T") {
          e.preventDefault();
          const next = theme === "dark" ? "light" : "dark";
          setTheme(next);
          toast.success(`Tema alterado para ${next === "dark" ? "Escuro" : "Claro"}`);
        }
      }
    };

    window.addEventListener("keydown", down);
    return () => window.removeEventListener("keydown", down);
  }, [router, theme, setTheme]);

  const runCommand = (command: () => void) => {
    setOpen(false);
    command();
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Buscar páginas, arquivos, comandos... (⌘K)" />
      <CommandList>
        <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>
        
        {/* Navigation Pages */}
        <CommandGroup heading="Navegação">
          <CommandItem onSelect={() => runCommand(() => router.push("/"))}>
            <Home className="mr-2 h-4 w-4 text-primary" />
            <span>Início / Home</span>
            <CommandShortcut>⌘1</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/about"))}>
            <User className="mr-2 h-4 w-4 text-[#FFA657]" />
            <span>Sobre / About</span>
            <CommandShortcut>⌘2</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/projects"))}>
            <FolderGit2 className="mr-2 h-4 w-4 text-[var(--ide-accent)]" />
            <span>Projetos / Projects</span>
            <CommandShortcut>⌘3</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/contact"))}>
            <Mail className="mr-2 h-4 w-4 text-emerald-500" />
            <span>Contato / Contact</span>
            <CommandShortcut>⌘4</CommandShortcut>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        {/* Editor Files */}
        <CommandGroup heading="Arquivos do Editor">
          <CommandItem onSelect={() => runCommand(() => router.push("/about"))}>
            <FileText className="mr-2 h-4 w-4 text-[#FFA657]" />
            <span>my-bio.md</span>
            <CommandShortcut>Bio</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/about"))}>
            <FileCode className="mr-2 h-4 w-4 text-[var(--ide-accent)]" />
            <span>hobbies.ts</span>
            <CommandShortcut>Interesses</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/about"))}>
            <FileCode className="mr-2 h-4 w-4 text-[var(--syntax-string)]" />
            <span>Education.tsx</span>
            <CommandShortcut>Formação</CommandShortcut>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        {/* Quick Actions */}
        <CommandGroup heading="Ações Rápidas">
          <CommandItem
            onSelect={() =>
              runCommand(() =>
                window.dispatchEvent(new CustomEvent("portfolio:toggle-terminal")),
              )
            }
          >
            <TerminalSquare className="mr-2 h-4 w-4 text-[var(--ide-accent)]" />
            <span>Abrir Terminal Integrado</span>
            <CommandShortcut>Ctrl+`</CommandShortcut>
          </CommandItem>

          <CommandItem
            onSelect={() => runCommand(() => window.open("/api/cv", "_blank"))}
          >
            <FileDown className="mr-2 h-4 w-4 text-emerald-500" />
            <span>Baixar Currículo (PDF)</span>
          </CommandItem>

          <CommandItem
            onSelect={() =>
              runCommand(() => {
                const next = theme === "dark" ? "light" : "dark";
                setTheme(next);
                toast.success(`Tema alterado para ${next === "dark" ? "Escuro" : "Claro"}`);
              })
            }
          >
            {theme === "dark" ? (
              <Sun className="mr-2 h-4 w-4 text-amber-400" />
            ) : (
              <Moon className="mr-2 h-4 w-4 text-indigo-400" />
            )}
            <span>Alternar Tema ({theme === "dark" ? "Modo Claro" : "Modo Escuro"})</span>
            <CommandShortcut>⌘T</CommandShortcut>
          </CommandItem>
          
          <CommandItem
            onSelect={() =>
              runCommand(() => {
                navigator.clipboard.writeText("fegrolla0210@gmail.com");
                toast.success("E-mail copiado: fegrolla0210@gmail.com");
              })
            }
          >
            <Copy className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>Copiar E-mail (fegrolla0210@gmail.com)</span>
          </CommandItem>

          <CommandItem
            onSelect={() =>
              runCommand(() => {
                navigator.clipboard.writeText("+5511997705370");
                toast.success("Telefone copiado: +55 (11) 99770-5370");
              })
            }
          >
            <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>Copiar Telefone (+55 11 99770-5370)</span>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        {/* External Links */}
        <CommandGroup heading="Links Externos">
          <CommandItem
            onSelect={() =>
              runCommand(() => window.open("https://github.com/Grolla05", "_blank"))
            }
          >
            <ExternalLink className="mr-2 h-4 w-4 text-[var(--ide-accent)]" />
            <span>GitHub (@Grolla05)</span>
          </CommandItem>
          <CommandItem
            onSelect={() =>
              runCommand(() =>
                window.open("https://www.linkedin.com/in/felipegrolla/", "_blank")
              )
            }
          >
            <ExternalLink className="mr-2 h-4 w-4 text-[#0A66C2]" />
            <span>LinkedIn (/in/felipegrolla)</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
