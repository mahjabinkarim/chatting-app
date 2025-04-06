import React from 'react';
 

const CommonUser = ({ userPhoto, userName}) => {
  return (
    <div className="user-card flex justify-between py-10 mx-5">
      <div className='flex gap-3 justify-center items-center'>
        <img src={userPhoto} alt={userName} className="user-photo rounded-full h-[80px] w-[80px]" />
        <h3 className="user-name text-xl font-medium text-[#0c6681]">{userName}</h3>
      </div>
      
    </div>
  );
};

export default CommonUser;
