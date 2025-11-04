import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import products from "./ProductList"; // import your product data
import OrderDetails from "./OrderDetails";

import FeedbackPage from "../Account/FeedbackPage";
// import { handlePlaceOrder } from "../Account/BuyNowFun";

function ItemDetails({ addToCart, isDark }) {
  const { id } = useParams();
  const product = products.find((p) => p.id === parseInt(id));
  let navigateTo = useNavigate()
  if (!product) {
    return <p className="text-center text-red-500">Product not found</p>;
  }

  return (
    <section className={`${
      isDark 
        ? 'text-gray-100' 
        : 'text-gray-700'
    } w-full h-full bg-w pt-12 relative left-0 top-0 my-[8rem] flex flex-col  place-items-center p-6`}>
      <div className="flex flex-col lg:flex-row gap-4 place-items-center rounded-md w-full h-full mt-8">
        <img
          src={product.img}
          alt={product.title}
          className="w-[40%] rounded-md object-cover"
        />

        <div className="flex flex-col gap-y-12 w-full">
          <div>
            <h2 className="text-xl font-bold">{product.title}</h2>
          <h3 className="text-lg ">${product.price}</h3>
          <p className="text-sm ">{product.detail}</p>
          </div>
        <div className="flex justify-between gap-x-4 mx-auto w-[78%] lg:w-[40%] relative bottom-0">
          <button
            onClick={() => addToCart(product)}
            className="bg-blue-500 text-white cursor-pointer p-4 w-full rounded hover:bg-blue-600 transition-colors duration-200"
          >
            Add to cart
          </button>
          <button
            onClick={() => { navigateTo(`/orderdetails/${id}`)}}
            className="bg-green-500 text-white cursor-pointer p-4 w-full rounded hover:bg-green-600 transition-colors duration-200"
          >
            Buy now
          </button>
        </div>
        </div>

      </div>
      <FeedbackPage productId={product.id} isDark={isDark}/>
    </section>
  );
}

export default ItemDetails;
