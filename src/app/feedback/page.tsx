
'use client';

import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Header } from '@/components/landing/Header';
import { Footer } from '@/components/landing/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, ArrowRight, CheckCircle, Lightbulb, Loader2, Send } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const questions = [
  {
    id: 'most-loved-feature',
    title: "What's the one feature you couldn't live without?",
    type: 'radio',
    options: ['AI Notes & Summaries', 'Flashcards', 'Quizzes', 'AI Study Roadmap', 'WisdomGPT Chat'],
  },
  {
    id: 'founder-priority',
    title: 'If you were the founder of Wisdom, what would be your #1 priority for the next month?',
    type: 'radio',
    options: ['Adding more AI features', 'Improving mobile experience', 'Making the UI faster', 'Adding more subjects/integrations', 'Marketing and growth'],
  },
  {
    id: 'magical-moment',
    title: 'Which part of the app feels the most magical or "wow!"?',
    type: 'radio',
    options: ['Seeing notes generated instantly', 'Getting an answer from a photo', 'Chatting with WisdomGPT', 'My personalized study roadmap', 'The design and animations'],
  },
  {
    id: 'missing-feature',
    title: "What's one thing you wish the app did that it currently doesn't?",
    type: 'textarea',
    placeholder: "e.g., 'I wish I could talk to my PDF documents...'",
  },
  {
    id: 'final-thoughts',
    title: 'Have any other ideas or feedback for us?',
    type: 'textarea',
    placeholder: 'Anything goes! We appreciate your honesty.',
  },
];

type Answers = Record<string, string>;

export default function FeedbackPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const { toast } = useToast();

  const progress = ((currentStep + 1) / (questions.length + 1)) * 100;
  const currentQuestion = questions[currentStep];

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleAnswerChange = (id: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    // In a real app, you'd send this data to your backend
    console.log('Feedback submitted:', answers);
    setTimeout(() => {
      setIsLoading(false);
      setIsFinished(true);
      toast({
        title: 'Feedback Received!',
        description: "Thank you for helping us make Wisdom better.",
      });
    }, 1500);
  };
  
  const currentAnswer = answers[currentQuestion?.id] || '';

  const renderContent = () => {
    if (isFinished) {
      return (
        <div className="text-center space-y-4">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto animate-pulse" />
            <h2 className="text-2xl font-bold font-headline">Thank You!</h2>
            <p className="text-muted-foreground">Your feedback is invaluable and helps us build a better learning experience for everyone.</p>
        </div>
      );
    }
    
    if (isLoading) {
      return (
        <div className="text-center space-y-4">
            <Loader2 className="w-16 h-16 text-primary mx-auto animate-spin" />
            <h2 className="text-2xl font-bold font-headline">Submitting Feedback...</h2>
        </div>
      );
    }

    return (
        <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              <div className="flex items-center gap-2 mb-4">
                 <Lightbulb className="w-5 h-5 text-primary" />
                 <p className="text-sm font-semibold text-primary">Question {currentStep + 1} of {questions.length}</p>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold font-headline mb-8">{currentQuestion.title}</h2>

              {currentQuestion.type === 'radio' && (
                <RadioGroup
                  value={currentAnswer}
                  onValueChange={(value) => {
                      handleAnswerChange(currentQuestion.id, value);
                      setTimeout(handleNext, 200);
                  }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  {currentQuestion.options?.map((option, index) => (
                    <Card
                      key={option}
                      className={cn(
                        'cursor-pointer transition-all hover:border-primary/50',
                        currentAnswer === option && 'border-primary ring-2 ring-primary ring-offset-2 ring-offset-background'
                      )}
                    >
                      <CardContent className="p-4">
                        <Label htmlFor={`${currentQuestion.id}-${index}`} className="flex items-center gap-4 cursor-pointer">
                          <RadioGroupItem value={option} id={`${currentQuestion.id}-${index}`} className="sr-only" />
                          <span className="font-medium">{option}</span>
                        </Label>
                      </CardContent>
                    </Card>
                  ))}
                </RadioGroup>
              )}
              {currentQuestion.type === 'textarea' && (
                <Textarea
                  value={currentAnswer}
                  onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                  placeholder={currentQuestion.placeholder}
                  className="min-h-[120px] text-lg p-4"
                />
              )}
            </motion.div>
        </AnimatePresence>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-3xl space-y-8">
            <Progress value={progress} className="h-2" />
            <div className="min-h-[300px] flex items-center justify-center">
                {renderContent()}
            </div>
             {!isFinished && !isLoading && (
              <div className="flex items-center justify-center gap-4">
                <Button variant="ghost" onClick={handleBack} disabled={currentStep === 0}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
                <Button onClick={handleNext} disabled={!currentAnswer}>
                   {currentStep === questions.length - 1 ? (
                       <><Send className="mr-2 h-4 w-4"/> Submit</>
                   ) : (
                       <><ArrowRight className="mr-2 h-4 w-4"/> Next</>
                   )}
                </Button>
              </div>
            )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
