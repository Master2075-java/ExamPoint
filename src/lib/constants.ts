// Brand Colors
export const BRAND_COLORS = {
  primary: {
    main: '#1e40af', // Deep blue for trust/intelligence
    light: '#3b82f6',
    dark: '#1e3a8a',
  },
  accent: {
    main: '#22c55e', // Bright green for growth/success
    light: '#4ade80',
    dark: '#16a34a',
  },
  background: {
    main: '#ffffff',
    secondary: '#f4f4f5',
    tertiary: '#e4e4e7',
  },
  text: {
    primary: '#18181b',
    secondary: '#52525b',
    muted: '#a1a1aa',
  },
};

// Subscription Tiers
export const SUBSCRIPTION_TIERS = {
  FREE: {
    name: 'Free',
    price: 0,
    currency: '$',
    interval: 'month',
    features: [
      '3 AI Flashcard Sets Per Month',
      '5 Quiz Questions Per Day',
      'Basic Progress Tracking',
      'Study Streak Counter',
      'Limited to 1 Subject at a Time',
      'Ads Supported',
    ],
  },
  BASIC: {
    name: 'Basic',
    price: 7,
    currency: '$',
    interval: 'month',
    features: [
      '50 AI Flashcard Sets Per Month',
      '100 Quiz Questions Per Day',
      'AI Tutor Sessions (20 Questions/Day)',
      'Spaced Repetition Algorithm',
      'Progress Tracking Dashboard',
      'Multi-Exam Support (SAT, ACT, AP)',
      'Study Streak Tracking & Badges',
      'Up to 5 Active Subjects',
      'Upload Study Materials (PDF, Images)',
      'Ad-Free Experience',
    ],
  },
  ELITE: {
    name: 'Elite',
    price: 15,
    currency: '$',
    interval: 'month',
    features: [
      'Unlimited AI Flashcard Generation',
      'Unlimited Quiz Questions',
      'Unlimited AI Tutor Chat Sessions',
      'Priority Flashcard Generation (2x Faster)',
      'Advanced Analytics Dashboard',
      'Parent Dashboard & Weekly Reports',
      'Personalized Mastery Pathways',
      'Premium UI Themes',
      'Downloadable Study Pack PDFs',
      'Score Prediction & Target Planning',
      'Unlimited Active Subjects',
      'Video Lecture Upload & Analysis',
    ],
  },
} as const;

// Exam Types
export const EXAM_TYPES = {
  SAT: 'SAT',
  ACT: 'ACT',
  AP: 'AP',
  SCHOOL: 'School',
} as const;

// Example Content
export const EXAMPLE_FLASHCARDS = [
  {
    question: 'What is the Pythagorean theorem?',
    answer: 'a² + b² = c² (in a right triangle, the square of the hypotenuse equals the sum of squares of the other two sides)',
  },
  {
    question: 'What is photosynthesis?',
    answer: 'The process by which plants use sunlight, water, and carbon dioxide to create oxygen and energy in the form of sugar',
  },
  {
    question: 'What does DNA stand for?',
    answer: 'Deoxyribonucleic Acid',
  },
];

export const EXAMPLE_QUIZ_QUESTIONS = [
  {
    questionText: 'What is the powerhouse of the cell?',
    questionType: 'multiple-choice' as const,
    options: ['Nucleus', 'Ribosome', 'Mitochondria', 'Chloroplast'],
    correctAnswer: 'Mitochondria',
    explanation: 'Mitochondria are called the powerhouse of the cell because they produce ATP, the energy currency used by cells.',
  },
  {
    questionText: 'The American Revolution ended in which year?',
    questionType: 'short-answer' as const,
    correctAnswer: '1783',
    explanation: 'The Treaty of Paris was signed in 1783, officially ending the American Revolutionary War.',
  },
];

export const EXAMPLE_TUTOR_EXPLANATION = {
  incorrect: "You chose B (Nucleus), but the correct answer is C (Mitochondria). The nucleus is actually the control center of the cell that contains DNA, but it doesn't produce energy. Mitochondria are the organelles responsible for cellular respiration and ATP production, which is why they're called the powerhouse of the cell. Think of mitochondria as tiny power plants inside each cell!",
  correct: "Excellent! You're absolutely right - Mitochondria are the powerhouse of the cell. You clearly understand that mitochondria produce ATP through cellular respiration. This energy currency is essential for all cellular processes. Great job!",
};

