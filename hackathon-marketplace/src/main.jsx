import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom'
import Sell from './Components/Sell/sell.jsx'
import Home from './Components/Home/home.jsx'
import Layout from './Layout.jsx'
import ContextProvider from './Context/ContextProvider.jsx'
import MyListings from './Components/MyListings/MyListings.jsx'
import MyBuyings from './Components/MyBuyings/MyBuyings.jsx'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path = "/" element = {<Layout />}>
      <Route path = "" element = {<Home />} />
      <Route path = "Sell" element = {<Sell />} />
      <Route path = "MyListings" element = {<MyListings />} />
      <Route path = "MyBuyings" element = {<MyBuyings />} />
    </Route>
  )
)

ReactDOM.createRoot(document.getElementById('root')).render(
  <ContextProvider>
    <React.StrictMode>
      <RouterProvider router= {router}/>
    </React.StrictMode>,
  </ContextProvider>
)
