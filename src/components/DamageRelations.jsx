import { useEffect, useState } from 'react'
import Type from './Type';
const DamageRelations = ({damages}) => {

const [damagePokemonForm, setDamagePokemonForm] = useState();

  useEffect(() => {
    //console.log(damages) : [{...}, {...}] => {key:value} 여기서 key값이 halt-damage-from 이런 애들
    const arrayDamage = damages.map((damage) => 
    separateObjectBetweenToAndFrom(damage))
    //console.log('arrayDamage',arrayDamage)
    
    if(arrayDamage.length === 2){
      const obj = joinDamageRelations(arrayDamage);
      setDamagePokemonForm(reduceDuplicateValues(postDamageValue(obj.from)));
    } else {
      setDamagePokemonForm(postDamageValue(arrayDamage[0].from));
    }

  }, [])
  
  
  const joinDamageRelations = (damage) => {
    return {
      to: joinObjects(damage,'to'),
      from:joinObjects(damage,'from')
    }
  }

  const reduceDuplicateValues = (damage) => {
    const duplicateVal = {
      double_damage:'4x',
      half_damage:'1/4x',
      no_damage:'0x'
    }
    const result = Object.entries(damage)
          .reduce((acc,[keyName,value]) => {
            const key = keyName;
            //console.log('newww',[keyName,value])
            const varifiedVal = filterForUniQVals(value, duplicateVal[key])

            return (acc = {[keyName]:varifiedVal, ...acc})
          },{})
          return result
  }

  const filterForUniQVals = (value,damageVal) => {
    const result =  value.reduce((acc, currentVal) => {
      const {url, name} = currentVal;
      const filterACC = acc.filter((a) => a.name !== name);
      return filterACC.length === acc.length
      ? (acc = [currentVal, ...acc])
      : (acc = [{damageValue: damageVal, name, url}, ...filterACC])
    },[])
    return result;
  }


  const joinObjects = (damage, string) => {
    const key = string;
    const firstArrayVal = damage[0][key]
    const secondArrayVal = damage[1][key]
    //console.log('1st',firstArrayVal)
    //console.log('2nd',secondArrayVal)
    const result = Object.entries(secondArrayVal)
      .reduce((acc, [keyName,value])=>{
        const result = firstArrayVal[keyName].concat(value);
        //console.log(firstArrayVal[keyName]) // firstArrayVal[keyName]는 firstArrayVal["no_damage"]와 같은 의미
        return (acc = {[keyName]:result, ...acc})
      },{})
      
      return result;
  }


  const postDamageValue = (damage) => {
      const result = Object.entries(damage)
            .reduce((acc, [keyName,value]) => {
              const key =  keyName;
              const valueOfkeyName = {
                double_damage:'2x',
                half_damage:'1/2x',
                no_damage:'0x'
              }
              return(acc= {[keyName]:value.map((i)=>({
                damageValue: valueOfkeyName[key], ...i
              })), ...acc})
            },{})
            console.log(result)
            return result;
  }



  const separateObjectBetweenToAndFrom = (damage) => {
    const from = filterDamageRelations('_from',damage);
    const to = filterDamageRelations('_to',damage);
    return {from, to}
  }

  const filterDamageRelations = (valueFilter, damage) => {
    const result = Object.entries(damage)
      .filter(([keyName,value]) => {
        return keyName.includes(valueFilter);
      })
      .reduce((acc,[keyName,value]) => {
        const changeName = keyName.replace(valueFilter,'');
        return (acc = {[changeName]:value,...acc})
      },{})
      return result;
  }

  return (
    <div className='flex gap-2 flex-col'>
      {damagePokemonForm
        ? (
          <>
            {Object.entries(damagePokemonForm).map(([keyName,value])=> {
              const key = keyName;
              const valuesOfKeyName = {
                double_damage: 'Week',
                half_damage:'Resistant',
                no_damage:'Immune'
              }
              return(
                <div key={key}>
                  <h3 className='capitalize font-medium text-sm md:text-base text-slate-500 text-center'>
                    {valuesOfKeyName[key]}
                  </h3>
                  <div className='flex flex-wrap gap-1 justify-center'>
                    {value.length > 0 
                      ? (value.map(({name, url, damageValue}) => {
                        return (
                          <Type
                            type={name}
                            key={url}
                            damageValue={damageValue}
                          />
                        )
                      })) 
                      :(
                        <Type
                          type={'none'}
                          key={'none'}
                        />
                      )
                    }
                  </div>
                </div>
              )
            })}
          </>
        )   
        : <div></div>
      }
    </div>
  )
}

export default DamageRelations