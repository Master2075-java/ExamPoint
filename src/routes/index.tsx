import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { Logo } from '@/components/brand/Logo';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Separator } from '@/components/ui/separator';
import {
  Brain,
  Zap,
  Target,
  Trophy,
  BookOpen,
  TrendingUp,
  CheckCircle2,
  Sparkles,
  Clock,
  BarChart3,
  Star,
  ArrowRight,
  Upload,
  MessageSquare,
  Calendar,
  Award,
  Users,
  Download,
  FileText,
  Image as ImageIcon,
  Video,
  Camera,
  File,
  Plus,
  LogOut,
} from 'lucide-react';
import {
  LEARNING_TECHNIQUES,
  TESTIMONIALS,
  FAQ_ITEMS,
  EXAMPLE_FLASHCARDS,
  EXAMPLE_QUIZ_QUESTIONS,
  EXAMPLE_TUTOR_EXPLANATION,
} from '@/lib/constants';
import { SubscriptionProvider, useSubscription, type SubscriptionTier } from '@/contexts/SubscriptionContext';
import { AuthModal } from '@/components/AuthModal';
import { SubscriptionGuard } from '@/components/SubscriptionGuard';
import { AdminSignupTracker } from '@/components/AdminSignupTracker';

export const Route = createFileRoute('/')({
  component: () => (
    <SubscriptionProvider>
      <App />
    </SubscriptionProvider>
  ),
});

// Helper function to read file content
async function readFileContent(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const result = e.target?.result;
      if (typeof result === 'string') {
        resolve(result);
      } else {
        // For binary files like images, provide a placeholder
        resolve(`[File uploaded: ${file.name}]\n\nThis appears to be a ${file.type} file. In a production environment, this would be processed using OCR or other content extraction methods.`);
      }
    };

    reader.onerror = () => reject(new Error('Failed to read file'));

    // Try to read as text for text-based files
    if (file.type.includes('text') || file.name.endsWith('.txt')) {
      reader.readAsText(file);
    } else {
      // For other files, provide metadata
      resolve(`[File uploaded: ${file.name}]\n\nFile type: ${file.type}\nFile size: ${(file.size / 1024).toFixed(2)} KB\n\nIn production, this content would be extracted and analyzed using AI to generate relevant flashcards.`);
    }
  });
}

// Helper function to generate flashcards from text or subject questions
function generateFlashcardsFromText(text: string): Array<{ question: string; answer: string }> {
  const lowerText = text.toLowerCase();

  // Check if user is asking a subject question
  if (text.length < 200 && (lowerText.includes('?') || lowerText.startsWith('what') || lowerText.startsWith('how') ||
      lowerText.startsWith('why') || lowerText.startsWith('explain') || lowerText.includes('about'))) {

    // Generate flashcards based on the subject question
    if (lowerText.includes('photosynthesis')) {
      return EXAMPLE_FLASHCARDS;
    }

    if (lowerText.includes('mitochondria') || lowerText.includes('cell biology')) {
      return [
        { question: 'What is the primary function of mitochondria?', answer: 'Mitochondria are the powerhouse of the cell, producing ATP through cellular respiration to provide energy for cellular processes.' },
        { question: 'What is the structure of mitochondria?', answer: 'Mitochondria have a double membrane structure with an outer membrane and an inner membrane with cristae (folds) that increase surface area for ATP production.' },
        { question: 'What is cellular respiration?', answer: 'Cellular respiration is the process where glucose and oxygen are converted into ATP, carbon dioxide, and water. Formula: C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O + ATP' },
        { question: 'Why do mitochondria have their own DNA?', answer: 'Mitochondria have their own DNA (mtDNA) because they evolved from ancient bacteria that were engulfed by early eukaryotic cells, supporting the endosymbiotic theory.' },
        { question: 'Where in the cell are mitochondria located?', answer: 'Mitochondria are found in the cytoplasm of nearly all eukaryotic cells, with higher concentrations in cells that require more energy, such as muscle cells.' },
      ];
    }

    if (lowerText.includes('algebra') || lowerText.includes('equation') || lowerText.includes('math')) {
      return [
        { question: 'What is the order of operations in algebra?', answer: 'PEMDAS: Parentheses, Exponents, Multiplication/Division (left to right), Addition/Subtraction (left to right)' },
        { question: 'How do you solve a linear equation?', answer: '1) Simplify both sides, 2) Use inverse operations to isolate the variable, 3) Whatever you do to one side, do to the other, 4) Check your answer' },
        { question: 'What is the quadratic formula?', answer: 'x = (-b ± √(b² - 4ac)) / 2a, used to solve equations in the form ax² + bx + c = 0' },
        { question: 'What is the slope-intercept form?', answer: 'y = mx + b, where m is the slope and b is the y-intercept of a linear equation' },
        { question: 'How do you factor a quadratic expression?', answer: 'Find two numbers that multiply to c and add to b in x² + bx + c, then write as (x + p)(x + q)' },
      ];
    }

    if (lowerText.includes('history') || lowerText.includes('revolution') || lowerText.includes('war')) {
      return [
        { question: 'What were the main causes of the American Revolution?', answer: 'Taxation without representation, restrictions on colonial trade, the Stamp Act, Tea Act, and increased British control over colonial affairs' },
        { question: 'When did the American Revolution take place?', answer: 'The American Revolution lasted from 1775 to 1783, starting with the Battles of Lexington and Concord and ending with the Treaty of Paris' },
        { question: 'Who were the key figures in the American Revolution?', answer: 'George Washington (Commander), Thomas Jefferson (Declaration author), Benjamin Franklin, John Adams, and Paul Revere were major American leaders' },
        { question: 'What was the Declaration of Independence?', answer: 'A document written in 1776 declaring the 13 American colonies independent from British rule, emphasizing natural rights and self-governance' },
        { question: 'What was the outcome of the American Revolution?', answer: 'The colonies gained independence, formed the United States, established a democratic government, and influenced future revolutions worldwide' },
      ];
    }

    if (lowerText.includes('chemistry') || lowerText.includes('element') || lowerText.includes('atom')) {
      return [
        { question: 'What is the basic structure of an atom?', answer: 'Atoms consist of a nucleus (containing protons and neutrons) surrounded by electrons in orbitals or shells' },
        { question: 'What are the three main types of chemical bonds?', answer: 'Ionic bonds (transfer of electrons), covalent bonds (sharing of electrons), and metallic bonds (sea of electrons)' },
        { question: 'What is the periodic table?', answer: 'An organized chart of chemical elements arranged by atomic number, showing patterns in element properties and behavior' },
        { question: 'What is a chemical reaction?', answer: 'A process where substances (reactants) are transformed into different substances (products) through breaking and forming chemical bonds' },
        { question: 'What is the difference between an element and a compound?', answer: 'An element is a pure substance made of one type of atom, while a compound is made of two or more different elements chemically bonded together' },
      ];
    }

    // Generic subject flashcards
    return [
      { question: `What is the main concept of ${text}?`, answer: 'This concept involves understanding the fundamental principles and how they apply in various contexts. Study the definitions, examples, and relationships between ideas.' },
      { question: `Why is ${text} important to learn?`, answer: 'Understanding this topic builds foundational knowledge for more advanced concepts and helps develop critical thinking skills in this subject area.' },
      { question: `What are the key components of ${text}?`, answer: 'Break down the topic into smaller parts: identify main ideas, supporting details, examples, and how they connect to broader concepts.' },
      { question: `How can you apply ${text} in real situations?`, answer: 'Look for practical examples, solve related problems, and connect the concept to real-world scenarios to deepen understanding.' },
      { question: `What are common misconceptions about ${text}?`, answer: 'Review the topic carefully, identify areas of confusion, and compare correct understanding with common errors to avoid mistakes.' },
    ];
  }

  // Original logic for longer text content
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 10);

  if (sentences.length === 0) {
    return [
      { question: `What is the main topic of: "${text.substring(0, 50)}..."?`, answer: 'This topic requires further study material to generate detailed flashcards.' },
      { question: 'How would you explain this concept?', answer: 'Review the material and create your own explanation to reinforce learning.' },
    ];
  }

  // Create flashcards from sentences
  const cards = [];
  for (let i = 0; i < Math.min(5, sentences.length); i++) {
    const sentence = sentences[i].trim();
    if (sentence.length > 15) {
      cards.push({
        question: `What key concept is explained by: "${sentence.substring(0, 60)}..."?`,
        answer: sentence,
      });
    }
  }

  // Add some general questions based on the topic
  if (text.toLowerCase().includes('photosynthesis')) {
    cards.push(...EXAMPLE_FLASHCARDS);
  } else {
    cards.push({
      question: `Summarize the main points from this material`,
      answer: `Key concepts: ${text.substring(0, 100)}...`,
    });
  }

  return cards.length > 0 ? cards : EXAMPLE_FLASHCARDS;
}

