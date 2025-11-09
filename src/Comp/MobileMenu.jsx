import React from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../Auth/AuthContext'
import { RiProfileLine } from 'react-icons/ri';
import { MdAccountCircle } from 'react-icons/md';
import { LuUpload } from 'react-icons/lu';
function MobileMenu({ setOpts, toggleMode, darkMode }) {
  const { logout, isAuthenticated } = useAuth();

  return (
    <div className='min-w-1/3 min-h-[100vh] md:hidden fixed top-0 left-0 rounded-md p-4 pt-18 flex flex-col gap-y-2 z-90 bg-gradient-to-b from-gray-950/80 to-gray-700'>
      <div className="flex items-center gap-3">
        {/* Authentication */}

        {isAuthenticated ? (
          <div className="flex items-center gap-2 w-full">
            <NavLink onClick={() => setOpts(false)}
              to={'/profilepage'}
              className="flex items-center gap-1 cursor-pointer bg-gradient-to-r from-emerald-500 to-green-500 text-white px-2 py-2 rounded-lg hover:from-emerald-600 hover:to-green-600 transition-all duration-300 text-sm font-semibold border border-emerald-400 shadow-lg"
            >
              <MdAccountCircle className='w-[28px] h-[28px]' />
              <span >My Account</span>
            </NavLink>
            <NavLink onClick={() => setOpts(false)}
        to={'/createproduct'}
        className={({ isActive }) =>
          `font-semibold cursor-pointer transition-all duration-300 px-3 py-2 rounded-lg text-sm ${isActive
            ? 'text-white bg-blue-600 border border-blue-400 shadow-lg'
            : 'text-gray-300 hover:text-white hover:bg-gray-700'
          }`
        }
      >
        <LuUpload className='text-2xl' />
        Share item
      </NavLink >

          </div>
        ) : (
          <div className="flex items-center gap-2">

            <NavLink onClick={() => setOpts(false)}
              to={'/login'}
              className="cursor-pointer bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300 text-sm font-semibold border border-blue-400 shadow-lg"
            >
              Login
            </NavLink>
          </div>
        )
        }
      </div>

      <NavLink onClick={() => setOpts(false)}
        to={'/'}
        className={({ isActive }) =>
          `font-semibold cursor-pointer transition-all duration-300 px-3 py-2 rounded-lg text-sm ${isActive
            ? 'text-white bg-blue-600 border border-blue-400 shadow-lg'
            : 'text-gray-300 hover:text-white hover:bg-gray-700'
          }`
        }
      >
        Home
      </NavLink >
      <NavLink onClick={() => setOpts(false)}
        to={'/about'}
        className={({ isActive }) =>
          `font-semibold cursor-pointer transition-all duration-300 px-3 py-2 rounded-lg text-sm ${isActive
            ? 'text-white bg-purple-600 border border-purple-400 shadow-lg'
            : 'text-gray-300 hover:text-white hover:bg-gray-700'
          }`
        }
      >
        About
      </NavLink >
      <NavLink onClick={() => setOpts(false)}
        to={'/shop'}
        className={({ isActive }) =>
          `font-semibold cursor-pointer transition-all duration-300 px-3 py-2 rounded-lg text-sm ${isActive
            ? 'text-white bg-pink-600 border border-pink-400 shadow-lg'
            : 'text-gray-300 hover:text-white hover:bg-gray-700'
          }`
        }
      >
        Shop
      </NavLink >
      <NavLink onClick={() => setOpts(false)}
        to={'/contactform'}
        className={({ isActive }) =>
          `font-semibold cursor-pointer transition-all duration-300 px-3 py-2 rounded-lg text-sm ${isActive
            ? 'text-white bg-green-600 border border-green-400 shadow-lg'
            : 'text-gray-300 hover:text-white hover:bg-gray-700'
          }`
        }
      >
        Contact
      </NavLink >
      {/* <button
        onClick={() => {
          toggleMode();
          // setOpts(false);
        }}
        className={` text-left cursor-pointer transition-all duration-300 px-3 py-2 rounded-lg text-sm shadow-lg
                text-white hover:bg-gray-700
              `}
      >
        Change Mode
      </button> */}
      <button
        onClick={toggleMode}
        className=" hover:bg-gray-600 transition-colors duration-300 text-gray-300 hover:text-white cursor-pointer"
        title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
      >
        {darkMode ? (
          <div className='flex gap-1 items-center'> <svg
              className="w-5 h-5 text-yellow-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 
             6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 
             0l-.707.707M6.343 17.657l-.707.707M16 12a4 
             4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
            <span className="text-gray-200 text-sm">Light Mode</span>
          </div>
        ) : (
          <div className='flex items-center gap-1'>
            <svg
              className="w-5 h-5 text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20.354 15.354A9 9 0 018.646 3.646 
             9.003 9.003 0 0012 21a9.003 9.003 0 
             008.354-5.646z"
              />
            </svg>
            <span className="text-gray-200 text-sm">Dark Mode</span>
          </div>
        )}
      </button>

      {
        isAuthenticated && (
          <button onClick={() => { setOpts(false); logout() }}
            to={'/'}
            className={
              `font-semibold cursor-pointer transition-all duration-300 px-3 py-2 rounded-lg text-sm 
                  text-white shadow-lg 
                   hover:text-black bg-red-400/70 hover:bg-red-400
              }`
            }
          >
            Logout
          </button >
        )
      }



    </div>
  )
}

export default MobileMenu
