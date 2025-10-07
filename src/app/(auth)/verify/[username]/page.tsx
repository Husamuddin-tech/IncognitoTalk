'use client';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { verifySchema } from '@/schemas/verifySchema';
import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { useRouter, useParams } from 'next/navigation'
import React from 'react'
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

const VerifyAccount = () => {

    const router = useRouter()
    const params = useParams<{username: string}>()
    
    // zod implementation
      const form = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema),

      });
      const onSubmit = async (data: z.infer<typeof verifySchema>) => {
        try {
            const response = await axios.post(`/api/verify-code`, {
                username: params.username,
                code: data.code
            })
            router.replace('/sign-in')
            toast(`Success: ${response.data.message}`)
        } catch(error) {
            console.log('Error in signup of user', error);
                  const axiosError = error as AxiosError<ApiResponse>;
                  toast.error('Signup failed', {
                    description: axiosError.response?.data.message,
                  });
        }
      }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-green-400 font-mono p-6">
  <div className="bg-black/80 border border-green-400 p-10 rounded-lg shadow-[0_0_25px_rgba(0,255,0,0.6)] animate-fade-in">
    <div className="text-center space-y-3 mb-8">
      <h1 className="text-4xl md:text-5xl font-bold uppercase tracking-widest text-green-400 drop-shadow-[0_0_10px_rgba(0,255,0,0.8)] animate-pulse">
        Verify Your Account
      </h1>
      <p className="text-green-300 text-lg animate-flicker">
        Enter the verification code sent to your email
      </p>
    </div>

    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8"
      >
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-green-300">Verification Code</FormLabel>
              <FormControl>
                <Input
                  type='text'
                  placeholder="Enter verification code"
                  {...field}
                  className="bg-black/60 border border-green-400 text-green-400 placeholder-green-700 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 w-full transition-all"
                />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="w-full bg-green-500 hover:bg-green-600 text-black font-semibold py-2 rounded-md shadow-[0_0_10px_rgba(0,255,0,0.8)] hover:shadow-[0_0_20px_rgba(0,255,0,1)] transition-all duration-300"
        >
          Submit
        </Button>
      </form>
    </Form>
  </div>
</div>

  )
}

export default VerifyAccount