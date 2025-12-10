import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Download,
  Mail,
  Github,
  Linkedin,
  MapPin,
  Phone,
  Calendar,
  Building,
  GraduationCap,
  Code,
  Briefcase,
} from "lucide-react"

// Animação simples para fade-in
const fadeIn = {
  animation: "fadeIn 0.8s ease-in"
}

// Adiciona keyframes no head
if (typeof window !== "undefined") {
  const style = document.createElement("style");
  style.innerHTML = `@keyframes fadeIn { from { opacity: 0; transform: translateY(20px);} to { opacity: 1; transform: none; } }`;
  document.head.appendChild(style);
}

export default function ProfilePage() {
  return (
  <div className="min-h-screen bg-background w-full">
      {/* Header com logo e animação */}
      <header className="sticky top-0 z-20 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
        <div className="flex h-16 items-center justify-between px-6 md:px-12 lg:px-24 w-full" style={fadeIn}>
          <div className="flex items-center gap-2">
          </div>
          <nav className="hidden md:flex gap-6 mx-auto">
            <Link href="#about" className="text-sm font-medium hover:text-primary transition-colors duration-200">
              Sobre
            </Link>
            <Link href="#experience" className="text-sm font-medium hover:text-primary transition-colors duration-200">
              Experiência
            </Link>
            <Link href="#education" className="text-sm font-medium hover:text-primary transition-colors duration-200">
              Educação
            </Link>
            <Link href="#skills" className="text-sm font-medium hover:text-primary transition-colors duration-200">
              Habilidades
            </Link>
            <Link href="#projects" className="text-sm font-medium hover:text-primary transition-colors duration-200">
              Projetos
            </Link>
          </nav>
          <div className="flex items-center gap-2">
            <Button asChild size="sm" className="hidden md:flex shadow-md hover:scale-105 transition-transform">
              <a href="/felipe-grolla-cv.png" download>
                <Download className="mr-2 h-4 w-4" />
                Baixar Currículo
              </a>
            </Button>
            <Button variant="outline" size="icon" className="md:hidden absolute right-4">
              <span className="sr-only">Toggle menu</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </Button>
          </div>
        </div>
      </header>

  <main className="w-full py-10 px-4 md:px-12 lg:px-24">
        {/* Hero Section */}
  <section id="about" className="mb-12 flex flex-col items-center text-center w-full" style={fadeIn}>
          <div className="mb-8">
            <div className="relative h-60 w-60 overflow-hidden rounded-full border-4 border-primary/60 bg-muted mb-6 shadow-lg">
              <Image src="/images/profile-photo-new.png" alt="Felipe Grolla" fill className="object-cover" priority />
            </div>
          </div>
          <div className="w-full max-w-2xl mx-auto">
            <div className="mb-4">
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl text-primary">Felipe Grolla</h1>
              <h2 className="text-xl text-muted-foreground font-medium">Engenharia de Controle e Automação</h2>
              <p className="text-base text-muted-foreground mt-2">Transformando ideias em soluções inovadoras para a indústria e tecnologia.</p>
            </div>
            <p className="text-muted-foreground mb-4 text-lg">
              Estudante de Engenharia de Controle e Automação com foco em sistemas embarcados, automação industrial e programação. Apaixonado por tecnologia e inovação.
            </p>
            <div className="flex items-center justify-center gap-2 text-muted-foreground mb-4">
              <MapPin className="h-4 w-4" />
              <span>Campinas, BR</span>
            </div>
            <div className="flex flex-wrap gap-3 justify-center">
              <Button asChild variant="outline" size="sm" className="hover:bg-primary/10 transition-colors">
                <Link href="mailto:fegrolla0210@gmail.com">
                  <Mail className="mr-2 h-4 w-4" />
                  Email
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm" className="hover:bg-primary/10 transition-colors">
                <Link href="https://github.com/Grolla05" target="_blank">
                  <Github className="mr-2 h-4 w-4" />
                  GitHub
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm" className="hover:bg-primary/10 transition-colors">
                <Link href="https://www.linkedin.com/in/felipegrolla/" target="_blank">
                  <Linkedin className="mr-2 h-4 w-4" />
                  LinkedIn
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm" className="hover:bg-primary/10 transition-colors">
                <Link href="tel:+11234567890">
                  <Phone className="mr-2 h-4 w-4" />
                  (11) 99770-5370
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Tabs for Resume Sections */}
  <Tabs defaultValue="experience" className="mb-12 w-full" style={fadeIn}>
          <TabsList className="flex justify-center mb-8 overflow-x-auto bg-muted/60 rounded-lg shadow-sm w-full">
            <TabsTrigger value="experience" className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              Experiência
            </TabsTrigger>
            <TabsTrigger value="education" className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              Educação
            </TabsTrigger>
            <TabsTrigger value="skills" className="flex items-center gap-2">
              <Code className="h-4 w-4" />
              Habilidades
            </TabsTrigger>
            <TabsTrigger value="projects" className="flex items-center gap-2">
              <Building className="h-4 w-4" />
              Projetos
            </TabsTrigger>
          </TabsList>

          {/* Experience Tab */}
          <TabsContent value="experience" id="experience" className="space-y-8 animate-fadeIn w-full">
            <h2 className="text-2xl font-bold tracking-tight text-center">Experiência Profissional</h2>

            <div className="space-y-6 max-w-3xl mx-auto w-full">
              {/* Experience Item 1 */}
              <div className="rounded-lg border p-6 text-center shadow-md hover:shadow-xl transition-shadow duration-300 bg-background/90">
                <div className="flex flex-col justify-center gap-2 items-center">
                  <div>
                    <h3 className="font-semibold">(Cargo no trabalho)</h3>
                    <p className="text-muted-foreground">(Empresa)</p>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>(Deste quando até quando)</span>
                  </div>
                </div>
                <div className="mt-4">
                  <ul className="list-disc pl-5 space-y-2 text-muted-foreground text-left">
                    <li>(Competências e funções do cargo)</li>
                  </ul>
                </div>
                <div className="mt-4 flex flex-wrap gap-2 justify-center">
                  <Badge>Tecnologias utilizadas</Badge>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Education Tab */}
          <TabsContent value="education" id="education" className="space-y-8 animate-fadeIn w-full">
            <h2 className="text-2xl font-bold tracking-tight text-center">Educação</h2>

            <div className="space-y-6 max-w-3xl mx-auto w-full">
              {/* Education Item 1 */}
              <div className="rounded-lg border p-6 text-center shadow-md hover:shadow-xl transition-shadow duration-300 bg-background/90">
                <div className="flex flex-col justify-center gap-2 items-center">
                  <div>
                    <h3 className="font-semibold">Engenharia de Controle e Automação</h3>
                    <p className="text-muted-foreground">Pontificia Universidade Catolica de Campinas</p>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>2025 - Today</span>
                  </div>
                </div>
                <div className="mt-4 text-muted-foreground">
                  <p>GPA: 7.0/10.0</p>
                  <p className="mt-2">Engenharia de Controle e Automação de máquinas elétricas"</p>
                </div>
                <div className="mt-4 flex flex-wrap gap-2 justify-center">
                  <Badge>Machine Learning</Badge>
                  <Badge>Algorithms</Badge>
                  <Badge>Eletrônica Embarcada</Badge>
                  <Badge>Eletrônica Digital</Badge>
                  <Badge>Sistemas Aplicados</Badge>
                  <Badge>Arduino</Badge>
                  <Badge>IoT</Badge>
                </div>
              </div>

              {/* Education Item 2 */}
              <div className="rounded-lg border p-6 text-center shadow-md hover:shadow-xl transition-shadow duration-300 bg-background/90">
                <div className="flex flex-col justify-center gap-2 items-center">
                  <div>
                    <h3 className="font-semibold">Instituto Educacional Parque Ecologico</h3>
                    <p className="text-muted-foreground">Colégio Objetivo, Indaiatuba - SP</p>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>2018 - 2023</span>
                  </div>
                </div>
                <div className="mt-4 text-muted-foreground">
                  <p>GPA: 5.0/10.0</p>
                  <p className="mt-2">Ensino Médio</p>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Skills Tab */}
          <TabsContent value="skills" id="skills" className="space-y-8 animate-fadeIn w-full">
            <h2 className="text-2xl font-bold tracking-tight text-center">Habilidades & Competências</h2>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto w-full">
              {/* Skill Category 1 */}
              <Card className="text-center shadow-md hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Frontend Development</h3>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">CSS</span>
                        <span className="text-sm text-muted-foreground">Intermediate</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: "55%" }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Figma</span>
                        <span className="text-sm text-muted-foreground">Intermediate</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: "55%" }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Next.js e TypeScript</span>
                        <span className="text-sm text-muted-foreground">Intermediate</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: "50%" }}></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Skill Category 2 */}
              <Card className="text-center shadow-md hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Backend Development</h3>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Python</span>
                        <span className="text-sm text-muted-foreground">Intermediate</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: "55%" }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">C / C++</span>
                        <span className="text-sm text-muted-foreground">Intermediate</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: "55%" }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">JavaScript</span>
                        <span className="text-sm text-muted-foreground">Intermediate</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: "55%" }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Node.js</span>
                        <span className="text-sm text-muted-foreground">Beginner</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: "35%" }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">SQLite</span>
                        <span className="text-sm text-muted-foreground">Beginner</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: "20%" }}></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Skill Category 3 */}
              <Card className="text-center shadow-md hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Eletro / Eletrônica</h3>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Eletrônica Embarcada</span>
                        <span className="text-sm text-muted-foreground">Advanced</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: "75%" }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Eletrônica Digital</span>
                        <span className="text-sm text-muted-foreground">Advanced</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: "75%" }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Sistemas Aplicados</span>
                        <span className="text-sm text-muted-foreground">Intermediate</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: "55%" }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Arduino</span>
                        <span className="text-sm text-muted-foreground">Intermediate</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: "50%" }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">IoT</span>
                        <span className="text-sm text-muted-foreground">Beginner</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: "20%" }}></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Projects Tab */}
          <TabsContent value="projects" id="projects" className="space-y-8 animate-fadeIn w-full">
            <h2 className="text-2xl font-bold tracking-tight text-center">Projetos</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto w-full">
              {/* Project 1 - Solar Points */}
              <Card className="overflow-hidden text-center shadow-md hover:shadow-xl transition-shadow duration-300">
                <div className="aspect-video relative">
                  <Image src="/placeholder.svg?height=200&width=400" alt="Solar Points" fill className="object-cover" />
                </div>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">Solar Points</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Sistema de iluminação inteligente para áreas sem infraestrutura elétrica. Projeto sustentável com
                    energia solar.
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4 justify-center">
                    <Badge variant="outline">Eletrônica</Badge>
                    <Badge variant="outline">Energia Solar</Badge>
                    <Badge variant="outline">IoT</Badge>
                  </div>
                  <div className="flex gap-2 justify-center">
                    <Button asChild size="sm" variant="outline">
                      <Link href="https://github.com/Grolla05/Project_SolarPoints" target="_blank">
                        <Github className="mr-2 h-4 w-4" />
                        Código
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Project 2 - Clock LED */}
              <Card className="overflow-hidden text-center shadow-md hover:shadow-xl transition-shadow duration-300">
                <div className="aspect-video relative">
                  <Image src="/placeholder.svg?height=200&width=400" alt="Clock LED" fill className="object-cover" />
                </div>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">Clock LED</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Relógio digital com display LED e funcionalidades programáveis. Interface intuitiva e design
                    moderno.
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4 justify-center">
                    <Badge variant="outline">Eletrônica</Badge>
                  </div>
                  <div className="flex gap-2 justify-center">
                    <Button asChild size="sm" variant="outline">
                      <Link href="https://github.com/Grolla05/Project-Clock-LED" target="_blank">
                        <Github className="mr-2 h-4 w-4" />
                        Código
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Project 3 - Simula Vest */}
              <Card className="overflow-hidden text-center shadow-md hover:shadow-xl transition-shadow duration-300">
                <div className="aspect-video relative">
                  <Image src="/placeholder.svg?height=200&width=400" alt="Simula Vest" fill className="object-cover" />
                </div>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">Simula Vest</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Plataforma de simulação de vestibulares com questões e estatísticas de desempenho para estudantes.
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4 justify-center">
                    <Badge variant="outline">TypeScript</Badge>
                    <Badge variant="outline">Node.js</Badge>
                    <Badge variant="outline">JavaScript</Badge>
                    <Badge variant="outline">MongoDB</Badge>
                  </div>
                  <div className="flex gap-2 justify-center">
                    <Button asChild size="sm" variant="outline">
                      <Link href="https://github.com/Grolla05/SimulaVest" target="_blank">
                        <Github className="mr-2 h-4 w-4" />
                        Código
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Project 4 - Template Web */}
              <Card className="overflow-hidden text-center shadow-md hover:shadow-xl transition-shadow duration-300">
                <div className="aspect-video relative">
                  <Image src="/placeholder.svg?height=200&width=400" alt="Template Web" fill className="object-cover" />
                </div>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">Template Web</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Template responsivo para desenvolvimento web com componentes reutilizáveis e design moderno.
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4 justify-center">
                    <Badge variant="outline">HTML</Badge>
                    <Badge variant="outline">CSS</Badge>
                    <Badge variant="outline">JavaScript</Badge>
                  </div>
                  <div className="flex gap-2 justify-center">
                    <Button asChild size="sm" variant="outline">
                      <Link href="https://github.com/Grolla05/Project-Template-Web" target="_blank">
                        <Github className="mr-2 h-4 w-4" />
                        Código
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Project 5 - Extensão 2024 */}
              <Card className="overflow-hidden text-center shadow-md hover:shadow-xl transition-shadow duration-300">
                <div className="aspect-video relative">
                  <Image
                    src="/placeholder.svg?height=200&width=400"
                    alt="Extensão 2024"
                    fill
                    className="object-cover"
                  />
                </div>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">Extensão 2024</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Projeto de extensão universitária desenvolvido em 2024 com foco em impacto social e tecnológico.
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4 justify-center">
                    <Badge variant="outline">Metodologia Aplicada</Badge>
                    <Badge variant="outline">Material Didático</Badge>
                    <Badge variant="outline">Análise de dados</Badge>
                  </div>
                  <div className="flex gap-2 justify-center">
                    <Button asChild size="sm" variant="outline">
                      <Link href="https://github.com/Grolla05/PROJETO-EXT24" target="_blank">
                        <Github className="mr-2 h-4 w-4" />
                        Código
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Project 6 - Flight Management Software */}
              <Card className="overflow-hidden text-center shadow-md hover:shadow-xl transition-shadow duration-300">
                <div className="aspect-video relative">
                  <Image
                    src="/placeholder.svg?height=200&width=400"
                    alt="Flight Management Software"
                    fill
                    className="object-cover"
                  />
                </div>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">Flight Management</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Software de gerenciamento de voos com interface para controle de rotas, passageiros e tripulação.
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4 justify-center">
                    <Badge variant="outline">C</Badge>
                  </div>
                  <div className="flex gap-2 justify-center">
                    <Button asChild size="sm" variant="outline">
                      <Link href="https://github.com/Grolla05/Flight-Management-Software" target="_blank">
                        <Github className="mr-2 h-4 w-4" />
                        Código
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Project 7 - Cofre Digital */}
              <Card className="overflow-hidden text-center shadow-md hover:shadow-xl transition-shadow duration-300">
                <div className="aspect-video relative">
                  <Image
                    src="/placeholder.svg?height=200&width=400"
                    alt="Cofre Digital"
                    fill
                    className="object-cover"
                  />
                </div>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">Cofre Digital</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Sistema de cofre digital com autenticação segura.
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4 justify-center">
                    <Badge variant="outline">C</Badge>
                  </div>
                  <div className="flex gap-2 justify-center">
                    <Button asChild size="sm" variant="outline">
                      <Link href="https://github.com/Grolla05/Projeto-Cofre-Digital" target="_blank">
                        <Github className="mr-2 h-4 w-4" />
                        Código
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Download Resume Button (Mobile) */}
  <div className="mt-8 flex justify-center w-full">
          <Button asChild className="shadow-md hover:scale-105 transition-transform">
            <a href="/felipe-grolla-cv.png" download>
              <Download className="mr-2 h-4 w-4" />
              Baixar Currículo
            </a>
          </Button>
        </div>
      </main>

      <footer className="border-t py-6 bg-background/95 shadow-inner w-full">
        <div className="flex flex-col items-center justify-center gap-4 text-center w-full px-4 md:px-12 lg:px-24">
          <div className="flex gap-4 mb-2">
            <Link href="https://github.com/Grolla05" target="_blank" className="hover:text-primary transition-colors">
              <Github className="h-5 w-5" />
            </Link>
            <Link href="https://www.linkedin.com/in/felipegrolla/" target="_blank" className="hover:text-primary transition-colors">
              <Linkedin className="h-5 w-5" />
            </Link>
            <Link href="mailto:fegrolla0210@gmail.com" className="hover:text-primary transition-colors">
              <Mail className="h-5 w-5" />
            </Link>
          </div>
          <p className="text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Felipe Grolla. Todos os direitos reservados.
          </p>
          <div className="flex gap-4">
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Política de Privacidade
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Termos de Serviço
            </Link>
            <a href="#about" className="text-sm text-muted-foreground hover:text-primary transition-colors">Voltar ao topo</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
