import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, createUserWithEmailAndPassword, updateProfile, sendEmailVerification } from "firebase/auth";
import app from "../../Firebase.config";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ClipLoader from "react-spinners/ClipLoader";
import bgImage from "../../assets/images/Register-bg.png";
import leaf from "../../assets/images/leaf.png";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
const auth = getAuth(app);

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    username: false,
    email: false,
    password: false,
    confirmPassword: false,
  });
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    setLoading(true);

    let formErrors = {
      username: !username,
      email: !email,
      password: !password,
      confirmPassword: !confirmPassword,
    };

    setErrors(formErrors);

    if (formErrors.username || formErrors.email || formErrors.password || formErrors.confirmPassword) {
      toast.error("All fields are required!");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      setLoading(false);
      return;
    }

    // Check if the email is already registered
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;

        // Update profile with display name
        updateProfile(user, {
          displayName: username,
          photoURL: "https://t4.ftcdn.net/jpg/07/57/29/01/360_F_757290191_dvznb3tQwqDvf2W4t8RnLuWKUGUcLb4d.jpg",
        })
          .then(() => {
            // Send email verification
            sendEmailVerification(user).then(() => {
              toast.success("Registration successful! Please check your email.");
              setTimeout(() => {
                setLoading(false);
                navigate("/login");
              }, 3000);
            });
          })
          .catch((error) => {
            toast.error("Failed to update profile: " + error.message);
            setLoading(false);
          });
      })
      .catch((error) => {
        if (error.code === "auth/email-already-in-use") {
          toast.error("An account with this email already exists. Please check your email for verification.");
        } else {
          toast.error(error.message);
        }
        setLoading(false);
      });
  };
  

  // Google Sign-In Function
  const handleGoogleSignIn = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        toast.success("Successfully logged in with Google!");
        navigate("/login");
      })
      .catch((error) => {
        toast.error("Error logging in with Google: " + error.message);
      });
  };
  // Apple Sign-In Function
const handleAppleSignIn = () => {
  const provider = new OAuthProvider('apple.com');
  signInWithPopup(auth, provider)
    .then((result) => {
      const user = result.user;
      toast.success("Successfully logged in with Apple!");
      navigate("/login");
    })
    .catch((error) => {
      toast.error("Error logging in with Apple: " + error.message);
    });
};
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#4CAB72]">
      <div
        className="relative w-[1000px] h-fit px-16 py-10 rounded-3xl shadow-lg overflow-hidden"
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
            Get Started
          </h1>
          <p className="text-white text-center text-sm mb-6">
            Already have an Account?{" "}
            <a href="/login" className="text-[#4CAB72] font-semibold">
              Log In
            </a>
          </p>

          <form onSubmit={handleRegister} className="space-y-8">
            <div>
              <label className="block text-white text-xs">Name</label>
              <input
                type="text"
                className={`w-[90%] bg-transparent text-white border-b-[1px] outline-none ${errors.username ? 'border-red-500' : 'border-b-white'}`}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-white text-xs">Email</label>
              <input
                type="email"
                className={`w-[90%] text-white bg-transparent border-b-[1px] outline-none ${errors.email ? 'border-red-500' : 'border-b-white'}`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-white text-xs">Password</label>
              <input
                type="password"
                className={`w-[90%] bg-transparent text-white border-b-[1px] outline-none ${errors.password ? 'border-red-500' : 'border-b-white'}`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-white text-xs">Confirm Password</label>
              <input
                type="password"
                className={`w-[90%] bg-transparent text-white border-b-[1px] outline-none ${errors.confirmPassword ? 'border-red-500' : 'border-b-white'}`}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="w-[190px] m-auto text-center items-center ml-14 bg-[#4CAB72] text-white py-2 rounded-lg font-semibold hover:bg-opacity-80 transition"
              disabled={loading}
            >
              {loading ? <ClipLoader color={"white"} size={20} /> : "Sign Up"}
            </button>

            {/* Or Sign Up Section */}
            <div className="flex items-center justify-center my-8">
              <div className="flex-grow h-px bg-white"></div>
              <p className="mx-2 text-white text-sm">Or Sign Up with</p>
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
          </form>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Register;
