import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { account } from "../Auth/Config";
import { toast } from "sonner";

export default function VerifyEmail() {
  const navigate = useNavigate();

  useEffect(() => {
    const verify = async () => {
      try {
        const url = new URL(window.location.href);
        const userId = url.searchParams.get("userId");
        const secret = url.searchParams.get("secret");

        // ✅ Verify the user
        await account.updateVerification(userId, secret);

        toast.success("Email verified! Please log in.");
        navigate("/login");

      } catch (err) {
        toast.error("Verification failed.");
        console.log(err);
      }
    };

    verify();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-lg font-medium">Verifying your email...</p>
    </div>
  );
}
