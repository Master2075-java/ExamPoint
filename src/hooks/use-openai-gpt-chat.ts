import { useMutation, type UseMutationResult } from '@tanstack/react-query';
import { createChatCompletion } from '@/sdk/api-clients/OpenAIGPTChat';

// ============================================================================
// Type Definitions
// ============================================================================

export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export type QuestionType = 'multiple-choice' | 'true-false' | 'short-answer';

export interface Flashcard {
  question: string;
  answer: string;
}

export interface QuizQuestion {
  questionText: string;
  questionType: QuestionType;
  options?: string[];
  correctAnswer: string;
  explanation?: string;
}

// ============================================================================
// Generate Flashcards Hook
// ============================================================================

export interface GenerateFlashcardsInput {
  topic?: string;
  content?: string;
  count?: number;
}

export interface GenerateFlashcardsResponse {
  flashcards: Flashcard[];
}

/**
 * Generate AI-powered flashcards from a topic or study material.
 *
 * @example
 * const { mutate, isPending, data } = useGenerateFlashcardsMutation();
 *
 * mutate({
 *   topic: "Photosynthesis",
 *   count: 5
 * });
 */
export function useGenerateFlashcardsMutation(): UseMutationResult<
  GenerateFlashcardsResponse,
  Error,
  GenerateFlashcardsInput
> {
  return useMutation({
    mutationFn: async (input: GenerateFlashcardsInput): Promise<GenerateFlashcardsResponse> => {
      if (!input.topic && !input.content) {
        throw new Error('Either topic or content is required');
      }

      const count = input.count || 5;
      const sourceText = input.content || input.topic || '';

      const systemPrompt = `You are an educational AI that creates high-quality flashcards for studying.
Generate exactly ${count} flashcards based on the provided material.
Return ONLY a valid JSON array of objects, each with "question" and "answer" string properties.
Do not include any markdown formatting, code blocks, or additional text.
Example format: [{"question":"Q1","answer":"A1"},{"question":"Q2","answer":"A2"}]`;

      const userPrompt = input.content
        ? `Create ${count} flashcards from this study material:\n\n${sourceText}`
        : `Create ${count} flashcards about: ${sourceText}`;

      const response = await createChatCompletion({
        body: {
          model: 'MaaS_4.1',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
        },
        headers: {
          'X-CREAO-API-NAME': 'OpenAIGPTChat',
          'X-CREAO-API-PATH': '/v1/ai/zWwyutGgvEGWwzSa/chat/completions',
          'X-CREAO-API-ID': '688a0b64dc79a2533460892c',
        },
      });

      if (response.error) {
        throw new Error('Failed to generate flashcards');
      }

      if (!response.data) {
        throw new Error('No response data received');
      }

      const content = response.data.choices?.[0]?.message?.content;
      if (!content) {
        throw new Error('No content in AI response');
      }

      try {
        const flashcards = JSON.parse(content) as Flashcard[];

        if (!Array.isArray(flashcards) || flashcards.length === 0) {
          throw new Error('Invalid flashcard format');
        }

        return { flashcards };
      } catch (parseError) {
        throw new Error('Failed to parse AI response as flashcards');
      }
    },
  });
}

// ============================================================================
// Generate Quiz Questions Hook
// ============================================================================

export interface GenerateQuizQuestionsInput {
  subject: string;
  topic: string;
  difficulty: DifficultyLevel;
  count?: number;
  questionTypes?: QuestionType[];
}

export interface GenerateQuizQuestionsResponse {
  questions: QuizQuestion[];
}

/**
 * Generate adaptive quiz questions based on subject, topic, and difficulty.
 *
 * @example
 * const { mutate, isPending, data } = useGenerateQuizQuestionsMutation();
 *
 * mutate({
 *   subject: "Biology",
 *   topic: "Cell Structure",
 *   difficulty: "medium",
 *   count: 10
 * });
 */
export function useGenerateQuizQuestionsMutation(): UseMutationResult<
  GenerateQuizQuestionsResponse,
  Error,
  GenerateQuizQuestionsInput
