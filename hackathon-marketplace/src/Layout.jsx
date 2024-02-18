import React from 'react'
import {Outlet} from 'react-router-dom'
import Header from './Components/Header/header'
import Footer from './Components/Footer/footer'

function Layout()
{
    return (
        <>
        <Header />
        <Outlet />
        <Footer />
        </>
    )
}

export default Layout