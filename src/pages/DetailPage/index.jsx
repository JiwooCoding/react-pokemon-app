import axios from 'axios';
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Loading } from '../../assets/Loading';
import { LessThan } from '../../assets/LessThan';
import { GreaterThan } from '../../assets/GreaterThan';
import { ArrowLeft } from '../../assets/ArrowLeft';
import { Balance } from '../../assets/Balance';
import { Vector } from '../../assets/Vector';
import Type from '../../components/Type';
import BaseStat from '../../components/BaseStat';
// import DamageRelations from '../../components/DamageRelations';
import DamageModal from '../../components/DamageModal';




const DetailPage = () => {

  const [pokemon, setPokemon] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const params = useParams();
  //params만 넣었을 때는 {id: 'pikachu'}
  //params.id 넣었을 때는 pikachu
  const pokemonId = params.id;
  //console.log(params.id); // id값 나옴 , 이유는? path에서 id값 받았기 때문에
  const baseUrl = 'https://pokeapi.co/api/v2/pokemon/';
  
  useEffect(() => {
    setIsLoading(true)
    fetchPokemonData(pokemonId);
  }, [pokemonId])
  
  async function fetchPokemonData(id){
    const url = `${baseUrl}${id}`;
    try {
      //객체분해
      //url안에 있는 data들만 뽑아오겠다
      //data의 이름을 pokemonData로 쓰겠다는 의미
      const {data: pokemonData} = await axios.get(url); 
      //console.log('$$$$$$$$$$$$$',pokemonData.types); // => types[{type:{name:'water',url:'https://~~/water'}}]
      if(pokemonData){
        const {name, id, types, weight, height, stats, abilities, sprites} = pokemonData;
        const nextAndPreviousPokemon = await getNextAndPreviousPokemon(id);
        //Promise.all: 여러 개의 비동기 작업을 병렬로 실행하고, 
        //모든 작업이 완료될 때까지 기다린 후 그 결과를 배열[]로 반환하는 메서드
        const DamageRelations = await Promise.all(
          types.map(async (i) => { // i : type:{name:'water',url:'https://~~/water'}} ...
            const type = await axios.get(i.type.url);
            return type.data.damage_relations;
          })
        )
        const formattedPokemonData = {
          id:id,
          name:name,
          weight:weight / 10,
          height: height / 10,
          previous: nextAndPreviousPokemon.previous,
          next: nextAndPreviousPokemon.next,
          abilities:formatPokemonAbilites(abilities),
          stats: formatPokemonStats(stats),
          DamageRelations,
          types: types.map(type => type.type.name), //type의 type.name
          sprites: formatPokemonSprites(sprites),
          description: await getPokemonDescription(id)
        }
        console.log(formattedPokemonData)
        setPokemon(formattedPokemonData)
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error)
      setIsLoading(false)
    }
  }//fetchPokemonData

  const filterAndFormatDescrition = (flavorText) => {
    const koreanDescription = flavorText
    ?.filter((text) => text.language.name === "ko")
    .map((text) => text.flavor_text.replace(/\r|\n|\f/g, ' '))
    return koreanDescription;
  }


  const getPokemonDescription = async(id) => {
    const url = `https://pokeapi.co/api/v2/pokemon-species/${id}/`;

    const {data:pokemonSpecies} = await axios.get(url);
    //console.log(pokemonSpecies);
    const descriptions = filterAndFormatDescrition(pokemonSpecies.flavor_text_entries)
  
    //여러개의 문장 중 하나가 랜덤으로 보여짐
    return descriptions[Math.floor(Math.random() * descriptions.length)]

  }


  const formatPokemonSprites = (sprites) => {
    const newSprites = {...sprites};
    //console.log(Object.keys(newSprites))
    Object.keys(newSprites).forEach(key => {
      if(typeof newSprites[key] !== 'string'){
        delete newSprites[key];
      }
    }); //키들만 배열에 담아둠
    console.log(Object.values(newSprites));
    return Object.values(newSprites);
  }

  const formatPokemonAbilites = (abilities) => {
    //포켓몬의 ability가 2개 이상이면 filter
    //filter 첫번째 인수 사용 하지 않으면 언더라인 (_)
    return abilities.filter((_, index) => index <= 1) 
                    .map((obj) => obj.ability.name.replaceAll('-',' ')) // ["능력1","능력2"]
  }

  const formatPokemonStats = ([
    setHP,
    setATT,
    setDEF,
    setSPATT,
    setSPDEF,
    setSPD
  ]) => [
    {name:'Hit Points', baseStat: setHP.base_stat},
    {name:'Attack', baseStat: setATT.base_stat},
    {name:'Defense', baseStat: setDEF.base_stat},
    {name:'Special Attack', baseStat: setSPATT.base_stat},
    {name:'Special Defense', baseStat: setSPDEF.base_stat},
    {name:'Speed', baseStat: setSPD.base_stat},
  ]

  

  async function getNextAndPreviousPokemon(id) {
    const urlPokemon = `${baseUrl}?limit=1&offset=${id - 1}`;
    const {data: pokemonData} = await axios.get(urlPokemon);
    const nextResponse = pokemonData.next && (await axios.get(pokemonData.next));
    const previousResponse = pokemonData.previous && (await axios.get(pokemonData.previous));
    return {
      next: nextResponse?.data?.results?.[0]?.name, // ?: 방어코드, 해당 데이터가 없을 경우 계속 데이터를 찾아서 undefinded 오류 나지 않게끔 만듦
      previous: previousResponse?.data?.results?.[0]?.name
    }
  }

  if(isLoading) {
    return (
      <div className={`absolute h-auto w-auto top-1/3 -translate-x-1/2 left-1/2 z-50`}>
        <Loading className='w-12 h-12 z-50 animate-spin text-slate-900' />
      </div>
    )
  }

  if(!isLoading && !pokemon){
    return <div>not found...</div>
  }

  const img = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon?.id}.png`;
  const bg = `bg-${pokemon?.types?.[0]}`;
  const text = `text-${pokemon?.types?.[0]}`;

  console.log(pokemon?.DamageRelations);

  return (
    <article className='flex items-center gap-1 flex-col w-full'>
      <div className={`${bg} w-auto h-full flex flex-col z-0 items-center justify-end relative overflow-hidden`}>
        {pokemon.previous && (
          <Link className='absolute top-[40%] -translate-y-1/2 z-50 left-1 w-3'
                to={`/pokemon/${pokemon.previous}`}>
            <LessThan className='w-5 h-8 p-1' />
          </Link>
        )}
        {pokemon.next && (
          <Link className='absolute top-[40%] -translate-y-1/2 z-50 right-1 w-3'
                to={`/pokemon/${pokemon.next}`}>
            <GreaterThan className='w-5 h-8 p-1' />
          </Link>
        )}
          <section className='w-full flex flex-col z-20 items-center justify-end relative h-full'>
            <div className='absolute z-30 top-6 flex items-center w-full justify-between px-2'>
              <div className='flex items-center gap-1'>
                <Link to='/' className='text-zinc-200'>
                  <ArrowLeft className='w-6 h-8' />
                </Link>
                <h1 className='text-zinc-200 font-bold text-xl capitalize'>
                  {pokemon.name}
                </h1>
              </div>
              <div className='text-zinc-200 font-bold text-md'>
                #{pokemon.id.toString().padStart(3,'0')}
              </div>
            </div>
            <div className='relative h-auto max-w-[15.5rem] z-20 mt-6 -mb-16'>
              <img
              src={img}
              width="100%"
              height="auto"
              loading='lazy'
              alt={pokemon.name}
              className='object-contain h-full'
              onClick={() => setIsModalOpen(true)}
            />
            </div>
          </section>
          <section className='w-full min-h-[65%] h-full bg-gray-800 z-10 pt-14 flex flex-col items-center gap-3 px-5 pb-4'>
            <div className='flex items-center justify-center gap-4'> 
              {pokemon.types.map((type) => (
                <Type key={type} type={type} />
              ))}
            </div>
            <h2 className={`text-base font-semibold ${text}`}>
              정보
            </h2>
            <div className='flex w-full items-center justify-between max-w-[400px] text-center'>
              <div className='w-full'>
                <h4 className='text-[0.5rem] text-zinc-100'>Weight</h4>
                  <div className='text-sm flex mt-1 gap-2 justify-center text-zinc-200'>
                    <Balance/>
                    {pokemon.weight}kg
                  </div>
              </div>
              <div className='w-full'>
                <h4 className='text-[0.5rem] text-zinc-100'>Heights</h4>
                  <div className='text-sm flex mt-1 gap-2 justify-center text-zinc-200'>
                    <Vector/>
                    {pokemon.height}m
                  </div>
              </div>
              <div className='w-full'>
                <h4 className='text-[0.5rem] text-zinc-100'>ability</h4>
                  <div className='text-sm mt-1 gap-2 justify-center text-zinc-200'>
                    {pokemon.abilities.map((ability) =>(
                      <div key={ability} className='text-zinc-200 text-[0.5rem] capitalize'>{ability}</div>
                      ))}
                  </div>
              </div>
            </div>
            <h2 className={`text-base font-semibold ${text}`}>
              기본 능력치
            </h2>
            <div className='w-full'>
              <table>
                <tbody>
                  {pokemon.stats.map((stat)=>(
                      <BaseStat
                        key={stat.name}
                        valueStat={stat.baseStat}
                        nameStat={stat.name}
                        type={pokemon.types[0]}
                      />
                  ))}
                </tbody>
              </table>
            </div>
            <h2 className={`text-base font-semibold ${text}`}>
              설명
            </h2>
            <p className='text-md leading-4 font-sans text-zinc-200 max-w-[30rem] text-center'>
              {pokemon.description}
            </p>
            <div className='flex my-8 flex-wrap justify-center'>
                {pokemon.sprites.map((url,index) => (
                  <img
                    key={index}
                    src={url}
                    alt="sprites"
                  />
                ))}
            </div>
          </section>
      </div>
      {isModalOpen && (
              <DamageModal 
                setIsModalOpen={setIsModalOpen} // 수정된 부분
                damages={pokemon.DamageRelations} 
              />
          )}
    </article>
)}

export default DetailPage