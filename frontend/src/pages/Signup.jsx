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
  signupUser
} from "../api/authApi";

function Signup() {

  const navigate = useNavigate();

  const [loading, setLoading] =
    useState(false);

  const [formData, setFormData] =
    useState({
      name: "",
      email: "",
      password: "",
      role: "USER",
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

      await signupUser(formData);

      toast.success(
        "Account created successfully"
      );

      navigate("/login");

    } catch (err) {

      toast.error(
        err.response?.data?.message ||
        "Signup failed"
      );

    } finally {

      setLoading(false);

    }
  };

  return (

    <>
      <Navbar />

      <main className="min-h-[calc(100vh-64px)] flex items-center">

        <div className="page-container w-full">

          <div className="max-w-md">

            <div className="mb-10">

              <h1 className="text-4xl font-semibold">

                Create account

              </h1>

              <p className="mt-3">

                Start fundraising or support meaningful causes.

              </p>

            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-6"
            >

              <Input
                label="Full Name"
                type="text"
                name="name"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleChange}
                required
              />

              <Input
                label="Email"
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
                placeholder="Create password"
                value={formData.password}
                onChange={handleChange}
                required
              />

              <Button
                className="w-full"
                disabled={loading}
              >
                {
                  loading
                  ? "Creating account..."
                  : "Sign Up"
                }
              </Button>

            </form>

            <p className="mt-8 text-sm text-text-muted">

              Already have an account?

              <Link
                to="/login"
                className="ml-2 text-primary hover:underline"
              >
                Login
              </Link>

            </p>

          </div>

        </div>

      </main>
    </>
  );
}

export default Signup;