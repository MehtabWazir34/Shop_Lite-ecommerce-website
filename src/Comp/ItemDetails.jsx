import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { DataBases } from "../Auth/Config";
import products from "./ProductList";
import FeedbackPage from "../Account/FeedbackPage";

function ItemDetails({ addToCart, isDark }) {
  const { id } = useParams();
  const navigateTo = useNavigate();

  const databaseId = import.meta.env.VITE_APPWRITE_DB_ID;
  const tableId = import.meta.env.VITE_APPWRITE_MyProductsTable_ID;

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ First, try Appwrite document
  useEffect(() => {
    DataBases.getDocument(databaseId, tableId, id)
      .then((res) => {
        setProduct({
          id: res.$id,
          title: res.title,
          price: res.price,
          detail: res.description,
          img: res.ImgLink,
        });
        setLoading(false);
      })
      .catch(() => {
        // ❗ If not found in Appwrite, fallback to static products
        const localProduct = products.find((p) => p.id === id);
        setProduct(localProduct || null);
        setLoading(false);
      });
  });

  if (loading) return <p className={`text-center ${isDark ? 'text-gray-100':'text-gray-800'}`}>Loading...</p>;

  if (!product)
    return (
      <p className="text-center text-red-500">Product not found</p>
    );

  return (
    <section
      className={`${
        isDark ? "text-gray-100" : "text-gray-700"
      } w-full h-full pt-12 my-[8rem] flex flex-col items-center p-6`}
    >
      <div className="flex flex-col lg:flex-row gap-4 items-center rounded-md w-full mt-8">
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

          <div className="flex justify-between gap-x-4 mx-auto w-[78%] lg:w-[40%]">
            <button
              onClick={() => addToCart(product)}
              className="bg-blue-500 text-white p-4 w-full rounded hover:bg-blue-600 transition"
            >
              Add to cart
            </button>

            <button
              onClick={() => navigateTo(`/orderdetails/${product.id}`)}
              className="bg-green-500 text-white p-4 w-full rounded hover:bg-green-600 transition"
            >
              Buy now
            </button>
          </div>
        </div>
      </div>

      <FeedbackPage productId={String(product.id)} isDark={isDark} />
    </section>
  );
}

export default ItemDetails;
