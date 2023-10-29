
import { useEffect } from 'react'
import './App.css'
import axios from 'axios';
import { useState } from 'react';
import PokeCard from './components/pokeCard';
import { useDebounce } from './hooks/useDebounce';

function App() {
  const [pokemon, setPokemon] = useState([]);
  const [offset, setoffset] = useState(0); //현재  포켓몬 목록에서 가져온 마지막 포켓몬의 위치
  const [limit, setlimit] = useState(20); //한번에 가져올 포켓몬의 수 
  const [searchTerm, setsearchTerm] = useState("");
  
  const debouncedSearchTerm = useDebounce(searchTerm,500);

  useEffect(()=>{
    fetchPokeData(true);
  },[]) 

  useEffect(() => {
    handleSearchInput(debouncedSearchTerm)
  }, [debouncedSearchTerm])
  
  
  const fetchPokeData = async(isFirstFetch) =>{
    try{
      const offsetValue = isFirstFetch ? 0 : offset + limit; //fetchPokeData(true)면 0 : (false)면 offset + limit
      const url = `https://pokeapi.co/api/v2/pokemon/?limit=${limit}&offset=${offsetValue}`;
      const response = await axios.get(url);
      //console.log(response.data.results);
      setPokemon([...pokemon,...response.data.results]);
      setoffset(offsetValue);
    } catch (error) {
      console.log(error)
    }
  }

  const handleSearchInput = async(searchTerm) =>{
    if(searchTerm.length > 0){
      try {
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${searchTerm}`);
        const pokemonData = {
          url:`https://pokeapi.co/api/v2/pokemon/${response.data.id}`,
          name: searchTerm
        }
        setPokemon([pokemonData])
      } catch (error) {
        setPokemon([]);
        console.log(error);
      }
    }else{
      fetchPokeData(true);
    }
  }

 
  return (
    <article className='pt-6'>
      <header className='flex flex-col gap-2 w-full px-4 z-50'>
        <div className='relative z-50'>
          <form className='relative flex justify-center items-center w-[20.5rem] h-6 rounded-lg m-auto'>
            <input
              type='text'
              value={searchTerm}
              onChange={(e) => setsearchTerm(e.target.value)}
              className='text-xs w-[20.5rem] bg-[hsl(214,13%,47%)] h-6 px-2 py-1 rounded-lg text-gray-300 text-center'
            />
            <button type='submit' 
              className='text-xs bg-slate-900 text-slate-300 w-[2.5rem] h-6 px-2 py-1 rounded-r-lg text-center absolute right-0 hover:bg-slate-700'>
              검색
            </button>
          </form>
        </div>
      </header>
      <section className='pt-6 flex flex-col justify-content items-center overflow-auto z-0'>
        <div className='flex flex-row flex-wrap gap-[16px] items-center justify-center px-2 max-w-4xl'>
          {pokemon.length > 0 ? 
          (
            pokemon.map(({url,name},index)=>(
                <PokeCard key={url} url={url} name={name}/>
            ))
          ) : 
          (
            <h2 className='font-medium text-lg text-slate-900 mb-1'>
              포켓몬이 없습니다.
            </h2>
          )}
        </div>
      </section>
      <div className='text-center'>
        <button 
        className='bg-slate-800 px-6 py-2 my-4 text-base rounded-lg font-bold text-white'
        onClick={()=>fetchPokeData(false)}> 
            더보기
        </button>
      </div>
    </article>

  )
}

export default App
