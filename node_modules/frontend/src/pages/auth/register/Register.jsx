import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../../../../global/STORE/authSlice";
import { STATUSES } from "../../../../global/mis/statuses";

function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const status = useSelector((state) => state.auth.status);
  const [form, setForm] = useState({
    userName: "",
    userEmail: "",
    userPhoneNumber: "",
    userPassword: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.userName || !form.userEmail || !form.userPhoneNumber || !form.userPassword) {
      setError("All fields are required.");
      return;
    }

    try {
      await dispatch(
        registerUser({
          userName: form.userName,
          userEmail: form.userEmail,
          userPhoneNumber: form.userPhoneNumber,
          userPassword: form.userPassword,
          name: form.userName,
          email: form.userEmail,
          phoneNumber: form.userPhoneNumber,
          password: form.userPassword,
        })
      );
      navigate("/login");
    } catch (err) {
      setError(err?.response?.data?.message || "Registration failed. Please try again.");
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-6 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">Create account</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">Sign up</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Full name</label>
            <input
              type="text"
              name="userName"
              value={form.userName}
              onChange={handleChange}
              className="w-full rounded-md border border-slate-300 px-3 py-2.5 text-slate-900 outline-none focus:border-emerald-500"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Email</label>
            <input
              type="email"
              name="userEmail"
              value={form.userEmail}
              onChange={handleChange}
              className="w-full rounded-md border border-slate-300 px-3 py-2.5 text-slate-900 outline-none focus:border-emerald-500"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Phone number</label>
            <input
              type="tel"
              name="userPhoneNumber"
              value={form.userPhoneNumber}
              onChange={handleChange}
              className="w-full rounded-md border border-slate-300 px-3 py-2.5 text-slate-900 outline-none focus:border-emerald-500"
              placeholder="98xxxxxxxx"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Password</label>
            <input
              type="password"
              name="userPassword"
              value={form.userPassword}
              onChange={handleChange}
              className="w-full rounded-md border border-slate-300 px-3 py-2.5 text-slate-900 outline-none focus:border-emerald-500"
              placeholder="********"
            />
          </div>

          {error && <p className="text-sm font-medium text-rose-600">{error}</p>}

          <button
            type="submit"
            disabled={status === STATUSES.LOADING}
            className="w-full rounded-md bg-emerald-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:opacity-60"
          >
            {status === STATUSES.LOADING ? "Creating account..." : "Sign up"}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-slate-600">
          Already have an account? <Link to="/login" className="font-semibold text-yellow-700">Login</Link>
        </p>
      </div>
    </main>
  );
}

export default Register;
