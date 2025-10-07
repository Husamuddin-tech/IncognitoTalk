'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useDebounceCallback } from 'usehooks-ts';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { signUpSchema } from '@/schemas/signUpSchema';
import axios, { AxiosError } from 'axios';
import { ApiResponse } from '@/types/ApiResponse';
import { LoaderIcon } from 'lucide-react';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const SignUp = () => {
  const [username, setUsername] = useState('');
  const [usernameMessage, setUsernameMessage] = useState('');
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const debounced = useDebounceCallback(setUsername, 300);
  const router = useRouter();

  // toast("Event has been created.")

  // zod implementation
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
    },
  });

  useEffect(() => {
    const checkUsernameUnique = async () => {
      if (username) {
        setIsCheckingUsername(true);
        setUsername('');

        try {
          const response = await axios.get(
            `/api/check-username-unique?username=${username}`
          );
          setUsernameMessage(response.data.message);
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          setUsernameMessage(
            axiosError.response?.data.message ?? 'Error checking Username'
          );
        } finally {
          setIsCheckingUsername(false);
        }
      }
    };
    checkUsernameUnique();
  }, [username]);

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post<ApiResponse>('/api/sign-up', data);
      toast(`Success: ${response.data.message}`);
      router.replace(`/verify/${data.username}`);
      setIsSubmitting(false);
    } catch (error) {
      console.log('Error in signup of user', error);
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage = axiosError.response?.data.message;
      toast.error('Signup failed', {
        description: errorMessage,
      });
      setIsSubmitting(false);
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
            Sign Up to start your Incognito Adventure
          </p>
        </div>

        {/* Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem className="relative">
                  <FormLabel className="text-green-300">Username</FormLabel>
                  <FormControl>
                    {/* Wrap Input + loader in a div */}
                    <div className="relative">
                      <Input
                        placeholder="username required"
                        {...field}
                        className="bg-black/70 border border-green-400 text-green-400 placeholder-green-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-1 w-full"
                        onChange={(e) => {
                          field.onChange(e);
                          debounced(e.target.value);
                        }}
                      />

                      {/* Loader is absolutely positioned inside the wrapper */}
                      {isCheckingUsername && (
                        <LoaderIcon className="animate-spin text-green-400 absolute right-3 top-1/2 -translate-y-1/2" />
                      )}
                    </div>
                  </FormControl>
                  <p className={`text-sm ${usernameMessage === "Username is available" ? "text-green-500" : "text-red-500"}`}>{usernameMessage}</p>

                  <FormDescription className="text-green-500 text-sm">
                    This is your public display name.
                  </FormDescription>
                  <FormMessage className="text-red-600" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-green-300">Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="email required"
                      {...field}
                      className="bg-black/70 border border-green-400 text-green-400 placeholder-green-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-1"
                    />
                  </FormControl>
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
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="password required"
                      {...field}
                      className="bg-black/70 border border-green-400 text-green-400 placeholder-green-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-1"
                    />
                  </FormControl>
                  <FormMessage className="text-red-600" />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-black border border-green-400 text-green-400 hover:bg-green-900/20 hover:shadow-[0_0_15px_rgba(0,255,0,0.7)] rounded-md py-2 font-mono transition-all duration-200 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <LoaderIcon className="animate-spin text-green-400" /> Please
                  Wait
                </>
              ) : (
                'Signup'
              )}
            </Button>
          </form>
        </Form>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-green-300 text-sm">
            Already a Member?{' '}
            <Link
              href={'/sign-in'}
              className="text-green-400 hover:text-green-500 underline"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
