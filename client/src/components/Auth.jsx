import { useState } from "react";
import { GraduationCap, BookOpen, ArrowRight } from "lucide-react";
import { login, register } from "../services/auth.service";
import "./Auth.css";

function Auth({ onAuthenticated }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      if (mode === "register") {
        await register(form);
        setMode("login");
        setForm({ ...form, password: "" });
        setSuccess("Account created successfully! Please log in.");
      } else {
        const result = await login({
          email: form.email,
          password: form.password,
        });
        onAuthenticated(result.user);
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setMode(mode === "login" ? "register" : "login");
    setError("");
    setSuccess("");
  };

  return (
    <div className="auth-page">
      <div className="auth-brand-panel">
        <div className="auth-brand">
          <div className="auth-brand-icon">
            <GraduationCap size={28} />
          </div>
          <span>Learn<span>Sphere</span></span>
        </div>

        <div className="auth-brand-content">
          <span className="auth-eyebrow">YOUR LEARNING JOURNEY STARTS HERE</span>
          <h1>Learn new skills. Build your future.</h1>
          <p>
            Discover courses, learn from experts, and track your progress
            with LearnSphere.
          </p>

          <div className="auth-feature">
            <BookOpen size={21} />
            <div>
              <strong>Learn at your own pace</strong>
              <span>Access your learning journey anytime.</span>
            </div>
          </div>

          <div className="auth-feature">
            <GraduationCap size={21} />
            <div>
              <strong>Grow your knowledge</strong>
              <span>Build skills that move your career forward.</span>
            </div>
          </div>
        </div>

        <span className="auth-copyright">
          © 2026 LearnSphere. Learn without limits.
        </span>
      </div>

      <div className="auth-form-panel">
        <div className="auth-form-container">
          <div className="auth-mobile-brand">
            <GraduationCap size={28} />
            <strong>LearnSphere</strong>
          </div>

          <span className="auth-eyebrow">
            {mode === "login" ? "WELCOME BACK" : "GET STARTED"}
          </span>

          <h2>
            {mode === "login" ? "Sign in to your account" : "Create your account"}
          </h2>

          <p className="auth-subtitle">
            {mode === "login"
              ? "Enter your details to continue learning."
              : "Join LearnSphere and start your learning journey."}
          </p>

          {error && <div className="auth-error">{error}</div>}
          {success && <div className="auth-success">{success}</div>}

          <form onSubmit={handleSubmit}>
            {mode === "register" && (
              <div className="auth-name-row">
                <div className="auth-field">
                  <label htmlFor="firstName">First name</label>
                  <input
                    id="firstName"
                    name="firstName"
                    value={form.firstName}
                    onChange={handleChange}
                    placeholder="First name"
                    required
                  />
                </div>

                <div className="auth-field">
                  <label htmlFor="lastName">Last name</label>
                  <input
                    id="lastName"
                    name="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                    placeholder="Last name"
                    required
                  />
                </div>
              </div>
            )}

            <div className="auth-field">
              <label htmlFor="email">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                autoComplete="email"
                required
              />
            </div>

            <div className="auth-field">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter your password"
                autoComplete={
                  mode === "login" ? "current-password" : "new-password"
                }
                minLength={8}
                required
              />
            </div>

            <button
              className="auth-submit"
              type="submit"
              disabled={loading}
            >
              {loading
                ? "Please wait..."
                : mode === "login"
                  ? "Sign in"
                  : "Create account"}
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>

          <div className="auth-switch">
            {mode === "login"
              ? "Don't have an account?"
              : "Already have an account?"}
            <button type="button" onClick={switchMode}>
              {mode === "login" ? "Create account" : "Sign in"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Auth;
