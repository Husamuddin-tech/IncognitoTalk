'use client'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import messages from '@/messages.json';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

const Home = () => {
  return (
    <>
    <main className="flex flex-col items-center justify-center min-h-screen bg-black text-green-400 font-mono px-6 py-12 gap-12">
  {/* Hero Section */}
  <section className="text-center max-w-3xl">
    <h1 className="text-5xl md:text-7xl font-extrabold tracking-widest uppercase drop-shadow-[0_0_20px_rgba(0,255,0,0.8)] animate-pulse mb-6">
      Incognito Talk
    </h1>
    <p className="text-green-300 text-lg md:text-2xl leading-relaxed animate-flicker">
      Connect. Chat. Vanish.
      <br />
      Join the most secure and anonymous communication network ever built.
    </p>
  </section>

  {/* Messages Carousel */}
  <div className="w-full max-w-3xl">
    <Carousel
      plugins={[Autoplay({ delay: 2500 })]}
      className="w-full"
    >
      <CarouselContent className="w-full">
        {messages.map((message, index) => (
          <CarouselItem key={index} className="w-full">
            <div className="p-4">
              <Card className="bg-black/70 border border-green-400 rounded-lg shadow-[0_0_15px_rgba(0,255,0,0.6)] hover:shadow-[0_0_25px_rgba(0,255,0,0.8)] transition-all duration-300">
                <CardHeader className="text-green-200 text-lg font-semibold px-4 pt-4">
                  {message.title}
                </CardHeader>
                <CardContent className="flex items-center justify-center p-6 text-center">
                  <span className="text-2xl md:text-3xl font-semibold text-green-100">
                    {message.content}
                  </span>
                </CardContent>
                <div className="px-4 pb-4 text-green-300 text-sm text-right">
                  {message.received}
                </div>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 text-green-400 bg-black/30 rounded-full p-2 hover:bg-black/50 hover:text-green-200 transition-colors shadow-md" />
<CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 text-green-400 bg-black/30 rounded-full p-2 hover:bg-black/50 hover:text-green-200 transition-colors shadow-md" />

    </Carousel>
  </div>
</main>

<footer className="mt-12 text-center text-green-700 text-sm">
  © {new Date().getFullYear()} Incognito Talk — Where Privacy Speaks
</footer>

    </>
  );
};

export default Home;
