import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

// password is asd
const Login = ({setData}) => {
    const [user,setUser]=useState({
        name:"",
        password:"",
    })
    const navigate = useNavigate();
    const handleSubmit=(e)=>{
        e.preventDefault();  
        const {name,password}=user;
        axios.post("http://localhost:8080/login",user)
            .then(res=>{
                setData(res.data.user);
                navigate('/home');
            })
            .catch(err=>console.log(err))
    }
    const handleChange=(e)=>{
        const {name,value}=e.target;
        e.preventDefault();
        setUser({
            ...user,
            [name]:value
        })
    }
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-700">
    <form className="flex flex-col gap-3 w-full max-w-md p-6 rounded-lg shadow-md bg-slate-400"  onSubmit={handleSubmit}>
        <input
            type="text"
            name="name"
            placeholder="Enter Your Username"
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:border-blue-500"
            value={user.name}
            onChange={handleChange}
        />
        <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:border-blue-500 focus:outline-none"
            value={user.password}
            onChange={handleChange}
        />
        <button
            className="w-full bg-gray-700 text-white rounded-md p-2 font-semibold hover:bg-gray-800 focus:outline-none focus:bg-blue-600"
            type="submit"
        >
            Submit
        </button>
        <Link
            to="/reg"
            className="text-black-500 text-center font-semibold "
        >
            Register
        </Link>
    </form>
</div>
  )
}

export default Login