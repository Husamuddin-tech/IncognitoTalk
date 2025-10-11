'use client';

import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { LoaderIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { CardHeader, CardContent, Card } from '@/components/ui/card';
import { useCompletion } from "@ai-sdk/react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import * as z from 'zod';
import { ApiResponse } from '@/types/ApiResponse';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { messageSchema } from '@/schemas/messageSchema';

const specialChar = '||';

const parseStringMessages = (messageString: string): string[] => {
  return messageString.split(specialChar);
};

const initialMessageString =
  "What's your favorite movie?||Do you have any pets?||What's your dream job?";

export default function SendMessage() {
  const params = useParams<{ username: string }>();
  const username = params.username;

  const {
    complete,
    completion,
    isLoading: isSuggestLoading,
    error,
  } = useCompletion({
    api: '/api/suggest-messages',
    initialCompletion: initialMessageString,
  });

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
  });

  const messageContent = form.watch('content');

  const handleMessageClick = (message: string) => {
    form.setValue('content', message);
  };

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setIsLoading(true);
    try {
      const response = await axios.post<ApiResponse>('/api/send-message', {
        ...data,
        username,
      });

      toast(response.data.message,);
      form.reset({ ...form.getValues(), content: '' });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast(axiosError.response?.data.message ?? 'Failed to sent message');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSuggestedMessages = async () => {
    try {
      complete('');
    } catch (error) {
      console.error('Error fetching messages:', error);
      // Handle error appropriately
    }
  };

  return (
    <div className="container mx-auto my-12 p-8 bg-black/40 backdrop-blur-lg border border-green-500/20 rounded-2xl max-w-3xl shadow-[0_0_15px_rgba(34,197,94,0.2)] text-green-400">
  <h1 className="text-4xl font-bold mb-8 text-center text-green-400 drop-shadow-[0_0_6px_rgba(34,197,94,0.7)]">
    Public Profile Link
  </h1>

  <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <FormField
        control={form.control}
        name="content"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-green-300 text-lg">
              Send Anonymous Message to @{username}
            </FormLabel>
            <FormControl>
              <Textarea
                placeholder="Write your anonymous message here..."
                className="resize-none bg-black/30 border border-green-500/20 focus:border-green-500 focus:ring-1 focus:ring-green-400 text-green-300 placeholder-green-700 rounded-lg p-3 transition-all duration-200"
                {...field}
              />
            </FormControl>
            <FormMessage className="text-red-400" />
          </FormItem>
        )}
      />

      <div className="flex justify-center">
        {isLoading ? (
          <Button
            disabled
            className="bg-green-500/20 text-green-300 border border-green-400/40 cursor-not-allowed"
          >
            <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />
            Please wait
          </Button>
        ) : (
          <Button
            type="submit"
            disabled={isLoading || !messageContent}
            className="bg-green-500/20 border border-green-400/50 hover:bg-green-500/30 text-green-300 transition-colors duration-200"
          >
            Send It
          </Button>
        )}
      </div>
    </form>
  </Form>

  <div className="space-y-6 my-8">
    <div className="space-y-2">
      <Button
        onClick={fetchSuggestedMessages}
        className="my-4 bg-green-500/20 border border-green-400/50 hover:bg-green-500/30 text-green-300"
        disabled={isSuggestLoading}
      >
        Suggest Messages
      </Button>
      <p className="text-sm text-green-600">
        Click on any message below to select it.
      </p>
    </div>

    <Card className="bg-black/30 border border-green-400/20">
      <CardHeader>
        <h3 className="text-xl font-semibold text-green-300">
          Suggested Messages
        </h3>
      </CardHeader>
      <CardContent className="flex flex-col space-y-4">
        {error ? (
          <p className="text-red-400">{error.message}</p>
        ) : (
          parseStringMessages(completion).map((message, index) => (
            <Button
              key={index}
              variant="outline"
              className="border border-green-400/40 text-green-300 hover:bg-green-500/10 transition-all duration-200"
              onClick={() => handleMessageClick(message)}
            >
              {message}
            </Button>
          ))
        )}
      </CardContent>
    </Card>
  </div>

  <Separator className="my-6 bg-green-400/30" />

  <div className="text-center">
    <div className="mb-4 text-green-300">Get Your Message Board</div>
    <Link href={'/sign-up'}>
      <Button className="bg-green-500/20 border border-green-400/50 hover:bg-green-500/30 text-green-300">
        Create Your Account
      </Button>
    </Link>
  </div>
</div>

  );
}