
import { Header } from '@/components/landing/Header';
import { Footer } from '@/components/landing/Footer';
import { PackageCheck } from 'lucide-react';

export default function DeliveryPage() {
    const lastUpdated = "June 19, 2025";

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <Header />
            <main className="flex-grow container mx-auto px-4 py-12 md:py-20">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <div className="inline-block bg-primary/10 text-primary p-4 rounded-full mb-4">
                            <PackageCheck className="w-10 h-10" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-headline font-bold">Service Delivery Policy</h1>
                        <p className="text-muted-foreground mt-2">Last updated: {lastUpdated}</p>
                    </div>
                    <div className="prose prose-invert max-w-none bg-card p-8 md:p-12 rounded-2xl border border-border/50 shadow-lg">
                        <p>This Service Delivery Policy outlines how wisdom ("we", "us", "our") provides its digital services to you ("the user", "you") upon purchase of a subscription.</p>

                        <h2>1. Nature of Service</h2>
                        <p>wisdom is a Software-as-a-Service (SaaS) application that provides digitally generated content, including but not limited to study notes, flashcards, quizzes, and study roadmaps. Our services are delivered entirely through our web-based platform accessible at https://wisdomis.fun.</p>

                        <h2>2. Delivery of Service Upon Purchase</h2>
                        <ul>
                            <li><strong>Immediate Access:</strong> Upon successful completion of your subscription payment, your account will be instantly upgraded to the Pro plan.</li>
                            <li><strong>Confirmation:</strong> You will receive an email confirmation of your purchase and subscription activation to the email address associated with your account.</li>
                            <li><strong>Accessing Features:</strong> All Pro features, including unlimited topic generations, will be unlocked and available for immediate use within your account dashboard. No further installation or setup is required from your end.</li>
                        </ul>

                        <h2>3. Service Availability and Uptime</h2>
                        <p>We strive to ensure our service is available 24/7. However, we do not guarantee uninterrupted service. We may occasionally have scheduled maintenance to improve the service. We will provide advance notice of any planned downtime that may significantly impact service availability.</p>
                        <p>Content generation relies on third-party AI models (e.g., Google's Gemini). While we have robust systems in place, the availability of these underlying models may occasionally affect our service. We will work to resolve any such issues as quickly as possible.</p>

                        <h2>4. Content Generation Time</h2>
                        <p>The generation of study materials (notes, flashcards, quizzes) is typically completed within 10-30 seconds after you submit a topic. Generation times may vary depending on the complexity of the topic and current server load. We continuously work to optimize this process for speed and efficiency.</p>

                        <h2>5. Support and Communication</h2>
                        <p>If you encounter any issues with service delivery or accessing Pro features after your purchase, please contact our support team immediately.</p>
                         <ul>
                            <li><strong>Email Support:</strong> You can reach us at <strong>hello@wisdomis.fun</strong>. We aim to respond to all inquiries within 24 hours.</li>
                            <li><strong>Support Portal:</strong> Pro subscribers have access to priority support through the support form within the application dashboard.</li>
                        </ul>

                         <h2>6. No Physical Delivery</h2>
                        <p>Please note that wisdom is a fully digital service. No physical products will be shipped or delivered to your address. All services and features are accessed online through your user account.</p>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
