import React from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { authActions } from '../store/index';
axios.defaults.withCredentials = true ;


const Header = () => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(state=>state.isLoggedIn);
  const sendLogoutReq = async () => {
    const res = await axios.post('http://localhost:5000/api/logout',null,{
      withCredentials: true
    });
    if(res.status === 200){
      return res ;
    }
    return new Error('unable to logout');
  };
    const handleLogout = () =>{
      sendLogoutReq().then(()=>dispatch(authActions.logout()));
  }
  return (
    <>
    <nav className="navbar navbar-expand-lg bg-dark">
  <div className="container-fluid">
    <Link className="navbar-brand text-light" to="/user">Home</Link>
      <ul className="navbar-nav mb-2 mb-lg-0">
        { !isLoggedIn && <><li className="nav-item">
          <Link className="nav-link text-light" to="/signup">SignUp</Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link text-light" to="/login">LogIn</Link>
        </li></>}
       { isLoggedIn && <li className="nav-item">
          <Link onClick={handleLogout} className="nav-link text-light" to="/">LogOut</Link>
        </li>   }     
      </ul>
    
  </div>
</nav>
    </>
  )
}

export default Header