// Learning Techniques Explanations
export const LEARNING_TECHNIQUES = {
  spacedRepetition: {
    title: 'Spaced Repetition',
    description: 'Review material at increasing time intervals (1 day, 3 days, 7 days, etc.) to move knowledge from short-term to long-term memory.',
    studentExplanation: 'Instead of cramming everything at once, we help you review topics at just the right time - right when you\'re about to forget them. This locks information into your long-term memory.',
  },
  activeRecall: {
    title: 'Active Recall',
    description: 'Test yourself on material rather than passively re-reading. Forces your brain to retrieve information, strengthening neural pathways.',
    studentExplanation: 'We make you actively pull answers from your brain instead of just reading notes. This "mental workout" makes memories much stronger and easier to remember during tests.',
  },
  interleaving: {
    title: 'Interleaving',
    description: 'Mix different subjects and topics in study sessions rather than focusing on one topic for hours (blocking).',
    studentExplanation: 'We mix up different subjects and topics in your study sessions. Your brain works harder to distinguish between concepts, which helps you understand them better and remember them longer.',
  },
  retrievalPractice: {
    title: 'Retrieval Practice',
    description: 'Repeatedly practice recalling information through quizzes and flashcards to strengthen memory consolidation.',
    studentExplanation: 'The more you practice pulling information out of your brain, the easier it becomes. Our quizzes and flashcards give you tons of practice retrieving what you\'ve learned.',
  },
};

// Testimonials
export const TESTIMONIALS = [
  {
    name: 'Sarah M.',
    role: 'High School Junior',
    exam: 'SAT',
    improvement: '+180 points',
    quote: 'I went from 1200 to 1380 on my SAT in just 3 months using ExamPoint. The spaced repetition really works - I actually remember everything now!',
    avatar: 'SM',
  },
  {
    name: 'James T.',
    role: 'High School Senior',
    exam: 'AP Biology',
    improvement: '3 to 5',
    quote: 'The AI tutor explanations are incredible. It\'s like having a personal tutor available 24/7. Raised my AP Bio score from a 3 to a 5!',
    avatar: 'JT',
  },
  {
    name: 'Emily R.',
    role: 'High School Sophomore',
    exam: 'ACT',
    improvement: '+5 points',
    quote: 'ExamPoint made studying actually fun. The gamification and streaks kept me motivated, and my ACT score jumped from 24 to 29!',
    avatar: 'ER',
  },
  {
    name: 'Michael K.',
    role: 'High School Junior',
    exam: 'AP Calculus',
    improvement: '2 to 4',
    quote: 'I was struggling with calculus until I started using ExamPoint. The adaptive quizzes identified exactly what I needed to work on.',
    avatar: 'MK',
  },
  {
    name: 'Lisa P.',
    role: 'High School Senior',
    exam: 'SAT',
    improvement: '+220 points',
    quote: 'My parents got me the Elite tier and the parent dashboard kept them updated. I went from 1180 to 1400 and got into my dream school!',
    avatar: 'LP',
  },
];

// FAQ Items
export const FAQ_ITEMS = [
  {
    question: 'What exams does ExamPoint support?',
    answer: 'ExamPoint supports SAT, ACT, all AP exams, and general school subjects including Math, Science, History, English, and more. You can create separate study tracks for each exam type.',
  },
  {
    question: 'How does the AI generate flashcards?',
    answer: 'Simply input any topic or upload your study material, and our AI automatically creates high-quality question-and-answer flashcards. The AI analyzes the content and generates targeted questions that help you learn effectively.',
  },
  {
    question: 'What\'s the difference between Free, Basic, and Elite?',
    answer: 'Free ($0) gives you limited access to try the platform with 3 flashcard sets/month and 5 quiz questions/day. Basic ($7/month) includes 50 flashcard sets/month, 100 quiz questions/day, 20 AI tutor questions/day, and access to 5 subjects - perfect for regular studying. Elite ($15/month) unlocks unlimited everything: flashcards, quizzes, AI tutor, advanced analytics, parent dashboard, and premium features.',
  },
  {
    question: 'How does spaced repetition work?',
    answer: 'Our algorithm schedules review sessions at optimal intervals (like 1 day, 3 days, 7 days, etc.). This helps move information from short-term to long-term memory. You review material right when you\'re about to forget it, which strengthens retention.',
  },
  {
    question: 'Can I get a refund if it doesn\'t work for me?',
    answer: 'Yes! We offer a 14-day money-back guarantee. If you\'re not satisfied with ExamPoint for any reason, just contact us within 14 days of signing up for a full refund.',
  },
  {
    question: 'Is there a free trial?',
    answer: 'Yes! We have a completely free tier that lets you try out ExamPoint with 3 flashcard sets per month and 5 quiz questions per day. No credit card required. When you\'re ready for more, upgrade to Basic ($7) or Elite ($15).',
  },
  {
    question: 'How much time should I spend studying each day?',
    answer: 'We recommend 20-30 minutes per day. Our platform is designed for consistent, focused study sessions rather than long cramming sessions. The spaced repetition algorithm works best with regular daily practice.',
  },
  {
    question: 'Will this really improve my test scores?',
    answer: 'Yes! Our methods are based on proven cognitive science research. Spaced repetition, active recall, and interleaving are scientifically proven to improve retention and test performance. Many students see score improvements within 2-3 months of consistent use.',
  },
];
