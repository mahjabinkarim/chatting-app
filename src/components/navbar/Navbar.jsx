import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearUserData } from "../../slice/userslice"; // Redux action
import { FaUser, FaUserFriends, FaUsers, FaEnvelope, FaBan, FaBars } from "react-icons/fa";
import { RiLogoutCircleRLine } from "react-icons/ri";
import  {Link}  from "react-router-dom";
import logo from '../../assets/images/logo.jpg'
const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(clearUserData()); // Redux state reset
    localStorage.removeItem("userData"); // Local storage reset
    navigate("/login"); // Navigate to login page
  };

  const menuItems = [
    { name: "Profile", icon: <FaUser />, path: "/profile" },
    { name: "Requests", icon: <FaUserFriends />, path: "/requests" },
    { name: "Users", icon: <FaUsers />, path: "/alluser" },
    { name: "Friends", icon: <FaUserFriends />, path: "/friends" },
    { name: "Block", icon: <FaBan />, path: "/block" },
    { name: "Inbox", icon: <FaEnvelope />, path: "/inbox" },
    { name: "Logout", icon: <RiLogoutCircleRLine />, path: "#" },
  ];

  return (
    <div className="h-fit  items-center text-center flex py-3 justify-between px-10 bg-[#ffecec] text-[#28a59d]">
      {/* Left Section: App Name & Tagline */}
      <div>
      <Link to='/'> <img className="h-[60px] w-[60px] rounded-full " src={logo} alt="logo" /> </Link>
        <p className="text-[12px] font-bold text-[#429497]">Feel the Connection</p>
      </div>

      {/* Right Section: Navigation Menu */}
      <div className="relative">
        {/* Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="p-3 bg-[#ffc3c3] rounded-full hover:bg-[#fa9b9b] active:1.1 transition"
        >
          <FaBars className="text-2xl" />
        </button>

        {/* Menu Items */}
        {menuOpen && (
          <div className="absolute right-0 mt-2 w-10 bg-[#ffc3c3] rounded-lg shadow-lg z-50">
            {menuItems.map((item, index) => (
              <div
                key={index}
                onClick={() => item.name === "Logout" ? handleLogout() : navigate(item.path)}
                className="flex items-center p-3 cursor-pointer hover:bg-[#fa9b9b] relative group"
              >
                {/* Icon */}
                {item.icon}

                {/* Tooltip on Hover */}
                <span className="absolute right-12 px-2 py-1 text-xs bg-[#fac7d0] text-[#945656] rounded opacity-0 group-hover:opacity-100 transition">
                  {item.name}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
