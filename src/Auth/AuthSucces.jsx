import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { account } from "../Auth/Config";
import { toast } from "sonner";
import { useAuth } from "../Auth/AuthContext";

function OAuthSuccess() {
  const navigate = useNavigate();
  const { register } = useAuth(); // If you store user in global context

  useEffect(() => {
    const finishLogin = async () => {
      try {
        // ✅ Get user details
        const user = await account.get();

        // ✅ Get session secret
        const session = await account.getSession("current");

        // ✅ Store user in context (optional)
        if (register) {
          register(
            {
              id: user.$id,
              name: user.name,
              email: user.email,
              role: "customer"
            },
            session?.secret
          );
        }

        toast.success("Logged in with Google!");
        navigate("/", { replace: true });

      } catch (err) {
        toast.error("Failed to complete Google login.");
        navigate("/login");
      }
    };

    finishLogin();
  }, [navigate, register]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-lg font-semibold">Signing you in with Google...</p>
    </div>
  );
}

export default OAuthSuccess;
