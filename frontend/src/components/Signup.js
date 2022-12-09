import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
const navigate = useNavigate();
  const [user, setUser] = useState({ name: "", email: "", password: "" });
  const handleInputs = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value })
  };

  const sendRequest = async () => {
    const res = await axios.post('http://localhost:5000/api/signup', {
      name: user.name,
      email: user.email,
      password: user.password
    }).catch((err)=> console.log(err)) ;
    const data = await res.data ;
    return data ;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendRequest().then(()=>navigate('/login'));
  };
  return (
    <>
      <section>
        <div className='container mt-5'>
          <div className='signup'>
            <h2>Sign Up</h2>
            <form method='POST' className='register-form' id='register-form'>
              <div className='form-group mt-3'>
                <label htmlFor='name' className='me-3'>Name </label>
                <input type='text' name='name' id='name' autoComplete='off' value={user.name} onChange={handleInputs} placeholder=' Enter Name' />
              </div>
              <div className='form-group mt-3'>
                <label htmlFor='email' className='me-3'>Email </label>
                <input type='text' name='email' id='email' autoComplete='off' value={user.email} onChange={handleInputs} placeholder=' Enter Email' />
              </div>
              <div className='form-group mt-3'>
                <label htmlFor='password' className='me-3'>Password </label>
                <input type='password' name='password' id='password' autoComplete='off' value={user.password} onChange={handleInputs} placeholder=' Enter password' />
              </div>
              <div className='form-group mt-3'>
                <input type='button' className='form-submit' name='signup' value='register' onClick={handleSubmit} />

              </div>

            </form>
          </div>
        </div>

      </section>

    </>
  )
}

export default Signup
