
import Navbar from "../components/Navbar";

import { useAuth }
from "../context/AuthContext";

function AdminProfile() {

  const { user } = useAuth();

  return (

    <div className="min-h-screen bg-gray-100">

      <Navbar />

      <div className="max-w-4xl mx-auto py-16 px-6">

        <div className="bg-white rounded-3xl shadow-lg p-10">

          {/* HEADER */}

          <div className="flex items-center gap-6 mb-10">

            <div className="w-24 h-24 rounded-full bg-blue-600 flex items-center justify-center text-white text-4xl font-bold">

              {
                user?.name
                  ?.charAt(0)
                  ?.toUpperCase()
              }

            </div>

            <div>

              <h1 className="text-4xl font-bold text-blue-700">

                Admin Profile

              </h1>

              <p className="text-gray-600 mt-2">

                Manage your admin account details

              </p>

            </div>

          </div>

          {/* PROFILE DETAILS */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

            {/* NAME */}

            <div className="bg-gray-50 rounded-2xl p-6">

              <h2 className="text-sm text-gray-500 font-medium">

                Full Name

              </h2>

              <p className="text-2xl font-semibold text-gray-800 mt-2">

                {user?.name || "Admin User"}

              </p>

            </div>

            {/* EMAIL */}

            <div className="bg-gray-50 rounded-2xl p-6">

              <h2 className="text-sm text-gray-500 font-medium">

                Email Address

              </h2>

              <p className="text-2xl font-semibold text-gray-800 mt-2">

                {user?.email || "admin@email.com"}

              </p>

            </div>

            {/* ROLE */}

            <div className="bg-gray-50 rounded-2xl p-6">

              <h2 className="text-sm text-gray-500 font-medium">

                Role

              </h2>

              <p className="text-2xl font-semibold text-blue-600 mt-2 capitalize">

                {user?.role || "admin"}

              </p>

            </div>

            {/* STATUS */}

            <div className="bg-gray-50 rounded-2xl p-6">

              <h2 className="text-sm text-gray-500 font-medium">

                Account Status

              </h2>

              <p className="text-2xl font-semibold text-green-600 mt-2">

                Active

              </p>

            </div>

          </div>

          {/* EXTRA SECTION */}

          <div className="mt-10 bg-blue-50 rounded-2xl p-8">

            <h2 className="text-2xl font-bold text-blue-700">

              Admin Responsibilities

            </h2>

            <ul className="mt-4 space-y-3 text-gray-700 text-lg">

              <li>
                • Approve fundraising campaigns
              </li>

              <li>
                • Reject spam or fake campaigns
              </li>

              <li>
                • Monitor donations and activity
              </li>

              <li>
                • Maintain platform trust and safety
              </li>

            </ul>

          </div>

        </div>

      </div>

    </div>
  );
}

export default AdminProfile;

