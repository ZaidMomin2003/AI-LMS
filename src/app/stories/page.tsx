
import { Header } from '@/components/landing/Header';
import { Footer } from '@/components/landing/Footer';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, BookOpen } from 'lucide-react';
import placeholderImages from '@/lib/placeholder-images.json';
import Link from 'next/link';

const stories = [
  {
    title: 'From Overwhelmed to Overachiever: A High Schooler’s Guide to Acing AP Exams',
    category: 'Student Success',
    author: 'Priya Sharma',
    location: 'Mumbai, India',
    image: placeholderImages.stories.story1,
    excerpt: 'Juggling three AP classes felt impossible until I discovered this AI study tool. The ability to instantly generate notes and quizzes for dense topics like Cellular Respiration saved me hours of manual work...',
    slug: '#',
  },
  {
    title: 'How My Son Went from C- Average to Dean’s List with AI-Powered Study Plans',
    category: 'Parental Guidance',
    author: 'David Chen',
    location: 'Toronto, Canada',
    image: placeholderImages.stories.story2,
    excerpt: 'As a parent, seeing your child struggle is heartbreaking. The AI Roadmap feature created a day-by-day study plan for my son’s entire syllabus, giving him the structure he desperately needed...',
    slug: '#',
  },
  {
    title: 'Conquering the MCAT: How I Scored in the 98th Percentile Using AI Flashcards',
    category: 'Exam Preparation',
    author: 'Aisha Adebayo',
    location: 'Lagos, Nigeria',
    image: placeholderImages.stories.story3,
    excerpt: 'The MCAT is a beast of an exam. The AI flashcards were a game-changer, allowing me to master thousands of key terms and concepts through active recall. The instant feedback was invaluable...',
    slug: '#',
  },
  {
    title: 'Lifelong Learning: Mastering a New Skill for a Career Change at 45',
    category: 'Professional Development',
    author: 'Carlos Rossi',
    location: 'São Paulo, Brazil',
    image: placeholderImages.stories.story4,
    excerpt: "Switching careers from finance to data science was daunting. This tool helped me grasp complex topics like machine learning algorithms by breaking them down into simple, understandable notes...",
    slug: '#',
  },
    {
    title: 'Acing University entrance exams in Korea with AI-driven practice tests',
    category: 'Exam Preparation',
    author: 'Kim Min-jun',
    location: 'Seoul, South Korea',
    image: placeholderImages.stories.story5,
    excerpt: 'The CSAT is notoriously difficult. I used the AI to generate endless practice quizzes on my weakest subjects. It helped me identify patterns in my mistakes and improve my score significantly...',
    slug: '#',
  },
  {
    title: 'Homeschooling Made Easy: How We Use AI to Personalize Our Children’s Curriculum',
    category: 'Parental Guidance',
    author: 'Emily Miller',
    location: 'Perth, Australia',
    image: placeholderImages.stories.story6,
    excerpt: 'As homeschooling parents, creating engaging material is a full-time job. Now, we just input a topic, and the AI generates notes, activities, and quizzes tailored to each child’s learning pace...',
    slug: '#',
  },
  {
    title: 'Finally Understanding Shakespeare: An English Lit Student’s AI Companion',
    category: 'Student Success',
    author: 'Oliver Smith',
    location: 'London, UK',
    image: placeholderImages.stories.story7,
    excerpt: 'Shakespearean language was like a different dialect. Explaining complex themes from "Macbeth" with the SageMaker AI tutor felt like having a personal professor available 24/7...',
    slug: '#',
  },
  {
    title: 'From Theory to Practice: A Computer Science Student’s Secret Weapon',
    category: 'Higher Education',
    author: 'Fatima Al-Jamil',
    location: 'Dubai, UAE',
    image: placeholderImages.stories.story8,
    excerpt: 'Understanding data structures and algorithms is tough. The AI’s ability to generate step-by-step explanations and practical examples for concepts like Dijkstra’s algorithm was crucial for my success...',
    slug: '#',
  },
];


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
              {stories.map((story) => (
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
                      <Link href={story.slug} className="stretched-link">
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
