import React, { useState, useEffect } from 'react';
import { useAuth } from '../Auth/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { account } from '../appwrite';
import { DataBases, ID } from '../Auth/Config';
import { toast, Toaster } from 'sonner';

function Contact() {
  const { user, isAuthenticated } = useAuth();
  const { isDark } = useTheme();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // ✅ Fill logged-in user data once
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || "",
        email: user.email || ""
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // ✅ Updated Send Message Function (Appwrite)
  const sendMessage = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.error("Please login to send message.");
      return;
    }

    if (!formData.message.trim()) {
      toast.error("Message cannot be empty.");
      return;
    }

    setIsSubmitting(true);

    try {
      // ✅ Ensure user session is valid
      await account.get();

      // ✅ Create message in Appwrite
      await DataBases.createDocument(
        import.meta.env.VITE_APPWRITE_DB_ID,
        import.meta.env.VITE_APPWRITE_MessagesTable,
        ID.unique(),
        {
          UserName: formData.name,
          Email: formData.email,
          Message: formData.message,
          $createdAt: new Date().toISOString(),
          userId: user.$id
        }
      );

      toast.success("✅ Message has been sent!");

      // ✅ Clear only message field
      setFormData(prev => ({
        ...prev,
        message: ""
      }));

    } catch (error) {
      console.log("MessageError:", error);
      toast.error("❌ Oops! Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className={`min-h-screen mt-10 py-16 transition-all duration-500 ${
      isDark 
        ? 'bg-gradient-to-b from-[#070F2B] to-[#1B1A55]' 
        : 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50'
    }`}>
       <Toaster position="top-center" />
      
      <div className="max-w-4xl mx-auto px-4">

        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Contact Us
          </h1>
          <p className={`text-xl ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Get in touch with us. We'd love to hear from you!
          </p>
        </div>

        {/* Contact Card */}
        <div className="backdrop-blur-sm rounded-2xl shadow-xl px-4 py-6 bg-transparent">
          <div className="grid md:grid-cols-2 gap-8">

            {/* Left Info Box */}
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                  Get in Touch
                </h3>
                <div className={`${isDark ? 'text-gray-400' : 'text-gray-600'} space-y-3`}>
                  <p className="flex gap-2">📧 hello@shoplite.com</p>
                  <p className="flex gap-2">📞 +92315 9878071</p>
                  <p className="flex gap-2">📍 PakhtunKhwa, Pakistan</p>
                </div>
              </div>

              {/* Auth Warning */}
              {!isAuthenticated && (
                <div className={`border rounded-lg p-4 ${
                  isDark ? 'bg-yellow-900/30 border-yellow-700 text-yellow-300'
                  : 'bg-yellow-50 border-yellow-200 text-yellow-800'
                }`}>
                  🔐 Please login to send a message.
                </div>
              )}
            </div>

            {/* Message Form */}
            <div className="space-y-4">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Send Message
              </h3>

              <form onSubmit={sendMessage} className="space-y-4">

                {/* Name (Auto-filled, disabled) */}
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  disabled
                  className={`w-full p-3 border rounded-lg ${
                    isDark 
                      ? 'bg-gray-800 text-gray-400 border-gray-600'
                      : 'bg-gray-100 border-gray-300 text-gray-700'
                  }`}
                />

                {/* Email (Auto-filled, disabled) */}
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  disabled
                  className={`w-full p-3 border rounded-lg ${
                    isDark 
                      ? 'bg-gray-800 text-gray-400 border-gray-600'
                      : 'bg-gray-100 border-gray-300 text-gray-700'
                  }`}
                />

                {/* Message */}
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Your Message"
                  className={`w-full p-3 border rounded-lg ${
                    isDark 
                      ? 'bg-gradient-to-b from-[#070F2B] to-[#1B1A55] text-gray-300 border-gray-600'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  required
                  disabled={isSubmitting}
                ></textarea>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting || !isAuthenticated}
                  className={`w-full p-3 rounded-lg font-semibold transition-all duration-300 ${
                    isSubmitting || !isAuthenticated
                      ? 'bg-gray-500 cursor-not-allowed text-gray-300'
                      : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:scale-105'
                  }`}
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </button>

              </form>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}

export default Contact;
