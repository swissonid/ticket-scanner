import type { MovieCardProps } from "../domain/movie"
import { cn } from "@/lib/utils"

export function MovieCard({ id, title, image, showTimes, selected, onSelect }: MovieCardProps) {
    return (
        <div className="relative rounded-2xl overflow-hidden aspect-[3/4]">
            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${image})` }} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/20" />

            <div className="absolute inset-0 p-6 flex flex-col justify-between">
                <h2 className="text-white text-2xl font-medium">{title}</h2>

                <div className="space-y-2">
                    {showTimes.map((time) => (
                        <div
                            key={`${id}-${time}`}
                            className="bg-white/90 text-black font-medium px-4 py-2 rounded-full w-24 text-center"
                        >
                            {time}
                        </div>
                    ))}
                </div>

                <button
                    onClick={() => onSelect(id)}
                    className={cn(
                        "absolute bottom-6 right-6 w-8 h-8 rounded-full border-2",
                        selected ? "bg-white border-white" : "border-white/50",
                    )}
                    aria-label={selected ? "Selected" : "Select movie"}
                />
            </div>
        </div>
    )
}

