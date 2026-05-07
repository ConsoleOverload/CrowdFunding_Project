import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Link, useNavigate } from "react-router-dom";

function Home() {

  const navigate = useNavigate();

  // HANDLE START FUNDRAISER
  const handleStartFundraiser = () => {

    const loggedInUser =
      JSON.parse(localStorage.getItem("loggedInUser"));

    // IF NOT LOGGED IN
    if (!loggedInUser) {

      localStorage.setItem(
        "redirectAfterLogin",
        "/create"
      );

      navigate("/login");

    } else {

      // USER ALREADY LOGGED IN
      navigate("/create");
    }
  };

  return (

    <div className="min-h-screen bg-gray-100">

      <Navbar />

      {/* HERO SECTION */}

      <section className="bg-gradient-to-bg from-blue-100 to-blue-50 py-32 px-8">

        <div className="max-w-6xl mx-auto text-center">

          <h1 className="text-6xl font-extrabold leading-tight text-blue-700 drop-shadow-md">

            Empower Dreams <br />

            Through Crowdfunding

          </h1>

          <p className="mt-8 text-xl text-black-600 max-w-3xl mx-auto leading-relaxed">

            Start fundraising for meaningful causes or support campaigns
            that inspire change and help people in need.

          </p>

          <div className="mt-12 flex flex-col sm:flex-row gap-6 justify-center">

            {/* START FUNDRAISER */}

            <button
              onClick={handleStartFundraiser}
              className="bg-blue-600 text-white px-10 py-4 rounded-xl shadow-lg hover:bg-blue-700 transition duration-300 font-semibold text-lg"
            >
              Start Fundraiser
            </button>

            {/* EXPLORE CAMPAIGNS */}

            <Link
              to="/campaigns"
              className="bg-blue-600 text-white px-10 py-4 rounded-xl shadow-lg hover:bg-blue-700 transition duration-300 font-semibold text-lg"
            >
              Explore Campaigns
            </Link>

          </div>

        </div>

      </section>

      {/* ABOUT SECTION */}

      <section className="py-24 px-8 bg-white">

        <div className="max-w-6xl mx-auto text-center">

          <h2 className="text-5xl font-bold text-gray-800">

            Why Choose CrowdFund?

          </h2>

          <p className="mt-6 text-gray-600 text-lg max-w-3xl mx-auto leading-relaxed">

            CrowdFund helps people raise money for education, medical
            emergencies, startups, social causes, and community support.
            Anyone can create campaigns and receive support from donors
            around the world.

          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-16">

            <div className="bg-gray-100 p-10 rounded-2xl shadow-md hover:shadow-xl transition duration-300">

              <h3 className="text-2xl font-bold text-blue-600">
                Easy Fundraising
              </h3>

              <p className="text-gray-600 mt-4">
                Create campaigns easily with images and detailed
                descriptions.
              </p>

            </div>

            <div className="bg-gray-100 p-10 rounded-2xl shadow-md hover:shadow-xl transition duration-300">

              <h3 className="text-2xl font-bold text-blue-600">
                Trusted Donations
              </h3>

              <p className="text-gray-600 mt-4">
                Donors can securely support campaigns and track causes.
              </p>

            </div>

            <div className="bg-gray-100 p-10 rounded-2xl shadow-md hover:shadow-xl transition duration-300">

              <h3 className="text-2xl font-bold text-blue-600">
                Community Impact
              </h3>

              <p className="text-gray-600 mt-4">
                Help people in need and create positive social impact.
              </p>

            </div>

          </div>

        </div>

      </section>

      <Footer />

    </div>
  );
}

export default Home;
