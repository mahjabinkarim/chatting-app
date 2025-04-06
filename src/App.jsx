import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import LayaoutsOne from './Layaouts/LayaoutsOne'
import Register from './components/Register/Register'
import app from './firebase.config'
import Login from './components/login/Login'
import Home from './Pages/home/Home'
import Profile from './Pages/profile/Profile'
import Alluser from './Pages/alluser/Alluser'
import Requests from './Pages/Requests/Requests'
import Friends from './Pages/Friends/Friends'
import Block from './Pages/Block/Block'
app
function App() {
  const myRoute=createBrowserRouter(createRoutesFromElements(
    <>
    <Route path="/Register" element={<Register />} />
    <Route path="/Login" element={<Login />} />

    <Route path='/' element={<LayaoutsOne/>}>
      <Route index element={<Home/>}/>
      <Route path='profile' element={<Profile/>}/>
      <Route path='alluser' element={<Alluser/>}/>
      <Route path='requests' element={<Requests/>}/>
      <Route path='friends' element={<Friends/>}/>
      <Route path='block' element={<Block/>}/>
    </Route>
    </>
   ))

  return (
    <>


    
     <RouterProvider router={myRoute}/>





    </>
  

    
  )
}

export default App
