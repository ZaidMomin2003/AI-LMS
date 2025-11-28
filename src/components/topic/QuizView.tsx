'use client';

import type { QuizQuestion } from '@/types';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Progress } from '../ui/progress';
import { RefreshCw, ArrowLeft, ArrowRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { getUserDoc, updateUserDoc } from '@/services/firestore';

interface QuizViewProps {
  quiz: QuizQuestion[];
  topicId: string;
}

export function QuizView({ quiz, topicId }: QuizViewProps) {
  const { user } = useAuth();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [userAnswers, setUserAnswers] = useState<(string | null)[]>([]);
  const [isFinished, setIsFinished] = useState(false);

  const score = userAnswers.reduce((acc, answer, index) => {
    if (quiz[index] && answer === quiz[index].answer) {
      return acc + 1;
    }
    return acc;
  }, 0);

  useEffect(() => {
    const saveQuizStats = async () => {
      if (isFinished && user && quiz.length > 0) {
        try {
          const userData = await getUserDoc(user.uid);
          const existingStats = userData?.quizStats || {};
          const newStats = {
            ...existingStats,
            [topicId]: {
              score,
              totalQuestions: quiz.length,
              timestamp: new Date().toISOString(),
            },
          };
          await updateUserDoc(user.uid, { quizStats: newStats });
        } catch (error) {
          console.error("Failed to save quiz stats to Firestore", error);
        }
      }
    };
    saveQuizStats();
  }, [isFinished, score, quiz.length, topicId, user]);
  
  // Restore selected answer if user has already answered this question
  useEffect(() => {
    if (!isFinished) {
      setSelectedAnswer(userAnswers[currentQuestionIndex] || null);
    }
  }, [currentQuestionIndex, userAnswers, isFinished]);

  if (!quiz || quiz.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6 text-center text-muted-foreground">
          <p>No quiz available for this topic.</p>
        </CardContent>
      </Card>
    );
  }
  
  const handleNext = () => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = selectedAnswer;
    setUserAnswers(newAnswers);

    if (currentQuestionIndex < quiz.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setIsFinished(true);
    }
  };

  const handlePrevious = () => {
      if (currentQuestionIndex > 0) {
          setCurrentQuestionIndex(currentQuestionIndex - 1);
      }
  }

  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setUserAnswers([]);
    setIsFinished(false);
  };
  
  const currentQuestion = quiz[currentQuestionIndex];
  
  return (
    <Card className="w-full max-w-2xl mx-auto">
      {isFinished ? (
        <>
           <CardHeader className="text-center">
                <CardTitle className="font-headline text-2xl">Quiz Completed!</CardTitle>
                <CardDescription>You scored {score} out of {quiz.length} ({Math.round((score / quiz.length) * 100)}%)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                    {quiz.map((question, index) => {
                        const userAnswer = userAnswers[index];
                        const isCorrect = userAnswer === question.answer;
                        return (
                            <div key={index} className={cn("p-4 rounded-lg border", isCorrect ? "border-green-500/50 bg-green-500/10" : "border-red-500/50 bg-red-500/10")}>
                                <p className="font-semibold">{index + 1}. {question.question}</p>
                                <p className="text-sm mt-2">Your answer: <span className={cn("font-medium", !isCorrect && "text-red-400")}>{userAnswer || 'Not answered'}</span></p>
                                {!isCorrect && <p className="text-sm">Correct answer: <span className="font-medium text-green-400">{question.answer}</span></p>}
                                {question.explanation && (
                                    <div className="mt-2 pt-2 border-t border-border/50">
                                        <p className="text-sm text-muted-foreground"><span className="font-semibold">Explanation:</span> {question.explanation}</p>
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>
                <Button onClick={restartQuiz} className="w-full">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Take Again
                </Button>
            </CardContent>
        </>
      ) : (
        <>
          <CardHeader>
            <Progress value={((currentQuestionIndex + 1) / quiz.length) * 100} className="mb-4" />
            <div className="flex justify-between items-center">
                <CardTitle className="font-headline">Question {currentQuestionIndex + 1} of {quiz.length}</CardTitle>
                <div className="flex gap-2">
                    <Button variant="outline" size="icon" onClick={handlePrevious} disabled={currentQuestionIndex === 0}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={handleNext} disabled={!selectedAnswer && currentQuestionIndex === quiz.length - 1}>
                        <ArrowRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>
            <CardDescription className="text-lg pt-2">{currentQuestion.question}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <RadioGroup
              value={selectedAnswer ?? ''}
              onValueChange={setSelectedAnswer}
            >
              {currentQuestion.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-3 rounded-md border p-4 transition-all hover:bg-secondary/50">
                  <RadioGroupItem value={option} id={`q${currentQuestionIndex}-o${index}`} />
                  <Label htmlFor={`q${currentQuestionIndex}-o${index}`} className="flex-1 cursor-pointer">{option}</Label>
                </div>
              ))}
            </RadioGroup>
            <Button onClick={handleNext} disabled={!selectedAnswer} className="w-full">
              {currentQuestionIndex < quiz.length - 1 ? 'Next Question' : 'Finish Quiz'}
            </Button>
          </CardContent>
        </>
      )}
    </Card>
  );
}