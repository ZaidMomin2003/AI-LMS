
'use client';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { BarChart } from 'lucide-react';

export default function AdminAnalyticsPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <h2 className="text-3xl font-bold tracking-tight font-headline">Advanced Analytics</h2>
      
      <Card>
          <CardHeader>
              <CardTitle>Coming Soon</CardTitle>
              <CardDescription>Deeper insights and more detailed analytics are on the way.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center text-center py-20">
              <BarChart className="w-16 h-16 text-muted-foreground mb-4" />
              <p className="text-lg font-semibold">More Charts and Data Visualizations</p>
              <p className="text-muted-foreground">This section will include cohort analysis, revenue breakdown, and more.</p>
          </CardContent>
      </Card>
    </div>
  );
}
