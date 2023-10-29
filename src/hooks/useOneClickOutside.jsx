import { useEffect } from "react"

export default function useOneClickOutSide(ref, handler){
    useEffect(() => {
        const listener = (event) => {
            //모달 창 안을 클릭 했는지
            if(!ref.current || ref.current.contains(event.target)){
                return; // 모달 창 내부를 클릭한 경우, 아무 동작도 하지 않음 (return 없음)
            }
            //모달 창 밖을 클릭 했는지
            handler();
        }
      document.addEventListener('mousedown',listener);
      //mousedowm:마우스 눌렀을 때 발생하는 이벤트
    
      return () => {
        document.removeEventListener('mousedown',listener);
      } //이 부분이 없으면 이벤트 리스너가 계속 남아있게 되어 
      //메모리 누수와 불필요한 동작을 초래할 수 있습니다.
    }, [ref, handler])
    
}