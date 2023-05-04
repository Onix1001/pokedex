import { useEffect, useReducer, useCallback, useMemo, createContext, useContext } from 'react'

interface Pokemons {
    name: string,
    url: string
}

interface Pokemon {
    abilities?: string[],
    base_experience?: number,
    forms?: string[],
    height?: number,
    id?: number,
    name?: string,
    wieght?: number,
    stats?: PokemonStats[]
}

type PokemonStats = {
    base_stat: number,
    effort: number,
    stat: Pokemons
}

export const usePokemonSource = (): { pokemons: Pokemon[], search: string, setSearch: (search: string) => void, pokemon: Pokemon, setPokemon: (pokemon: Pokemon) => void } => {

    type PokemonState = {
        pokemons: Pokemon[];
        search: string;
        pokemon: Pokemon
    }
    type PokemonAction = { type: "setPokemons", payload: Pokemon[]; } | { type: "setSearch", payload: string; } | { type: "setPokemon", payload: Pokemon }
    const [{ pokemons, search, pokemon }, dispatch] = useReducer((state: PokemonState, action: PokemonAction) => {
        switch (action.type) {
            case "setPokemons":
                return { ...state, pokemons: action.payload }
            case "setSearch":
                return { ...state, search: action.payload }
            case "setPokemon":
                return { ...state, pokemon: action.payload }
        }
    }, {
        pokemons: [],
        search: "",
        pokemon: {}
    })

    useEffect(() => {
        FetchPokemon()
    }, [])

    const FetchPokemon = async () => {
        const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=200&offset=0")
        const data = await response.json()

        try {
            const res = await Promise.all(data.results.map((e: Pokemons) => fetch(e.url).then(response => response.json())))
            dispatch({ type: "setPokemons", payload: res })
        } catch (error) {
            console.log(error)
        }
    }

    const setSearch = useCallback((search: string) => {
        dispatch({
            type: "setSearch",
            payload: search
        })
    }, [])

    const setPokemon = useCallback((pokemon: Pokemon) => {
        dispatch({ type: "setPokemon", payload: pokemon })
    }, [])

    const filteredPokemon = useMemo(() => pokemons.filter((p) => p.name?.includes(search)), [pokemons, search])

    return { pokemons: filteredPokemon, search, setSearch, pokemon, setPokemon }
}

export const PokemonContext = createContext<ReturnType<typeof usePokemonSource>>(
    {} as unknown as ReturnType<typeof usePokemonSource>
)

export const usePokemon = () => useContext(PokemonContext)

export const PokemonProvider = ({ children }: { children: React.ReactNode }) => (
    <PokemonContext.Provider value={usePokemonSource()}>
        {children}
    </PokemonContext.Provider>
)

