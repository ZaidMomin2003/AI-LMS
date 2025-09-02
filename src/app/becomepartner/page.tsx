
import { Header } from '@/components/landing/Header';
import { Footer } from '@/components/landing/Footer';
import { Handshake } from 'lucide-react';

export default function BecomePartnerPage() {
    return (
        <div className="flex min-h-screen flex-col bg-background">
            <Header />
            <main className="flex-grow container mx-auto px-4 py-12 md:py-20">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <div className="inline-block bg-primary/10 text-primary p-4 rounded-full mb-4">
                            <Handshake className="w-10 h-10" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-headline font-bold">Become a Partner</h1>
                        <p className="text-muted-foreground mt-2">Content coming soon...</p>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
