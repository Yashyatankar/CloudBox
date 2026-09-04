import React from 'react'
import AuthPage from './Components/AuthPage.jsx'
import Panel from './Components/Panel.jsx'
import { BrowserRouter } from "react-router-dom";

const App = () => {
  return (
    <>
      <BrowserRouter>
        <AuthPage />
        <Panel />
      </BrowserRouter>

      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/dashboard" element={<Panel />} />
      </Routes>

    </>
  )
}

export default App