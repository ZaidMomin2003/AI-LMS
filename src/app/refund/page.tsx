
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
                        <p>At wisdom, we are committed to your satisfaction. Our policy outlines the conditions under which we offer refunds for our digital services.</p>

                        <h2>1. Overview</h2>
                        <p>Our service provides a one-year subscription plan for access to our AI-powered study tools. Given the digital nature of our service and the immediate access to our proprietary features upon purchase, our refund policy is as follows.</p>
                        
                        <h2>2. Refund Eligibility</h2>
                        <p>We offer a <strong>7-day money-back guarantee</strong> on all new subscriptions. To be eligible for a refund, you must request it within 7 calendar days of your original purchase date.</p>
                        <ul>
                            <li>Requests made after the 7-day period will not be eligible for a refund.</li>
                            <li>Refunds are only available for new subscriptions, not for renewal payments.</li>
                            <li>We reserve the right to deny a refund if we detect abuse of our services or this policy.</li>
                        </ul>

                        <h2>3. How to Request a Refund</h2>
                        <p>To request a refund, please contact our support team directly via email. You do not need to provide a reason, but we welcome feedback as it helps us improve.</p>
                        <ul>
                            <li>Send an email to <strong>hello@wisdomis.fun</strong> from the email address associated with your account.</li>
                            <li>Include the subject line: "Refund Request".</li>
                            <li>Please include your order ID or any purchase details to help us locate your transaction quickly.</li>
                        </ul>

                        <h2>4. Processing Your Refund</h2>
                        <p>Once we receive your refund request, we will process it within 3-5 business days. The funds will be returned to your original method of payment. Please note that it may take an additional 5-10 business days for the credit to appear on your bank or credit card statement, depending on your financial institution.</p>
                        
                        <h2>5. Service Access After Refund</h2>
                        <p>Upon a successful refund, your account will be reverted to the free plan, and you will lose access to all Pro features associated with the subscription.</p>

                        <h2>6. Contact Us</h2>
                        <p>If you have any questions about our Refund Policy, please do not hesitate to contact us at: hello@wisdomis.fun</p>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
