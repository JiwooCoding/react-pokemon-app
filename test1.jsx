
import { useEffect } from 'react'
import './App.css'
import axios from 'axios';
import { useState } from 'react';
import PokeCard from './components/pokeCard';

function App() {
  //모든 포켓몬 데이터를 가지고 있는 state
  const [allPokemons, setAllPokemons] = useState([]);

  //실제로 리스트로 보여주는 포켓몬 데이터를 가지고 있는 state
  const [displayedPokemons, setDisplayedPokemons] = useState([]);

  //한번에 보여주는 포켓몬 갯수
  const limitNum = 20;
  const url = `https://pokeapi.co/api/v2/pokemon/?limit=1008&offset=0`;

  const [searchTerm, setsearchTerm] = useState("");
  
  useEffect(()=>{
    fetchPokeData();
  },[]) 
  
  const filterDisplayedPokemonData = (allPokemonsData, displayedPokemons = []) => {
    const limit = displayedPokemons.length + limitNum;
    //모든 포켓몬 데이터에서 limitNum에서 더 가져오기
    const array = allPokemonsData.filter((pokemon, index) => index + 1 <= limit);
    return array;
  }

  const fetchPokeData = async() =>{
    try{
      //1008 포켓몬 데이터 받아오기
      const response = await axios.get(url);
      //모든 포켓몬 데이터 기억하기
      setAllPokemons(response.data.results);
      //실제로 화면에 보여줄 포켓몬 리스트 기억하는 state
      setDisplayedPokemons(filterDisplayedPokemonData(response.data.results));
    } catch (error) {
      console.log(error)
    }
  }

  const handleSearchInput = async(e) =>{
    setsearchTerm(e.target.value);
    if(e.target.value.length > 0){
      try {
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${e.target.value}`);
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
              onChange={handleSearchInput}
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
          {displayedPokemons.length > 0 ? 
          (
            displayedPokemons.map(({url,name},index)=>(
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
        {(allPokemons.length > displayedPokemons.length) && (displayedPokemons.length !== 1) &&
          (
            <button 
              className='bg-slate-800 px-6 py-2 my-4 text-base rounded-lg font-bold text-white'
              onClick={()=>setDisplayedPokemons(filterDisplayedPokemonData(allPokemons, displayedPokemons))}> 
                더보기
            </button>
          )
        }
        
      </div>
    </article>

  )
}

export default App