function App() {
  const [activeView, setActiveView] = useState<'landing' | 'dashboard' | 'flashcards' | 'quiz' | 'tutor' | 'upload' | 'admin'>('landing');
  const [selectedTier, setSelectedTier] = useState<'FREE' | 'BASIC' | 'ELITE'>('FREE');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { isAuthenticated, user, logout, currentTier, signupEvents } = useSubscription();

  const handleAuthRequired = (tier?: SubscriptionTier) => {
    if (!isAuthenticated) {
      if (tier) setSelectedTier(tier);
      setShowAuthModal(true);
    } else {
      setActiveView('dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-zinc-50">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <button onClick={() => setActiveView('landing')} className="cursor-pointer transition-opacity hover:opacity-80">
            <Logo />
          </button>
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => setActiveView('landing')}
              className={activeView === 'landing' ? 'bg-zinc-100' : ''}
            >
              Home
            </Button>
            {isAuthenticated && (
              <>
                <Button
                  variant="ghost"
                  onClick={() => setActiveView('dashboard')}
                  className={activeView === 'dashboard' ? 'bg-zinc-100' : ''}
                >
                  Dashboard
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setActiveView('upload')}
                  className={activeView === 'upload' ? 'bg-zinc-100' : ''}
                >
                  Add Material
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setActiveView('admin')}
                  className={activeView === 'admin' ? 'bg-zinc-100' : ''}
                >
                  <Users className="mr-2 h-4 w-4" />
                  Admin
                  {signupEvents.length > 0 && (
                    <Badge className="ml-2 bg-red-500">{signupEvents.length}</Badge>
                  )}
                </Button>
              </>
            )}
            <Button
              variant="outline"
              className="border-yellow-500 text-yellow-600 hover:bg-yellow-50"
              onClick={() => window.open('https://buymeacoffee.com/exampoint?new=1', '_blank')}
            >
              ☕ Donate
            </Button>
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={logout}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <>
                <Button variant="ghost" onClick={() => setShowAuthModal(true)}>
                  Log In
                </Button>
                <Button
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={() => {
                    setSelectedTier('FREE');
                    setShowAuthModal(true);
                  }}
                >
                  Sign Up Free
                </Button>
              </>
            )}
          </div>
        </div>
      </nav>

      {activeView === 'landing' && <LandingPage setActiveView={setActiveView} selectedTier={selectedTier} setSelectedTier={setSelectedTier} onAuthRequired={handleAuthRequired} />}
      {activeView === 'dashboard' && <DashboardView setActiveView={setActiveView} />}
      {activeView === 'flashcards' && <FlashcardsView setActiveView={setActiveView} />}
      {activeView === 'quiz' && <QuizView setActiveView={setActiveView} />}
      {activeView === 'tutor' && <TutorView setActiveView={setActiveView} />}
      {activeView === 'upload' && <UploadCenterView setActiveView={setActiveView} />}
      {activeView === 'admin' && <AdminView setActiveView={setActiveView} />}

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        defaultTab="signup"
        selectedTier={selectedTier}
        onAuthSuccess={() => {
          setShowAuthModal(false);
          setActiveView('dashboard');
        }}
      />
    </div>
  );
}

