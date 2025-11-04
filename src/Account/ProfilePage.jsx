
import { useAuth } from '../Auth/AuthContext';
import H2Styles from '../MiniParts/H2Styles';
import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import OrderHistory from '../Account/OrderHistory';
import MessagesHistory from './MessagesHistory';

const ProfilePage = ({isDark}) => {
  const { user } = useAuth();
  // const [userMessages, setUserMessages] = useState([]);

  // useEffect(() => {
  //   // Fetch user messages from localStorage
  //   const messages = JSON.parse(localStorage.getItem('userMessages') || '[]');
  //   const userMessages = messages.filter(msg => msg.userId === user.id);
  //   setUserMessages(userMessages);
  // }, [user]);

  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      const timer = setTimeout(() => {
        navigate("/");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [user, navigate]);

  if (!user) {
    return (
      <div className="min-h-screen  flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
let isDarkKk = isDark ? 'text-gray-300' : 'text-gray-700';
let darkInput = isDark ? 'bg-gradient-to-r from-blue-800/30 to-white/30 text-gray-200' : 'text-gray-700'
  return (
    <div className={`min-h-screen mt-12 py-16 transition-all duration-300 ${
      isDark 
        ? 'bg-gradient-to-b from-blue-950/60 via-blue-800/20 to-blue-700/25 text-gray-100' 
        : 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50'
    }`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className={`text-4xl font-bold ${isDarkKk}`}>Profile Details</h2>
          <p className={` ${isDarkKk} mt-4`}>Manage your account and view your activity</p>
        </div>

        {/* User Info Card */}
        <div className={`bg-transparent backdrop-blur-sm rounded-xl shadow-2xl p-8 border border-gray-400/20 mb-8`}>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Basic Info */}
            <div className="space-y-6 bg-transparent">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Personal Information
              </h3>
              
              <div className="space-y-4">
                <div className={` ${darkInput} shadow-lg flex items-center justify-left p-4  rounded-lg`}>
                  <span className="font-semibold ">Name:</span>
                  <span className={"ml-4 font-medium"}>{user.name}</span>
                </div>
                
                <div className={` ${darkInput} shadow-lg flex items-center justify-left p-4  rounded-lg`}>
                  <span className="font-semibold ">Email:</span>
                  <span className={"ml-4 font-medium"}>{user.email}</span>
                </div>
                
                <div className={` ${darkInput} shadow-lg flex items-center justify-left p-4  rounded-lg`}>
                  <span className="font-semibold ">User ID:</span>
                  <span className="ml-4 font-medium text-sm">{user.$id}</span>
                </div>
                <div className={` ${darkInput} shadow-lg flex items-center justify-left p-4  rounded-lg`}>
                  <span className="font-semibold ">Verification Status:</span>
                  {/* <span className="ml-4 font-medium capitalize">{user.Status}</span> */}
                </div>
                
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold bg-transparent text-transparent">
                Quick Actions
              </h3>
              
              <div className="space-y-3">
                <NavLink 
                  to="/userdetail" 
                  className="block w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 px-4 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105 text-center"
                >
                  ✏️ Edit Profile
                </NavLink>
                
                <NavLink 
                  to="/propicture" 
                  className="block w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-4 rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 text-center"
                >
                  🖼️ Update Picture
                </NavLink>
                
                <NavLink 
                  to="/contactform" 
                  className="block w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-3 px-4 rounded-xl font-semibold hover:from-green-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 text-center"
                >
                  💌 Contact Support
                </NavLink>
              </div>
            </div>
          </div>
        </div>

        {/* Messages Section */}
        <MessagesHistory isDark={isDark}/>


        {/* Order History Section */}
        <div className={` backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-gray-400/20 bg-transparent `}>
          <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
            Order History
          </h3>
          <OrderHistory isDark={isDark}/>
        
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;