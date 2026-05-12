import {
  useState
} from "react";

import {
  Link,
  useNavigate
} from "react-router-dom";

import toast
from "react-hot-toast";

import Navbar
from "../components/Navbar";

import Input
from "../components/Input";

import Button
from "../components/Button";

import {
  loginUser
} from "../api/authApi";

import {
  useAuth
} from "../context/AuthContext";

function Login() {

  const navigate = useNavigate();

  const {
    fetchUser,
  } = useAuth();

  const [loading, setLoading] =
    useState(false);

  const [formData, setFormData] =
    useState({
      email: "",
      password: "",
    });

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      setLoading(true);

      await loginUser(formData);

      await fetchUser();

      toast.success(
        "Login successful"
      );

      navigate("/campaigns");

    } catch (err) {

      toast.error(
        err.response?.data?.message ||
        "Login failed"
      );

    } finally {

      setLoading(false);

    }
  };
    return (

    <>
      <Navbar />

      <main className="min-h-[calc(100vh-64px)] bg-bg">

        <div className="page-container flex items-center justify-center py-20">

          <div className="w-full max-w-md">

            {/* CARD */}

            <div className="card p-8 md:p-10">

              {/* HEADER */}

              <div className="text-center">

                <div className="inline-flex items-center rounded-full bg-surface-2 px-4 py-1.5 text-sm text-text-muted">

                  Welcome Back

                </div>

                <h1 className="mt-6 text-4xl font-semibold tracking-tight">

                  Login to your account

                </h1>

                <p className="mt-4 text-base text-text-muted leading-relaxed">

                  Continue supporting meaningful causes and track your fundraising journey.

                </p>

              </div>

              {/* FORM */}

              <form
                onSubmit={handleSubmit}
                className="mt-10 space-y-6"
              >

                <Input
                  label="Email Address"
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />

                <Input
                  label="Password"
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />

                <Button
                  className="w-full justify-center"
                  disabled={loading}
                >
                  {
                    loading
                      ? "Signing in..."
                      : "Login"
                  }
                </Button>

              </form>

              {/* FOOTER */}

              <div className="mt-8 border-t border-border pt-6 text-center">

                <p className="text-sm text-text-muted">

                  Don’t have an account?

                  <Link
                    to="/signup"
                    className="ml-2 font-medium text-primary hover:underline"
                  >
                    Create account
                  </Link>

                </p>

              </div>

            </div>

          </div>

        </div>

      </main>
    </>
  );
}

export default Login;