export type Movie = {
    id: string
    title: string
    image: string
    showTimes: string[]
    prices: string[]
    selected?: boolean
}

export interface MovieCardProps extends Movie {
    onSelect: (id: string) => void
}

