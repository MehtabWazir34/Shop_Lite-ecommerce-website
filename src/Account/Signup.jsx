import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ID } from 'appwrite';
import { account } from '../Auth/Config';
import { toast, Toaster } from 'sonner';
import InpLable from '../MiniParts/InpLable';
import MyInput from '../MiniParts/MyInput';

function SignUp({ isDark }) {

  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Correct Signup Flow (Create user → Send verification email)
const handleSendVerification = async (e) => {
  e.preventDefault();

  if (!name || !email || !pass) {
    toast.error("Please fill all fields.");
    return;
  }

  try {
    setLoading(true);

    // ✅ Create user first (required by Appwrite)
    await account.create(
      ID.unique(),
      email,
      pass,
      name
    );

    // ✅ Login temporarily (Appwrite requires a session for verification email)
    await account.createEmailPasswordSession(email, pass);

    // ✅ Send verification email
    await account.createVerification(
      `${window.location.origin}/verify-email`
    );

    toast.success("Verification email sent! Check your inbox.");

    // ✅ Logout temporary session
    await account.deleteSession("current");

    // ✅ Navigate to waiting screen
    navigate("/verify-email-pending", {
      state: { email }
    });

  } catch (err) {
    toast.error("Sign-up failed.");
    console.log(err);
  } finally {
    setLoading(false);
  }
};

  // ✅ Google OAuth2 Login
  const handleGoogleSignIn = async () => {
    try {
      account.createOAuth2Session(
        "google",
        `${window.location.origin}/oauth-success`,
        `${window.location.origin}/oauth-fail`,
      );
    } catch (err) {
      toast.error("Google login failed.");
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen mt-16 flex flex-col items-center justify-center bg-transparent py-8">
      <Toaster richColors position="top-center" />
<div className="flex justify-center items-center mb-3">
          <div className='w-auto cursor-pointer bg-transparent flex justify-center items-center'>
            <p className='text-3xl font-semibold bg-transparent text-[#fd366e]'>Shop</p> 
            <span className='text-gray-800 animate-bounce bg-transparent ml-[-30px] mb-2 text-xl'>Lite</span>
          </div>
        </div>
      <form
        onSubmit={handleSendVerification}
        className={`flex flex-col max-w-[480px] w-full transition-all duration-300 p-6 rounded-xl shadow-xl ${
          isDark ? 'bg-blue-950/90 text-white' : 'text-black bg-white/50'
        }`}
      >
        <h2 className="text-2xl font-bold text-center mb-6">
          Create Your Account
        </h2>

        {/* Name */}
        <InpLable labelFor={'name'} labelName={'Name'} />
        <MyInput id={'name'} name={'name'} placeHolder={'Enter your name'} req={'required'} onChange={(p)=> setName(p.target.value)} type={'text'} value={name} />
        

        {/* Email */}
        <InpLable labelFor={'email'} labelName={'Email'} />
        <MyInput id={'email'} name={'email'} placeHolder={'Enter your email'} req={'required'} onChange={(p)=> setEmail(p.target.value)} type={'email'} value={email} />
        
       

        {/* Password */}
        <InpLable labelFor={'password'} labelName={'Password'} />
        <MyInput id={'password'} name={'password'} placeHolder={'Set your password'} req={'required'} onChange={(p)=> setPass(p.target.value)} type={'password'} value={pass} />
        

        <button
          type="submit"
          disabled={loading}
          className={` mx-auto 
                w-full py-2 rounded-lg cursor-pointer transition-all duration-300 transform  hover:text-black
                ${loading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl'
                } text-white
              `}
        >
          {loading ? "Creating Account..." : "Create Account"}
        </button>

        <div className="flex items-center my-4 gap-2">
          <div className="h-[1px] bg-gray-300 flex-1"></div>
          <p className="text-gray-500 text-sm">or</p>
          <div className="h-[1px] bg-gray-300 flex-1"></div>
        </div>

        {/* Google OAuth */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          className="border p-2 rounded-lg transition-all duration-300 flex items-center justify-center gap-3 hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 hover:text-white cursor-pointer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-5 h-5">
            <path fill="#EA4335" d="M24 9.5c3.94 0 6.6 1.7 8.12 3.13l5.94-5.94C34.3 3.53 29.65 1.5 24 1.5 14.83 1.5 7.01 6.98 3.48 14.85l6.95 5.4C11.9 14.08 17.41 9.5 24 9.5z"/>
            <path fill="#34A853" d="M46.5 24.5c0-1.62-.15-3.18-.44-4.68H24v9.1h12.7c-.54 2.9-2.16 5.36-4.6 7.02l7.07 5.49c4.12-3.8 6.33-9.4 6.33-16.93z"/>
            <path fill="#4A90E2" d="M24 47.5c6.3 0 11.58-2.08 15.44-5.57l-7.07-5.49c-1.96 1.32-4.45 2.11-8.37 2.11-6.42 0-11.85-4.32-13.79-10.17l-6.95 5.37C7.06 41.26 14.94 47.5 24 47.5z"/>
            <path fill="#FBBC05" d="M10.21 28.38c-.46-1.32-.71-2.73-.71-4.18s.25-2.86.71-4.18l-6.95-5.37C1.86 17.35 1 20.6 1 24s.86 6.65 2.26 9.35l6.95-5.37z"/>
          </svg>
          Sign in with Google
        </button>

        <p className="mt-6 text-center text-sm">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-blue-600 text-sm font-bold cursor-pointer hover:text-blue-700 transition-colors duration-300 underline"
          >
            Login Now
          </span>
        </p>
      </form>
    </div>
  );
}

export default SignUp;
