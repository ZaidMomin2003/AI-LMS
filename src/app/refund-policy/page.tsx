
import { Header } from '@/components/landing/Header';
import { Footer } from '@/components/landing/Footer';

export default function RefundPolicyPage() {
    const lastUpdated = "August 1, 2024";

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <Header />
            <main className="flex-grow container mx-auto px-4 py-12 md:py-20">
                <div className="prose prose-invert max-w-4xl mx-auto">
                    <h1>Refund Policy</h1>
                    <p className="text-muted-foreground">Last updated: {lastUpdated}</p>

                    <h2>Our Policy</h2>
                    <p>Due to the nature of our digital services, we do not offer refunds or credits for any purchases, including subscription fees. Once a payment is made, it is final and non-refundable.</p>

                    <h3>Why No Refunds?</h3>
                    <p>ScholarAI provides immediate access to digital content and AI-powered services. The generation of study materials incurs an instant and irreversible cost to us. Because our services are delivered instantly upon request and cannot be "returned," we are unable to provide refunds.</p>

                    <h3>Free Plan</h3>
                    <p>We offer a free plan for you to try our services before committing to a paid subscription. We encourage you to use this plan to determine if ScholarAI is the right fit for your needs before purchasing a subscription.</p>

                    <h3>Cancellation</h3>
                    <p>You can cancel your subscription at any time from your account settings. Your cancellation will take effect at the end of your current billing cycle, and you will not be charged again. You will continue to have access to the service until the end of your billing period.</p>
                    
                    <h2>Contact Us</h2>
                    <p>If you have any questions about our Refund Policy, please contact us at: hello@scholarai.app</p>
                </div>
            </main>
            <Footer />
        </div>
    );
}