> {
  return useMutation({
    mutationFn: async (input: GenerateQuizQuestionsInput): Promise<GenerateQuizQuestionsResponse> => {
      if (!input.subject || !input.topic) {
        throw new Error('Subject and topic are required');
      }

      if (!['easy', 'medium', 'hard'].includes(input.difficulty)) {
        throw new Error('Difficulty must be easy, medium, or hard');
      }

      const count = input.count || 5;
      const questionTypes = input.questionTypes || ['multiple-choice', 'true-false'];

      const systemPrompt = `You are an educational AI that creates quiz questions.
Generate exactly ${count} quiz questions for ${input.difficulty} difficulty level.
Question types: ${questionTypes.join(', ')}.
Return ONLY a valid JSON array of objects with these properties:
- questionText: string
- questionType: "${questionTypes.join('" | "')}"
- options: string[] (only for multiple-choice, with 4 options)
- correctAnswer: string
- explanation: string (brief explanation)

Do not include markdown formatting or code blocks.
Example: [{"questionText":"Q","questionType":"multiple-choice","options":["A","B","C","D"],"correctAnswer":"A","explanation":"Why A is correct"}]`;

      const userPrompt = `Create ${count} ${input.difficulty} difficulty quiz questions about ${input.topic} in ${input.subject}.`;

      const response = await createChatCompletion({
        body: {
          model: 'MaaS_4.1',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
        },
        headers: {
          'X-CREAO-API-NAME': 'OpenAIGPTChat',
          'X-CREAO-API-PATH': '/v1/ai/zWwyutGgvEGWwzSa/chat/completions',
          'X-CREAO-API-ID': '688a0b64dc79a2533460892c',
        },
      });

      if (response.error) {
        throw new Error('Failed to generate quiz questions');
      }

      if (!response.data) {
        throw new Error('No response data received');
      }

      const content = response.data.choices?.[0]?.message?.content;
      if (!content) {
        throw new Error('No content in AI response');
      }

      try {
        const questions = JSON.parse(content) as QuizQuestion[];

        if (!Array.isArray(questions) || questions.length === 0) {
          throw new Error('Invalid quiz questions format');
        }

        return { questions };
      } catch (parseError) {
        throw new Error('Failed to parse AI response as quiz questions');
      }
    },
  });
}

// ============================================================================
// Generate Tutor Explanation Hook
// ============================================================================

export interface GenerateTutorExplanationInput {
  questionText: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  context?: string;
}

export interface GenerateTutorExplanationResponse {
  explanation: string;
  keyConcepts?: string[];
  additionalResources?: string[];
}

/**
 * Generate detailed AI tutor explanations for quiz answers.
 * Provides educational feedback explaining why an answer is correct or incorrect.
 *
 * @example
 * const { mutate, isPending, data } = useGenerateTutorExplanationMutation();
 *
 * mutate({
 *   questionText: "What is the powerhouse of the cell?",
 *   userAnswer: "Nucleus",
 *   correctAnswer: "Mitochondria",
 *   isCorrect: false
 * });
 */
export function useGenerateTutorExplanationMutation(): UseMutationResult<
  GenerateTutorExplanationResponse,
  Error,
  GenerateTutorExplanationInput
> {
  return useMutation({
    mutationFn: async (input: GenerateTutorExplanationInput): Promise<GenerateTutorExplanationResponse> => {
      if (!input.questionText || !input.userAnswer || !input.correctAnswer) {
        throw new Error('Question text, user answer, and correct answer are required');
      }

      const systemPrompt = `You are a patient, encouraging AI tutor.
Provide a clear, educational explanation about the answer.
Return ONLY a valid JSON object with these properties:
- explanation: string (2-3 sentences explaining the concept and why the answer is correct/incorrect)
- keyConcepts: string[] (2-4 key concepts related to this question)
- additionalResources: string[] (optional, 1-2 study tips)

Do not include markdown formatting or code blocks.
Example: {"explanation":"...","keyConcepts":["concept1","concept2"],"additionalResources":["tip1"]}`;

      const feedbackType = input.isCorrect ? 'correct' : 'incorrect';
      const userPrompt = input.isCorrect
        ? `The student answered correctly!
Question: ${input.questionText}
Their answer: ${input.userAnswer}
Correct answer: ${input.correctAnswer}

Explain why this answer is correct and reinforce the key concepts.${input.context ? `\n\nContext: ${input.context}` : ''}`
        : `The student answered incorrectly.
Question: ${input.questionText}
Their answer: ${input.userAnswer}
Correct answer: ${input.correctAnswer}

Gently explain what the correct answer is and why, and help them understand the concept better.${input.context ? `\n\nContext: ${input.context}` : ''}`;

      const response = await createChatCompletion({
        body: {
          model: 'MaaS_4.1',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
        },
        headers: {
          'X-CREAO-API-NAME': 'OpenAIGPTChat',
          'X-CREAO-API-PATH': '/v1/ai/zWwyutGgvEGWwzSa/chat/completions',
          'X-CREAO-API-ID': '688a0b64dc79a2533460892c',
        },
      });

      if (response.error) {
        throw new Error('Failed to generate tutor explanation');
      }

      if (!response.data) {
        throw new Error('No response data received');
      }

      const content = response.data.choices?.[0]?.message?.content;
      if (!content) {
        throw new Error('No content in AI response');
      }

      try {
        const result = JSON.parse(content) as GenerateTutorExplanationResponse;

        if (!result.explanation || typeof result.explanation !== 'string') {
          throw new Error('Invalid explanation format');
        }

        return result;
      } catch (parseError) {
        throw new Error('Failed to parse AI response as explanation');
      }
    },
  });
}
