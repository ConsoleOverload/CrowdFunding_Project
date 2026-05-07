import Navbar from "../components/Navbar";

function Login() {
return ( <div className="min-h-screen bg-gray-100">

  <Navbar />

  <div className="flex items-center justify-center py-20 px-4">

    <div className="bg-white shadow-xl rounded-2xl p-10 w-full max-w-md">

      <h1 className="text-4xl font-bold text-center text-gray-800">
        Welcome Back
      </h1>

      <p className="text-center text-gray-500 mt-3">
        Login to continue supporting causes.
      </p>

      <form className="mt-8 space-y-5">

        <div>
          <label className="block mb-2 text-gray-700">
            Email
          </label>

          <input
            type="email"
            placeholder="Enter your email"
            className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block mb-2 text-gray-700">
            Password
          </label>

          <input
            type="password"
            placeholder="Enter your password"
            className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl text-lg transition"
        >
          Login
        </button>

      </form>

    </div>

  </div>

</div>

);
}

export default Login;
