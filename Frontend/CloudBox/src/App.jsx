import React from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthPage from './Components/AuthPage.jsx'
import Panel from './Components/Panel.jsx'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/dashboard" element={<Panel />} />
      </Routes>
    </BrowserRouter>
    
  )
}

export default App