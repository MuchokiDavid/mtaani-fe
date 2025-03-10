import { useState } from 'react'
import './App.css'
import Login from './components/authentication/Login'
import Register from './components/authentication/Register'
import Home from './components/pages/Home'
import About from './components/pages/About'
import Policy from './components/pages/Policy'
import Terms from './components/pages/Terms'
import { Routes, Route } from 'react-router-dom';
import Dashboard from './components/pages/dash/Dashboard'

function App() {
  // 

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/policy" element={<Policy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard/*" element={<Dashboard />} />
      </Routes>
    </>
  )
}

export default App
