'use client';

import type { QuizQuestion } from '@/types';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Progress } from '../ui/progress';
import { CheckCircle, XCircle, RefreshCw } from 'lucide-react';

interface QuizViewProps {
  quiz: QuizQuestion[];
}

export function QuizView({ quiz }: QuizViewProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  if (!quiz || quiz.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6 text-center text-muted-foreground">
          <p>No quiz available for this topic.</p>
        </CardContent>
      </Card>
    );
  }
  
  const currentQuestion = quiz[currentQuestionIndex];
  const isCorrect = selectedAnswer === currentQuestion.answer;

  const handleNext = () => {
    if (isAnswered) {
      if (currentQuestionIndex < quiz.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedAnswer(null);
        setIsAnswered(false);
      } else {
        setIsFinished(true);
      }
    } else {
      setIsAnswered(true);
      if (isCorrect) {
        setScore(score + 1);
      }
    }
  };

  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setScore(0);
    setIsFinished(false);
  };
  
  if (isFinished) {
    const percentage = Math.round((score / quiz.length) * 100);
    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader className="text-center">
                <CardTitle className="font-headline text-2xl">Quiz Completed!</CardTitle>
                <CardDescription>You've finished the quiz. Here's how you did:</CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
                <p className="text-4xl font-bold text-primary">{percentage}%</p>
                <p className="text-muted-foreground">You answered {score} out of {quiz.length} questions correctly.</p>
                <Button onClick={restartQuiz}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Take Again
                </Button>
            </CardContent>
        </Card>
    )
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <Progress value={((currentQuestionIndex + 1) / quiz.length) * 100} className="mb-4" />
        <CardTitle className="font-headline">Question {currentQuestionIndex + 1}</CardTitle>
        <CardDescription className="text-lg pt-2">{currentQuestion.question}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <RadioGroup
          value={selectedAnswer ?? ''}
          onValueChange={setSelectedAnswer}
          disabled={isAnswered}
        >
          {currentQuestion.options.map((option, index) => {
            const isThisTheAnswer = option === currentQuestion.answer;
            const isThisSelected = option === selectedAnswer;
            
            return (
            <div key={index} className={cn(
                "flex items-center space-x-3 rounded-md border p-4 transition-all",
                 isAnswered && isThisTheAnswer && "border-green-500 bg-green-500/10",
                 isAnswered && isThisSelected && !isThisTheAnswer && "border-red-500 bg-red-500/10"
            )}>
              <RadioGroupItem value={option} id={`q${currentQuestionIndex}-o${index}`} />
              <Label htmlFor={`q${currentQuestionIndex}-o${index}`} className="flex-1 cursor-pointer">{option}</Label>
              {isAnswered && isThisTheAnswer && <CheckCircle className="h-5 w-5 text-green-500" />}
              {isAnswered && isThisSelected && !isThisTheAnswer && <XCircle className="h-5 w-5 text-red-500" />}
            </div>
            )
          })}
        </RadioGroup>
        <Button onClick={handleNext} disabled={!selectedAnswer} className="w-full">
          {isAnswered ? (currentQuestionIndex < quiz.length - 1 ? 'Next Question' : 'Finish Quiz') : 'Submit Answer'}
        </Button>
      </CardContent>
    </Card>
  );
}
