import React from 'react'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import Footer from "./components/Footer";
import NavbarPublic from './components/NavbarPublic'
import Onboarding from './pages/Onboarding'
import Dashboard from './pages/Dashboard'
import ProtectedRoute from './components/ProtectedRoute'
import AccountTransactions from './pages/AccountTransactions'
import CreateTransaction from "./pages/CreateTransaction";
import FinancialAdvisor from './pages/FinancialAdvisor';

const App = () => {
  return (
    <BrowserRouter>
    <NavbarPublic/>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/register' element={<Register/>} />
        <Route path='/login' element={<Login/>} />
        <Route path='/onboarding' element={<Onboarding/>} />
        <Route path="/dashboard"
        element = {
        <ProtectedRoute>
          <Dashboard/>
        </ProtectedRoute>
        }
        />

        <Route path='/account/:accountId' element={
          <ProtectedRoute >
            <AccountTransactions />
        </ProtectedRoute>
        }
        />

        <Route
        path="/account/:accountId/create"
        element={
          <ProtectedRoute>
            <CreateTransaction />
          </ProtectedRoute>
        }
      />

      <Route 
        path='/account/:accountId/transaction/:transactionId/edit'
        element = {
          <ProtectedRoute>
            <CreateTransaction />
          </ProtectedRoute>
        }
      />

      <Route
        path='/account/:accountId/advisor/chat'
        element = {
          <ProtectedRoute>
            <FinancialAdvisor />
          </ProtectedRoute>
        }
      />

      </Routes>
       <Footer/>
    </BrowserRouter>
  )
}

export default App