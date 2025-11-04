import { useLocation } from "react-router-dom";

export default function VerifyEmailPending() {
  const { state } = useLocation();

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl shadow text-center">
        <h2 className="font-bold text-lg mb-2">Verify Your Email</h2>
        <p>A verification link has been sent to:</p>
        <p className="font-bold mt-2">{state?.email}</p>
        <p className="text-sm mt-2">Open your inbox and click the link.</p>
      </div>
    </div>
  );
}