function LandingPage({
  setActiveView,
  selectedTier,
  setSelectedTier,
  onAuthRequired,
}: {
  setActiveView: (view: 'landing' | 'dashboard' | 'flashcards' | 'quiz' | 'tutor' | 'upload' | 'admin') => void;
  selectedTier: 'FREE' | 'BASIC' | 'ELITE';
  setSelectedTier: (tier: 'FREE' | 'BASIC' | 'ELITE') => void;
  onAuthRequired?: (tier?: SubscriptionTier) => void;
}) {
  return (
    <>
      {/* Hero Section */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="text-center">
          <Badge className="mb-4 bg-green-100 text-green-700 hover:bg-green-100">
            <Sparkles className="mr-1 h-3 w-3" />
            100% Free Forever
          </Badge>
          <h1 className="mb-6 text-5xl font-bold tracking-tight text-zinc-900 sm:text-6xl lg:text-7xl">
            Ready to{' '}
            <span className="bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent">
              Raise Your Test Scores?
            </span>
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-xl text-zinc-600">
            AI-powered flashcards, adaptive quizzes, and personalized study plans using spaced repetition, active recall, and interleaving. Completely free for all students!
          </p>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button
              size="lg"
              className="bg-blue-600 text-lg hover:bg-blue-700"
              onClick={() => {
                setSelectedTier('FREE');
                onAuthRequired?.('FREE');
              }}
            >
              Start Free Today
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-yellow-500 text-lg text-yellow-600 hover:bg-yellow-50"
              onClick={() => window.open('https://buymeacoffee.com/exampoint?new=1', '_blank')}
            >
              Support Us ☕
            </Button>
          </div>
          <p className="mt-4 text-sm text-zinc-500">100% Free Forever • Support us with a donation if you love ExamPoint!</p>
        </div>

        {/* Stats */}
        <div className="mt-16 grid gap-8 sm:grid-cols-3">
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="mb-2 text-4xl font-bold text-blue-600">+180</div>
              <p className="text-sm text-zinc-600">Average SAT Point Increase</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="mb-2 text-4xl font-bold text-green-600">93%</div>
              <p className="text-sm text-zinc-600">Students See Score Improvement</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="mb-2 text-4xl font-bold text-blue-600">50K+</div>
              <p className="text-sm text-zinc-600">Students Using ExamPoint</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-zinc-900">Everything You Need to Excel</h2>
            <p className="mx-auto max-w-2xl text-lg text-zinc-600">
              Powerful features designed to make studying more effective and help you achieve your target scores.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={<Brain className="h-6 w-6" />}
              title="AI Flashcard Generator"
              description="Input any topic or upload study material and get instant AI-generated flashcards with smart question-answer pairs."
            />
            <FeatureCard
              icon={<Zap className="h-6 w-6" />}
              title="Adaptive Quiz System"
              description="Take quizzes that adapt to your skill level, with multiple-choice, short answer, and long reasoning questions."
            />
            <FeatureCard
              icon={<MessageSquare className="h-6 w-6" />}
              title="AI Tutor Explanations"
              description="Get detailed explanations after every answer showing why you're right or wrong and teaching the underlying concept."
            />
            <FeatureCard
              icon={<Calendar className="h-6 w-6" />}
              title="Spaced Repetition"
              description="Our algorithm schedules reviews at optimal intervals to move knowledge into long-term memory."
            />
            <FeatureCard
              icon={<Target className="h-6 w-6" />}
              title="Active Recall Practice"
              description="Test yourself instead of passively reading. Build stronger neural pathways through retrieval practice."
            />
            <FeatureCard
              icon={<BookOpen className="h-6 w-6" />}
              title="Interleaving Method"
              description="Mix different subjects and topics in study sessions for better retention and understanding."
            />
            <FeatureCard
              icon={<BarChart3 className="h-6 w-6" />}
              title="Progress Tracking"
              description="Track study streaks, accuracy rates, subject mastery levels, and see your improvement over time."
            />
            <FeatureCard
              icon={<Trophy className="h-6 w-6" />}
              title="Gamification"
              description="Stay motivated with study streaks, achievement badges, leaderboards, and progress milestones."
            />
            <FeatureCard
              icon={<Award className="h-6 w-6" />}
              title="Multi-Exam Support"
              description="Prepare for SAT, ACT, AP exams, and all school subjects with dedicated study tracks for each."
            />
          </div>
        </div>
      </section>

      {/* Why It Works Section */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-zinc-900">Why ExamPoint Works</h2>
            <p className="mx-auto max-w-2xl text-lg text-zinc-600">
              Our platform is built on proven cognitive science research. Here's how each technique helps you learn better.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {Object.entries(LEARNING_TECHNIQUES).map(([key, technique]) => (
              <Card key={key} className="border-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    {technique.title}
                  </CardTitle>
                  <CardDescription className="text-base">{technique.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-zinc-700">
                    <strong className="text-blue-600">For students:</strong> {technique.studentExplanation}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Product Demo Section */}
      <section className="bg-white py-20" data-demo-section>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-zinc-900">See ExamPoint in Action</h2>
            <p className="mx-auto max-w-2xl text-lg text-zinc-600">
              Watch how easy it is to generate flashcards, take adaptive quizzes, and get AI tutor help.
            </p>
          </div>

          <Tabs defaultValue="flashcards" className="mx-auto max-w-4xl">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="flashcards">1. Generate Flashcards</TabsTrigger>
              <TabsTrigger value="quiz">2. Take Quiz</TabsTrigger>
              <TabsTrigger value="tutor">3. Get AI Tutoring</TabsTrigger>
            </TabsList>

            <TabsContent value="flashcards" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Enter a Topic: "Photosynthesis"</CardTitle>
                  <CardDescription>AI generates instant flashcards</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {EXAMPLE_FLASHCARDS.map((card, idx) => (
                    <Card key={idx} className="bg-zinc-50">
                      <CardContent className="pt-6">
                        <p className="mb-2 font-semibold text-blue-600">Q: {card.question}</p>
                        <p className="text-sm text-zinc-700">A: {card.answer}</p>
                      </CardContent>
                    </Card>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="quiz" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Adaptive Quiz Questions</CardTitle>
                  <CardDescription>Questions adapt to your level</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {EXAMPLE_QUIZ_QUESTIONS.map((q, idx) => (
                    <Card key={idx} className="bg-zinc-50">
                      <CardContent className="pt-6">
                        <p className="mb-3 font-semibold">{q.questionText}</p>
                        {q.options && (
                          <div className="space-y-2">
                            {q.options.map((option, oidx) => (
                              <div
                                key={oidx}
                                className={`rounded-lg border-2 p-3 ${
                                  option === q.correctAnswer
                                    ? 'border-green-500 bg-green-50'
                                    : 'border-zinc-200 bg-white'
                                }`}
                              >
                                {option}
                                {option === q.correctAnswer && (
                                  <CheckCircle2 className="ml-2 inline h-4 w-4 text-green-600" />
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="tutor" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>AI Tutor Explanation</CardTitle>
                  <CardDescription>Detailed feedback on every answer</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Card className="border-red-200 bg-red-50">
                    <CardContent className="pt-6">
                      <Badge className="mb-2 bg-red-100 text-red-700">Incorrect</Badge>
                      <p className="text-sm text-zinc-700">{EXAMPLE_TUTOR_EXPLANATION.incorrect}</p>
                    </CardContent>
                  </Card>
                  <Card className="border-green-200 bg-green-50">
                    <CardContent className="pt-6">
                      <Badge className="mb-2 bg-green-100 text-green-700">Correct</Badge>
                      <p className="text-sm text-zinc-700">{EXAMPLE_TUTOR_EXPLANATION.correct}</p>
                    </CardContent>
                  </Card>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-zinc-900">Students Love ExamPoint</h2>
            <p className="mx-auto max-w-2xl text-lg text-zinc-600">
              Real students, real score improvements. See what ExamPoint users have achieved.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {TESTIMONIALS.map((testimonial, idx) => (
              <Card key={idx}>
                <CardContent className="pt-6">
                  <div className="mb-4 flex items-start justify-between">
                    <Avatar>
                      <AvatarFallback className="bg-blue-100 text-blue-600">
                        {testimonial.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <Badge className="bg-green-100 text-green-700">{testimonial.improvement}</Badge>
                  </div>
                  <div className="mb-2 flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="mb-4 text-sm text-zinc-700">{testimonial.quote}</p>
                  <div className="text-xs text-zinc-500">
                    <p className="font-semibold">{testimonial.name}</p>
                    <p>
                      {testimonial.role} • {testimonial.exam}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>


      {/* FAQ Section */}
      <section className="py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-zinc-900">Frequently Asked Questions</h2>
            <p className="text-lg text-zinc-600">Everything you need to know about ExamPoint</p>
          </div>

          <Accordion type="single" collapsible className="w-full">
            {FAQ_ITEMS.map((item, idx) => (
              <AccordionItem key={idx} value={`item-${idx}`}>
                <AccordionTrigger className="text-left">{item.question}</AccordionTrigger>
                <AccordionContent className="text-zinc-600">{item.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 py-20 text-white">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-4 text-4xl font-bold">Ready to Raise Your Test Scores?</h2>
          <p className="mb-8 text-xl text-blue-100">
            Join 50,000+ students using ExamPoint to achieve their academic goals
          </p>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button
              size="lg"
              className="bg-white text-lg text-blue-600 hover:bg-zinc-100"
              onClick={() => {
                setSelectedTier('FREE');
                onAuthRequired?.('FREE');
              }}
            >
              Start Free Today
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-white text-lg text-white hover:bg-blue-800"
              onClick={() => window.open('https://buymeacoffee.com/exampoint?new=1', '_blank')}
            >
              ☕ Support ExamPoint
            </Button>
          </div>
          <p className="mt-4 text-sm text-blue-200">100% Free Forever • Love ExamPoint? Support us with a donation!</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <Logo className="mb-4" />
              <p className="text-sm text-zinc-600 mb-4">
                Science-backed study platform for better test scores
              </p>
              <Button
                className="bg-yellow-500 hover:bg-yellow-600 text-white"
                onClick={() => window.open('https://buymeacoffee.com/exampoint?new=1', '_blank')}
              >
                ☕ Buy Me a Coffee
              </Button>
            </div>
            <div>
              <h3 className="mb-4 font-semibold">Product</h3>
              <ul className="space-y-2 text-sm text-zinc-600">
                <li>Features</li>
                <li>Demo</li>
                <li>FAQ</li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 font-semibold">Exams</h3>
              <ul className="space-y-2 text-sm text-zinc-600">
                <li>SAT Prep</li>
                <li>ACT Prep</li>
                <li>AP Exams</li>
                <li>School Subjects</li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 font-semibold">Company</h3>
              <ul className="space-y-2 text-sm text-zinc-600">
                <li>About</li>
                <li>Blog</li>
                <li>Contact</li>
                <li>Privacy</li>
              </ul>
            </div>
          </div>
          <Separator className="my-8" />
          <div className="text-center">
            <p className="text-sm text-zinc-600 mb-2">
              © 2024 ExamPoint. All rights reserved. Built with science-backed learning methods.
            </p>
            <p className="text-xs text-zinc-500">
              100% Free Forever • If ExamPoint helps you, consider{' '}
              <button
                onClick={() => window.open('https://buymeacoffee.com/exampoint?new=1', '_blank')}
                className="text-yellow-600 underline hover:text-yellow-700"
              >
                buying us a coffee
              </button>
              !
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}

function DashboardView({ setActiveView }: { setActiveView: (view: 'landing' | 'dashboard' | 'flashcards' | 'quiz' | 'tutor' | 'upload' | 'admin') => void }) {
  const { user, currentTier } = useSubscription();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-zinc-900">Welcome back, {user?.name || 'Student'}!</h1>
        <p className="text-zinc-600">Keep up the great work. You're on a 5-day streak!</p>
      </div>

      {/* Quick Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-zinc-600">Study Streak</p>
                <p className="text-3xl font-bold text-blue-600">5 days</p>
              </div>
              <Trophy className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-zinc-600">Questions Answered</p>
                <p className="text-3xl font-bold text-green-600">847</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-zinc-600">Accuracy Rate</p>
                <p className="text-3xl font-bold text-blue-600">78%</p>
              </div>
              <Target className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-zinc-600">Rank</p>
                <p className="text-3xl font-bold text-green-600">#127</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard Content */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left Column - Today's Study */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Today's Recommended Study Session
              </CardTitle>
              <CardDescription>Based on your spaced repetition schedule</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border-2 border-blue-200 bg-blue-50 p-4">
                <div>
                  <p className="font-semibold text-blue-900">Biology - Cell Structure</p>
                  <p className="text-sm text-blue-700">15 flashcards • 10 quiz questions</p>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setActiveView('flashcards')}>
                  Start Session
                </Button>
              </div>
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <p className="font-semibold">SAT Math - Algebra</p>
                  <p className="text-sm text-zinc-600">Review from 3 days ago</p>
                </div>
                <Button variant="outline" onClick={() => setActiveView('flashcards')}>Review</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Subject Mastery</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="mb-2 flex justify-between text-sm">
                  <span className="font-medium">Biology</span>
                  <span className="text-zinc-600">85%</span>
                </div>
                <Progress value={85} className="h-2" />
              </div>
              <div>
                <div className="mb-2 flex justify-between text-sm">
                  <span className="font-medium">SAT Math</span>
                  <span className="text-zinc-600">72%</span>
                </div>
                <Progress value={72} className="h-2" />
              </div>
              <div>
                <div className="mb-2 flex justify-between text-sm">
                  <span className="font-medium">World History</span>
                  <span className="text-zinc-600">64%</span>
                </div>
                <Progress value={64} className="h-2" />
              </div>
              <div>
                <div className="mb-2 flex justify-between text-sm">
                  <span className="font-medium">English Literature</span>
                  <span className="text-zinc-600">91%</span>
                </div>
                <Progress value={91} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Quiz Scores</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { subject: 'Biology Quiz', score: 9, total: 10, date: 'Today' },
                  { subject: 'SAT Math Practice', score: 16, total: 20, date: 'Yesterday' },
                  { subject: 'World History', score: 7, total: 10, date: '2 days ago' },
                ].map((quiz, idx) => (
                  <div key={idx} className="flex items-center justify-between rounded-lg border p-3">
                    <div>
                      <p className="font-medium">{quiz.subject}</p>
                      <p className="text-xs text-zinc-500">{quiz.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-blue-600">
                        {quiz.score}/{quiz.total}
                      </p>
                      <p className="text-xs text-zinc-600">{Math.round((quiz.score / quiz.total) * 100)}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Quick Actions */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start" variant="outline" onClick={() => setActiveView('flashcards')}>
                <Brain className="mr-2 h-4 w-4" />
                Generate Flashcards
              </Button>
              <Button className="w-full justify-start" variant="outline" onClick={() => setActiveView('quiz')}>
                <Zap className="mr-2 h-4 w-4" />
                Start Quiz
              </Button>
              <Button className="w-full justify-start" variant="outline" onClick={() => setActiveView('tutor')}>
                <MessageSquare className="mr-2 h-4 w-4" />
                Ask AI Tutor
              </Button>
              <Button className="w-full justify-start" variant="outline" onClick={() => setActiveView('upload')}>
                <Upload className="mr-2 h-4 w-4" />
                Upload Study Material
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Upcoming Schedule</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <div className="mt-1 h-2 w-2 rounded-full bg-blue-600"></div>
                <div>
                  <p className="font-medium">SAT Practice Test</p>
                  <p className="text-xs text-zinc-600">Tomorrow, 10:00 AM</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-1 h-2 w-2 rounded-full bg-green-600"></div>
                <div>
                  <p className="font-medium">Biology Review</p>
                  <p className="text-xs text-zinc-600">In 2 days</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-1 h-2 w-2 rounded-full bg-blue-600"></div>
                <div>
                  <p className="font-medium">Math Quiz</p>
                  <p className="text-xs text-zinc-600">In 3 days</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-600" />
                Achievements
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Badge className="w-full justify-start bg-yellow-100 text-yellow-700">
                5-Day Streak Master
              </Badge>
              <Badge className="w-full justify-start bg-blue-100 text-blue-700">
                500 Questions Answered
              </Badge>
              <Badge className="w-full justify-start bg-green-100 text-green-700">
                Biology Expert
              </Badge>
            </CardContent>
          </Card>

          <Card className="border-2 border-yellow-500 bg-gradient-to-br from-yellow-50 to-orange-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                ☕ Love ExamPoint?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-sm text-zinc-700">
                ExamPoint is 100% free for all students! If you find it helpful, consider supporting us with a donation.
              </p>
              <Button
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-white"
                onClick={() => window.open('https://buymeacoffee.com/exampoint?new=1', '_blank')}
              >
                ☕ Buy Us a Coffee
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function FlashcardsView({ setActiveView }: { setActiveView: (view: 'landing' | 'dashboard' | 'flashcards' | 'quiz' | 'tutor' | 'upload' | 'admin') => void }) {
  const [topic, setTopic] = useState('');
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [generatedCards, setGeneratedCards] = useState(EXAMPLE_FLASHCARDS);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedFile(file);
      setIsProcessing(true);

      try {
        // Read file content
        const text = await readFileContent(file);

        // Simulate AI flashcard generation (in production, this would call an AI API)
        setTimeout(() => {
          const newCards = generateFlashcardsFromText(text);
          setGeneratedCards(newCards);
          setIsProcessing(false);
          setCurrentCardIndex(0);
          setShowAnswer(false);
        }, 2000);
      } catch (error) {
        console.error('Error processing file:', error);
        setIsProcessing(false);
      }
    }
  };

  const handleGenerateFromTopic = () => {
    if (!topic.trim()) return;

    setIsProcessing(true);
    // Simulate AI generation
    setTimeout(() => {
      const newCards = generateFlashcardsFromText(topic);
      setGeneratedCards(newCards);
      setIsProcessing(false);
      setCurrentCardIndex(0);
      setShowAnswer(false);
    }, 2000);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <Button variant="ghost" className="mb-6" onClick={() => setActiveView('dashboard')}>
        ← Back to Dashboard
      </Button>

      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-zinc-900">AI Flashcard Generator</h1>
        <p className="text-zinc-600">Ask a subject question or upload study material to generate flashcards</p>
      </div>

      <Card className="mb-8 border-blue-200 bg-blue-50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Sparkles className="h-5 w-5 text-blue-600" />
            <div>
              <p className="mb-2 text-sm font-semibold text-blue-900">How to generate flashcards:</p>
              <div className="space-y-1 text-xs text-blue-700">
                <p>• Ask a subject question: "What is photosynthesis?"</p>
                <p>• Request a topic: "Algebra equations"</p>
                <p>• Upload files: PDFs, Word docs, images, text files</p>
                <p>• Paste text: Copy notes, textbook content, or study material</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Generate New Flashcards</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium">Subject Question or Topic</label>
            <input
              type="text"
              placeholder="e.g., What is photosynthesis? / Explain algebra / American Revolution"
              className="w-full rounded-lg border border-zinc-300 px-4 py-2"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          </div>
          <div className="flex gap-4">
            <Button
              className="flex-1 bg-blue-600 hover:bg-blue-700"
              onClick={handleGenerateFromTopic}
              disabled={isProcessing || !topic.trim()}
            >
              <Brain className="mr-2 h-4 w-4" />
              {isProcessing ? 'Generating...' : 'Generate Flashcards'}
            </Button>
            <input
              type="file"
              accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
              className="hidden"
              id="flashcard-file-upload"
              onChange={handleFileUpload}
            />
            <label htmlFor="flashcard-file-upload" className="flex-1">
              <Button variant="outline" className="w-full cursor-pointer" asChild>
                <span>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload File
                </span>
              </Button>
            </label>
          </div>
          {uploadedFile && (
            <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 p-3">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium">Uploaded: {uploadedFile.name}</span>
              {isProcessing && <span className="ml-auto text-sm text-blue-600">Processing...</span>}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold">Your Flashcards</h2>
        <Badge>Card {currentCardIndex + 1} of {generatedCards.length}</Badge>
      </div>

      <Card className="mb-4 min-h-[300px] cursor-pointer" onClick={() => setShowAnswer(!showAnswer)}>
        <CardContent className="flex min-h-[300px] flex-col items-center justify-center p-8 text-center">
          {!showAnswer ? (
            <>
              <Brain className="mb-4 h-12 w-12 text-blue-600" />
              <p className="mb-4 text-2xl font-bold text-zinc-900">
                {generatedCards[currentCardIndex].question}
              </p>
              <p className="text-sm text-zinc-500">Click to reveal answer</p>
            </>
          ) : (
            <>
              <CheckCircle2 className="mb-4 h-12 w-12 text-green-600" />
              <p className="mb-2 text-lg font-semibold text-zinc-700">Answer:</p>
              <p className="text-xl text-zinc-900">{generatedCards[currentCardIndex].answer}</p>
            </>
          )}
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button
          variant="outline"
          className="flex-1"
          onClick={() => {
            setCurrentCardIndex(Math.max(0, currentCardIndex - 1));
            setShowAnswer(false);
          }}
          disabled={currentCardIndex === 0}
        >
          Previous
        </Button>
        <Button
          className="flex-1 bg-blue-600 hover:bg-blue-700"
          onClick={() => {
            setCurrentCardIndex(Math.min(generatedCards.length - 1, currentCardIndex + 1));
            setShowAnswer(false);
          }}
          disabled={currentCardIndex === generatedCards.length - 1}
        >
          Next
        </Button>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <Button
          variant="outline"
          className="justify-start"
          onClick={() => {
            toast.success('PDF Export Started!', {
              description: 'Your flashcards are being exported to PDF format. Download will start shortly.',
            });
          }}
        >
          <Download className="mr-2 h-4 w-4" />
          Export to PDF
        </Button>
        <Button variant="outline" className="justify-start" onClick={() => setActiveView('quiz')}>
          <Zap className="mr-2 h-4 w-4" />
          Quiz Me on This
        </Button>
        <Button
          variant="outline"
          className="justify-start"
          onClick={() => {
            toast.success('Saved to Library!', {
              description: 'These flashcards have been added to your personal library.',
            });
          }}
        >
          <BookOpen className="mr-2 h-4 w-4" />
          Save to Library
        </Button>
      </div>
    </div>
  );
}

function QuizView({ setActiveView }: { setActiveView: (view: 'landing' | 'dashboard' | 'flashcards' | 'quiz' | 'tutor' | 'upload' | 'admin') => void }) {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);

  const currentQuestion = EXAMPLE_QUIZ_QUESTIONS[0];

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <Button variant="ghost" className="mb-6" onClick={() => setActiveView('dashboard')}>
        ← Back to Dashboard
      </Button>

      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-zinc-900">Adaptive Quiz</h1>
        <p className="text-zinc-600">Questions adapt to your skill level</p>
      </div>

      <div className="mb-4 flex items-center justify-between">
        <Badge variant="outline">Question 1 of 10</Badge>
        <Badge className="bg-blue-100 text-blue-700">Medium Difficulty</Badge>
      </div>

      <Progress value={10} className="mb-8 h-2" />

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-xl">{currentQuestion.questionText}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {currentQuestion.options?.map((option, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedAnswer(option)}
              className={`w-full rounded-lg border-2 p-4 text-left transition-all ${
                selectedAnswer === option
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-zinc-200 bg-white hover:border-zinc-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span>{option}</span>
                {selectedAnswer === option && <CheckCircle2 className="h-5 w-5 text-blue-600" />}
              </div>
            </button>
          ))}
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button
          variant="outline"
          className="flex-1"
          onClick={() => {
            toast.info('Question Skipped', {
              description: 'Moving to the next question. You can review skipped questions later.',
            });
          }}
        >
          Skip Question
        </Button>
        <Button
          className="flex-1 bg-blue-600 hover:bg-blue-700"
          disabled={!selectedAnswer}
          onClick={() => {
            setShowResult(true);
            setActiveView('tutor');
          }}
        >
          Submit Answer
        </Button>
      </div>

      <Card className="mt-8 border-blue-200 bg-blue-50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Sparkles className="h-5 w-5 text-blue-600" />
            <div>
              <p className="mb-1 font-semibold text-blue-900">AI Tutor Available</p>
              <p className="text-sm text-blue-700">
                Get detailed explanations after each question to understand the concept better
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function TutorView({ setActiveView }: { setActiveView: (view: 'landing' | 'dashboard' | 'flashcards' | 'quiz' | 'tutor' | 'upload' | 'admin') => void }) {
  const [question, setQuestion] = useState('');
  const [conversation, setConversation] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const { hasAccess } = useSubscription();

  const handleAskQuestion = () => {
    if (!question.trim() || isGenerating) return;

    // Add user question to conversation
    const userMessage = question.trim();
    setConversation([...conversation, { role: 'user', content: userMessage }]);
    setQuestion('');
    setIsGenerating(true);

    // Simulate AI response generation
    setTimeout(() => {
      const response = generateTutorResponse(userMessage);
      setConversation(prev => [...prev, { role: 'assistant', content: response }]);
      setIsGenerating(false);
    }, 1500);
  };

  const generateTutorResponse = (userQuestion: string): string => {
    const lowerQuestion = userQuestion.toLowerCase();

    // Simple math responses
    if (lowerQuestion.includes('1 + 1') || lowerQuestion.includes('one plus one')) {
      return "1 + 1 = 2\n\nStudy Tip: Practice basic addition daily to build speed and confidence!";
    }

    if (lowerQuestion.includes('photosynthesis')) {
      return "Photosynthesis is how plants make food using sunlight, water, and CO₂ to create glucose and oxygen.\n\nEquation: 6CO₂ + 6H₂O + Light → C₆H₁₂O₆ + 6O₂\n\nStudy Tip: Remember it happens in chloroplasts and produces the oxygen we breathe!";
    }

    if (lowerQuestion.includes('mitochondria')) {
      return "Mitochondria is the powerhouse of the cell - it makes ATP (energy) from glucose.\n\nStudy Tip: Think of it like a battery that powers the cell!";
    }

    if (lowerQuestion.includes('solve') || lowerQuestion.includes('equation')) {
      return "To solve equations:\n1. Get the variable alone\n2. Do the same thing to both sides\n3. Check your answer\n\nExample: 2x + 5 = 13\nSubtract 5: 2x = 8\nDivide by 2: x = 4\n\nStudy Tip: Practice one problem type at a time until you master it!";
    }

    // Generic responses based on question pattern
    if (lowerQuestion.includes('what is') || lowerQuestion.includes('what are')) {
      // Extract the topic from the question
      const topic = userQuestion.replace(/what is |what are |[\?\!\.]/gi, '').trim();
      return `${topic.charAt(0).toUpperCase() + topic.slice(1)} is a concept you'll understand better with practice.\n\nStudy Tip: Try teaching this to a friend - if you can explain it simply, you really get it!`;
    }

    if (lowerQuestion.includes('how')) {
      return "Here's the simple answer:\n\nBreak it into small steps, practice each step, then put them together.\n\nStudy Tip: Use flashcards to memorize the key steps!";
    }

    // Default simple response
    return `Good question! The key is to understand the basics first, then practice.\n\nStudy Tip: Review this topic for 10 minutes today, then again in 3 days for better memory!`;
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <Button variant="ghost" className="mb-6" onClick={() => setActiveView('dashboard')}>
        ← Back to Dashboard
      </Button>

      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-zinc-900">AI Tutor</h1>
        <p className="text-zinc-600">Ask any question and get detailed explanations</p>
      </div>

      <SubscriptionGuard requiredTier="BASIC" featureName="AI Tutor">
        {/* Conversation History */}
        <div className="mb-6 space-y-4">
        {conversation.length === 0 && (
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <Brain className="h-6 w-6 text-blue-600" />
                <div>
                  <p className="mb-2 font-semibold text-blue-900">Welcome to AI Tutor!</p>
                  <p className="text-sm text-blue-700">
                    Ask me anything about your studies - concepts, homework help, exam prep, or explanations. I'm here to help you understand!
                  </p>
                  <div className="mt-3 space-y-1 text-xs text-blue-600">
                    <p>• "Explain photosynthesis"</p>
                    <p>• "How do I solve quadratic equations?"</p>
                    <p>• "What is mitochondria?"</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {conversation.map((message, idx) => (
          <Card key={idx} className={message.role === 'user' ? 'border-zinc-300 bg-zinc-50' : 'border-green-200 bg-green-50'}>
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                {message.role === 'user' ? (
                  <Avatar>
                    <AvatarFallback className="bg-blue-100 text-blue-600">You</AvatarFallback>
                  </Avatar>
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-600">
                    <Brain className="h-5 w-5 text-white" />
                  </div>
                )}
                <div className="flex-1">
                  <p className="mb-1 text-sm font-semibold">{message.role === 'user' ? 'You' : 'AI Tutor'}</p>
                  <p className="whitespace-pre-line text-sm leading-relaxed text-zinc-700">{message.content}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {isGenerating && (
          <Card className="border-green-200 bg-green-50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-600">
                  <Brain className="h-5 w-5 animate-pulse text-white" />
                </div>
                <p className="text-sm text-green-700">AI Tutor is thinking...</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Question Input */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-blue-600" />
            Ask Your Question
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <textarea
            className="min-h-[120px] w-full rounded-lg border-2 border-zinc-300 p-4 focus:border-blue-500 focus:outline-none"
            placeholder="Type your question here...

Examples:
• What is photosynthesis and how does it work?
• Explain the Pythagorean theorem
• How do I solve for x in 2x + 5 = 13?
• What are the causes of the American Revolution?"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.ctrlKey) {
                handleAskQuestion();
              }
            }}
          />
          <div className="flex gap-2">
            <Button
              className="flex-1 bg-blue-600 hover:bg-blue-700"
              onClick={handleAskQuestion}
              disabled={!question.trim() || isGenerating}
            >
              <Brain className="mr-2 h-4 w-4" />
              {isGenerating ? 'AI is thinking...' : 'Ask Question'}
            </Button>
            <Button
              variant="outline"
              onClick={() => setQuestion('')}
              disabled={!question.trim()}
            >
              Clear
            </Button>
          </div>
          <p className="text-xs text-zinc-500">Tip: Press Ctrl+Enter to submit</p>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="flex gap-4">
        <Button variant="outline" className="flex-1" onClick={() => setActiveView('flashcards')}>
          <Brain className="mr-2 h-4 w-4" />
          Generate Flashcards
        </Button>
        <Button variant="outline" className="flex-1" onClick={() => setActiveView('quiz')}>
          <Zap className="mr-2 h-4 w-4" />
          Take a Quiz
        </Button>
      </div>
      </SubscriptionGuard>
    </div>
  );
}

function UploadCenterView({ setActiveView }: { setActiveView: (view: 'landing' | 'dashboard' | 'flashcards' | 'quiz' | 'tutor' | 'upload' | 'admin') => void }) {
  const [studyText, setStudyText] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<Array<{ name: string; size: number }>>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setIsProcessing(true);
      const files = Array.from(e.target.files);
      const fileInfo = files.map(f => ({ name: f.name, size: f.size }));
      setUploadedFiles([...uploadedFiles, ...fileInfo]);

      // Simulate processing
      setTimeout(() => {
        setIsProcessing(false);
      }, 1500);
    }
  };

  const handleGenerateFromText = () => {
    if (!studyText.trim()) return;
    setIsProcessing(true);

    // Simulate processing
    setTimeout(() => {
      setIsProcessing(false);
      setActiveView('flashcards');
    }, 1000);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <Button variant="ghost" className="mb-6" onClick={() => setActiveView('dashboard')}>
        ← Back to Dashboard
      </Button>

      <div className="mb-8 text-center">
        <h1 className="mb-2 text-4xl font-bold text-zinc-900">Study Material Input Center</h1>
        <p className="text-xl text-zinc-600">Add everything you want to study - type, paste, upload files, or add from camera</p>
      </div>

      {/* Feature Reference Grid */}
      <Card className="mb-8 border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-green-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-blue-600" />
            All 9 Features Available Here
          </CardTitle>
          <CardDescription>Everything you can do with your study materials</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex items-start gap-3 rounded-lg bg-white p-4">
              <Brain className="h-5 w-5 text-blue-600" />
              <div>
                <p className="font-semibold text-sm">AI Flashcard Generator</p>
                <p className="text-xs text-zinc-600">Auto-generate from your content</p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-lg bg-white p-4">
              <Zap className="h-5 w-5 text-blue-600" />
              <div>
                <p className="font-semibold text-sm">Adaptive Quiz System</p>
                <p className="text-xs text-zinc-600">Questions match your level</p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-lg bg-white p-4">
              <MessageSquare className="h-5 w-5 text-blue-600" />
              <div>
                <p className="font-semibold text-sm">AI Tutor Explanations</p>
                <p className="text-xs text-zinc-600">Get detailed feedback</p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-lg bg-white p-4">
              <Calendar className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-semibold text-sm">Spaced Repetition</p>
                <p className="text-xs text-zinc-600">Optimal review scheduling</p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-lg bg-white p-4">
              <Target className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-semibold text-sm">Active Recall Practice</p>
                <p className="text-xs text-zinc-600">Test yourself effectively</p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-lg bg-white p-4">
              <BookOpen className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-semibold text-sm">Interleaving Method</p>
                <p className="text-xs text-zinc-600">Mix topics for better retention</p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-lg bg-white p-4">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              <div>
                <p className="font-semibold text-sm">Progress Tracking</p>
                <p className="text-xs text-zinc-600">See your improvement</p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-lg bg-white p-4">
              <Trophy className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="font-semibold text-sm">Gamification</p>
                <p className="text-xs text-zinc-600">Streaks & achievements</p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-lg bg-white p-4">
              <Award className="h-5 w-5 text-blue-600" />
              <div>
                <p className="font-semibold text-sm">Multi-Exam Support</p>
                <p className="text-xs text-zinc-600">SAT, ACT, AP & more</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Input Methods Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Type or Paste Text */}
        <Card className="border-2 border-blue-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              Type or Paste Text
            </CardTitle>
            <CardDescription>Copy from notes, textbooks, or type your study material</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <textarea
              className="min-h-[200px] w-full rounded-lg border-2 border-zinc-300 p-4 focus:border-blue-500 focus:outline-none"
              placeholder="Paste or type your study material here...

Examples:
• Chapter notes from your textbook
• Lecture notes
• Study guide content
• Definitions and concepts
• Practice problems

The AI will analyze this and create flashcards, quizzes, and study plans!"
              value={studyText}
              onChange={(e) => setStudyText(e.target.value)}
            />
            <div className="flex gap-2">
              <Button
                className="flex-1 bg-blue-600 hover:bg-blue-700"
                onClick={handleGenerateFromText}
                disabled={isProcessing || !studyText.trim()}
              >
                <Brain className="mr-2 h-4 w-4" />
                {isProcessing ? 'Generating...' : 'Generate Flashcards'}
              </Button>
              <Button
                className="flex-1 bg-green-600 hover:bg-green-700"
                onClick={() => setActiveView('quiz')}
                disabled={!studyText.trim()}
              >
                <Zap className="mr-2 h-4 w-4" />
                Create Quiz
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Upload Files */}
        <Card className="border-2 border-green-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5 text-green-600" />
              Upload Files
            </CardTitle>
            <CardDescription>Documents, PDFs, images, videos - we support it all</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border-2 border-dashed border-zinc-300 bg-zinc-50 p-8 text-center">
              <Upload className="mx-auto mb-4 h-12 w-12 text-zinc-400" />
              <p className="mb-2 font-semibold text-zinc-700">Drag and drop or click to browse</p>
              <p className="mb-4 text-sm text-zinc-500">
                Supported: PDF, DOC, DOCX, TXT, JPG, PNG, MP4, MOV
              </p>
              <input
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.mp4,.mov"
                className="hidden"
                id="file-upload"
                onChange={handleFileUpload}
              />
              <label htmlFor="file-upload">
                <Button variant="outline" className="cursor-pointer" asChild>
                  <span>
                    <File className="mr-2 h-4 w-4" />
                    Choose Files
                  </span>
                </Button>
              </label>
            </div>

            {uploadedFiles.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-semibold">Uploaded Files:</p>
                {uploadedFiles.map((file, idx) => (
                  <div key={idx} className="flex items-center gap-2 rounded-lg border bg-white p-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span className="text-sm">{file.name}</span>
                    <span className="ml-auto text-xs text-zinc-500">{(file.size / 1024).toFixed(1)} KB</span>
                  </div>
                ))}
              </div>
            )}
            {isProcessing && (
              <div className="rounded-lg bg-blue-50 p-3 text-center">
                <p className="text-sm text-blue-700">Processing files...</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Camera/Photo Upload */}
        <Card className="border-2 border-purple-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5 text-purple-600" />
              Add from Camera/Photos
            </CardTitle>
            <CardDescription>Snap pictures of notes, whiteboards, or textbook pages</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg border-2 border-dashed border-purple-300 bg-purple-50 p-6 text-center">
                <Camera className="mx-auto mb-3 h-10 w-10 text-purple-600" />
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  id="camera-capture"
                  onChange={handleFileUpload}
                />
                <label htmlFor="camera-capture">
                  <Button variant="outline" size="sm" className="cursor-pointer" asChild>
                    <span>Take Photo</span>
                  </Button>
                </label>
              </div>
              <div className="rounded-lg border-2 border-dashed border-purple-300 bg-purple-50 p-6 text-center">
                <ImageIcon className="mx-auto mb-3 h-10 w-10 text-purple-600" />
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  id="photo-upload"
                  onChange={handleFileUpload}
                />
                <label htmlFor="photo-upload">
                  <Button variant="outline" size="sm" className="cursor-pointer" asChild>
                    <span>Choose Photos</span>
                  </Button>
                </label>
              </div>
            </div>
            <div className="rounded-lg bg-purple-50 p-4">
              <p className="mb-2 text-sm font-semibold text-purple-900">Perfect for:</p>
              <ul className="space-y-1 text-xs text-purple-700">
                <li>• Handwritten notes</li>
                <li>• Whiteboard diagrams</li>
                <li>• Textbook pages</li>
                <li>• Homework problems</li>
                <li>• Study guides</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Video Upload */}
        <Card className="border-2 border-orange-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Video className="h-5 w-5 text-orange-600" />
              Upload Video Lectures
            </CardTitle>
            <CardDescription>Add recorded lectures or educational videos</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border-2 border-dashed border-orange-300 bg-orange-50 p-8 text-center">
              <Video className="mx-auto mb-4 h-12 w-12 text-orange-600" />
              <p className="mb-2 font-semibold text-zinc-700">Upload video files</p>
              <p className="mb-4 text-sm text-zinc-500">MP4, MOV, AVI - AI will transcribe & analyze</p>
              <input
                type="file"
                accept="video/*"
                multiple
                className="hidden"
                id="video-upload"
                onChange={handleFileUpload}
              />
              <label htmlFor="video-upload">
                <Button variant="outline" className="cursor-pointer" asChild>
                  <span>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Videos
                  </span>
                </Button>
              </label>
            </div>
            <div className="rounded-lg bg-orange-50 p-4">
              <p className="text-sm font-semibold text-orange-900 mb-2">AI will extract:</p>
              <ul className="space-y-1 text-xs text-orange-700">
                <li>• Key concepts & definitions</li>
                <li>• Important timestamps</li>
                <li>• Practice questions</li>
                <li>• Study flashcards</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Access to Features */}
      <Card className="mt-8 bg-gradient-to-r from-blue-600 to-green-600 text-white">
        <CardContent className="pt-6">
          <h3 className="mb-4 text-xl font-bold">Ready to Study?</h3>
          <div className="grid gap-3 md:grid-cols-4">
            <Button variant="secondary" onClick={() => setActiveView('flashcards')}>
              <Brain className="mr-2 h-4 w-4" />
              Flashcards
            </Button>
            <Button variant="secondary" onClick={() => setActiveView('quiz')}>
              <Zap className="mr-2 h-4 w-4" />
              Start Quiz
            </Button>
            <Button variant="secondary" onClick={() => setActiveView('tutor')}>
              <MessageSquare className="mr-2 h-4 w-4" />
              AI Tutor
            </Button>
            <Button variant="secondary" onClick={() => setActiveView('dashboard')}>
              <BarChart3 className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function AdminView({ setActiveView }: { setActiveView: (view: 'landing' | 'dashboard' | 'flashcards' | 'quiz' | 'tutor' | 'upload' | 'admin') => void }) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Button variant="ghost" className="mb-6" onClick={() => setActiveView('dashboard')}>
        ← Back to Dashboard
      </Button>

      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-zinc-900">Admin Dashboard</h1>
        <p className="text-zinc-600">Track and manage all user signups in real-time</p>
      </div>

      <AdminSignupTracker />
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <Card className="transition-shadow hover:shadow-lg">
      <CardContent className="pt-6">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
          {icon}
        </div>
        <h3 className="mb-2 text-lg font-semibold text-zinc-900">{title}</h3>
        <p className="text-sm text-zinc-600">{description}</p>
      </CardContent>
    </Card>
  );
}
