import { useEffect, useState } from "react";
import { Query } from "appwrite";
import { account, DataBases, getCurrentUser } from "../Auth/Config";

const dbId = import.meta.env.VITE_APPWRITE_DB_ID;
const tableId = import.meta.env.VITE_APPWRITE_FeedbacksTable;

export default function FeedbackPage({ productId, isDark }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!productId) return;
    const fetchReviews = async () => {
      try {
        
        
        const res = await DataBases.listDocuments(
          dbId,
          tableId,
          [Query.equal("productId", [Number(productId)])]
        );

        setReviews(res.documents); 
      } catch (err) {
        console.error("Error fetching reviews:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [productId]);
 

  if (loading) return <p>Loading reviews...</p>;

  return (
    <div className="product-reviews w-full min-h-2/6 my-4">
      <h3 className="text-center text-2xl font-semibold my-2">Customer Reviews</h3>

      {reviews.length === 0 ? (
        <p  className="text-center">No reviews yet</p>
      ) : (
        reviews.map((r) => (
          <div key={r.$id} className={`review max-w-[90vw] mx-auto p-2 my-2 rounded-md transition-colors duration-300 
          ${isDark ? 'bg-blue-950/90' : 'bg-black/10'}
          `}>
            <div className="text-2xl text-yellow-500  max-w-26 rounded-md">
              {"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}
            </div>
            <p className={`text-xl ${isDark ? 'text-white' : 'text-black'}`}>{r.comments}</p>
            <div className="text-gray-500 flex justify-between">
              <small>Reviewed by {r.userName}</small>
              <small>Date: {new Date(r.$createdAt).toLocaleDateString()}</small>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
