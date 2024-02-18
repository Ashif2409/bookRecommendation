import { Reg } from './Components/Reg';
import Login from './Components/Login';
import { Home } from './Components/Home';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import  Details  from './Components/Details';

function App() {
  const [data, setData] = useState({});
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login setData={setData} />}></Route>
        <Route path='/reg' element={<Reg />}></Route>
        <Route path='/home' element={<Home data={data} />}></Route>
        <Route path='/details' element={<Details />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
