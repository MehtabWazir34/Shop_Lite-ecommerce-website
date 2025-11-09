
import React, { useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
import { DataBases } from "../Auth/Config";
import { Query } from "appwrite";

function ProBoxCopy() {
  const { isDark } = useTheme();
  let navigateTo = useNavigate('');
  useEffect(()=>{
    async () => {
      try {
        await DataBases.listDocuments(
          import.meta.env.VITE_APPWRITE_DB_ID,
          import.meta.env.VITE_APPWRITE_MyProductsTable_ID,
          [Query.equal('id', id)]
        )
      } catch (error) {
        console.log(error);
        
      }
    }
  })
  let darkSpot = isDark 
                  ? 'bg-gradient-to-r from-blue-800 to-black text-gray-100 hover:bg-gradient-to-r hover:from-black hover:to-blue-800' 
                  : 'bg-white/90 text-gray-800 hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-500'

  return (
    <div className={`rounded-md overflow-hidden transition-all duration-500 
     bg-transparent
    `
    }>
      <div 
        key={id} 
        className={`group relative  shadow-lg hover:shadow-xl transition-all duration-500   transform hover:-translate-y-2 
          ${
      isDark 
        ? 'bg-[#070F2B] ' 
        : 'bg-white/90'
    }`}
      >
        {/* Image Container */}
        <div className="relative overflow-hidden">
          <img
            src={img}
            alt={title}
            className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-700"
          />
          
          {/* Quick detail and Add Button Overlay */}
          <div className="absolute inset-0  transition-all duration-500 flex items-center justify-center gap-2">
            <button
              onClick={() => navigateTo(`/itemdetails/${id}`)}
              className={`backdrop-blur-sm px-4 py-2 rounded-lg cursor-pointer shadow-2xl opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300  hover:text-white hover:scale-105 font-semibold flex items-center space-x-2 ${darkSpot}`}
            >
              <span>See details</span>
              <motion.svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                viewBox="0 0 24 24"
                whileHover={{ x: 3 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <path d="M5 12h14" />
                <path d="M12 5l7 7-7 7" />
              </motion.svg>
            </button>
            <button
              onClick={onAdd}
              className={`backdrop-blur-sm px-4 py-2 rounded-lg cursor-pointer shadow-2xl opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500  hover:text-white hover:scale-105 font-semibold flex items-center space-x-2 ${
                darkSpot
              }`}
            >
              <span>Add to cart</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </button>
          </div>

        </div>
        
        {/* Content */}
        <div className="p-2  ">
          <div className="mb-8 py-4 flex justify-around w-full">
            {/* Product Title and price*/}
            <h2 className={`font-bold absolute left-4 mb-3 line-clamp-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-500 group-hover:to-purple-500 transition-all duration-500 leading-tight ${
              isDark ? 'text-gray-100' : 'text-gray-800'
            }`}>
              {title}
            </h2>
            <div className="lg:hidden absolute right-4">
              <span className="text-2xl font-black bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                ${price}
              </span>
              <span className={`text-sm line-through opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
                isDark ? 'text-gray-400' : 'text-gray-400'
              }`}>
                ${price + 15}
              </span>
            </div>
          </div>
          
          {/* Bottom Part */}
          <div className="flex items-center justify-between mt-auto">
            {/* Price Display */}
            <div className="hidden lg:block">
              <span className="text-2xl font-black bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                ${price}
              </span>
              <span className={`text-sm line-through opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
                isDark ? 'text-gray-400' : 'text-gray-400'
              }`}>
                ${price + 15}
              </span>
            </div>
            
            <button
              onClick={() => navigateTo(`/itemdetails/${id}`)}
              className={`${
      isDark 
        ? 'bg-gradient-to-b from-blue-800 to-black text-gray-100 hover:bg-gradient-to-b hover:from-black hover:to-blue-800' 
        : 'text-gray-100 bg-gradient-to-r from-blue-500 to-purple-500'
    } lg:hidden   px-3 cursor-pointer py-2.5 rounded-lg transition-all duration-300 transform hover:scale-105 font-semibold text-sm shadow-md hover:shadow-lg relative overflow-hidden group/btn`}
            >
              <span>See details</span>
              
            </button>
            <NavLink
              to={`/orderdetails/${id}`}
              className={` ${
      isDark 
        ? 'bg-gradient-to-b from-blue-800 to-black text-gray-100 hover:bg-gradient-to-b hover:from-black hover:to-blue-800' 
        : 'text-gray-100 bg-gradient-to-r from-blue-500 to-purple-500'
    } px-4 cursor-pointer py-2.5 rounded-lg transition-all duration-300 transform hover:scale-105 font-semibold text-sm shadow-md hover:shadow-lg relative overflow-hidden group/btn`}
            >
              <span className="relative z-10 flex items-center space-x-1">
                <span>Buy Now</span>
                
              </span>
              {/* <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div> */}
            </NavLink>
          </div>
        </div>

        {/* Hover Border Glow */}
        <div className="absolute inset-0 rounded-md bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-md"></div>
        <div className={`absolute inset-[1px] rounded-md -z-10 ${
      isDark 
        ? 'bg-gradient-to-b  from-[#070F2B] to-[#1B1A55]' 
        : 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50'
    }`}></div>
      </div>
    </div>
  );
}

export default ProBoxCopy;