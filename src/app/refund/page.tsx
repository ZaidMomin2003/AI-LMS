
import { Header } from '@/components/landing/Header';
import { Footer } from '@/components/landing/Footer';
import { Undo2 } from 'lucide-react';

export default function RefundPage() {
    const lastUpdated = "June 19, 2025";

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <Header />
            <main className="flex-grow container mx-auto px-4 py-12 md:py-20">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <div className="inline-block bg-primary/10 text-primary p-4 rounded-full mb-4">
                            <Undo2 className="w-10 h-10" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-headline font-bold">Refund Policy</h1>
                        <p className="text-muted-foreground mt-2">Last updated: {lastUpdated}</p>
                    </div>
                    <div className="prose prose-invert max-w-none bg-card p-8 md:p-12 rounded-2xl border border-border/50 shadow-lg">
                        <h2>1. Our No-Refund Policy</h2>
                        <p>At wisdom, we are dedicated to providing you with powerful, high-quality AI-driven study tools. Due to the nature of our service, which provides immediate access to digital content and incurs irreversible costs for AI generation upon use, we operate under a strict no-refund policy.</p>
                        <p><strong>All purchases are final and non-refundable.</strong> Once a subscription is purchased and our service is used, the costs associated with generating your personalized study materials cannot be recovered. We encourage you to make use of our free trial to ensure our service meets your needs before committing to a subscription.</p>

                        <h2>2. Our Commitment to Your Satisfaction</h2>
                        <p>While we do not offer refunds, your satisfaction is our highest priority. We are committed to ensuring you have a positive and productive experience with our platform. If you encounter any issues, have technical difficulties, or are unsatisfied with the service, we strongly encourage you to contact our support team.</p>
                        <ul>
                            <li><strong>Dedicated Support:</strong> We provide robust customer support to resolve any technical problems, answer questions, and assist you in getting the most out of our features.</li>
                            <li><strong>Service Reliability:</strong> We are committed to maintaining a high level of service availability and continuously improving our AI models and platform features.</li>
                        </ul>

                        <h2>3. How to Get Help</h2>
                        <p>If you are facing any challenges, please do not hesitate to reach out. We are here to help you succeed.</p>
                         <ul>
                            <li><strong>Email Support:</strong> Contact us directly at <strong>hello@wisdomis.fun</strong>. Our team will review your issue and work with you to find a satisfactory solution.</li>
                            <li><strong>In-App Support:</strong> For faster assistance, use the support form available within your dashboard.</li>
                        </ul>
                        <p>We believe in the value and effectiveness of our service and are dedicated to providing the support you need to achieve your learning goals.</p>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
