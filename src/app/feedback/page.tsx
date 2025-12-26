
import { Header } from '@/components/landing/Header';
import { Footer } from '@/components/landing/Footer';

export default function FeedbackPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12 md:py-20">
        {/* Feedback form will be added here */}
      </main>
      <Footer />
    </div>
  );
}
