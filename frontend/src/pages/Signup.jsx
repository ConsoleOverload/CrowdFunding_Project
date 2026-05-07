import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

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

  const handleSubmit = (e) => {
    e.preventDefault();

    const newUser = {
      ...formData,
      role: "user",
    };

    // Save user
    localStorage.setItem(
      "currentUser",
      JSON.stringify(newUser)
    );

    // Save registered user
    localStorage.setItem(
      "registeredUser",
      JSON.stringify(newUser)
    );

    alert("Signup Successful!");

    navigate("/home");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md">

        <h1 className="text-5xl font-bold text-center text-gray-800">
          Create Account
        </h1>

        <p className="text-center text-gray-500 mt-4">
          Join and start supporting causes.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-10 space-y-5"
        >

          <div>
            <label className="block mb-2">
              Name
            </label>

            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border border-gray-300 px-4 py-3 rounded-xl outline-none"
              required
            />
          </div>

          <div>
            <label className="block mb-2">
              Email
            </label>

            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-300 px-4 py-3 rounded-xl outline-none"
              required
            />
          </div>

          <div>
            <label className="block mb-2">
              Password
            </label>

            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border border-gray-300 px-4 py-3 rounded-xl outline-none"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl text-lg"
          >
            Sign Up
          </button>

        </form>

        <p className="text-center mt-6 text-gray-600">
          Already have an account?{" "}

          <Link
            to="/"
            className="text-blue-600 font-semibold"
          >
            Login
          </Link>

        </p>

      </div>

    </div>
  );
}

export default Signup;
