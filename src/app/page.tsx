import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { SpectraVoXLogo } from '@/components/icons';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Volume2, Heart, Eye, Target, Send, Upload, BookOpen, Facebook, Twitter, Linkedin, Youtube } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Chatbot } from '@/components/chatbot';

export default function LandingPage() {
  const heroImage = PlaceHolderImages.find(p => p.id === 'login-hero');
  const teacherAvatar = PlaceHolderImages.find(p => p.id === 'teacher-avatar-1');
  const guardianAvatar = PlaceHolderImages.find(p => p.id === 'guardian-avatar-1');

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="px-4 lg:px-6 h-14 flex items-center border-b sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <Link href="#" className="flex items-center justify-center" prefetch={false}>
          <SpectraVoXLogo className="h-6 w-6 text-primary" />
          <span className="ml-2 text-xl font-bold">SpectraVox by AptX</span>
        </Link>
        <nav className="ml-auto hidden lg:flex gap-4 sm:gap-6 items-center">
          <Link href="#about" className="text-sm font-medium hover:underline underline-offset-4" prefetch={false}>
            About Us
          </Link>
          <Link href="#how-it-works" className="text-sm font-medium hover:underline underline-offset-4" prefetch={false}>
            How It Works
          </Link>
          <Link href="#feedback" className="text-sm font-medium hover:underline underline-offset-4" prefetch={false}>
            Feedback
          </Link>
          <Link href="#contact" className="text-sm font-medium hover:underline underline-offset-4" prefetch={false}>
            Contact
          </Link>
          <ThemeToggle />
           <Button asChild size="sm">
              <Link href="/auth/login">Login</Link>
           </Button>
        </nav>
        <div className="ml-4 lg:hidden flex items-center gap-2">
            <ThemeToggle />
             <Button asChild size="sm">
              <Link href="/auth/login">Login</Link>
           </Button>
        </div>
      </header>
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-3 md:py-6 lg:py-8 xl:py-12 relative">
           <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-background to-green-100/30 dark:to-green-900/20 -z-10"></div>
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                 <Badge variant="outline" className="w-fit">
                    <Sparkles className="w-4 h-4 mr-2 text-accent" />
                    AI-Powered Accessible Learning
                </Badge>
                <div className="space-y-4">
                  <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none font-headline">
                    Transform Curriculum Into <span className='text-primary'>Inclusive Learning</span> Experiences
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    SpectraVox by AptX uses AI to simplify teacher curriculum into visual, audio-rich, and adaptive lessons designed
                    specifically for students with Down syndrome and other learning differences.
                  </p>
                  <div className="flex flex-col gap-2 min-[400px]:flex-row">
                    <Button asChild size="lg">
                        <Link href="/auth/signup">Start Learning Now</Link>
                    </Button>
                    <Button asChild variant="outline" size="lg">
                        <Link href="#how-it-works">How it Works</Link>
                    </Button>
                  </div>
                </div>
              </div>
              <div className="relative group">
                {heroImage && (
                    <Image
                        src={heroImage.imageUrl}
                        alt={heroImage.description}
                        width={600}
                        height={600}
                        data-ai-hint={heroImage.imageHint}
                        className="mx-auto aspect-square overflow-hidden rounded-full object-cover sm:w-full"
                    />
                )}
                 <div className="absolute top-8 right-8 bg-accent/90 backdrop-blur-sm text-accent-foreground p-4 rounded-lg shadow-lg flex items-center gap-3 transition-transform group-hover:scale-105">
                    <div className="bg-accent p-2 rounded-full">
                        <Volume2 className="w-6 h-6 text-accent-foreground" />
                    </div>
                    <div>
                        <p className="font-bold">Audio Learning</p>
                        <p className="text-sm">Text-to-Speech</p>
                    </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* About Us Section */}
        <section id="about" className="w-full py-12 md:py-24 lg:py-32 bg-muted/40">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">About SpectraVox by AptX</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  We believe every child deserves an education that adapts to them. SpectraVox by AptX was born from a passion to leverage technology to create truly inclusive learning environments for children with learning differences.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              <div className="flex flex-col items-center text-center p-4">
                <Heart className="h-12 w-12 text-primary" />
                <h3 className="mt-4 text-xl font-bold">Our Mission</h3>
                <p className="mt-2 text-muted-foreground">
                  To empower students with accessible, engaging, and personalized learning experiences.
                </p>
              </div>
              <div className="flex flex-col items-center text-center p-4">
                <Eye className="h-12 w-12 text-primary" />
                <h3 className="mt-4 text-xl font-bold">Our Vision</h3>
                <p className="mt-2 text-muted-foreground">
                  A world where technology bridges educational gaps, making learning a joy for every child.
                </p>
              </div>
              <div className="flex flex-col items-center text-center p-4">
                <Target className="h-12 w-12 text-primary" />
                <h3 className="mt-4 text-xl font-bold">Our Approach</h3>
                <p className="mt-2 text-muted-foreground">
                  Combining AI with educational expertise to create adaptive, multi-sensory learning tools.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How We Operate Section */}
        <section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">How It Works</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed">
                  A simple three-step process for teachers to create and assign accessible lessons.
                </p>
              </div>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              <Card>
                <CardHeader className="text-center">
                  <div className="mx-auto bg-primary/10 text-primary p-4 rounded-full w-fit">
                    <Upload className="w-8 h-8" />
                  </div>
                  <CardTitle className="mt-4">1. Upload Curriculum</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-center text-muted-foreground">Teachers upload their existing curriculum documents (PDF, Docx, etc.).</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="text-center">
                  <div className="mx-auto bg-primary/10 text-primary p-4 rounded-full w-fit">
                    <Sparkles className="w-8 h-8" />
                  </div>
                  <CardTitle className="mt-4">2. AI Simplification</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-center text-muted-foreground">Our AI analyzes, simplifies, and enhances the content with visuals and audio.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="text-center">
                  <div className="mx-auto bg-primary/10 text-primary p-4 rounded-full w-fit">
                    <BookOpen className="w-8 h-8" />
                  </div>
                  <CardTitle className="mt-4">3. Student Learns</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-center text-muted-foreground">Students engage with the adaptive, multi-sensory lessons.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Feedback Section */}
        <section id="feedback" className="w-full py-12 md:py-24 lg:py-32 bg-muted/40">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">Loved by Teachers & Guardians</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed">
                Hear what educators and parents are saying about SpectraVox by AptX.
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-2">
              <Card>
                <CardContent className="p-6">
                  <blockquote className="text-lg italic text-muted-foreground">
                    "SpectraVox by AptX has been a game-changer in my classroom. I can finally provide differentiated instruction without spending hours adapting materials myself. The students are more engaged than ever!"
                  </blockquote>
                  <div className="flex items-center gap-4 mt-4">
                    {teacherAvatar && <Avatar>
                      <AvatarImage src={teacherAvatar.imageUrl} alt="Teacher Avatar" />
                      <AvatarFallback>T</AvatarFallback>
                    </Avatar>}
                    <div>
                      <p className="font-semibold">Mr. David Chen</p>
                      <p className="text-sm text-muted-foreground">3rd Grade Teacher</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <blockquote className="text-lg italic text-muted-foreground">
                    "Watching my son learn with so much confidence has been incredible. The visual and audio supports are exactly what he needs. Thank you, SpectraVox by AptX, for seeing his potential."
                  </blockquote>
                  <div className="flex items-center gap-4 mt-4">
                    {guardianAvatar && <Avatar>
                      <AvatarImage src={guardianAvatar.imageUrl} alt="Guardian Avatar" />
                      <AvatarFallback>G</AvatarFallback>
                    </Avatar>}
                    <div>
                      <p className="font-semibold">Sarah Thompson</p>
                      <p className="text-sm text-muted-foreground">Parent</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Contact Us Section */}
        <section id="contact" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight font-headline">Get in Touch</h2>
              <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Have questions or want to learn more? Send us a message.
              </p>
            </div>
            <div className="mx-auto w-full max-w-sm space-y-4">
              <form 
                action="mailto:qmary1085@gmail.com" 
                method="post" 
                encType="text/plain"
                className="grid gap-4"
              >
                <Input type="text" name="name" placeholder="Your Name" required />
                <Input type="email" name="email" placeholder="Your Email" required />
                <Textarea placeholder="Your Message" name="message" required />
                <Button type="submit">
                  <Send className="mr-2 h-4 w-4" /> Send Message
                </Button>
              </form>
            </div>
          </div>
        </section>
      </main>

      {/* Subscribe Section - placed just above the footer */}
      <section id="subscribe" className="w-full py-12 md:py-16 bg-muted/10">
        <div className="container px-4 md:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <h3 className="text-2xl font-bold">Stay Updated</h3>
            <p className="mt-2 text-muted-foreground">Get product updates, tips, and resources for inclusive learning.</p>
            <form
              action="mailto:qmary1085@gmail.com?subject=Subscribe%20to%20SpectraVox%20by%20AptX"
              method="post"
              encType="text/plain"
              className="mt-6 flex flex-col sm:flex-row items-center gap-2"
            >
              <Input type="email" name="email" placeholder="Enter your email" required className="flex-1" />
              <Button type="submit" className="whitespace-nowrap">
                <Send className="mr-2 h-4 w-4" /> Subscribe
              </Button>
            </form>
            <p className="mt-3 text-xs text-muted-foreground">We respect your privacy. No spam — unsubscribe anytime.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card text-card-foreground border-t">
        <div className="container py-12 px-4 md:px-6">
            <div className="grid gap-8 md:grid-cols-12">
                <div className="md:col-span-4 flex flex-col gap-4">
                    <Link href="#" className="flex items-center gap-2" prefetch={false}>
                        <SpectraVoXLogo className="h-8 w-8 text-primary" />
                        <span className="text-2xl font-bold">SpectraVox by AptX</span>
                    </Link>
                    <p className="text-muted-foreground max-w-xs">
                        SpectraVox by AptX: Transforming education with AI-powered accessible learning for students with Down syndrome. Built on Raindrop, ElevenLabs, and Stripe.
                    </p>
                    <div className="flex gap-2">
                        <Button variant="ghost" size="icon" asChild><Link href="#"><Facebook className="h-5 w-5"/></Link></Button>
                        <Button variant="ghost" size="icon" asChild><Link href="#"><Twitter className="h-5 w-5"/></Link></Button>
                        <Button variant="ghost" size="icon" asChild><Link href="#"><Linkedin className="h-5 w-5"/></Link></Button>
                        <Button variant="ghost" size="icon" asChild><Link href="#"><Youtube className="h-5 w-5"/></Link></Button>
                    </div>
                </div>

                <div className="md:col-span-2">
                    <h4 className="font-semibold mb-4">Platform</h4>
                    <ul className="space-y-2">
                        <li><Link href="#" className="text-muted-foreground hover:text-primary" prefetch={false}>Home</Link></li>
                        <li><Link href="/auth/login" className="text-muted-foreground hover:text-primary" prefetch={false}>Login</Link></li>
                        <li><Link href="/auth/signup" className="text-muted-foreground hover:text-primary" prefetch={false}>Signup</Link></li>
                        <li><Link href="/student" className="text-muted-foreground hover:text-primary" prefetch={false}>Student Lessons</Link></li>
                        <li><Link href="/guardian" className="text-muted-foreground hover:text-primary" prefetch={false}>Progress Tracking</Link></li>
                    </ul>
                </div>

                <div className="md:col-span-2">
                    <h4 className="font-semibold mb-4">Dashboards</h4>
                    <ul className="space-y-2">
                        <li><Link href="/teacher" className="text-muted-foreground hover:text-primary" prefetch={false}>Teacher Dashboard</Link></li>
                        <li><Link href="/teacher/upload" className="text-muted-foreground hover:text-primary" prefetch={false}>Upload Curriculum</Link></li>
                        <li><Link href="/teacher/curriculum/1" className="text-muted-foreground hover:text-primary" prefetch={false}>Curriculum Review</Link></li>
                        <li><Link href="/guardian" className="text-muted-foreground hover:text-primary" prefetch={false}>Guardian Dashboard</Link></li>
                        <li><Link href="/student/exam/1" className="text-muted-foreground hover:text-primary" prefetch={false}>Student Exam</Link></li>
                    </ul>
                </div>

                <div className="md:col-span-2">
                    <h4 className="font-semibold mb-4">Support</h4>
                    <ul className="space-y-2">
                        <li><Link href="#" className="text-muted-foreground hover:text-primary" prefetch={false}>Help Center</Link></li>
                        <li><Link href="#" className="text-muted-foreground hover:text-primary" prefetch={false}>Documentation</Link></li>
                        <li><Link href="#contact" className="text-muted-foreground hover:text-primary" prefetch={false}>Contact Us</Link></li>
                        <li><Link href="#" className="text-muted-foreground hover:text-primary" prefetch={false}>Privacy Policy</Link></li>
                        <li><Link href="#" className="text-muted-foreground hover:text-primary" prefetch={false}>Terms of Service</Link></li>
                    </ul>
                </div>
            </div>
            <div className="mt-8 border-t pt-6 text-center text-xs text-muted-foreground">
                &copy; {new Date().getFullYear()} SpectraVox by AptX. All rights reserved.
            </div>
        </div>
      </footer>

      {/* Chatbot */}
      <Chatbot />
    </div>
  );
}
