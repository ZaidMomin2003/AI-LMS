
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useTopic } from '@/context/TopicContext';
import { useSubscription } from '@/context/SubscriptionContext';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Loader2, Lock, Gem, CheckCircle, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import type { Topic } from '@/types';
import { getShareableTopic } from '@/services/firestore';

export default function SharedTopicPage() {
    const params = useParams();
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();
    const { receiveSharedTopic } = useTopic();
    const { canUseFeature, incrementReceivedTopics, loading: subLoading } = useSubscription();
    const { toast } = useToast();

    const [status, setStatus] = useState<'loading' | 'prompt-login' | 'unauthorized' | 'limit-reached' | 'ready' | 'error' | 'already-owned'>('loading');
    const [topicData, setTopicData] = useState<Omit<Topic, 'id' | 'ownerId'> | null>(null);

    const shareId = params.id as string;
    
    useEffect(() => {
        const processShare = async () => {
            if (authLoading || subLoading) return;
            if (!shareId) {
                setStatus('error');
                return;
            }

            const fetchedTopicData = await getShareableTopic(shareId);
            if (!fetchedTopicData) {
                setStatus('error');
                return;
            }
            setTopicData(fetchedTopicData);

            if (!user) {
                setStatus('prompt-login');
                return;
            }

            if (user.uid === fetchedTopicData.ownerId) {
                setStatus('already-owned');
                // The original topic ID is not available here, so we just send them to dashboard.
                // A better approach might be to store original topic ID in the shared doc.
                router.replace(`/dashboard`);
                return;
            }

            if (!canUseFeature('receiveTopic')) {
                setStatus('limit-reached');
                return;
            }
            
            setStatus('ready');
        };

        processShare();

    }, [authLoading, subLoading, user, shareId, router, canUseFeature]);


    const handleAcceptTopic = async () => {
        if (!topicData) return;
        setStatus('loading');
        try {
            const newTopic = await receiveSharedTopic(topicData);
            await incrementReceivedTopics();
            toast({
                title: 'Topic Added!',
                description: `"${newTopic?.title}" has been added to your collection.`,
            });
            router.push(`/topic/${newTopic?.id}`);
        } catch (error) {
            setStatus('error');
            toast({
                variant: 'destructive',
                title: 'Failed to Add Topic',
                description: 'An error occurred while adding the topic to your account.',
            });
        }
    };
    
    const renderContent = () => {
        switch (status) {
            case 'loading':
                return <Loader2 className="h-12 w-12 animate-spin text-primary" />;
            case 'prompt-login':
                return (
                    <Card className="w-full max-w-md">
                        <CardHeader>
                            <CardTitle>You've Been Sent a Topic!</CardTitle>
                            <CardDescription>Log in or sign up to add "{topicData?.title}" to your collection.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid grid-cols-2 gap-4">
                            <Button asChild><Link href="/login">Log In</Link></Button>
                            <Button asChild variant="outline"><Link href="/signup">Sign Up</Link></Button>
                        </CardContent>
                    </Card>
                );
             case 'limit-reached':
                return (
                    <Card className="w-full max-w-md text-center">
                        <CardHeader>
                             <div className="mx-auto bg-primary/10 text-primary p-3 rounded-full w-fit mb-4">
                                <Lock className="w-6 h-6" />
                            </div>
                            <CardTitle>Free Limit Reached</CardTitle>
                            <CardDescription>You've received your maximum of 5 shared topics on the free plan.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button asChild>
                                <Link href="/dashboard/pricing">
                                    <Gem className="mr-2 h-4 w-4" /> Upgrade to Pro
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                );
             case 'ready':
                 return (
                    <Card className="w-full max-w-md text-center">
                         <CardHeader>
                            <div className="mx-auto bg-primary/10 text-primary p-3 rounded-full w-fit mb-4">
                                <CheckCircle className="w-6 h-6" />
                            </div>
                            <CardTitle>Ready to Add Topic</CardTitle>
                            <CardDescription>Add "{topicData?.title}" to your Wisdom account.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button onClick={handleAcceptTopic}>
                                Accept and View Topic
                            </Button>
                        </CardContent>
                    </Card>
                 )
             case 'error':
                 return (
                    <Card className="w-full max-w-md text-center">
                         <CardHeader>
                            <div className="mx-auto bg-destructive/10 text-destructive p-3 rounded-full w-fit mb-4">
                                <AlertTriangle className="w-6 h-6" />
                            </div>
                            <CardTitle>Invalid Link</CardTitle>
                            <CardDescription>This share link is either invalid or has expired.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button asChild>
                                <Link href="/dashboard">Go to Dashboard</Link>
                            </Button>
                        </CardContent>
                    </Card>
                 )
            default:
                return null;
        }
    }

  return (
    <div className="flex h-screen w-full items-center justify-center bg-background p-4">
      {renderContent()}
    </div>
  );
}
