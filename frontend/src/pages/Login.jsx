import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {

    e.preventDefault();

    // GET USERS
    const users =
      JSON.parse(localStorage.getItem("users")) || [];

    // FIND MATCHING USER
    const matchedUser = users.find(
      (user) =>
        user.email === email &&
        user.password === password
    );

    if (!matchedUser) {

      alert("Invalid Email or Password");

      return;
    }

    // SAVE LOGGED IN USER
    localStorage.setItem(
      "loggedInUser",
      JSON.stringify(matchedUser)
    );

    // CHECK REDIRECT
    const redirectPath =
      localStorage.getItem("redirectAfterLogin");

    if (redirectPath) {

      localStorage.removeItem("redirectAfterLogin");

      navigate(redirectPath);

    } else {

      navigate("/home");
    }
  };

  return (

    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">

      <div className="bg-white p-10 rounded-2xl shadow-lg w-full max-w-md">

        <h1 className="text-5xl font-bold text-center text-blue-700">
          Welcome Back
        </h1>

        <p className="text-gray-500 text-center mt-3">
          Login to continue supporting causes.
        </p>

        <form
          onSubmit={handleLogin}
          className="mt-10"
        >

          <div>

            <label className="block text-gray-700 mb-2">
              Email
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              required
            />

          </div>

          <div className="mt-6">

            <label className="block text-gray-700 mb-2">
              Password
            </label>

            <input
              type="password"
              placeholder="Enter your password"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              required
            />

          </div>

          <button
            type="submit"
            className="w-full mt-8 bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition"
          >
            Login
          </button>

        </form>

        <p className="text-center text-gray-500 mt-6">

          Don’t have an account?

          <Link
            to="/signup"
            className="text-blue-600 font-semibold ml-2"
          >
            Sign Up
          </Link>

        </p>

      </div>

    </div>
  );
}

export default Login;
