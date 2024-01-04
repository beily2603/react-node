import { Route, Routes } from 'react-router-dom';
import Home from './Components/Home';
import Login from './Components/Login';
import Add from './Components/Add';
import Signup from './Components/SignUp';
import Locations from './Components/Locations';
import React from 'react';
import './App.css';
import ResponsiveAppBar from './Components/ResponsiveAppBar';
import Edit from './Components/Edit';
import OpenLocation from './Components/OpenLocation';
import { HomePage } from './Components/HomePage';
import MapComponent from './Components/MapComponent';

const App: React.FC = () => {

  return (
    <>
      <ResponsiveAppBar />
      <Routes>
        <Route path='/' Component={Home} />
        <Route path='/login' Component={Login} />
        <Route path='/signup' Component={Signup} />
        <Route path='/location' Component={Locations} />
        <Route path='/add' Component={Add} />
        <Route path='/edit' Component={Edit} />
        <Route path='/openLocation' Component={OpenLocation} />
        <Route path='/HomePage' Component={HomePage} />
        <Route path='/MapComponent' Component={MapComponent} />

      </Routes>
    </>
  )
}

export default App
