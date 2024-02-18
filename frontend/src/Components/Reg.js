import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
export const Reg = () => {
    const [user, setUser] = useState({
        email: '',
        name: '',
        password: '',
        confirmPass: ''
    });
    const navigate = useNavigate();
    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser({
            ...user,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const { email, name, password, confirmPass } = user;
        if (email && name && password && confirmPass) {
            if (password === confirmPass) {
                axios.post('http://localhost:8080/register', user)
                    .then(res => {
                        navigate('/');
                        console.log('Successfully Register');
                        setUser({
                            email: '',
                            name: '',
                            password: '',
                            confirmPass: ''
                        });
                    })
                    .catch(err => console.log(err));
            } else {
                alert('Password and confirm password do not match');
            }
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-700">
            <form className="flex flex-col gap-3 w-full max-w-md p-6 rounded-lg shadow-md bg-slate-400" onSubmit={handleSubmit}>
                <input
                    type="email"
                    name="email"
                    placeholder="Enter Your Email"
                    className="w-full md:w-64 lg:w-80 xl:w-96 border rounded-md p-2 focus:outline-none"
                    value={user.email}
                    onChange={handleChange}
                />
                <input
                    type="text"
                    name="name"
                    placeholder="Enter Your Username"
                    className="w-full md:w-64 lg:w-80 xl:w-96 border rounded-md p-2 focus:outline-none"
                    value={user.name}
                    onChange={handleChange}
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    className="w-full md:w-64 lg:w-80 xl:w-96 border rounded-md p-2 focus:outline-none"
                    value={user.password}
                    onChange={handleChange}
                />
                <input
                    type="password"
                    name="confirmPass"
                    placeholder="Confirm Password"
                    className="w-full md:w-64 lg:w-80 xl:w-96 border rounded-md p-2 focus:outline-none"
                    value={user.confirmPass}
                    onChange={handleChange}
                />
                <button
                    className="w-full bg-gray-700 text-white rounded-md p-2 font-semibold hover:bg-gray-800 focus:outline-none focus:bg-blue-600"
                    type="submit"
                >
                    Submit
                </button>
            </form>
        </div>
    );
};
