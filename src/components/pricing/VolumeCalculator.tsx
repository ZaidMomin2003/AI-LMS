
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { DollarSign, Users, TrendingDown, TrendingUp, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';

const StatCard = ({ icon, title, value, description, className }: { icon: React.ReactNode, title: string, value: string, description?: string, className?: string }) => (
    <Card className={className}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            {icon}
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold">{value}</div>
            {description && <p className="text-xs text-muted-foreground">{description}</p>}
        </CardContent>
    </Card>
);

const userTiers = [10, 100, 500, 1000, 1500, 2000];
const commissionPerSale = 39;

export function VolumeCalculator() {
    const [users, setUsers] = useState(100);
    const minPrice = 149;
    const maxPrice = 199;
    const minUsers = userTiers[0];
    const maxUsers = userTiers[userTiers.length - 1];

    // Calculate dynamic pricing based on user volume
    const pricePerUser = maxPrice - ((maxPrice - minPrice) * (users - minUsers)) / (maxUsers - minUsers);
    const savings = (maxPrice * users) - (pricePerUser * users);
    const partnerEarning = commissionPerSale * users;

    return (
        <section className="py-20 sm:py-24 bg-background">
            <div className="container mx-auto max-w-4xl px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl font-headline">
                        Partnership & Volume Calculator
                    </h2>
                    <p className="mt-4 text-lg leading-8 text-muted-foreground">
                        Institutions receive a volume discount and also earn a $39 commission for every student.
                    </p>
                </div>

                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle className="font-headline text-center">Estimate Your Impact</CardTitle>
                        <CardDescription className="text-center">Select the number of users to see the breakdown.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-8">
                        <div className="flex flex-wrap justify-center p-1 bg-muted rounded-lg gap-1">
                            {userTiers.map(tier => (
                                <Button 
                                    key={tier}
                                    variant={users === tier ? 'default' : 'ghost'}
                                    onClick={() => setUsers(tier)}
                                    className="flex-1 min-w-[120px] basis-1/4 sm:basis-auto transition-all"
                                >
                                    {tier} Users
                                </Button>
                            ))}
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                             <StatCard 
                                icon={<Users className="h-4 w-4 text-muted-foreground" />}
                                title="Number of Users"
                                value={`${users}`}
                            />
                             <StatCard 
                                icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
                                title="Price Per User"
                                value={`$${pricePerUser.toFixed(2)}`}
                                description="per year"
                            />
                             <StatCard 
                                icon={<TrendingDown className="h-4 w-4 text-muted-foreground" />}
                                title="Total User Savings"
                                value={`$${savings.toLocaleString('en-US', {maximumFractionDigits: 0})}`}
                                description="across all users"
                            />
                             <StatCard 
                                icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
                                title="Your Potential Earning"
                                value={`$${partnerEarning.toLocaleString('en-US')}`}
                                description={`$${commissionPerSale} per user`}
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </section>
    );
}
