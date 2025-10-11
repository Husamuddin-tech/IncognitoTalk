'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { signIn } from 'next-auth/react';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { signInSchema } from '@/schemas/signInSchema';

export default function SignInForm() {
  const router = useRouter();

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: '',
      password: '',
    },
  });

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    const result = await signIn('credentials', {
      redirect: false,
      identifier: data.identifier,
      password: data.password
    })

    if (result?.error) {
      if (result.error === 'CredentialsSignin') {
        toast('Login Failed: Incorrect username or password');
      } else {
        toast(`Error: ${result.error}`);
    }
    }
    if (result?.url) {
      router.replace('/dashboard');
    }
    
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-green-400 font-mono p-6">
      <div className="bg-black/80 border border-green-400 p-10 rounded-lg shadow-[0_0_20px_rgba(0,255,0,0.6)] animate-flicker w-full max-w-md">
        {/* Header */}
        <div className="space-y-4 text-center mb-6">
          <h1 className="text-4xl md:text-6xl font-bold uppercase tracking-widest text-green-400 drop-shadow-[0_0_10px_rgba(0,255,0,0.8)] animate-pulse">
            Join Incognito Talk
          </h1>
          <p className="text-lg md:text-2xl text-green-300 animate-flicker">
            Sign In to start your Incognito Adventure
          </p>
        </div>

        {/* Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      
            <FormField
              control={form.control}
              name="identifier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-green-300">Email/Username</FormLabel>
                    <Input
                      placeholder="email/username"
                      {...field}
                      className="bg-black/70 border border-green-400 text-green-400 placeholder-green-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-1"
                    />
                  <FormMessage className="text-red-600" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-green-300">Password</FormLabel>
                    <Input
                      type="password"
                      placeholder="password required"
                      {...field}
                      className="bg-black/70 border border-green-400 text-green-400 placeholder-green-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-1"
                    />
                  <FormMessage className="text-red-600" />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full bg-black border border-green-400 text-green-400 hover:bg-green-900/20 hover:shadow-[0_0_15px_rgba(0,255,0,0.7)] rounded-md py-2 font-mono transition-all duration-200 flex items-center justify-center gap-2"
            >
              Sign In
            </Button>
          </form>
        </Form>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-green-300 text-sm">
            Not a Member?{' '}
            <Link
              href={'/sign-up'}
              className="text-green-400 hover:text-green-500 underline"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};


