
'use client';

import { notFound } from 'next/navigation';
import { Header } from '@/components/landing/Header';
import { Footer } from '@/components/landing/Footer';
import { getStoryBySlug } from '@/lib/stories-data';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin } from 'lucide-react';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';

export default function StoryPage({ params }: { params: { slug: string } }) {
    const slug = params.slug || '';
    const story = getStoryBySlug(slug);

    if (!story) {
        notFound();
    }

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <Header />
            <main className="flex-grow">
                <article className="container mx-auto px-4 py-12 md:py-20 max-w-4xl">
                    {/* --- Story Header --- */}
                    <header className="mb-12 text-center">
                        <Badge variant="secondary" className="mb-4">{story.category}</Badge>
                        <h1 className="text-4xl md:text-5xl font-headline font-bold text-foreground">
                            {story.title}
                        </h1>
                        <div className="mt-6 flex items-center justify-center gap-6 text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src={story.authorImage} alt={story.author} />
                                    <AvatarFallback>{story.author.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <span className="font-medium">{story.author}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4" />
                                <span>{story.location}</span>
                            </div>
                        </div>
                    </header>

                    {/* --- Feature Image --- */}
                    <div className="relative mb-12 aspect-video w-full overflow-hidden rounded-2xl shadow-lg">
                        <Image
                            src={story.image.src}
                            alt={story.title}
                            layout="fill"
                            objectFit="cover"
                            className="transition-transform duration-300 group-hover:scale-105"
                            data-ai-hint={story.image.hint}
                            priority
                        />
                    </div>
                    
                    {/* --- Story Content --- */}
                    <div className="prose prose-lg prose-invert mx-auto max-w-none text-foreground">
                         <MarkdownRenderer content={story.fullStory} />
                    </div>
                </article>
            </main>
            <Footer />
        </div>
    );
}
