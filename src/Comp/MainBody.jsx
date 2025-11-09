
import React from "react";
import ProBox from "./ProBox";
import ItemDetails from "./ItemDetails";
import { motion } from "framer-motion";
import CreatedProducts from "./CreatedProducts";

function MainBody({ addToCart, products, seeDetailsBtn, isDark }) {

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};


  return (

    <motion.main 
    viewport={{once: true}}
    variants={containerVariants}
     whileInView={'show'}
    className={`w-full min-h-screen py-8
      bg-transparent
    `}>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center mb-8">
          <motion.h1 
          initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9 }}
      // viewport={{ once: true }}
      className={`text-3xl md:text-4xl font-black mb-4
      ${isDark ? 'text-gray-100' : 'text-gray-800'}
      `}>
            Our <span
            initial={{ width: 0 }}
          whileInView={{ width: "100%" }}
          transition={{ duration: 0.7, delay: 0.3 }}

            className={` text-transparent
            ${isDark ? 'text-gray-100 bg-gradient-to-r from-blue-300 to-purple-500 bg-clip-text' : 'bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text'}
            `}>Products</span>
          </motion.h1>

          <motion.p
          initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.3 }}
        // viewport={{once:true}}

           className={`${isDark ? 'text-gray-100' : 'text-gray-700'} text-lg max-w-2xl mx-auto`}>
            Discover amazing products with great deals and premium quality
          </motion.p>
        </div>

        {/* Products Count */}
        <div className="flex justify-between items-center mb-6 px-2">
          <p className={`${isDark ? 'text-gray-200': 'text-gray-700'} font-semibold`}>
            Showing <span className={`${isDark ? 'text-amber-500':"text-blue-600"}`}>{products.length}</span> products
          </p>
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
            🎯 Best Deals
          </div>
        </div>

        {/* Products Grid */}
        <div 
 
        className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ">
          {products.length > 0 ? (
            products.map((eachProduct) => (
              
              <motion.div 
              variants={itemVariants}
                key={eachProduct.id}
                className="animate-fade-in"
                style={{
                  animationDelay: `${products.indexOf(eachProduct) * 100}ms`
                }}
              >
                <ProBox
                  {...eachProduct}
                  onAdd={() => addToCart(eachProduct)} seeDetails={seeDetailsBtn}
                />
                
              </motion.div>
            ))
          ) : (
            /* No Products Found State */
            <div className="col-span-full text-center py-16">
              <div className="bg-transparent backdrop-blur-sm rounded-2xl p-12 shadow-lg border border-white/20 max-w-2xl mx-auto">
                <div className="text-8xl mb-6">🔍</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  No Products Found
                </h3>
                <p className={`${isDark?'text-gray-200':'text-gray-600'} text-lg mb-6`}>
                  We couldn't find any products matching your search. Try different keywords or browse our categories.
                </p>
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-xl font-semibold inline-block shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  Browse All Products
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Loading More Indicator (Optional) */}
        {products.length > 0 && (
          <div className="text-center mt-12">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl inline-block shadow-2xl">
              <p className="font-semibold flex items-center justify-center gap-2">
                <span>✨</span>
                More amazing products coming soon!
                <span>✨</span>
              </p>
            </div>
          </div>
        )}

        {/* Background Elements */}
        <div className="fixed top-20 left-5 w-16 h-16 bg-blue-200 rounded-full blur-2xl opacity-30 animate-float -z-10"></div>
        <div className="fixed bottom-20 right-10 w-12 h-12 bg-purple-200 rounded-full blur-2xl opacity-30 animate-float delay-1000 -z-10"></div>
        <div className="fixed top-1/2 left-1/4 w-8 h-8 bg-pink-200 rounded-full blur-2xl opacity-30 animate-pulse-slow -z-10"></div>
      </div>


    </motion.main> //Main Div
  );
}

export default MainBody;