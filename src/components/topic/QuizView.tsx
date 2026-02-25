'use client';

import type { QuizQuestion } from '@/types';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Progress } from '../ui/progress';
import { RefreshCw, ArrowLeft, ArrowRight, Brain } from 'lucide-react';
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
    <div className="w-full max-w-2xl mx-auto pb-20">
      {isFinished ? (
        <Card className="bg-card/40 backdrop-blur-xl border-border/10 shadow-2xl rounded-3xl overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
          <CardHeader className="text-center pb-8 pt-10">
            <div className="mx-auto w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4 border border-primary/20">
              <Brain className="w-10 h-10 text-primary" />
            </div>
            <CardTitle className="font-black text-3xl tracking-tighter uppercase mb-2">Quiz Synthesized</CardTitle>
            <div className="flex flex-col items-center">
              <span className="text-5xl font-black text-primary mb-2">{score}/{quiz.length}</span>
              <CardDescription className="text-base font-bold uppercase tracking-widest opacity-60">
                Performance Accuracy: {Math.round((score / quiz.length) * 100)}%
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-8 px-6 md:px-10 pb-10">
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 scrollbar-hide">
              {quiz.map((question, index) => {
                const userAnswer = userAnswers[index];
                const isCorrect = userAnswer === question.answer;
                return (
                  <div key={index} className={cn(
                    "p-5 rounded-2xl border transition-all duration-300",
                    isCorrect
                      ? "border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/10"
                      : "border-red-500/20 bg-red-500/5 hover:bg-red-500/10"
                  )}>
                    <div className="flex items-start gap-3">
                      <span className={cn(
                        "flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black border",
                        isCorrect ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400" : "bg-red-500/20 border-red-500/40 text-red-400"
                      )}>
                        {index + 1}
                      </span>
                      <p className="font-bold text-sm leading-tight pt-0.5">{question.question}</p>
                    </div>

                    <div className="mt-4 flex flex-col gap-2 pl-9">
                      <p className="text-xs">
                        <span className="opacity-40 font-bold uppercase tracking-wider mr-2">Your Transmission:</span>
                        <span className={cn("font-black", !isCorrect && "text-red-400")}>{userAnswer || 'Timed out/No Response'}</span>
                      </p>
                      {!isCorrect && (
                        <p className="text-xs">
                          <span className="opacity-40 font-bold uppercase tracking-wider mr-2">Correct Protocol:</span>
                          <span className="font-black text-emerald-400">{question.answer}</span>
                        </p>
                      )}
                      {question.explanation && (
                        <div className="mt-2 p-3 rounded-xl bg-background/40 border border-white/5">
                          <p className="text-[11px] leading-relaxed text-muted-foreground italic font-medium">
                            <span className="font-black uppercase tracking-widest text-[9px] not-italic mr-2 text-primary opacity-80">Intel:</span>
                            {question.explanation}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
            <Button onClick={restartQuiz} className="h-14 w-full rounded-2xl bg-gradient-to-br from-primary to-blue-600 text-white font-black uppercase tracking-widest text-[11px] shadow-xl shadow-primary/20 hover:scale-[1.01] active:scale-95 transition-all">
              <RefreshCw className="mr-2 h-4 w-4" />
              Re-initialize Assessment
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-card/40 backdrop-blur-xl border-border/10 shadow-2xl rounded-3xl overflow-hidden relative">
          {/* Progress bar at top */}
          <div className="w-full h-1 bg-white/5">
            <div className="h-1 bg-gradient-to-r from-primary to-blue-500 transition-all duration-500" style={{ width: `${((currentQuestionIndex + 1) / quiz.length) * 100}%` }} />
          </div>

          <CardHeader className="pb-4 pt-6">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-primary/10 text-primary border border-primary/20">
                  <Brain className="w-5 h-5" />
                </div>
                <div>
                  <CardTitle className="font-black text-xl tracking-tighter uppercase opacity-80">Neural Probe</CardTitle>
                  <CardDescription className="font-bold text-[10px] uppercase tracking-[0.2em] opacity-40">Section {currentQuestionIndex + 1} of {quiz.length}</CardDescription>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" onClick={handlePrevious} disabled={currentQuestionIndex === 0} className="rounded-xl border-white/5 bg-background/40 hover:bg-background/80 transition-all">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={handleNext} disabled={!selectedAnswer && currentQuestionIndex === quiz.length - 1} className="rounded-xl border-white/5 bg-background/40 hover:bg-background/80 transition-all">
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <p className="text-xl md:text-2xl font-bold tracking-tight text-foreground leading-tight">{currentQuestion.question}</p>
          </CardHeader>
          <CardContent className="space-y-8 px-6 md:px-10 pb-10">
            <RadioGroup
              value={selectedAnswer ?? ''}
              onValueChange={setSelectedAnswer}
              className="grid grid-cols-1 gap-4"
            >
              {currentQuestion.options.map((option, index) => (
                <div key={index}
                  className={cn(
                    "group relative flex items-center space-x-3 rounded-2xl border p-4 transition-all duration-300",
                    selectedAnswer === option
                      ? "bg-primary/20 border-primary shadow-[0_0_20px_rgba(var(--primary),0.1)]"
                      : "bg-background/20 border-white/5 hover:border-white/20 hover:bg-background/40"
                  )}
                  onClick={() => setSelectedAnswer(option)}
                >
                  <RadioGroupItem value={option} id={`q${currentQuestionIndex}-o${index}`} className="sr-only" />
                  <div className={cn(
                    "flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center font-black transition-all duration-300",
                    selectedAnswer === option ? "bg-primary text-white" : "bg-white/5 text-muted-foreground group-hover:bg-white/10"
                  )}>
                    {String.fromCharCode(65 + index)}
                  </div>
                  <Label htmlFor={`q${currentQuestionIndex}-o${index}`} className="flex-1 cursor-pointer font-bold text-base tracking-tight leading-tight pt-0.5">{option}</Label>
                </div>
              ))}
            </RadioGroup>

            <div className="pt-4">
              <Button onClick={handleNext} disabled={!selectedAnswer} className="h-14 w-full rounded-2xl bg-gradient-to-br from-primary to-blue-600 text-white font-black uppercase tracking-widest text-[11px] shadow-xl shadow-primary/20 hover:scale-[1.01] active:scale-95 transition-all">
                {currentQuestionIndex < quiz.length - 1 ? 'Execute Next Pulse' : 'Finalize Assessment'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}