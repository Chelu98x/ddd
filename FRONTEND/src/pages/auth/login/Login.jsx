import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../../../../global/STORE/authSlice";
import { STATUSES } from "../../../../global/mis/statuses";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const status = useSelector((state) => state.auth.status);
  const [form, setForm] = useState({ userEmail: "", userPassword: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.userEmail || !form.userPassword) {
      setError("Email and password are required.");
      return;
    }

    try {
      await dispatch(loginUser({
        userEmail: form.userEmail,
        userPassword: form.userPassword,
        email: form.userEmail,
        password: form.userPassword
      }));
      navigate("/");
    } catch (err) {
      setError(err?.response?.data?.message || "Login failed. Please try again.");
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-6 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-yellow-700">Welcome back</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">Login</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Email</label>
            <input
              type="email"
              name="userEmail"
              value={form.userEmail}
              onChange={handleChange}
              className="w-full rounded-md border border-slate-300 px-3 py-2.5 text-slate-900 outline-none focus:border-yellow-500"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Password</label>
            <input
              type="password"
              name="userPassword"
              value={form.userPassword}
              onChange={handleChange}
              className="w-full rounded-md border border-slate-300 px-3 py-2.5 text-slate-900 outline-none focus:border-yellow-500"
              placeholder="********"
            />
          </div>

          {error && <p className="text-sm font-medium text-rose-600">{error}</p>}

          <button
            type="submit"
            disabled={status === STATUSES.LOADING}
            className="w-full rounded-md bg-yellow-500 px-4 py-3 text-sm font-semibold text-yellow-950 transition hover:bg-yellow-400 disabled:opacity-60"
          >
            {status === STATUSES.LOADING ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-slate-600">
          Don’t have an account? <Link to="/register" className="font-semibold text-emerald-700">Sign up</Link>
        </p>
      </div>
    </main>
  );
}

export default Login;
