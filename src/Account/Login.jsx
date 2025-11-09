import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { account } from '../Auth/Config.js';
import { toast } from 'sonner';
import { Formik } from 'formik';
import * as yup from 'yup';
import { useAuth } from '../Auth/AuthContext';
import InpLable from '../MiniParts/InpLable.jsx';
import MyInput from '../MiniParts/MyInput.jsx';

function Login({isDark}) {
  let [email, saveEmail] = useState('');
  let [pass, savePass] = useState('');
  const [loading, setLoading] = useState(false);
  let navigate = useNavigate();
  
  const { login, isAuthenticated } = useAuth(); 

  const validationSchema = yup.object({
    email: yup.string().email("Enter valid email!").required("Email is required!"),
    password: yup.string().required("Password is required!")
  });

  const handleLogin = async (e) => {
  e.preventDefault();
  
  if (!email || !pass) {
    toast.warning("Fill all fields.");
    return;
  }

  setLoading(true);
  try {
    await login(email, pass); // using AuthContext's login function
    toast.success("Logged in Successfully!");
    navigate("/", { replace: true });
  } catch (error) {
    console.error("Login error:", error);
    toast.error(error.message || "Login failed! Please check your credentials.");
  } finally {
    setLoading(false);
  }
};

  console.log("Login component - isAuthenticated:", isAuthenticated);

  const handleGoogleLogIn = async ()=>{
    try {
      account.createOAuth2Session(
        'google',
        `${window.location.origin}/oauth-success`,
        `${window.location.origin}/oauth-fail`
      );
    } catch (error) {
      toast.error("Oops! failed to login with Google.")
      console.log('Error: ', error);
      
    }
  }
  return (
    <div className="min-h-screen bg-transparent flex flex-col items-center justify-center py-8 mt-10">
      {/* ShopLite Logo */}
      <div className="mb-4 text-center">
        <div className="flex justify-center items-center ">
          <div className='w-auto cursor-pointer bg-transparent flex justify-center items-center'>
            <p className='text-3xl font-semibold bg-transparent text-[#fd366e]'>Shop</p> 
            <span className='text-gray-800 animate-bounce bg-transparent ml-[-30px] mb-2 text-xl'>Lite</span>
          </div>
        </div>
        <p className={`${isDark ? 'text-gray-100' : 'text-gray-600'} text-lg`}>Welcome back! Please login to your account</p>
      </div>

      <Formik
        validationSchema={validationSchema}
        initialValues={{ email: '', password: '' }}
      >
        {({ errors, touched }) => (
          <form
            className={`
              ${isDark ? 'bg-blue-950/90 text-white' : 'bg-white/50 '}
              flex flex-col max-w-[480px] w-full 
              rounded-2xl 
              p-6
               backdrop-blur-sm
              shadow-2xl hover:shadow-3xl
              transition-all duration-300 ease-in-out 
              hover:scale-[1.01]
              border border-white/20
            `}
            onSubmit={handleLogin}
          >
            <h2 className="text-2xl font-black  text-center mb-6">
              Login to Your Account
            </h2>

            {/* Email  */}
            
              <InpLable labelFor={'email'} labelName={'Email'} />
              <MyInput id={'email'} type={'email'} value={email} req={'required'} name={'email'} placeHolder={'Enter your email'} onChange={(p) => saveEmail(p.target.value)}  />
             
              {errors.email && touched.email && (
                <div className="text-red-500 text-sm mt-2 font-medium">{errors.email}</div>
              )}
           

            {/* Password  */}
            
              <InpLable labelFor={'password'} labelName={'Password'} />
              <MyInput id={'password'} type={'password'} value={pass} req={'required'} name={'password'} placeHolder={'Enter your password'} onChange={(p) => savePass(p.target.value)}  />
             
              {errors.password && touched.password && (
                <div className="text-red-500 text-sm mt-2 font-medium">{errors.password}</div>
              )}
            
            
            {/* Login Button */}
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
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Logging in...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Login to Account
                  
                </span>
              )}
            </button>

            <div className="flex items-center my-4 gap-2">
          <div className="h-[1px] bg-gray-300 flex-1"></div>
          <p className="text-gray-500 text-sm">or</p>
          <div className="h-[1px] bg-gray-300 flex-1"></div>
        </div>

                <button
          type="button"
          onClick={handleGoogleLogIn}
          className=" my-2 border py-2 transition-all duration-300 cursor-pointer rounded-lg flex items-center justify-center gap-3 hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 hover:text-white"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-5 h-5">
            <path fill="#EA4335" d="M24 9.5c3.94 0 6.6 1.7 8.12 3.13l5.94-5.94C34.3 3.53 29.65 1.5 24 1.5 14.83 1.5 7.01 6.98 3.48 14.85l6.95 5.4C11.9 14.08 17.41 9.5 24 9.5z"/>
            <path fill="#34A853" d="M46.5 24.5c0-1.62-.15-3.18-.44-4.68H24v9.1h12.7c-.54 2.9-2.16 5.36-4.6 7.02l7.07 5.49c4.12-3.8 6.33-9.4 6.33-16.93z"/>
            <path fill="#4A90E2" d="M24 47.5c6.3 0 11.58-2.08 15.44-5.57l-7.07-5.49c-1.96 1.32-4.45 2.11-8.37 2.11-6.42 0-11.85-4.32-13.79-10.17l-6.95 5.37C7.06 41.26 14.94 47.5 24 47.5z"/>
            <path fill="#FBBC05" d="M10.21 28.38c-.46-1.32-.71-2.73-.71-4.18s.25-2.86.71-4.18l-6.95-5.37C1.86 17.35 1 20.6 1 24s.86 6.65 2.26 9.35l6.95-5.37z"/>
          </svg>
          Login with Google
        </button>

        <div className='mx-auto text-center'>
          <small><b>Note! </b>Login with Google doesn't need password.</small>
        </div>
            {/* Signup Link */}
            <p className="mt-6 text-center  text-sm">
              Don't have an account?{" "}
              <span
                onClick={() => navigate("/signup")}
                className="text-blue-600 text-sm font-bold cursor-pointer hover:text-blue-700 transition-colors duration-300 underline"
              >
                Create Account
              </span>
            </p>

            {/* Demo Info */}
            {/* <div className="mt-6 p-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
              <p className="text-sm text-gray-700 text-center font-medium">
                <span className="font-bold">💡 Demo:</span> Use your Appwrite registered account credentials
              </p>
            </div> */}
          </form>
        )}
      </Formik>

      {/* Background Elements */}
      <div className="fixed top-20 left-10 w-16 h-16 bg-blue-200 rounded-full blur-2xl opacity-30 animate-float -z-10"></div>
      <div className="fixed bottom-20 right-10 w-12 h-12 bg-purple-200 rounded-full blur-2xl opacity-30 animate-float delay-1000 -z-10"></div>
    </div>
  );
}

export default Login;