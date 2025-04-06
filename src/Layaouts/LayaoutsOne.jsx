import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';
import { Outlet, useNavigate } from 'react-router-dom'

const LayaoutsOne = () => {
  const sliceuser = useSelector((state) => state.userData.value);
  const navigate = useNavigate();

  useEffect (()=>{
    if(sliceuser  ==  null){
        navigate('/Login')
    }
},[])
  return (
    <>
     <Outlet/> 
    </>
  )
}

export default LayaoutsOne
