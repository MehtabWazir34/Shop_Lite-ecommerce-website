import { useState } from "react";

import { account, DataBases, ID } from "../Auth/Config";
import { useLocation } from "react-router-dom";
import { string } from "yup";


export default function FeedBackForm({ onSubmitSuccess }) {
  const dbId = import.meta.env.VITE_APPWRITE_DB_ID 
  const feedbackTable = import.meta.env.VITE_APPWRITE_FeedbacksTable



  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const location = useLocation();
  const { productId, orderId, userId } = location.state || {};
  console.log("📝 Submitting feedback with values:", {
  productId,
  orderId,
  userId,
  rating,
  review
});

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
    let user = await account.get();
        let userName = user.name;
      await DataBases.createDocument(
        dbId, feedbackTable,
        ID.unique(),
        {
          productId: Number(productId),
          orderId,
          userName,
          rating,
          comments: review,
          createdAt: new Date().toISOString(),
        }
      );

      setLoading(false);
      setReview("");
      setRating(0);
      onSubmitSuccess?.();
      console.log('Feedback submitted!');
      alert("Feedback submitted! Thanks.")
      
    } catch (err) {
      console.error(err);
      setError("Something went wrong while submitting the review.");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="review-form bg-amber-600 p-8 rounded-md max-w-2/3 min-h-1/2 mt-16 my-8 mx-auto grid place-items-center">
      <h3>Write Feedback!</h3>
      <p>Your honest feedback helps other while shopping online.</p>

      <div className="rating-section text-3xl my-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            onClick={() => setRating(star)}
            style={{ cursor: "pointer", color: star <= rating ? "gold" : "#ccc" }}
          >
            ★
          </span>
        ))}
      </div>

      <textarea
      className="w-full bg-amber-50 p-2 outline-none rounded-md"
        placeholder="Share your honest experience..."
        value={review}
        onChange={(e) => setReview(e.target.value)}
        required
      />

      {error && <p className="bg-red-700 rounded-md p-1 my-2
      text-white">{error}</p>}

      <button
      className="p-2 rounded-md bg-blue-800 text-white cursor-pointer my-4"
      type="submit" disabled={loading}>
        {loading ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  );
}
