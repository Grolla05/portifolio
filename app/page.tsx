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
  Twitter,
  MapPin,
  Phone,
  Calendar,
  Building,
  GraduationCap,
  Code,
  Briefcase,
} from "lucide-react"

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between">
          <div className="font-semibold">John Doe</div>
          <nav className="hidden md:flex gap-6">
            <Link href="#about" className="text-sm font-medium hover:text-primary">
              About
            </Link>
            <Link href="#experience" className="text-sm font-medium hover:text-primary">
              Experience
            </Link>
            <Link href="#education" className="text-sm font-medium hover:text-primary">
              Education
            </Link>
            <Link href="#skills" className="text-sm font-medium hover:text-primary">
              Skills
            </Link>
            <Link href="#projects" className="text-sm font-medium hover:text-primary">
              Projects
            </Link>
          </nav>
          <Button size="sm" className="hidden md:flex">
            <Download className="mr-2 h-4 w-4" />
            Download CV
          </Button>
          <Button variant="outline" size="icon" className="md:hidden">
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
      </header>

      <main className="container py-10">
        {/* Hero Section */}
        <section id="about" className="mb-12 grid gap-6 md:grid-cols-2 md:gap-10">
          <div className="flex flex-col justify-center space-y-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">John Doe</h1>
              <h2 className="text-xl text-muted-foreground">Senior Software Engineer</h2>
            </div>
            <p className="text-muted-foreground">
              Passionate software engineer with 5+ years of experience building web applications. Specialized in React,
              Node.js, and cloud infrastructure.
            </p>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>San Francisco, CA</span>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button asChild variant="outline" size="sm">
                <Link href="mailto:john.doe@example.com">
                  <Mail className="mr-2 h-4 w-4" />
                  Email
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link href="https://github.com" target="_blank">
                  <Github className="mr-2 h-4 w-4" />
                  GitHub
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link href="https://linkedin.com" target="_blank">
                  <Linkedin className="mr-2 h-4 w-4" />
                  LinkedIn
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link href="https://twitter.com" target="_blank">
                  <Twitter className="mr-2 h-4 w-4" />
                  Twitter
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link href="tel:+11234567890">
                  <Phone className="mr-2 h-4 w-4" />
                  (123) 456-7890
                </Link>
              </Button>
            </div>
          </div>
          <div className="flex justify-center md:justify-end">
            <div className="relative h-60 w-60 overflow-hidden rounded-full border-4 border-background bg-muted md:h-80 md:w-80">
              <Image src="/placeholder.svg?height=320&width=320" alt="Profile" fill className="object-cover" priority />
            </div>
          </div>
        </section>

        {/* Tabs for Resume Sections */}
        <Tabs defaultValue="experience" className="mb-12">
          <TabsList className="w-full justify-start mb-8 overflow-x-auto">
            <TabsTrigger value="experience" className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              Experience
            </TabsTrigger>
            <TabsTrigger value="education" className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              Education
            </TabsTrigger>
            <TabsTrigger value="skills" className="flex items-center gap-2">
              <Code className="h-4 w-4" />
              Skills
            </TabsTrigger>
            <TabsTrigger value="projects" className="flex items-center gap-2">
              <Building className="h-4 w-4" />
              Projects
            </TabsTrigger>
          </TabsList>

          {/* Experience Tab */}
          <TabsContent value="experience" id="experience" className="space-y-8">
            <h2 className="text-2xl font-bold tracking-tight">Work Experience</h2>

            <div className="space-y-6">
              {/* Experience Item 1 */}
              <div className="rounded-lg border p-6">
                <div className="flex flex-col justify-between gap-2 md:flex-row md:items-center">
                  <div>
                    <h3 className="font-semibold">Senior Software Engineer</h3>
                    <p className="text-muted-foreground">Tech Solutions Inc.</p>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>Jan 2020 - Present</span>
                  </div>
                </div>
                <div className="mt-4">
                  <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                    <li>Led a team of 5 engineers to develop a cloud-based SaaS platform</li>
                    <li>Implemented CI/CD pipelines reducing deployment time by 40%</li>
                    <li>Architected microservices infrastructure using Docker and Kubernetes</li>
                    <li>Mentored junior developers and conducted code reviews</li>
                  </ul>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Badge>React</Badge>
                  <Badge>Node.js</Badge>
                  <Badge>TypeScript</Badge>
                  <Badge>AWS</Badge>
                  <Badge>Docker</Badge>
                </div>
              </div>

              {/* Experience Item 2 */}
              <div className="rounded-lg border p-6">
                <div className="flex flex-col justify-between gap-2 md:flex-row md:items-center">
                  <div>
                    <h3 className="font-semibold">Software Engineer</h3>
                    <p className="text-muted-foreground">Innovative Apps LLC</p>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>Jun 2017 - Dec 2019</span>
                  </div>
                </div>
                <div className="mt-4">
                  <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                    <li>Developed responsive web applications using React and Redux</li>
                    <li>Built RESTful APIs with Express.js and MongoDB</li>
                    <li>Improved application performance by 30% through code optimization</li>
                    <li>Collaborated with UX designers to implement user-friendly interfaces</li>
                  </ul>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Badge>React</Badge>
                  <Badge>Redux</Badge>
                  <Badge>Express.js</Badge>
                  <Badge>MongoDB</Badge>
                  <Badge>JavaScript</Badge>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Education Tab */}
          <TabsContent value="education" id="education" className="space-y-8">
            <h2 className="text-2xl font-bold tracking-tight">Education</h2>

            <div className="space-y-6">
              {/* Education Item 1 */}
              <div className="rounded-lg border p-6">
                <div className="flex flex-col justify-between gap-2 md:flex-row md:items-center">
                  <div>
                    <h3 className="font-semibold">Master of Science in Computer Science</h3>
                    <p className="text-muted-foreground">Stanford University</p>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>2015 - 2017</span>
                  </div>
                </div>
                <div className="mt-4 text-muted-foreground">
                  <p>GPA: 3.8/4.0</p>
                  <p className="mt-2">Thesis: "Optimizing Neural Networks for Mobile Applications"</p>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Badge>Machine Learning</Badge>
                  <Badge>Algorithms</Badge>
                  <Badge>Distributed Systems</Badge>
                </div>
              </div>

              {/* Education Item 2 */}
              <div className="rounded-lg border p-6">
                <div className="flex flex-col justify-between gap-2 md:flex-row md:items-center">
                  <div>
                    <h3 className="font-semibold">Bachelor of Science in Computer Engineering</h3>
                    <p className="text-muted-foreground">University of California, Berkeley</p>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>2011 - 2015</span>
                  </div>
                </div>
                <div className="mt-4 text-muted-foreground">
                  <p>GPA: 3.7/4.0</p>
                  <p className="mt-2">Minor in Business Administration</p>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Badge>Software Engineering</Badge>
                  <Badge>Data Structures</Badge>
                  <Badge>Computer Architecture</Badge>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Skills Tab */}
          <TabsContent value="skills" id="skills" className="space-y-8">
            <h2 className="text-2xl font-bold tracking-tight">Skills & Expertise</h2>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {/* Skill Category 1 */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Frontend Development</h3>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">React</span>
                        <span className="text-sm text-muted-foreground">Expert</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: "95%" }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">TypeScript</span>
                        <span className="text-sm text-muted-foreground">Expert</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: "90%" }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Next.js</span>
                        <span className="text-sm text-muted-foreground">Advanced</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: "85%" }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">CSS/Tailwind</span>
                        <span className="text-sm text-muted-foreground">Advanced</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: "80%" }}></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Skill Category 2 */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Backend Development</h3>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Node.js</span>
                        <span className="text-sm text-muted-foreground">Expert</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: "90%" }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Express.js</span>
                        <span className="text-sm text-muted-foreground">Expert</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: "90%" }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">MongoDB</span>
                        <span className="text-sm text-muted-foreground">Advanced</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: "80%" }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">PostgreSQL</span>
                        <span className="text-sm text-muted-foreground">Intermediate</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: "70%" }}></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Skill Category 3 */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">DevOps & Cloud</h3>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">AWS</span>
                        <span className="text-sm text-muted-foreground">Advanced</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: "85%" }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Docker</span>
                        <span className="text-sm text-muted-foreground">Advanced</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: "80%" }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Kubernetes</span>
                        <span className="text-sm text-muted-foreground">Intermediate</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: "70%" }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">CI/CD</span>
                        <span className="text-sm text-muted-foreground">Advanced</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: "85%" }}></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Projects Tab */}
          <TabsContent value="projects" id="projects" className="space-y-8">
            <h2 className="text-2xl font-bold tracking-tight">Projects</h2>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {/* Project 1 */}
              <Card className="overflow-hidden">
                <div className="aspect-video relative">
                  <Image src="/placeholder.svg?height=200&width=400" alt="Project 1" fill className="object-cover" />
                </div>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">E-commerce Platform</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    A full-stack e-commerce platform with payment processing, inventory management, and analytics
                    dashboard.
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge variant="outline">React</Badge>
                    <Badge variant="outline">Node.js</Badge>
                    <Badge variant="outline">MongoDB</Badge>
                    <Badge variant="outline">Stripe</Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button asChild size="sm" variant="outline">
                      <Link href="#" target="_blank">
                        <Github className="mr-2 h-4 w-4" />
                        Code
                      </Link>
                    </Button>
                    <Button asChild size="sm">
                      <Link href="#" target="_blank">
                        Demo
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Project 2 */}
              <Card className="overflow-hidden">
                <div className="aspect-video relative">
                  <Image src="/placeholder.svg?height=200&width=400" alt="Project 2" fill className="object-cover" />
                </div>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">Task Management App</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    A collaborative task management application with real-time updates and team collaboration features.
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge variant="outline">Next.js</Badge>
                    <Badge variant="outline">TypeScript</Badge>
                    <Badge variant="outline">Prisma</Badge>
                    <Badge variant="outline">Socket.io</Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button asChild size="sm" variant="outline">
                      <Link href="#" target="_blank">
                        <Github className="mr-2 h-4 w-4" />
                        Code
                      </Link>
                    </Button>
                    <Button asChild size="sm">
                      <Link href="#" target="_blank">
                        Demo
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Project 3 */}
              <Card className="overflow-hidden">
                <div className="aspect-video relative">
                  <Image src="/placeholder.svg?height=200&width=400" alt="Project 3" fill className="object-cover" />
                </div>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">AI Content Generator</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    An AI-powered content generation tool for creating marketing copy, blog posts, and social media
                    content.
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge variant="outline">React</Badge>
                    <Badge variant="outline">Python</Badge>
                    <Badge variant="outline">TensorFlow</Badge>
                    <Badge variant="outline">AWS</Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button asChild size="sm" variant="outline">
                      <Link href="#" target="_blank">
                        <Github className="mr-2 h-4 w-4" />
                        Code
                      </Link>
                    </Button>
                    <Button asChild size="sm">
                      <Link href="#" target="_blank">
                        Demo
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Download Resume Button (Mobile) */}
        <div className="mt-8 flex justify-center md:hidden">
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Download CV
          </Button>
        </div>
      </main>

      <footer className="border-t py-6">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} John Doe. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Privacy Policy
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Terms of Service
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
