import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Signup() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignup = (e) => {

    e.preventDefault();

    // GET EXISTING USERS
    const users =
      JSON.parse(localStorage.getItem("users")) || [];

    // CHECK EXISTING EMAIL
    const existingUser = users.find(
      (user) => user.email === formData.email
    );

    if (existingUser) {

      alert("User already exists");

      return;
    }

    // SAVE USER
    users.push(formData);

    localStorage.setItem(
      "users",
      JSON.stringify(users)
    );

    // AUTO LOGIN AFTER SIGNUP
    localStorage.setItem(
      "loggedInUser",
      JSON.stringify(formData)
    );

    // REDIRECT TO HOME
    navigate("/home");
  };

  return (

    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">

      <div className="bg-white p-10 rounded-2xl shadow-lg w-full max-w-md">

        <h1 className="text-5xl font-bold text-center text-blue-700">
          Create Account
        </h1>

        <p className="text-gray-500 text-center mt-3">
          Join CrowdFund today.
        </p>

        <form
          onSubmit={handleSignup}
          className="mt-10"
        >

          <div>

            <label className="block text-gray-700 mb-2">
              Full Name
            </label>

            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
              value={formData.name}
              onChange={handleChange}
              required
            />

          </div>

          <div className="mt-6">

            <label className="block text-gray-700 mb-2">
              Email
            </label>

            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
              value={formData.email}
              onChange={handleChange}
              required
            />

          </div>

          <div className="mt-6">

            <label className="block text-gray-700 mb-2">
              Password
            </label>

            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
              value={formData.password}
              onChange={handleChange}
              required
            />

          </div>

          <button
            type="submit"
            className="w-full mt-8 bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition"
          >
            Sign Up
          </button>

        </form>

        <p className="text-center text-gray-500 mt-6">

          Already have an account?

          <Link
            to="/login"
            className="text-blue-600 font-semibold ml-2"
          >
            Login
          </Link>

        </p>

      </div>

    </div>
  );
}

export default Signup;
