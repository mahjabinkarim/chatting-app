import React from "react";
import { useSelector } from "react-redux";

const Profile = () => {
  const sliceuser = useSelector((state) => state.userData.value);

  if (!sliceuser) {
    return <div className="text-center text-white mt-20">No user logged in</div>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-cyan-100 via-fuchsia-200 to-red-300">
      <div className="relative w-80 h-96 bg-[#f1cece] group rounded-2xl shadow-lg flex flex-col items-center justify-center text-center p-6 transition-transform duration-500 group-hover:rounded-full ">
        {/* Background Header */}
        <div className="absolute top-0 w-full h-24 bg-gradient-to-r from-red-200 via-red-400 to-red-300 rounded-t-2xl border-b-4 border-white transition-all duration-300 hover:scale-100 group "></div>

        {/* Profile Image */}
        <div className="w-24 h-24 rounded-full border-4 border-white bg-blue-600 overflow-hidden mt-16 transition-transform duration-500 hover:scale-150">
          {sliceuser.photoURL ? (
            <img src={sliceuser.photoURL} alt="User Avatar" className="w-full h-full object-cover" />
          ) : (
            <div className="flex items-center justify-center w-full h-full text-white text-2xl font-bold">
              {sliceuser.displayName ? sliceuser.displayName[0] : "?"}
            </div>
          )}
        </div>

        {/* User Info */}
        <div className="mt-5 transition-transform duration-500 hover:-translate-y-4">
          <h2 className="text-lg font-semibold text-[#204c5e]">{sliceuser.displayName || "Anonymous"}</h2>
          <p className="text-sm text-[#072d46]">{sliceuser.email}</p>
        </div>

        {/* Follow Button */}
        <a
          href="#"
          className="mt-4 px-6 py-2 bg-[#eea1a1] text-[#3989a1] rounded-md border border-[#118ead] shadow-md transition-all duration-300 hover:bg-[#ee8282] hover:scale-110"
        >
          Front End development
        </a>
      </div>
    </div>
  );
};

export default Profile;
