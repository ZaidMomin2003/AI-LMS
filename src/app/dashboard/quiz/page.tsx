
'use client';

import { AppLayout } from '@/components/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, Youtube, FileText, List, CheckCircle } from 'lucide-react';

const ComingSoonFeature = ({ icon, text }: { icon: React.ReactNode, text: string }) => (
    <li className="flex items-start gap-3">
        <div className="bg-primary/10 text-primary rounded-full p-1.5 mt-1">
            {icon}
        </div>
        <span className="text-muted-foreground flex-1">{text}</span>
    </li>
);

export default function CustomQuizPage() {
  return (
    <AppLayout>
      <div className="flex-1 flex items-center justify-center p-4 md:p-8">
        <Card className="max-w-2xl w-full text-center shadow-lg border-primary/20">
          <CardHeader>
            <div className="mx-auto bg-primary/10 text-primary p-4 rounded-full w-fit mb-4">
              <Lock className="w-8 h-8" />
            </div>
            <CardTitle className="font-headline text-3xl">Advanced Quiz Generator Coming Soon!</CardTitle>
            <CardDescription className="text-lg pt-2">
              We're building a revolutionary tool to supercharge your study sessions.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-left space-y-6">
            <div>
                <h3 className="font-semibold text-center mb-4">You'll soon be able to:</h3>
                <ul className="space-y-4 max-w-md mx-auto">
                    <ComingSoonFeature icon={<Youtube size={20} />} text="Generate quizzes from YouTube video links." />
                    <ComingSoonFeature icon={<FileText size={20} />} text="Upload your own PDF & PPT documents." />
                    <ComingSoonFeature icon={<List size={20} />} text="Paste a syllabus or just type in topic names." />
                </ul>
            </div>
            <div className="border-t pt-6">
                <h3 className="font-semibold text-center mb-4">To generate question types like:</h3>
                <div className="flex justify-center flex-wrap gap-3">
                    <div className="flex items-center gap-2 text-sm"><CheckCircle className="w-4 h-4 text-green-500" />Multiple Choice</div>
                    <div className="flex items-center gap-2 text-sm"><CheckCircle className="w-4 h-4 text-green-500" />True/False</div>
                    <div className="flex items-center gap-2 text-sm"><CheckCircle className="w-4 h-4 text-green-500" />Fill in the Blanks</div>
                    <div className="flex items-center gap-2 text-sm"><CheckCircle className="w-4 h-4 text-green-500" />Matching</div>
                </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
