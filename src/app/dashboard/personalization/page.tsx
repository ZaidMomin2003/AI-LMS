
'use client';

import { AppLayout } from '@/components/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function PersonalizationPage() {
    return (
        <AppLayout>
            <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
                <div className="space-y-2">
                    <h2 className="text-3xl font-headline font-bold tracking-tight">
                        Personalization
                    </h2>
                    <p className="text-muted-foreground">
                        Tailor your learning experience.
                    </p>
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle>Coming Soon</CardTitle>
                        <CardDescription>
                            This section is under construction.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p>More personalization options are on the way!</p>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}

    