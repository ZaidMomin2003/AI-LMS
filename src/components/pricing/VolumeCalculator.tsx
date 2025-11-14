'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { DollarSign, Users, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';

const StatCard = ({ icon, title, value, className }: { icon: React.ReactNode, title: string, value: string, className?: string }) => (
    <Card className={className}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            {icon}
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold">{value}</div>
        </CardContent>
    </Card>
);

const userTiers = [10, 100, 500, 1000, 1500, 2000];

export function VolumeCalculator() {
    const [users, setUsers] = useState(100);
    const minPrice = 149; // New lower price at max tier
    const maxPrice = 199;
    const minUsers = userTiers[0];
    const maxUsers = userTiers[userTiers.length - 1];

    // Adjusted linear interpolation for price
    const pricePerUser = maxPrice - ((maxPrice - minPrice) * (users - minUsers)) / (maxUsers - minUsers);
    const totalCost = pricePerUser * users;
    const savings = (maxPrice * users) - totalCost;

    return (
        <section className="py-20 sm:py-24 bg-background">
            <div className="container mx-auto max-w-4xl px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl font-headline">
                        Scale Your Earnings with Volume Discounts
                    </h2>
                    <p className="mt-4 text-lg leading-8 text-muted-foreground">
                        The more licenses you sell, the lower the price per user. Select a tier to see your potential earnings.
                    </p>
                </div>

                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle className="font-headline text-center">Discount Calculator</CardTitle>
                        <CardDescription className="text-center">Select the number of licenses to see your discount.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-8">
                        <div className="flex justify-center p-1 bg-muted rounded-lg">
                            {userTiers.map(tier => (
                                <Button 
                                    key={tier}
                                    variant={users === tier ? 'default' : 'ghost'}
                                    onClick={() => setUsers(tier)}
                                    className="flex-1 transition-all"
                                >
                                    {tier} Users
                                </Button>
                            ))}
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <StatCard 
                                icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
                                title="Price per User"
                                value={`$${pricePerUser.toFixed(2)}`}
                            />
                             <StatCard 
                                icon={<Users className="h-4 w-4 text-muted-foreground" />}
                                title="Total Annual Cost"
                                value={`$${totalCost.toLocaleString('en-US', { maximumFractionDigits: 0 })}`}
                            />
                             <StatCard 
                                icon={<TrendingDown className="h-4 w-4 text-muted-foreground" />}
                                title="Total Savings"
                                value={`$${savings.toLocaleString('en-US', { maximumFractionDigits: 0 })}`}
                                className="bg-primary/10 border-primary/20"
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </section>
    );
}
