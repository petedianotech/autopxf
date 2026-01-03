'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2, Sparkles, Volume2 } from 'lucide-react';
import { handleGenerateUniversalPost, handleGenerateAudio } from '@/lib/actions';
import type { GenerateUniversalPostOutput } from '@/ai/flows/generate-universal-post';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

const formSchema = z.object({
  topic: z.string().min(5, {
    message: 'Topic must be at least 5 characters long.',
  }).max(150, {
    message: 'Topic must be at most 150 characters long.',
  }),
  includeLongForm: z.boolean().default(false),
});

type FormValues = z.infer<typeof formSchema>;

interface GeneratedContentState extends GenerateUniversalPostOutput {
  shortFormScriptAudio?: string;
  longFormScriptAudio?: string;
}

interface AudioGenerationState {
  short?: 'loading' | 'loaded' | 'error';
  long?: 'loading' | 'loaded' | 'error';
}

export default function AutopxAllPage() {
  const { toast } = useToast();
  const [isGeneratingText, setIsGeneratingText] = useState(false);
  const [audioState, setAudioState] = useState<AudioGenerationState>({});
  const [generatedContent, setGeneratedContent] = useState<GeneratedContentState | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: '',
      includeLongForm: true,
    },
  });

  async function onTextSubmit(values: FormValues) {
    setIsGeneratingText(true);
    setGeneratedContent(null);
    setAudioState({});
    try {
      const result = await handleGenerateUniversalPost(values);
      if (result) {
        setGeneratedContent(result);
        toast({
          title: 'Content Generated!',
          description: 'Your new content package is ready.',
        });
      } else {
        throw new Error('AI did not return a valid response.');
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'An error occurred',
        description: error instanceof Error ? error.message : 'Please try again.',
      });
    } finally {
      setIsGeneratingText(false);
    }
  }

  async function onAudioGenerate(script: string, type: 'short' | 'long') {
    setAudioState(prev => ({...prev, [type]: 'loading' }));
    try {
        const result = await handleGenerateAudio(script);
        if (result?.media) {
            setGeneratedContent(prev => prev ? {
                ...prev,
                [type === 'short' ? 'shortFormScriptAudio' : 'longFormScriptAudio']: result.media,
            } : null);
            setAudioState(prev => ({...prev, [type]: 'loaded' }));
            toast({ title: 'Audio Generated!', description: `Your ${type}-form audio is ready.` });
        } else {
            throw new Error('AI did not return valid audio.');
        }
    } catch (error) {
        setAudioState(prev => ({...prev, [type]: 'error' }));
        toast({
            variant: 'destructive',
            title: 'Audio Generation Failed',
            description: error instanceof Error ? error.message : 'Please try again.',
        });
    }
  }


  return (
    <div className="grid gap-8 md:grid-cols-3">
      <div className="md:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle>Autopx All Generator</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onTextSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="topic"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Content Topic</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="e.g., A better way to think about automation"
                          className="min-h-[120px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="includeLongForm"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          Include long-form script (2-4 mins)
                        </FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isGeneratingText}>
                  {isGeneratingText ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <Sparkles className="mr-2 h-4 w-4" />
                  )}
                  Generate Content
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
      <div className="space-y-6 md:col-span-2">
        {isGeneratingText && (
            <Card>
                <CardContent className="p-6">
                    <div className="space-y-4">
                        <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
                        <p className="text-center text-muted-foreground">Generating your content package... this may take a moment.</p>
                    </div>
                </CardContent>
            </Card>
        )}
        {generatedContent && (
          <ScrollArea className="h-[calc(100vh-10rem)]">
            <div className="space-y-6 pr-6">
            <Card>
              <CardHeader><CardTitle>Virality-Optimized Titles</CardTitle></CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {generatedContent.titles.map((title, i) => <Badge key={i} variant="secondary">{title}</Badge>)}
              </CardContent>
            </Card>

             <Card>
              <CardHeader><CardTitle>Hashtags</CardTitle></CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {generatedContent.hashtags.map((tag, i) => <Badge key={i} variant="outline">{tag}</Badge>)}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader><CardTitle>Short-Form Script (30-60s)</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                {generatedContent.shortFormScriptAudio && audioState.short === 'loaded' ? (
                  <audio controls src={generatedContent.shortFormScriptAudio} className="w-full" />
                ) : (
                  <Button onClick={() => onAudioGenerate(generatedContent.shortFormScript, 'short')} disabled={audioState.short === 'loading'} className='w-full'>
                    {audioState.short === 'loading' ? <Loader2 className="animate-spin" /> : <Volume2 className="mr-2 h-4 w-4" />}
                    Generate Audio
                  </Button>
                )}
                <div className="prose prose-sm dark:prose-invert whitespace-pre-wrap">{generatedContent.shortFormScript}</div>
              </CardContent>
            </Card>

            {generatedContent.longFormScript && (
              <Card>
                <CardHeader><CardTitle>Long-Form Script (2-4 mins)</CardTitle></CardHeader>
                 <CardContent className="space-y-4">
                 {generatedContent.longFormScriptAudio && audioState.long === 'loaded' ? (
                    <audio controls src={generatedContent.longFormScriptAudio} className="w-full" />
                  ) : (
                    <Button onClick={() => onAudioGenerate(generatedContent.longFormScript!, 'long')} disabled={audioState.long === 'loading'} className='w-full'>
                      {audioState.long === 'loading' ? <Loader2 className="animate-spin" /> : <Volume2 className="mr-2 h-4 w-4" />}
                      Generate Audio
                    </Button>
                  )}
                  <div className="prose prose-sm dark:prose-invert whitespace-pre-wrap">{generatedContent.longFormScript}</div>
                </CardContent>
              </Card>
            )}

             <Card>
              <CardHeader><CardTitle>On-Screen Captions</CardTitle></CardHeader>
              <CardContent className="prose prose-sm dark:prose-invert">
                <ul className="list-disc pl-5">
                    {generatedContent.onScreenCaptions.map((caption, i) => <li key={i}>{caption}</li>)}
                </ul>
              </CardContent>
            </Card>
             <Card>
              <CardHeader><CardTitle>Post Description</CardTitle></CardHeader>
              <CardContent className="prose prose-sm dark:prose-invert whitespace-pre-wrap">{generatedContent.postDescription}</CardContent>
            </Card>
            </div>
          </ScrollArea>
        )}
        {!isGeneratingText && !generatedContent && (
            <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed h-full min-h-[400px] text-center p-8">
                <Sparkles className="h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold">Your content package will appear here</h3>
                <p className="mt-2 text-sm text-muted-foreground">Enter a topic to generate your first universal post.</p>
            </div>
        )}
      </div>
    </div>
  );
}
