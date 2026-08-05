export interface IQuiz{
  id: string;
  title: string;
  questions: IQuestion[];
  createdAt: number;
  allowBacktrack: boolean;
}

export interface IQuestion{
  id: string;
  text: string;
  answers: IAnswer[];
  correctAnswerIds: string[];
  explanation?: string
}

export interface IAnswer{
  id: string;
  text: string;
}

export interface IQuestionResult{
  questionId: string;
  answerId: string;
  isCorrect: boolean;
}
export interface IQuizAttempt{
  id: string;
  quizId: string;
  questionResults: IQuestionResult[];
  start: number;
  finish: number;
}
