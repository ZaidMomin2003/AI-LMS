import { BrainCircuit, FileText, MessageCircleQuestion } from 'lucide-react';
import { Card, CardContent, CardHeader } from '../ui/card';

export function Features() {
  return (
    <section id="features" className="py-20 sm:py-32">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-primary">Learn Faster</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl font-headline">
            A Toolkit for Total Understanding
          </p>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            ScholarAI deconstructs any topic into the core components you need to truly learn it, not just memorize it.
          </p>
        </div>
        
        {/* Feature 1: Notes */}
        <div className="mt-20 grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
            <div className="lg:pr-8">
                <div className="flex items-center gap-2">
                   <FileText className="h-8 w-8 text-primary" />
                   <h3 className="text-2xl font-headline font-bold">Comprehensive Study Notes</h3>
                </div>
                <p className="mt-4 text-lg text-muted-foreground">
                    Tired of dense, confusing material? Our AI reads through the noise and extracts what truly matters. It generates well-structured, easy-to-digest notes in Markdown format, complete with headings, lists, and key takeaways. It's the perfect foundation for any study session.
                </p>
            </div>
            <div className="flex items-center justify-center">
                <Card className="w-full max-w-md bg-card/50 p-4 shadow-lg border-2 border-primary/10">
                    <CardHeader className="p-2 border-b">
                        <p className="font-mono text-sm"># The Renaissance</p>
                    </CardHeader>
                    <CardContent className="p-2 space-y-2 text-sm text-muted-foreground">
                        <p className="font-mono">## Key Characteristics</p>
                        <p className="font-mono">* Rebirth of art & science</p>
                        <p className="font-mono">* Humanism focus</p>
                        <p className="font-mono">* Started in Florence, Italy</p>
                    </CardContent>
                </Card>
            </div>
        </div>

        {/* Feature 2: Flashcards */}
        <div className="mt-24 grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
             <div className="flex items-center justify-center lg:order-last">
                 <div className="relative w-full max-w-xs h-48">
                    <Card className="absolute top-0 left-0 w-full h-full p-6 flex flex-col justify-between transform -rotate-6 bg-card/50 shadow-lg border-2 border-accent/10">
                        <h4 className="font-headline text-xl">Humanism</h4>
                        <p className="text-right text-accent">Term</p>
                    </Card>
                    <Card className="absolute top-0 left-0 w-full h-full p-6 flex flex-col justify-between transform rotate-6 bg-card/80 shadow-xl border-2 border-accent/20 backdrop-blur-sm">
                        <p className="text-sm">An outlook attaching prime importance to human rather than divine or supernatural matters.</p>
                        <p className="text-right text-accent">Definition</p>
                    </Card>
                </div>
            </div>
            <div className="lg:pl-8">
                <div className="flex items-center gap-2">
                   <BrainCircuit className="h-8 w-8 text-accent" />
                   <h3 className="text-2xl font-headline font-bold">Interactive Flashcards</h3>
                </div>
                <p className="mt-4 text-lg text-muted-foreground">
                    Active recall is the secret to long-term retention. We automatically identify key terms and concepts from your topic and build a set of interactive flashcards. Test your memory, solidify your understanding, and master the vocabulary of your subject.
                </p>
            </div>
        </div>

        {/* Feature 3: Quizzes */}
        <div className="mt-24 grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
            <div className="lg:pr-8">
                <div className="flex items-center gap-2">
                   <MessageCircleQuestion className="h-8 w-8 text-primary" />
                   <h3 className="text-2xl font-headline font-bold">Challenging Quizzes</h3>
                </div>
                <p className="mt-4 text-lg text-muted-foreground">
                    Put your knowledge to the test. ScholarAI generates custom multiple-choice quizzes that challenge you on the most important aspects of your topic. Get instant feedback on your answers to identify weak spots and confirm your mastery.
                </p>
            </div>
            <div className="flex items-center justify-center">
                 <Card className="w-full max-w-md bg-card/50 p-4 shadow-lg border-2 border-primary/10">
                    <CardContent className="p-2 space-y-3">
                        <p className="font-semibold">Who wrote "The Prince"?</p>
                        <RadioOption text="Leonardo da Vinci" />
                        <RadioOption text="Niccolò Machiavelli" selected={true}/>
                        <RadioOption text="Galileo Galilei" />
                        <RadioOption text="Dante Alighieri" />
                    </CardContent>
                </Card>
            </div>
        </div>
      </div>
    </section>
  );
}

const RadioOption = ({text, selected = false}: {text: string, selected?: boolean}) => (
    <div className={`flex items-center space-x-3 rounded-md border p-3 transition-all ${selected ? "border-primary bg-primary/10" : "bg-background/50"}`}>
        <div className={`h-4 w-4 rounded-full border-2 flex items-center justify-center ${selected ? "border-primary" : "border-muted-foreground"}`}>
            {selected && <div className="h-2 w-2 rounded-full bg-primary"/>}
        </div>
        <p className="flex-1">{text}</p>
    </div>
)
