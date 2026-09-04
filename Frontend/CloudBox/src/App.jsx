import React from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthPage from './Components/AuthPage.jsx'
import Panel from './Components/Panel.jsx'
import OtpPage from './Components/Otppage.jsx';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/dashboard" element={<Panel />} />
        <Route path='/login_otp' element={<OtpPage />} />
      </Routes>
    </BrowserRouter>
    
  )
}

export default App