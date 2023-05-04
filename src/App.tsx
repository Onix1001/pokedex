import { PokemonProvider, usePokemon } from "./store"


const SearchBox = () => {
  const { search, setSearch } = usePokemon()
  return <input type="text" placeholder="Search..." className='p-3 border-2 w-full rounded-md text-xl' value={search} onChange={(e) => setSearch(e.target.value)} />
}

const PokemonList = () => {

  const { pokemons, setPokemon } = usePokemon()
  return <div className='grid grid-cols-3 gap-5'>
    {pokemons.map((element, index) => {
      return <div key={index} className='flex flex-col justify-end items-center shadow-md p-3 gap-y-3'>
        <img src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${element.id}.svg`} alt="" />
        <p>#{element.id} - {element.name}</p>
        <button onClick={() => setPokemon(element)}>details</button>
      </div>
    })}
  </div>
}

const PokemonDetail = () => {

  const { pokemon } = usePokemon()

  return <div className="max-w-xl flex-1 flex items-center flex-col gap-y-5 p-10 border-l fixed">
    {Object.keys(pokemon).length === 0 ? "" :
      <>
        <h1>{pokemon.name}</h1>
        <img
          src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${pokemon.id}.svg`}
          alt={pokemon.name}
          className="w-80 h-80 "
        />
        {pokemon.stats?.map((element, index) => {
          const persen = Math.round((element.base_stat / 255) * 100)
          return <div className="flex w-full gap-3 items-center self-start" key={index}>
            <div className="flex-[0.4]">{element.stat.name}</div>
            <div className="flex-1 bg-neutral-200 rounded-full">
              <div
                className={`bg-blue-300 p-1 text-center rounded-full text-xs font-medium leading-none text-primary-100`}
                style={{ width: `${persen}%` }}
              >
                {element.base_stat}
              </div>
            </div>
          </div>
        })}
      </>
    }

  </div>
}

function App() {
  return (
    <PokemonProvider>
      <div className="flex">
        <div className="max-w-3xl mx-auto">
          <SearchBox />
          <PokemonList />
        </div>
        <PokemonDetail />
      </div>
    </PokemonProvider>
  )
}

export default App
