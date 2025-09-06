
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

const BASE_PRICE_PER_LICENSE = 249;

const discountTiers = [
  { threshold: 1000, discount: 0.30, label: '30% OFF' },
  { threshold: 500, discount: 0.20, label: '20% OFF' },
  { threshold: 100, discount: 0.10, label: '10% OFF' },
  { threshold: 0, discount: 0, label: '' },
];

const features = [
    'Unlimited AI Generations',
    'SageMaker AI Assistant',
    'Personalized Study Roadmaps',
    'Full Analytics Suite',
    'Priority Support',
    'Centralized Management',
];


export default function LicensesPage() {
  const [licenses, setLicenses] = useState(100);

  const calculatePrice = () => {
    const tier = discountTiers.find(t => licenses >= t.threshold);
    const discount = tier?.discount || 0;
    
    const originalPrice = licenses * BASE_PRICE_PER_LICENSE;
    const discountedPrice = originalPrice * (1 - discount);
    
    return {
      originalPrice,
      discountedPrice,
      pricePerLicense: discountedPrice / licenses,
      discountLabel: tier?.label || null,
    };
  };
  
  const { originalPrice, discountedPrice, pricePerLicense, discountLabel } = calculatePrice();

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8">
        <div className="space-y-2">
            <h2 className="text-3xl font-headline font-bold tracking-tight">
                Manage Your Licenses
            </h2>
            <p className="text-muted-foreground">
                Purchase additional licenses for your students with progressive discounts.
            </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Select Number of Licenses</CardTitle>
                        <CardDescription>Use the slider to choose how many licenses to purchase.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-8 pt-2">
                        <div className="flex items-center gap-4">
                            <Slider
                                defaultValue={[licenses]}
                                max={2000}
                                min={50}
                                step={10}
                                onValueChange={(value) => setLicenses(value[0])}
                            />
                            <div className="flex h-12 w-24 items-center justify-center rounded-md border border-input bg-background px-3 py-2 text-lg font-bold">
                                {licenses}
                            </div>
                        </div>
                         <div className="flex justify-between text-xs text-muted-foreground">
                            <span>50 Licenses</span>
                            <span>2000 Licenses</span>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Plan Features</CardTitle>
                        <CardDescription>All institutional licenses include full access to Pro features.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {features.map(feature => (
                            <div key={feature} className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-green-500" />
                                <span className="text-sm">{feature}</span>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
            
            <div className="space-y-6">
                <Card className="sticky top-20">
                    <CardHeader>
                        <CardTitle>Order Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Number of Licenses</span>
                            <span className="font-semibold">{licenses}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Price per License</span>
                            <span className="font-semibold">${pricePerLicense.toFixed(2)} / year</span>
                        </div>
                        {discountLabel && (
                            <div className="flex justify-between items-center text-green-600 dark:text-green-400">
                                <span className="text-muted-foreground">Discount Applied</span>
                                <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300">{discountLabel}</Badge>
                            </div>
                        )}
                        <div className="flex justify-between text-muted-foreground line-through">
                             <span>Original Total</span>
                             <span>${originalPrice.toLocaleString()}</span>
                        </div>
                        <div className="border-t pt-4 mt-4 flex justify-between text-xl font-bold">
                            <span>Total (USD)</span>
                            <span>${discountedPrice.toLocaleString()}</span>
                        </div>

                         <Button size="lg" className="w-full mt-4" disabled>
                            <Zap className="mr-2 h-4 w-4" />
                            Purchase (Coming Soon)
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    </div>
  );
}
