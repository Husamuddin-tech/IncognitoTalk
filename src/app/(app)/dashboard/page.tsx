'use client'

import MessageCard from '@/components/MessageCard'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Message, User } from '@/model/User'
import { AcceptMessageSchema } from '@/schemas/acceptMessageSchema'
import { ApiResponse } from '@/types/ApiResponse'
import { zodResolver } from '@hookform/resolvers/zod'
import { Separator } from '@radix-ui/react-separator'
import axios, { AxiosError } from 'axios'
import { LoaderIcon, RefreshCcw } from 'lucide-react'
import { useSession } from 'next-auth/react'
import React, { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

function Dashboard() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSwitchLoading, setIsSwitchLoading] = useState(false)

  const { data: session } = useSession()

  const form = useForm({
    resolver: zodResolver(AcceptMessageSchema),
    defaultValues: { acceptMessage: false },
  })

  const { register, watch, setValue } = form
  const acceptMessage = watch('acceptMessage')

  const fetchAcceptMessages = useCallback(async () => {
    setIsSwitchLoading(true)
    try {
      const response = await axios.get<ApiResponse>('/api/accept-messages')
      setValue('acceptMessage', response.data.isAcceptingMessages ?? false)
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast.error(axiosError.response?.data.message ?? 'Failed to fetch message settings')
    } finally {
      setIsSwitchLoading(false)
    }
  }, [setValue])

  const fetchMessages = useCallback(async (refresh = false) => {
    setIsLoading(true)
    try {
      const response = await axios.get<ApiResponse>('/api/get-messages')
      setMessages(response.data.messages || [])
      if (refresh) toast('Refreshed Messages')
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast.error(axiosError.response?.data.message ?? 'Failed to fetch messages')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!session || !session.user) return
    fetchMessages()
    fetchAcceptMessages()
  }, [session, fetchMessages, fetchAcceptMessages])

  const handleSwitchChange = async () => {
    setIsSwitchLoading(true)
    try {
      const response = await axios.post<ApiResponse>('/api/accept-messages', {
        acceptMessages: !acceptMessage,
      })
      setValue('acceptMessage', !acceptMessage)
      toast(response.data.message)
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast.error(axiosError.response?.data.message ?? 'Failed to update message settings')
    } finally {
      setIsSwitchLoading(false)
    }
  }

  if (!session || !session.user) return null

  const { username } = session.user as User
  const profileUrl = `${window.location.origin}/u/${username}`
  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl)
    toast('URL Copied!')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black via-black/95 to-black/90 px-4 py-10">
      <div className="my-10 mx-4 md:mx-8 lg:mx-auto p-6 sm:p-8 bg-gradient-to-b from-black via-black/90 to-black/70 border border-green-500 text-green-300 rounded-2xl shadow-[0_0_25px_rgba(0,255,0,0.4)] w-full max-w-6xl transition-all duration-500 hover:shadow-[0_0_45px_rgba(0,255,0,0.8)] backdrop-blur-md">
        
        {/* Dashboard Title */}
        <h1 className="text-3xl sm:text-4xl font-extrabold mb-8 text-center text-green-400 drop-shadow-[0_0_12px_rgba(0,255,0,0.6)] tracking-wider animate-pulse">
          🧠 User Dashboard
        </h1>

        {/* Unique Link Section */}
        <div className="mb-10">
          <h2 className="text-lg sm:text-xl font-semibold mb-3 text-green-300 tracking-wide flex items-center gap-2">
            🔗 Your Unique Profile Link
          </h2>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <input type="text" value={profileUrl} disabled
              className="flex-1 bg-black/60 border border-green-500 text-green-300 placeholder-green-800 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-black transition-all duration-300 select-all cursor-pointer" />
            <Button onClick={copyToClipboard} className="px-6 py-2 text-black font-semibold bg-green-400 hover:bg-green-500 rounded-md shadow-[0_0_15px_rgba(0,255,0,0.6)] hover:shadow-[0_0_35px_rgba(0,255,0,1)] transition-all duration-300 active:scale-95">
              Copy
            </Button>
          </div>
          <p className="text-xs text-green-600 mt-2 italic">
            Share this link to receive anonymous messages securely.
          </p>
        </div>

        {/* Switch Section */}
        <div className="mb-8 flex items-center justify-between bg-black/50 border border-green-500/30 rounded-lg p-3">
          <div className="flex items-center gap-3">
            <Switch
              {...register('acceptMessage')}
              checked={acceptMessage ?? false}
              onCheckedChange={handleSwitchChange}
              disabled={isSwitchLoading}
              className="data-[state=checked]:bg-green-400 data-[state=unchecked]:bg-gray-700 transition-all"
            />
            <span className="text-sm sm:text-base">
              Accept Messages:
              <span className="ml-1 font-semibold text-green-400">
                {acceptMessage ? " On" : " Off"}
              </span>
            </span>
          </div>
          {isSwitchLoading && (
            <LoaderIcon className="h-4 w-4 text-green-400 animate-spin" />
          )}
        </div>

        <Separator className="bg-green-500 opacity-40 mb-6" />

        {/* Refresh Button */}
        <div className="flex justify-end mb-4">
          <Button
            className="flex items-center gap-2 border border-green-400 text-green-400 hover:bg-green-400 hover:text-black transition-all duration-300 rounded-md px-4 py-2 shadow-[0_0_15px_rgba(0,255,0,0.3)] active:scale-95"
            variant="outline"
            onClick={(e) => { e.preventDefault(); fetchMessages(true) }}
          >
            {isLoading ? <LoaderIcon className="h-4 w-4 animate-spin" /> : <RefreshCcw className="h-4 w-4" />}
            Refresh
          </Button>
        </div>

        {/* Messages Section */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {messages.length > 0 ? (
            messages.map((message) => (
              <div key={message._id} className="animate-fadeIn">
                <MessageCard message={message} onMessageDelete={(id) => setMessages(messages.filter(m => m._id !== id))} />
              </div>
            ))
          ) : (
            <p className="text-center text-green-700 text-sm sm:text-base italic">
              No messages to display yet — your inbox awaits 🌱
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard








// 'use client'

// import MessageCard from '@/components/MessageCard'
// import { Button } from '@/components/ui/button'
// import { Switch } from '@/components/ui/switch'
// import { Message, User } from '@/model/User'
// import { AcceptMessageSchema } from '@/schemas/acceptMessageSchema'
// import { ApiResponse } from '@/types/ApiResponse'
// import { zodResolver } from '@hookform/resolvers/zod'
// import { Separator } from '@radix-ui/react-separator'


// import axios, { AxiosError } from 'axios'
// import { LoaderIcon, RefreshCcw } from 'lucide-react'
// import { useSession } from 'next-auth/react'
// import React, { useCallback, useEffect, useState } from 'react'
// import { useForm } from 'react-hook-form'
// import { toast } from 'sonner'

// function Dashboard() {
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [isSwitchLoading, setIsSwitchLoading] = useState(false);

//   const handleDeleteMessage = (messageId: string) => {
//     setMessages(messages.filter((message) => message._id !== messageId));
//   };

//   const { data: session, status } = useSession();

//   const form = useForm({
//     resolver: zodResolver(AcceptMessageSchema),
//     defaultValues: {
//     acceptMessage: false,
//   },
//   });

//   const { register, watch, setValue } = form;
//   const acceptMessage = watch('acceptMessage');

//   const fetchAcceptMessages = useCallback(async () => {
//     setIsSwitchLoading(true);
//     try {
//       const response = await axios.get<ApiResponse>('/api/accept-messages');
//       setValue('acceptMessage', response.data.isAcceptingMessages ?? false);
//     } catch (error) {
//       const axiosError = error as AxiosError<ApiResponse>;
//       toast.error(axiosError.response?.data.message ??
//           'Failed to fetch message settings');
//     } finally {
//       setIsSwitchLoading(false);
//     }
//   }, [setValue]);

//   const fetchMessages = useCallback(
//     async (refresh: boolean = false) => {
//       setIsLoading(true);
//       setIsSwitchLoading(false);
//       try {
//         const response = await axios.get<ApiResponse>('/api/get-messages');
//         setMessages(response.data.messages || []);
//         if (refresh) {
//           toast('Refreshed Messages');
//         }
//       } catch (error) {
//         const axiosError = error as AxiosError<ApiResponse>;
//         toast.error(axiosError.response?.data.message ?? 'Failed to fetch messages');
//       } finally {
//         setIsLoading(false);
//         setIsSwitchLoading(false);
//       }
//     },
//     [setIsLoading, setMessages]
//   );

//   // Fetch initial state from the server
//   useEffect(() => {
//     if (!session || !session.user) return;

//     fetchMessages();

//     fetchAcceptMessages();
//   }, [session, setValue, fetchAcceptMessages, fetchMessages]);

//   // Handle switch change
//   const handleSwitchChange = async () => {
//     try {
//       const response = await axios.post<ApiResponse>('/api/accept-messages', {
//         acceptMessages: !acceptMessage,
//       });
//       setValue('acceptMessage', !acceptMessage);
//       toast(response.data.message);
//     } catch (error) {
//       const axiosError = error as AxiosError<ApiResponse>;
//       toast(axiosError.response?.data.message ??
//           'Failed to update message settings');
//     }
//   };

//   if (status === 'loading') return <div>Loading...</div>;
// if (!session?.user) return <div>User not found</div>;

//   const { username } = session.user as User;

//   const baseUrl = `${window.location.protocol}//${window.location.host}`;
//   const profileUrl = `${baseUrl}/u/${username}`;

//   const copyToClipboard = () => {
//     navigator.clipboard.writeText(profileUrl);
//     toast('URL Copied!');
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black via-black/95 to-black/90 px-4 py-10">
//   <div className="my-10 mx-4 md:mx-8 lg:mx-auto p-6 sm:p-8 bg-gradient-to-b from-black via-black/90 to-black/70 border border-green-500 text-green-300 rounded-2xl shadow-[0_0_25px_rgba(0,255,0,0.4)] w-full max-w-6xl transition-all duration-500 hover:shadow-[0_0_45px_rgba(0,255,0,0.8)] backdrop-blur-md">

//     {/* Dashboard Title */}
//     <h1 className="text-3xl sm:text-4xl font-extrabold mb-8 text-center text-green-400 drop-shadow-[0_0_12px_rgba(0,255,0,0.6)] tracking-wider animate-pulse">
//       🧠 User Dashboard
//     </h1>

//     {/* Unique Link Section */}
//     <div className="mb-10">
//       <h2 className="text-lg sm:text-xl font-semibold mb-3 text-green-300 tracking-wide flex items-center gap-2">
//         🔗 Your Unique Profile Link
//       </h2>
//       <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
//         <input
//           type="text"
//           value={profileUrl}
//           disabled
//           className="flex-1 bg-black/60 border border-green-500 text-green-300 placeholder-green-800 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-black transition-all duration-300 select-all cursor-pointer"
//         />
//         <Button
//           onClick={copyToClipboard}
//           className="px-6 py-2 text-black font-semibold bg-green-400 hover:bg-green-500 rounded-md shadow-[0_0_15px_rgba(0,255,0,0.6)] hover:shadow-[0_0_35px_rgba(0,255,0,1)] transition-all duration-300 active:scale-95"
//         >
//           Copy
//         </Button>
//       </div>
//       <p className="text-xs text-green-600 mt-2 italic">
//         Share this link to receive anonymous messages securely.
//       </p>
//     </div>

//     {/* Switch Section */}
//     <div className="mb-8 flex items-center justify-between bg-black/50 border border-green-500/30 rounded-lg p-3">
//       <div className="flex items-center gap-3">
//         <Switch
//           // {...register('acceptMessage')}
//           checked={acceptMessage ?? false}
//           onCheckedChange={handleSwitchChange}
//           disabled={isSwitchLoading}
//           className="data-[state=checked]:bg-green-400 data-[state=unchecked]:bg-gray-700 transition-all"
//         />
//         <span className="text-sm sm:text-base">
//           Accept Messages:
//           <span className="ml-1 font-semibold text-green-400">
//             {acceptMessage ? " On" : " Off"}
//           </span>
//         </span>
//       </div>
//       {isSwitchLoading && (
//         <LoaderIcon className="h-4 w-4 text-green-400 animate-spin" />
//       )}
//     </div>

//     <Separator className="bg-green-500 opacity-40 mb-6" />

//     {/* Refresh Button */}
//     <div className="flex justify-end mb-4">
//       <Button
//         className="flex items-center gap-2 border border-green-400 text-green-400 hover:bg-green-400 hover:text-black transition-all duration-300 rounded-md px-4 py-2 shadow-[0_0_15px_rgba(0,255,0,0.3)] active:scale-95"
//         variant="outline"
//         onClick={(e) => {
//           e.preventDefault();
//           fetchMessages(true);
//         }}
//       >
//         {isLoading ? (
//           <LoaderIcon className="h-4 w-4 animate-spin" />
//         ) : (
//           <RefreshCcw className="h-4 w-4" />
//         )}
//         Refresh
//       </Button>
//     </div>

//     {/* Messages Section */}
//     <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//       {messages.length > 0 ? (
//         messages.map((message) => (
//           <div key={String(message._id)} className="animate-fadeIn">
//             <MessageCard
//               message={message}
//               onMessageDelete={handleDeleteMessage}
//             />
//           </div>
//         ))
//       ) : (
//         <p className="text-center text-green-700 text-sm sm:text-base italic">
//           No messages to display yet — your inbox awaits 🌱
//         </p>
//       )}
//     </div>
//   </div>
// </div>



//   )
// }

// export default Dashboard