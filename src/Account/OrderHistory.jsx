import React, { useEffect, useState } from 'react';
import { DataBases, account } from '../Auth/Config';
import { Query } from 'appwrite';
import { Toaster, toast } from 'sonner';
import { NavLink } from 'react-router-dom';

const databaseId = import.meta.env.VITE_APPWRITE_DB_ID;
const collectionId = import.meta.env.VITE_APPWRITE_OrderCollection_ID;

function OrderList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const user = await account.get(); // current logged-in user
        const response = await DataBases.listDocuments(
          databaseId,
          collectionId,
          [
            Query.equal('userId', user.$id),    // fetch only their orders
            Query.orderDesc('$createdAt'),     // latest first
          ]
        );
        setOrders(response.documents);
      } catch (error) {
        console.error('Error fetching orders:', error);
        toast.error('Failed to load your order history');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading your orders...</p>;

  // if (orders.length === 0){
  //   return <p className="text-center mt-10 text-gray-500">No orders found.</p>;}


  return (
    <div className={`bg-transparent max-w-3xl mx-auto mt-10  p-2`}>
      <Toaster position="top-center" />
      {
        orders.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="text-6xl mb-4">💌</div>
                      <p className="text-gray-500 text-lg mb-4">You've no order placed yet.</p>
                      <NavLink 
                        to="/shop" 
                        className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
                      >
                        Place your first order
                      </NavLink>
                    </div>) :
        (<ul>
        {orders.map((order) => (
          <li key={order.$id} className=" flex justify-between items-center rounded-xl p-2 shadow-lg transition-all duration-300">
            <div className=''>
              <p className="font-medium">Order ID: {order.$id}</p>
              <p className="text-sm text-gray-500">
                Date: {new Date(order.$createdAt).toLocaleString()}
              </p>
              <p className="text-sm text-gray-500">
                Quantity: {order.quantity} | Total: Rs. {order.total}
              </p>
              <p
                className={`text-sm font-semibold ${
                  order.status === 'pending'
                    ? 'text-yellow-600'
                    : order.status === 'Delivered'
                    ? 'text-green-600'
                    : 'text-red-600'
                }`}
              >
                Status: {order.status}
              </p>
            </div>
            <NavLink
            to={ order.status === 'Delivered' ? ('/feedbackform') : (`/itemdetails/${order.productId}`)}
            state={{
    productId: order.productId,
    orderId: order.$id,
     // or from logged in account.get()
  }}
            className="px-3 py-1 text-sm bg-orange-500 text-white rounded hover:bg-orange-600">
              {
                order.status === 'Delivered' ? 'Write feedback' : 'View Product'
            }
            </NavLink>
          </li>
        ))}
      </ul>)
      }
    </div>
  );
}

export default OrderList;
