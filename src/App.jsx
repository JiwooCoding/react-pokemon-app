import React from 'react'
import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom'
import MainPage from './pages/MainPage'
import DetailPage from './pages/DetailPage'
import LoginPage from './pages/LoginPage'
import NavBar from './components/NavBar'

const Layout = () => {
  return(
    <>
      <NavBar/>
      <br/>
      <br/>
      <br/>
      <Outlet/>
    </>
  )
}


const App = () => {
  return (

    // 만약 localhost:4000/ 이면 Layout이 레이아웃 되고 MainPage가 옴
    //      localhost:4000/login 이면 Layout이 레이아웃 되고 LoginPage가 옴

    <BrowserRouter>
      <Routes>
        {/* 중첩라우트 */}
        <Route path='/' element={<Layout/>}>
          <Route index element={<MainPage/>} />
          <Route path='/pokemon/:id' element={<DetailPage/>} />
          <Route path='login' element={<LoginPage/>} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App