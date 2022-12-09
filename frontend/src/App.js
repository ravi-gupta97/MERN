import './App.css';
import Header from './components/Header';
import {Routes, Route} from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import Home from './components/Home';
import { useSelector} from 'react-redux';
function App() {
  const isLoggedIn = useSelector(state=>state.isLoggedIn);
  console.log(isLoggedIn);
  return (
    <>
     <Header />
     <Routes>
    {isLoggedIn && <Route path='/user' element={<Home />} />}
      <Route path='/login' element={<Login />} />
      <Route path='/signup' element={<Signup />} />
     </Routes>

    </>
  );
}

export default App;
