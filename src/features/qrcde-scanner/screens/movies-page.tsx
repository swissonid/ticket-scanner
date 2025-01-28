'use client';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar, X } from 'lucide-react';

interface Movie {
  id: number;
  name: string;
  price: number; // Price in CHF
}

const movies: Array<Movie> = [
  { id: 0, name: 'The Shawshank Redemption', price: 12.99 },
  { id: 1, name: 'The Dark Knight', price: 11.99 },
  { id: 2, name: 'Pulp Fiction', price: 10.99 },
  { id: 3, name: 'Inception', price: 13.99 },
  { id: 4, name: 'The Matrix', price: 9.99 },
  { id: 5, name: 'Forrest Gump', price: 12.99 },
  {
    id: 6,
    name: 'The Lord of the Rings: The Fellowship of the Ring',
    price: 14.99,
  },
  { id: 7, name: 'Spirited Away', price: 11.99 },
  { id: 8, name: 'Parasite', price: 10.99 },
  { id: 9, name: '12 Angry Men', price: 9.99 },
];

export default function MoviePage() {
  return (
    <main className="flex h-screen flex-grow flex-col">
      <AppBar />
      <MoviePageHeader />
      <MoviesList />
    </main>
  );
}

function MoviePageHeader() {
  return (
    <div className="flex flex-col gap-2 px-4 pb-4">
      <h1 className="text-2xl font-bold">Filmauswahl</h1>
      <div className="flex w-[40%] items-center rounded-xl border border-neutral-500">
        <Input
          type="email"
          placeholder={getTodaFormatted()}
          className="rounded-xl border-none"
        />
        <Button
          size="icon"
          variant="ghost"
          onClick={() => window.history.back()}
        >
          <Calendar />
        </Button>
      </div>
    </div>
  );
}

function AppBar() {
  return (
    <div className="flex h-14 w-full flex-row items-center">
      <Button variant="ghost" size="icon">
        <X />
      </Button>
    </div>
  );
}

function MoviesList() {
  return (
    <RadioGroup className="flex flex-col gap-2 px-4">
      {movies.map((movie, index) => (
        <MovieListItem movie={movie} key={index} />
      ))}
    </RadioGroup>
  );
}

function MovieListItem({ movie }: { movie: Movie }) {
  return (
    <div className="h-18 flex flex-row items-center gap-3 rounded-xl border border-neutral-500 px-3 py-2">
      <RadioGroupItem value={`${movie.id}`} id={movie.name} />
      <Label
        htmlFor={`${movie.name}`}
        className="flex flex-grow flex-row items-center justify-between"
      >
        <div className="flex w-[80%] flex-col">
          <span className="text-sm text-gray-500">Film</span>
          <span className="font-bold">{movie.name}</span>
        </div>

        <div className="flex flex-col items-end">
          <span className="text-sm text-gray-500">Preise</span>
          <span className="font-bold">{movie.price}</span>
        </div>
      </Label>
    </div>
  );
}

function getTodaFormatted() {
  const currentDate = new Date();
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'short',
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
  };
  const formattedDate = currentDate
    .toLocaleDateString('de-DE', options) // Use German locale for desired format
    .replace(',', '.') // Replace comma with period
    .replace(/\. /g, '.') // Remove space after period
    .replace('..', ', ');
  return formattedDate;
}
