import axios from 'axios';
import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom'
import { authActions } from '../store/index';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [user,setUser] = useState({ email:"", password:""});
   const handleInputs = (e) => {
      setUser({...user, [e.target.name]:e.target.value})
  };

  const sendRequest = async() => {
    const res = await axios.post('http://localhost:5000/api/login',{
      email:user.email,
      password:user.password
    }).catch((err)=>console.log(err));
    const data = res.data ;
    return data;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendRequest().then(()=>dispatch(authActions.login())).then(()=>navigate('/user'));
  };
  return (
    <div>
      <section>
        <div className='container mt-5'>
          <div className='signup'>
            <h2>Log In</h2>
            <form method='POST' className='register-form' id='register-form'>
              <div className='form-group mt-3'>
                <label htmlFor='email' className='me-3'>Email </label>
                <input type='text' name='email' id='email' autoComplete='off' value={user.email} onChange={handleInputs} placeholder=' Enter Email' />
              </div>
              <div className='form-group mt-3'>
                <label htmlFor='password' className='me-3'>Password </label>
                <input type='password' name='password' id='password' autoComplete='off' value={user.password} onChange={handleInputs} placeholder=' Enter password' />
              </div>
              <div className='form-group mt-3'>
                <input type='button' className='form-submit' name='login' value='register' onClick={handleSubmit} />

              </div>

            </form>
          </div>
        </div>

      </section>
    </div>
  )
}

export default Login
