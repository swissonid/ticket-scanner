'use client';

import { useState, useRef, useTransition } from 'react';
import { X, Loader2, CalendarIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroupIndicator } from '@radix-ui/react-radio-group';
import { redeemVoucher } from '../actions/qrcode.server-actions';
import { VoucherIcon } from '../components/voucher-icon';

interface Movie {
  id: string;
  title: string;
  price: number;
  times?: string[];
}

const movies: Movie[] = [
  { id: '1', title: 'The Shawshank Redemption', price: 12.99 },
  { id: '2', title: 'The Dark Knight', price: 11.99 },
  { id: '3', title: 'Pulp Fiction', price: 10.99 },
  { id: '4', title: 'Inception', price: 13.99 },
  { id: '5', title: 'The Matrix', price: 9.99 },
  { id: '6', title: 'Forrest Gump', price: 12.99 },
  {
    id: '7',
    title: 'The Lord of the Rings: The Fellowship of the Ring',
    price: 14.99,
  },
  { id: '8', title: 'Spirited Away', price: 11.99 },
  { id: '9', title: 'Parasite', price: 10.99 },
  { id: '10', title: '12 Angry Men', price: 9.99 },
];

function getTodayFormatted() {
  const currentDate = new Date();
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'short',
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
  };
  const formattedDate = currentDate
    .toLocaleDateString('de-DE', options)
    .replace(',', '.')
    .replace(/\. /g, '.')
    .replace('..', ', ');
  return formattedDate;
}

export default function MovieList() {
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [selectedMovieId, setSelectedMovieId] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [isOpen, setIsOpen] = useState(false);
  const sheetTriggerRef = useRef<HTMLButtonElement>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const dateStr = getTodayFormatted();

  const handleRedeemVoucher = async () => {
    if (selectedMovie) {
      startTransition(async () => {
        try {
          console.log('start redemtion');
          const voucherId = new URLSearchParams(window.location.search).get(
            'voucherid'
          );
          if (!voucherId) {
            throw new Error('Voucher ID is missing');
          }
          const result = await redeemVoucher(voucherId);
          console.log(result);
          setIsOpen(false);
          router.push('/');
          router.refresh();
        } catch (error) {
          console.log(error);
          // Handle error (e.g., show an error message)
        }
      });
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <div className="space-y-6 bg-white p-4">
        <header className="space-y-4">
          <button className="-ml-2 p-2" onClick={() => router.back()}>
            <X className="h-6 w-6" />
          </button>
          <h1 className="text-4xl font-bold">Filmauswahl</h1>
          <div className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-4 py-2 text-sm">
            <span>{dateStr}</span>
            <CalendarIcon className="h-4 w-4" />
          </div>
        </header>
      </div>

      <div className="flex-1 overflow-auto px-4 pb-4">
        <RadioGroup className="space-y-1.5">
          {movies.map((movie) => (
            <Label
              key={movie.id}
              htmlFor={movie.id}
              className="flex cursor-pointer items-center justify-between rounded-2xl border bg-white p-4 transition-colors hover:bg-gray-50"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setSelectedMovieId(movie.id);
                setSelectedMovie(movie);
                setSelectedTime('');
                setIsOpen(true);
              }}
            >
              <div className="flex items-center gap-3">
                <RadioGroupItem
                  value={movie.id}
                  id={movie.id}
                  checked={selectedMovieId === movie.id}
                />
                <div>
                  <span className="text-sm">Film</span>
                  <p className="font-semibold">{movie.title}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-sm">Preise</span>
                <p className="font-semibold">{movie.price.toFixed(2)}</p>
              </div>
            </Label>
          ))}
        </RadioGroup>
      </div>

      <div className="bg-white p-4">
        <p className="text-center text-sm text-gray-500">
          Wählen Sie einen Film aus, um fortzufahren.
        </p>
      </div>

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <button
            ref={sheetTriggerRef}
            className="hidden"
            aria-label="Open Sheet"
          >
            Open Sheet
          </button>
        </SheetTrigger>
        <SheetContent side="bottom" className="min-h-[40vh] rounded-t-3xl">
          <SheetHeader className="relative">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute right-0 top-0 p-2"
            >
              <X className="h-6 w-6" />
            </button>
            <SheetTitle className="flex flex-col items-center gap-2 pt-6">
              <VoucherIcon />
              <span className="text-xl font-bold">Gutschein einlösen für:</span>
            </SheetTitle>
          </SheetHeader>
          {selectedMovie && (
            <div className="mt-6 space-y-6">
              <div>
                <Label className="text-gray-500">Film</Label>
                <h3 className="mb-4 text-xl font-semibold">
                  {selectedMovie.title}
                </h3>

                <Label className="text-gray-500">Veranstaltung</Label>
                <div className="mt-2 flex gap-2">
                  {['18:00', '20:00', '21:00'].map((time) => (
                    <Button
                      key={time}
                      variant={selectedTime === time ? 'default' : 'outline'}
                      onClick={() => setSelectedTime(time)}
                      className="rounded-full"
                    >
                      {time}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-gray-500">Preise</Label>
                <p className="text-2xl font-bold">
                  CHF {selectedMovie.price.toFixed(2)}
                </p>
              </div>

              <Button
                className="w-full rounded-lg py-6 text-lg"
                size="lg"
                onClick={handleRedeemVoucher}
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verarbeitung...
                  </>
                ) : (
                  'Gutschein Entwerten'
                )}
              </Button>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
