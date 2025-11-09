import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast, Toaster } from "sonner";
import { DataBases, account } from "../Auth/Config";
import { ID } from "appwrite";
import { useAuth } from "../Auth/AuthContext";

function CartOrder({ isDark }) {
  const { state } = useLocation();
  const [cartItems, setCartItems] = useState([]);

  const {user, isAuthenticated} = useAuth()

  const databaseId = import.meta.env.VITE_APPWRITE_DB_ID;
  const orderTableId = import.meta.env.VITE_APPWRITE_MyCartOrders_ID;

  // ---------- Load Cart from navigation → fallback localStorage ----------
  useEffect(() => {
    if (state?.cartItems) {
      setCartItems(state.cartItems);
      localStorage.setItem("CartItems", JSON.stringify(state.cartItems));
    } else {
      const saved = JSON.parse(localStorage.getItem("CartItems") || "[]");
      setCartItems(saved);
    }
  }, [state]);

  // ---------- Quantity Controls ----------
  const updateQty = (id, change) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, qty: Math.max(1, item.qty + change) }
          : item
      )
    );
  };

  const removeItem = (id) => {
    const updated = cartItems.filter((item) => item.id !== id);
    setCartItems(updated);
    localStorage.setItem("CartItems", JSON.stringify(updated));
  };

  // ---------- Calculate totals ----------
  const itemTotal = (item) => item.price * item.qty;
  const grandTotal = cartItems.reduce((sum, i) => sum + itemTotal(i), 0);

  // ---------- Form Validation ----------
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

  // ---------- Submit Order ----------
  const handleSubmit = async (values, { resetForm }) => {
    if (cartItems.length === 0) {
      return toast.error("Cart is empty!");
    }

    if(!isAuthenticated){
        toast.error("Not authenticated");
        return
    }
    try {
      const user = await account.get();

      const orderData = {
        userId: user.$id,
        Name: values.name,
        PhoneNumber: Number(values.phone),
        Address: values.address,
        // items: JSON.stringify(cartItems.map((i) => ({
        //   id: i.id,
        //   title: i.title,
        //   qty: i.qty,
        //   price: i.price,
        //   total: i.price * i.qty,
        //   img: i.img,
        // }) )),
        orderedItems: JSON.stringify(cartItems.map((i) => ({
          id: i.id,
          title: i.title,
          qty: i.qty,
          price: i.price,
          total: i.price * i.qty,
          img: i.img,
        }) )),
        grandTotal,
        $createdAt: new Date().toISOString(),
        Status: "pending",
      };

    //    await account.get()
      await DataBases.createDocument(
        databaseId,
        orderTableId,
        ID.unique(),
        orderData
      );

      toast.success("Order placed successfully!");
      localStorage.removeItem("CartItems");
      resetForm();
      setCartItems([]);

    } catch (err) {
      console.error(err);
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
          Place Your Order
        </h2>

        <Formik
          initialValues={{ name: "", phone: "", address: "" }}
          validationSchema={validationSchema}
        //   onSubmit={isAuthenticated ? (handleSubmit) :(toast.error("Not authenticated user.")) }
        onSubmit={handleSubmit}
        >
          {() => (
            <Form className="space-y-4">

              {/* ============ USER INFO INPUTS ============ */}
              <div>
                <Field
                  name="name"
                  type="text"
                  placeholder="Full Name"
                  className={`${inputStyle} w-full p-3 rounded-lg outline-0`}
                />
                <ErrorMessage
                  name="name"
                  className="text-red-500 text-sm"
                  component="div"
                />
              </div>

              <div>
                <Field
                  name="phone"
                  type="text"
                  placeholder="Phone Number"
                  className={`${inputStyle} w-full p-3 rounded-lg outline-0`}
                />
                <ErrorMessage
                  name="phone"
                  className="text-red-500 text-sm"
                  component="div"
                />
              </div>

              <div>
                <Field
                  as="textarea"
                  name="address"
                  placeholder="Shipping Address"
                  className={`${inputStyle} w-full p-3 rounded-lg outline-0`}
                />
                <ErrorMessage
                  name="address"
                  className="text-red-500 text-sm"
                  component="div"
                />
              </div>

              {/* ============ CART ITEMS LIST ============ */}
              <div className={`${inputStyle} p-4 rounded-md`}>
                <h3 className="text-lg font-semibold mb-3">Your Items</h3>

                {cartItems.length === 0 ? (
                  <p className="text-center py-4">Your cart is empty.</p>
                ) : (
                  cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="border-b pb-3 mb-3 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4"
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={item.img}
                          className="w-20 h-20 rounded object-cover"
                        />
                        <div>
                          <p className="font-semibold text-sm">{item.title}</p>
                          <p className="text-orange-600 font-bold">
                            Rs. {item.price}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => updateQty(item.id, -1)}
                          className="px-3 py-1 bg-gray-200 font-bold rounded hover:bg-gray-300"
                        >
                          -
                        </button>
                        <span className="font-medium">{item.qty}</span>
                        <button
                          type="button"
                          onClick={() => updateQty(item.id, 1)}
                          className="px-3 py-1 bg-gray-200 font-bold rounded hover:bg-gray-300"
                        >
                          +
                        </button>
                      </div>

                      <div>
                        <p className="font-semibold">
                          Total: Rs. {itemTotal(item)}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="text-red-500 font-bold"
                      >
                        ✕
                      </button>
                    </div>
                  ))
                )}

                {/* GRAND TOTAL */}
                <div className="flex justify-between mt-4 text-lg font-semibold">
                  <span>Grand Total:</span>
                  <span>Rs. {grandTotal}</span>
                </div>

                <button
                  type="submit"
                  className="w-full bg-orange-500 text-white py-2 rounded-md font-medium text-lg mt-4 hover:bg-orange-600"
                >
                  Place Order
                </button>

              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default CartOrder;
