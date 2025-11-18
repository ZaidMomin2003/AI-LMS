
import { Header } from '@/components/landing/Header';
import { Footer } from '@/components/landing/Footer';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { BookOpen } from 'lucide-react';
import Link from 'next/link';
import { storiesData } from '@/lib/stories-data';

export default function StoriesPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-grow">
        {/* --- Hero Section --- */}
        <section className="relative overflow-hidden bg-secondary/30 py-20 lg:py-32">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
                <div className="mx-auto bg-primary/10 text-primary p-4 rounded-full w-fit mb-6">
                    <BookOpen className="w-10 h-10" />
                </div>
                <h1 className="font-headline mt-4 text-4xl font-bold text-foreground sm:text-6xl">
                    Journeys to Success
                </h1>
                <p className="mt-6 text-lg text-muted-foreground">
                    Discover how students and parents across the globe are using our AI-powered tools to transform their learning, conquer exams, and achieve their academic dreams.
                </p>
            </div>
          </div>
        </section>

        {/* --- Stories Grid --- */}
        <section className="py-20 sm:py-24">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {storiesData.map((story) => (
                <div key={story.title} className="group relative flex flex-col overflow-hidden rounded-2xl border bg-card shadow-sm transition-shadow hover:shadow-lg">
                  <div className="aspect-w-3 aspect-h-2">
                    <Image
                      className="w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      src={story.image.src}
                      alt={story.title}
                      width={400}
                      height={300}
                      data-ai-hint={story.image.hint}
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <div className="mb-4">
                        <Badge variant="secondary">{story.category}</Badge>
                    </div>
                    <h3 className="text-lg font-bold font-headline text-foreground">
                      <Link href={`/stories/${story.slug}`} className="stretched-link">
                        {story.title}
                      </Link>
                    </h3>
                    <p className="mt-3 text-sm text-muted-foreground line-clamp-3">{story.excerpt}</p>
                    <div className="mt-6 flex items-center border-t pt-4">
                      <div className="flex-shrink-0">
                        <span className="text-sm font-medium text-foreground">{story.author}</span>
                        <p className="text-xs text-muted-foreground">{story.location}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
