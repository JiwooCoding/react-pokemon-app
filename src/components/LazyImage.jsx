import { useEffect, useState } from 'react'

const LazyImage = ({url,alt}) => {
  const [isLoading, setIsLoading] = useState(true); //디폴트 값은 트루: 로딩 중이라는 의미
  const [opacity, setOpacity] = useState('opacity-0');

  useEffect(() => {
    isLoading ? setOpacity('opacity-0') : setOpacity('opacity-100') //로딩 상태 중이면 사진 불투명 0, 로딩 중 아니고 사진 데이터 가지고 왔으면 사진 불투명 1
  }, [isLoading]) //의존성 배열: 즉, isLoading 상태가 변경될 때만 useEffect 실행된다는 의미
  

  return (
    <>
      {isLoading && (
        <div className='absolute h-full z-10 flex items-center justify-center'>
          ...loading
        </div>
      )}
      <img
        src={url}
        alt={alt}
        width="100%"
        height="auto"
        loading='lazy'
        onLoad={()=>setIsLoading(false)} //로딩 다 되어서 사진 데이터 가지고 온 상태는 false
        className={`object-contain h-full ${opacity}`}
      />
    </>
  )
}

export default LazyImage