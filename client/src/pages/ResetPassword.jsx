import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { API_BASE } from "../utils/apiBase";

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      toast.error("Reset token missing in URL");
      return;
    }

    if (password !== confirm) {
      toast.error("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {
      setSubmitting(true);

      const res = await axios.put(
        `${API_BASE}/api/users/reset-password/${token}`,
        { password }
      );

      const msg = res?.data?.message || "Password reset successful. Please login.";

      // ✅ Critical: clear old login state so your app doesn't act weird
      localStorage.removeItem("user");

      toast.success(msg);

      // ✅ Stronger redirect (prevents back-button weirdness)
      navigate("/login", { replace: true });
    } catch (err) {
      console.log("[RESET PASSWORD ERROR]", err);

      const apiMsg = err?.response?.data?.message;
      toast.error(apiMsg || "Reset failed. Token invalid/expired or server error.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh]">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Reset Password</h1>

        <form onSubmit={onSubmit} className="space-y-4">
          <input
            type="password"
            className="w-full border rounded px-3 py-2"
            placeholder="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={submitting}
          />
          <input
            type="password"
            className="w-full border rounded px-3 py-2"
            placeholder="Confirm new password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
            disabled={submitting}
          />

          <button
            type="submit"
            disabled={submitting}
            className={`w-full text-white font-bold py-2 rounded ${
              submitting ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {submitting ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
