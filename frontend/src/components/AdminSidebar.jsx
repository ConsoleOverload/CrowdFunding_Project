import { Link } from "react-router-dom";

function AdminSidebar() {

  return (

    <div className="w-64 min-h-screen bg-blue-700 text-white p-6">

      <h1 className="text-3xl font-bold mb-10">
        Admin Panel
      </h1>

      <div className="flex flex-col gap-5 text-lg">

        <Link
          to="/admin"
          className="hover:text-blue-200"
        >
          Dashboard
        </Link>

        <Link
          to="/admin/profile"
           className="hover:text-blue-200"
        >
          Admin Profile
        </Link>

      </div>

    </div>
  );
}

export default AdminSidebar;