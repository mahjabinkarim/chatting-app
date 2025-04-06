import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {getAuth, signInWithEmailAndPassword, sendPasswordResetEmail, GoogleAuthProvider, signInWithPopup, OAuthProvider } from "firebase/auth";
import app from "../../Firebase.config";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ClipLoader from "react-spinners/ClipLoader";
import bgImage from "../../assets/images/Register-bg.png";
import leaf from "../../assets/images/leaf.png";
import { useDispatch } from "react-redux";
import { setUserData } from "../../slice/userslice";
import {getDatabase , ref,set } from 'firebase/database';
const auth = getAuth(app);
// Firebase database
const db = getDatabase();

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailReset, setEmailReset] = useState("");
  const [resetPopup, setResetPopup] = useState(false);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);

    if (!email || !password) {
      toast.error("All fields are required!");
      setLoading(false);
      return;
    }

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        if (user.emailVerified) {
          const { uid, email, displayName, photoURL } = user;
          const userData = { uid, email, displayName, photoURL };
          dispatch(setUserData(userData));
          set(ref(db,'allUsers/'+ userCredential.user.uid),{
               username:userCredential.user.displayName,
               userphoto:userCredential.user.photoURL
          });
          localStorage.setItem("userData", JSON.stringify(userData));
          toast.success("Login successful!");
          setTimeout(() => {
            navigate("/");
          }, 2000);
        } else {
          toast.warning("Please verify your email before logging in.");
        }
      })
      .catch((error) => {
        if (error.code === "auth/user-not-found") {
          toast.error("No user found with this email.");
        } else if (error.code === "auth/wrong-password") {
          toast.error("Incorrect password.");
        } else {
          toast.error("Something went wrong. Please try again.");
        }
      });
  };


  const handleGoogleSignIn = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        toast.success("Successfully logged in with Google!");
        navigate("/");
      })
      .catch((error) => {
        toast.error("Error logging in with Google: " + error.message);
      });
  };

  const handleAppleSignIn = () => {
    const provider = new OAuthProvider('apple.com');
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        toast.success("Successfully logged in with Apple!");
        navigate("/");
      })
      .catch((error) => {
        toast.error("Error logging in with Apple: " + error.message);
      });
  };

  const handlePasswordReset = () => {
    if (!emailReset) {
      toast.error("Please enter your email address!");
      return;
    }
    sendPasswordResetEmail(auth, emailReset)
      .then(() => {
        toast.success("Password reset email sent! Check your inbox.");
        setResetPopup(false);
      })
      .catch((error) => {
        toast.error("Error sending password reset email: " + error.message);
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#4CAB72]">
      <div className="relative w-[1000px] h-fit px-16 py-10 rounded-3xl shadow-lg overflow-hidden"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute top-[210px] left-[330px] z-[30]">
          <img className="w-[580px]" src={leaf} alt="leaf" />
        </div>

        <div className="relative w-[450px] bg-[#ffffff38] bg-opacity-20 backdrop-blur-sm rounded-lg p-8 z-[20]">
          <h1 className="text-3xl font-bold text-white text-center mb-2">
            Login
          </h1>
          <p className="text-white text-center text-sm mb-6">
            Don't have an Account?{" "}
            <a href="/register" className="text-[#4CAB72] font-semibold">
              Sign Up
            </a>
          </p>

          <form onSubmit={handleLogin} className="space-y-8">
            <div>
              <label className="block text-white text-xs">Email</label>
              <input
                type="email"
                className="w-[90%] text-white bg-transparent border-b-white border-b-[1px] outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-white text-xs">Password</label>
              <input
                type="password"
                className="w-[90%] bg-transparent text-white border-b-white border-b-[1px] outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="w-[190px] m-auto text-center items-center ml-14 bg-[#4CAB72] text-white py-2 rounded-lg font-semibold hover:bg-opacity-80 transition"
              disabled={loading}
            >
              {loading ? (
                <ClipLoader color={"white"} size={20} />
              ) : (
                "Log In"
              )}
            </button>
          </form>

          <p
            className="text-center text-white text-sm mt-4 cursor-pointer"
            onClick={() => setResetPopup(true)}
          >
            Forgot Password?
          </p>

          <div className="flex items-center justify-center my-8">
            <div className="flex-grow h-px bg-white"></div>
            <p className="mx-2 text-white text-sm">Or Log In with</p>
            <div className="flex-grow h-px bg-white"></div>
          </div>

          <div className="flex justify-center space-x-4">
            <button onClick={handleGoogleSignIn} className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-md hover:bg-gray-200">
              <img src="https://img.icons8.com/color/48/null/google-logo.png" alt="Google" />
            </button>
            <button onClick={handleAppleSignIn} className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-md hover:bg-gray-200">
              <img src="https://img.icons8.com/ios-filled/50/null/mac-os.png" alt="Apple" />
            </button>
          </div>
        </div>
      </div>

      {/* Forgot Password Popup */}
      {resetPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[50]">
          <div className="bg-white p-6 rounded-lg w-[300px]">
            <h2 className="text-center text-lg font-bold">Reset Password</h2>
            <input
              type="email"
              className="w-full mt-4 p-2 border border-gray-300 rounded"
              placeholder="Enter your email"
              value={emailReset}
              onChange={(e) => setEmailReset(e.target.value)}
            />
            <div className="flex justify-between mt-4">
              <button
                className="bg-[#4CAB72] text-white px-4 py-2 rounded"
                onClick={handlePasswordReset}
              >
                Reset
              </button>
              <button
                className="bg-gray-300 text-black px-4 py-2 rounded"
                onClick={() => setResetPopup(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default Login;
