
import { Header } from '@/components/landing/Header';
import { Footer } from '@/components/landing/Footer';
import { FileText } from 'lucide-react';

export default function TermsPage() {
    const lastUpdated = "June 19, 2025";

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <Header />
            <main className="flex-grow container mx-auto px-4 py-12 md:py-20">
                 <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <div className="inline-block bg-primary/10 text-primary p-4 rounded-full mb-4">
                            <FileText className="w-10 h-10" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-headline font-bold">Terms and Conditions</h1>
                        <p className="text-muted-foreground mt-2">Last updated: {lastUpdated}</p>
                    </div>
                    <div className="prose prose-invert max-w-none bg-card p-8 md:p-12 rounded-2xl border border-border/50 shadow-lg">
                        <p>Welcome to Wisdomis Fun! These terms and conditions outline the rules and regulations for the use of Wisdomis Fun's Website, located at https://wisdomis.fun.</p>

                        <p>By accessing this website we assume you accept these terms and conditions. Do not continue to use Wisdomis Fun if you do not agree to take all of the terms and conditions stated on this page.</p>

                        <h2>1. User Accounts</h2>
                        <p>When you create an account with us, you must provide us with information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.</p>
                        <p>You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password, whether your password is with our Service or a third-party service.</p>

                        <h2>2. Content</h2>
                        <p>Our Service allows you to post, link, store, share and otherwise make available certain information, text, graphics, videos, or other material ("Content"). You are responsible for the Content that you post to the Service, including its legality, reliability, and appropriateness.</p>
                        <p>The Service also generates content using artificial intelligence ("Generated Content"). While we strive for accuracy, we make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability or availability with respect to the Generated Content.</p>

                        <h2>3. Subscriptions and Payments</h2>
                        <p>Some parts of the Service are billed on a subscription basis ("Subscription(s)"). You will be billed in advance on a recurring and periodic basis ("Billing Cycle"). Billing cycles are set either on a monthly or annual basis, depending on the type of subscription plan you select when purchasing a Subscription.</p>

                        <h2>4. Intellectual Property</h2>
                        <p>The Service and its original content (excluding Content provided by users), features and functionality are and will remain the exclusive property of Wisdomis Fun and its licensors. The Service is protected by copyright, trademark, and other laws of both the [Your Country] and foreign countries.</p>

                        <h2>5. Prohibited Activities</h2>
                        <p>You agree not to use the Service for any unlawful purpose or to engage in any activity that is harmful, fraudulent, deceptive, or otherwise objectionable. This includes, but is not limited to, attempting to reverse engineer the AI models, using the service to generate harmful or illegal content, or interfering with the proper working of the Service.</p>

                        <h2>6. Limitation of Liability</h2>
                        <p>In no event shall Wisdomis Fun, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.</p>

                        <h2>7. Governing Law</h2>
                        <p>These Terms shall be governed and construed in accordance with the laws of [Your Country/State], without regard to its conflict of law provisions.</p>
                        
                        <h2>8. Changes to Terms</h2>
                        <p>We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.</p>

                        <h2>9. Contact Us</h2>
                        <p>If you have any questions about these Terms, please contact us at: hello@wisdomis.fun</p>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
