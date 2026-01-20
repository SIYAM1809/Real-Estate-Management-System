import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { API_BASE } from "../utils/apiBase";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isSending, setIsSending] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();

    if (isSending) return; // hard lock
    setIsSending(true);

    const toastId = toast.loading("Sending reset link...");

    try {
      const res = await axios.post(`${API_BASE}/api/users/forgot-password`, { email });
      toast.update(toastId, {
        render: res.data?.message || "If the email exists, a reset link has been sent.",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
      setEmail("");
    } catch (err) {
      toast.update(toastId, {
        render: err.response?.data?.message || "Server error while sending reset link.",
        type: "error",
        isLoading: false,
        autoClose: 4000,
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh]">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Forgot Password</h1>
        <p className="text-gray-600 mb-6">Enter your email to get a reset link.</p>

        <form onSubmit={onSubmit} className="space-y-4">
          <input
            type="email"
            className="w-full border rounded px-3 py-2"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isSending}
          />

          <button
            type="submit"
            disabled={isSending}
            className={`w-full text-white font-bold py-2 rounded transition
              ${isSending ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
          >
            {isSending ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;
