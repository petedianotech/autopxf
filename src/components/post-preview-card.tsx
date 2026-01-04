'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Copy, Facebook, Send, Twitter, Wand2, Pilcrow, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from './ui/skeleton';
import { optimizeForPlatform } from '@/ai/flows/optimize-for-platform';
import { cn } from '@/lib/utils';
import { handlePostToFacebook, handlePostToX, handleGenerateTitles } from '@/lib/actions';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"


type Platform = 'facebook' | 'x';

interface PostPreviewCardProps {
  platform: Platform;
  content: string;
}

function PlatformIcon({ platform }: { platform: Platform }) {
    if (platform === 'facebook') {
        return <Facebook className="h-6 w-6 text-blue-500" />;
    }
    return <Twitter className="h-6 w-6 text-sky-500" />;
}

export function PostPreviewCard({ platform, content: initialContent }: PostPreviewCardProps) {
  const [content, setContent] = useState(initialContent);
  const [isPosting, setIsPosting] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [suggestedTitles, setSuggestedTitles] = useState<string[]>([]);
  const { toast } = useToast();

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    toast({ title: 'Copied to clipboard!' });
  };
  
  const handleSuggestHashtags = async () => {
    setIsSuggesting(true);
    try {
        const result = await optimizeForPlatform({ content, platform: 'x' });
        const hashtags = result.optimizedContent.match(/#\\w+/g);
        if (hashtags) {
            setContent(currentContent => `${currentContent}\\n\\n${hashtags.join(' ')}`);
            toast({ title: 'Hashtags added!' });
        } else {
            toast({ title: 'No hashtags found', description: 'Could not extract hashtags from the optimized content.' });
        }
    } catch(e) {
        toast({ variant: 'destructive', title: 'Could not suggest hashtags' });
    } finally {
      setIsSuggesting(false);
    }
  }

  const handleSuggestTitles = async () => {
    setIsSuggesting(true);
    setSuggestedTitles([]);
    try {
      const result = await handleGenerateTitles({ postContent: content, platform });
      if(result && result.titles.length > 0) {
        setSuggestedTitles(result.titles);
      } else {
        toast({ title: 'No titles generated', description: 'The AI did not return any titles.' });
      }
    } catch(e) {
      toast({ variant: 'destructive', title: 'Could not suggest titles', description: e instanceof Error ? e.message : 'Unknown error' });
    } finally {
      setIsSuggesting(false);
    }
  }

  const onPost = async () => {
    setIsPosting(true);
    try {
      if (platform === 'x') {
        const result = await handlePostToX(content);
        if (result.success) {
          toast({
            title: 'Posted to X!',
            description: 'Your post has been successfully sent.',
          });
        }
      } else if (platform === 'facebook') {
        const result = await handlePostToFacebook(content);
        if (result.success) {
          toast({
            title: 'Posted to Facebook!',
            description: 'Your post has been successfully sent.',
          });
        }
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'An error occurred',
        description: error instanceof Error ? error.message : 'Please try again.',
      });
    } finally {
      setIsPosting(false);
    }
  };

  const platformTitle = platform.charAt(0).toUpperCase() + platform.slice(1);

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <PlatformIcon platform={platform} />
            <div>
              <CardTitle>{platformTitle} Post</CardTitle>
              <CardDescription>Preview of the generated post.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[150px] text-base"
          />
        </CardContent>
        <CardFooter className="flex-wrap justify-end gap-2">
           <Button variant="outline" onClick={handleSuggestTitles} disabled={isSuggesting || content.length < 20}>
            {isSuggesting && suggestedTitles.length === 0 ? <Loader2 className="animate-spin" /> : <Pilcrow className="mr-2 h-4 w-4" />}
            Suggest Titles
          </Button>
          <Button variant="outline" onClick={handleSuggestHashtags} disabled={isSuggesting}>
            {isSuggesting ? <Loader2 className="animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
            Suggest Hashtags
          </Button>
          <Button variant="outline" onClick={handleCopy}>
            <Copy className="mr-2 h-4 w-4" />
            Copy Post
          </Button>
          <Button onClick={onPost} disabled={isPosting}>
              {isPosting ? (
                <Loader2 className="animate-spin" />
              ) : (
                <Send className="mr-2 h-4 w-4" />
              )}
              Post to {platformTitle}
            </Button>
        </CardFooter>
      </Card>
      
      <AlertDialog open={suggestedTitles.length > 0} onOpenChange={() => setSuggestedTitles([])}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Suggested Titles</AlertDialogTitle>
            <AlertDialogDescription>
              Here are a few AI-generated titles for your post. You can prepend one to your content.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex flex-col gap-2">
            {suggestedTitles.map((title, i) => (
                <div key={i} className="flex items-center gap-2 rounded-md border p-3">
                  <p className="flex-1 text-sm">"{title}"</p>
                  <Button size="sm" onClick={() => {
                    setContent(prev => `${title}\\n\\n${prev}`);
                    toast({title: "Title added!"});
                    setSuggestedTitles([]);
                  }}>Prepend</Button>
                </div>
            ))}
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Close</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}


PostPreviewCard.Skeleton = function PostPreviewCardSkeleton({platform}: {platform: Platform}) {
  const platformTitle = platform.charAt(0).toUpperCase() + platform.slice(1);
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <Skeleton className={cn("h-6 w-6 rounded-full", platform === 'facebook' ? 'bg-blue-500/50' : 'bg-sky-500/50')} />
          <div>
            <CardTitle>{platformTitle} Post</CardTitle>
            <CardDescription>Generating post preview...</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Skeleton className="h-[150px] w-full" />
      </CardContent>
      <CardFooter className="justify-end gap-2">
        <Skeleton className="h-10 w-36" />
        <Skeleton className="h-10 w-28" />
        <Skeleton className="h-10 w-32" />
      </CardFooter>
    </Card>
  )
}
