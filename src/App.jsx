import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter } from 'react-router-dom'
import { Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Home from './pages/Home'
import NavBar from './components/NavBar'
import EditTask from './pages/EditTask'


function App() {


  return (
      <>
        <main className='main-content'>
          <Routes>
            <Route path="/" element={<Home />}/>
            <Route path="/login" element={<Login />}/>
            <Route path="/signup" element={<Signup />}/>
            <Route path="/edittask" element={<EditTask />}/>
          
          </Routes>
        </main>
      
      </>


  )
}

export default App
