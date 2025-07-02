'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { ClipboardCopy, Download } from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';

interface NotesViewProps {
  notes: string;
}

export function NotesView({ notes }: NotesViewProps) {
  const { toast } = useToast();

  const handleCopy = () => {
    navigator.clipboard.writeText(notes);
    toast({
      title: 'Copied to clipboard!',
      description: 'The study notes have been copied.',
    });
  };

  const handleDownload = () => {
    const blob = new Blob([notes], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'study-notes.md';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (!notes) {
    return (
      <Card>
        <CardContent className="pt-6 text-center text-muted-foreground">
          <p>No notes available for this topic.</p>
        </CardContent>
      </Card>
    );
  }

  // A simple markdown-to-html-like renderer
  const renderNotes = (text: string) => {
    return text.split('\n').map((line, index) => {
      if (line.startsWith('### ')) {
        return <h3 key={index} className="text-lg font-headline mt-4 mb-2">{line.substring(4)}</h3>;
      }
      if (line.startsWith('## ')) {
        return <h2 key={index} className="text-xl font-headline mt-6 mb-3 border-b pb-2">{line.substring(3)}</h2>;
      }
      if (line.startsWith('# ')) {
        return <h1 key={index} className="text-2xl font-headline mt-8 mb-4 border-b pb-2">{line.substring(2)}</h1>;
      }
      if (line.startsWith('* ')) {
        return <li key={index} className="ml-4 list-disc">{line.substring(2)}</li>;
      }
      if (line.trim() === '') {
        return <br key={index} />;
      }
      return <p key={index} className="my-1">{line}</p>;
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="font-headline">Study Notes</CardTitle>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={handleCopy}>
            <ClipboardCopy className="h-4 w-4" />
            <span className="sr-only">Copy</span>
          </Button>
          <Button variant="outline" size="icon" onClick={handleDownload}>
            <Download className="h-4 w-4" />
            <span className="sr-only">Download</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px] w-full pr-4">
          <div className="prose prose-invert max-w-none">
            {renderNotes(notes)}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
