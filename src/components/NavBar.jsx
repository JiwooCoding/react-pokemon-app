import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components'
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut  } from "firebase/auth";
import app from '../firebase';
const NavBar = () => {

    //localStorage에 get할 'userData'가 있다면, 
    //JSON.parse해서 문자형으로 변환된 'userData'를 가지고 오고 
    //없다면 {} 빈 객체 반환
    const initiralUserData = localStorage.getItem('userData') ?
    JSON.parse(localStorage.getItem('userData')) : {};

    const [show, setShow] = useState(false);
    const {pathname} = useLocation();
    const [userData, setUserData] = useState(initiralUserData);

    //구글 로그인 연동(FireBase)
    const auth = getAuth(app);
    const provider = new GoogleAuthProvider();
    const handleAuth = () =>{
        signInWithPopup(auth, provider) //비동기 이기 때문에 응답이 오면,
        .then(result => {
            console.log(result) //로그인 한 user정보 담고 있음
            setUserData(result.user);
            //localStorage에 (result.user)데이터를 
            //JSON타입의 문자열로 변환해 'userData'(콘솔의 키 값에 보여질 변수)에 담아라
            localStorage.setItem("userData", JSON.stringify(result.user));
        })
        //구글 로그인 에러시 catch 사용해서 에러 잡기
        .catch(error => {
            console.error(error);
        })
    }


    //로그인 시 상태 체크
    const navigate = useNavigate();
    useEffect(() => {
        //user의 sign-in-state가 변할 때 (user)부분 호출
        const unsubscribe = onAuthStateChanged(auth, (user) => {
           if(!user){
            //user가 없을 때 (로그아웃 시)
            //로그아웃 상태라면 login페이지로 이동
            navigate('/login')
           }else if(user && pathname === "/login"){
            //user가 있고 로그인 페이지로 이동하려고 하면 
            //main페이지로 이동
            navigate('/');
           }
            console.log(user)
        })
    
      return () => {
        unsubscribe();
      }
    }, [pathname])
    


    const listener = () => {
        if(window.scrollY > 50){
            setShow(true)
        }else{
            setShow(false)
        }
    }

    useEffect(() => {
      window.addEventListener('scroll', listener)
    
      return () => {
        window.removeEventListener('scroll',listener) // 컴포넌트가 언마운트 될 때 listener함수 remove 해줌
      }
    }, [])
    
    //로그아웃(signOut from FireBase)
    const handleLogout = () =>{
        signOut(auth).then(()=> {
            setUserData({});
        })
        .catch(error => {
            alert(error.message)
        })
    }

  return (
    <NavWrapper show={show}>
        <Logo>
            <Image
                alt="Poke Logo"
                src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png"
                onClick={ () =>(window.location.href = "/") }
            />
        </Logo>
        {pathname === '/login' ? 
        (
            <Login onClick={handleAuth}>
            로그인
            </Login>
        ) : 
        <SignOut>
            <UserImg
                src={userData.photoURL}
                alt="user photo"
            />
            <Dropdown>
                <span onClick={handleLogout}>Sign out</span>
            </Dropdown>
        </SignOut>  
    }        
    </NavWrapper>
  )
}

const UserImg = styled.img`
    border-radius: 50%;
    width: 100%;
    height: 100%;
`

const Dropdown = styled.div`
    position: absolute;
    top: 48px; 
    right: 0px;
    background: rgb(19,19,19);
    border: 1px solid rgba(151,151,151,0.34);
    border-radius: 4px;
    box-shadow: rgb(0 0 0 /50%) 0px 0px 18px 0px;
    padding: 10px;
    font-size: 14px;
    letter-spacing: 3px;
    width: 100px;
    opacity: 0;
    color: #fff;
`

const SignOut = styled.div`
    position: relative;
    height: 48px;
    width: 48px;
    display: flex;
    cursor: pointer;
    align-items: center;
    justify-content: center;
    &:hover{
        ${Dropdown}{
            opacity: 1;
            transition-duration: 1s;
        }
    }
`

const Login = styled.a`
    background-color: rgba(0,0,0,0.4);
    padding: 8px 16px;
    text-transform: uppercase;
    letter-spacing: 1.55px;
    border: 1px solid #f9f9f9;
    border-radius: 4px;
    transition: all 0.2s ease 0s;
    color: white;
    display: flex;
    align-items: center;
    height:50%;
    &:hover {
    background-color: #f9f9f9;
    color: #000;
    border-color: transparent;
    }
`

const Image = styled.img`
    cursor:pointer;
    width:100%;
`

const Logo = styled.a`
    padding:0;
    width:50px;
    margin-top:4px;
`

const NavWrapper = styled.nav`
    position: fixed;
    top:0;
    left:0;
    right:0;
    height:70px;
    display:flex;
    justify-content: space-between;
    align-text: center;
    padding:0 36px;
    letter-spacing:16px;
    z-index:100;
    align-items: center;
    background-color: ${props => props.show ? "#ececec": "transparent"};
    box-shadow: ${props => props.show ? "0px 5px 5px rgba(0, 0, 0, 0.2)" : "transparent"}
`
export default NavBar