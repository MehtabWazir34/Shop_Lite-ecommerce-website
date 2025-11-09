import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import products from "./ProductList";
import { DataBases, account } from "../Auth/Config";
import { ID } from "appwrite";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Toaster, toast } from "sonner";

function OrderDetails({ isDark }) {
  const { id } = useParams();

  const databaseId = import.meta.env.VITE_APPWRITE_DB_ID;
  const userTableId = import.meta.env.VITE_APPWRITE_MyProductsTable_ID;
  const orderTableId = import.meta.env.VITE_APPWRITE_OrderCollection_ID;

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQuantity] = useState(1);

  const increaseQty = () => setQuantity((prev) => prev + 1);
  const decreaseQty = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  // const total = (product.price * qty).toFixed(2);

  // FETCH PRODUCT (Appwrite → fallback to static)
useEffect(() => {
  DataBases.getDocument(databaseId, userTableId, id)
    .then((res) => {
      setProduct({
        id: res.$id,
        title: res.title,
        price: Number(res.price),
        deliveryFee: Number(res.deliveryFee) || 200,  // ✅ set default fee
        detail: res.description,
        img: res.ImgLink,
      });
      setLoading(false);
    })
    .catch(() => {
      const local = products.find((p) => String(p.id) === String(id));  // ✅ handles int/string mismatch
      setProduct(local || null);
      setLoading(false);
    });
}, []);


  if (loading) {
    return <div className={`text-center mt-30 ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>Loading...</div>;
  }

  if (!product) {
    return (
      <div className="p-6 text-center text-red-500">Product not found!</div>
    );
  }

const ItemTotal = product ? (product.price * qty).toFixed(2) : "0";
const total = (product.price * qty) + (product.deliveryFee || 0);


  // ✅ Yup Validation
  const validationSchema = Yup.object({
    name: Yup.string().required("Full name is required"),
    phone: Yup.string()
      .matches(/^[0-9]{10,15}$/, "Invalid phone number")
      .required("Phone number is required"),
    address: Yup.string()
      .min(10, "Address is too short")
      .required("Address is required"),
  });

  const inputStyle = isDark
    ? "bg-blue-800/10 text-gray-200 border-gray-500 border focus:border-b-amber-200"
    : "bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 border border-gray-300 focus:border-b-amber-700";

  // ✅ Submit Order to Appwrite Database
const handleSubmit = async (values, { resetForm }) => {
  try {
    const user = await account.get();

    const orderData = {
      userId: user.$id,
      productId: product.id,
      quantity: qty,                        
      // price: product.price,                
      // deliveryFee: product.deliveryFee || 0,
      total: Number(product.price * qty) + Number(product.deliveryFee || 0),  
      address: `${values.name}, ${values.phone}, ${values.address}`,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    console.log("My ORDER DATA:", orderData);

    await DataBases.createDocument(
      databaseId,
      orderTableId,
      ID.unique(),
      orderData
    );

    toast.success("Order placed successfully!");
    resetForm();
  } catch (err) {
    console.error("Order placement error:", err);
    toast.error("Failed to place order.");
  }
};

  return (
    <div
      className={`min-h-screen flex justify-center mt-12 py-8 ${
        isDark
          ? "bg-gradient-to-b from-black/30 via-blue-800/30 to-black/35 text-gray-100"
          : "bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 text-gray-800"
      }`}
    >
      <div
        className={`w-full max-w-4xl rounded-md shadow-md p-6 space-y-6 ${
          isDark
            ? "bg-gradient-to-t via-black/50 from-blue-800/30 to-black/35 text-gray-100"
            : "bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 text-gray-800"
        }`}
      >
        <Toaster position="top-center" />

        <h2 className="text-xl font-semibold mb-3 text-center">
          Shipping & Billing
        </h2>

        <Formik
          initialValues={{ name: "", phone: "", address: "" }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {() => (
            <Form className="space-y-4">
              {/* Name */}
              <div>
                <Field
                  name="name"
                  type="text"
                  placeholder="Full Name"
                  className={`${inputStyle} w-full p-3 rounded-lg outline-0`}
                />
                <ErrorMessage
                  name="name"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Phone */}
              <div>
                <Field
                  name="phone"
                  type="text"
                  placeholder="Phone Number"
                  className={`${inputStyle} w-full p-3 rounded-lg outline-0`}
                />
                <ErrorMessage
                  name="phone"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Address */}
              <div>
                <Field
                  as="textarea"
                  name="address"
                  placeholder="Shipping Address"
                  className={`${inputStyle} w-full p-3 rounded-lg outline-0`}
                />
                <ErrorMessage
                  name="address"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Product Display */}
              <div
                className={`${inputStyle} border p-4 rounded-md grid grid-cols-1 place-items-center sm:flex sm:justify-between space-x-4`}
              >
                <img
                  src={product.img}
                  alt={product.title}
                  className="w-24 h-24 object-cover rounded"
                />

                <div>
                  <p className="text-sm font-medium">{product.title}</p>

                  <div>
                    <span className="text-orange-600 font-semibold text-lg">
                      Rs. {product.price}
                    </span>

                    {product.originalPrice && (
                      <span className="line-through text-gray-400 ml-2 text-sm">
                        Rs. {product.originalPrice}
                      </span>
                    )}
                  </div>

                 
                </div> 

        <div className="flex  items-center gap-2">
          <button
          type="button"
            onClick={decreaseQty}
            className={`font-bold px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 ${isDark ? 'text-gray-800' : ''}`}
          > - </button>
          <span className="font-medium">{qty}</span>
          <button
          type="button"
            onClick={increaseQty}
            className={`font-bold px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 ${isDark ? 'text-gray-800' : ''}`}
          > + </button>
        </div>
              </div>

              {/* Order Summary */}
              <div className={`p-4 rounded-md ${inputStyle}`}>
                <h3 className="text-lg font-semibold mb-3">Order Summary</h3>

                <div className="flex justify-between mb-1">
                  <span>Quantity</span>
                  <span> {qty}</span>
                </div>
                <div className="flex justify-between mb-1">
                  <span>Item Total</span>
                  <span>Rs. {ItemTotal}</span>
                </div>

                <div className="flex justify-between mb-1">
                  <span>Delivery Fee</span>
                  <span>Rs. {product.deliveryFee || 0}</span>
                </div>

                <hr className="my-2" />

                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>Rs. {total}</span>
                </div>

                <button
                  type="submit"
                  className="w-full mt-4 cursor-pointer bg-orange-500 text-white py-2 rounded-md font-medium text-lg hover:bg-orange-600"
                >
                  Proceed to Pay
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default OrderDetails;
