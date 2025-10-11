'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
// import { Button } from './ui/button';
import { X } from 'lucide-react';
import { Message } from '@/model/User';
import { toast } from 'sonner';
import axios, { AxiosError } from 'axios';
import { ApiResponse } from '@/types/ApiResponse';

type MessageCardProps = {
    message: Message,
    onMessageDelete: (messageId: string) => void
}

const MessageCard = ({ message, onMessageDelete}: MessageCardProps) => {
    const handleDeleteConfirm = async () => {
    try {
      const response = await axios.delete<ApiResponse>(
        `/api/delete-message/${message._id}`
      );
      toast(response.data.message,);
      onMessageDelete(message._id as string);

    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast(
        axiosError.response?.data.message ?? 'Failed to delete message'
      );
    } 
  };
  return (
    <Card className="bg-black/70 border border-green-500 rounded-2xl shadow-[0_0_20px_rgba(0,255,0,0.4)] hover:shadow-[0_0_35px_rgba(0,255,0,0.8)] transition-all duration-300">
  <CardHeader className="flex justify-between items-start gap-2 p-4 border-b border-green-500/30">
    <CardTitle className="text-green-300 font-semibold text-lg sm:text-xl break-words">
      {message.content}
    </CardTitle>
    
    {/* Minimal Delete Button */}
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button className="w-6 h-6 flex items-center justify-center text-red-500 hover:text-red-600 transition-colors duration-200 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500">
          <X className="w-4 h-4" />
        </button>
      </AlertDialogTrigger>
      
      <AlertDialogContent className="bg-black/90 text-green-300 border border-green-500 rounded-2xl p-6 shadow-[0_0_25px_rgba(0,255,0,0.4)]">
        <AlertDialogHeader className="mb-4">
          <AlertDialogTitle className="text-lg sm:text-xl font-bold text-green-400">
            Are you absolutely sure?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-green-300 text-sm sm:text-base">
            This action cannot be undone. This will permanently delete your
            message.
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <AlertDialogFooter className="flex justify-end gap-2 mt-4">
          <AlertDialogCancel className="bg-gray-700 hover:bg-gray-800 text-green-300 rounded-md px-4 py-2 transition-all duration-300">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDeleteConfirm}
            className="bg-red-600 hover:bg-red-700 text-white rounded-md px-4 py-2 shadow-[0_0_10px_rgba(255,0,0,0.4)] hover:shadow-[0_0_20px_rgba(255,0,0,0.7)] transition-all duration-300"
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </CardHeader>

  <CardContent className="p-4 text-green-300"></CardContent>
</Card>


  );
};

export default MessageCard;
