import React, { useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import CreatePost from './pages/CreatePost';
import Login from './pages/Login';
import NavigationBar from './components/NavigationBar';
import Footer from './components/Footer';
import WrongPage from './pages/WrongPage';

function App() {

  const [isAuth, setIsAuth] = useState<boolean>(localStorage.getItem("isAuth") === "true");

  return (
    <div className='App'>
    <Router>
      <NavigationBar isAuth={isAuth} setIsAuth={setIsAuth}/>
      <Routes>
        <Route path='/' element={<Home isAuth={isAuth}/>} />
        <Route path='/createpost' element={<CreatePost isAuth={isAuth} />} />
        <Route path='/login' element={<Login setIsAuth={setIsAuth}/>} />
        <Route path='*' element={<WrongPage />} />
      </Routes>
      <Footer />
    </Router>
    </div>
  );
}

export default App;
