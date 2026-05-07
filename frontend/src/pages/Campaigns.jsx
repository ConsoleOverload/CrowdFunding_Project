import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Campaigns() {

  const campaigns =
    JSON.parse(localStorage.getItem("campaigns")) || [];

  return (
    <div className="min-h-screen bg-gray-100">

      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-16">

        <h1 className="text-5xl font-bold text-center text-gray-800">
          Explore Campaigns
        </h1>

        <p className="text-center text-gray-500 mt-4">
          Support causes that matter.
        </p>

        {campaigns.length > 0 ? (

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-14">

            {campaigns.map((campaign) => (

              <div
                key={campaign.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden"
              >

                {/* Image */}
                <img
                  src={campaign.image}
                  alt={campaign.title}
                  className="h-56 w-full object-cover"
                />

                {/* Content */}
                <div className="p-6">

                  <h2 className="text-2xl font-bold text-gray-800">
                    {campaign.title}
                  </h2>

                  <p className="text-gray-600 mt-3">
                    {campaign.description}
                  </p>

                  <p className="mt-4 text-blue-600 font-semibold">
                    Goal: ₹ {campaign.goal}
                  </p>

                  <p className="mt-2 text-sm text-gray-500">
                    Created by: {campaign.creator}
                  </p>

                  <button
                    className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl"
                  >
                    Donate Now
                  </button>

                </div>

              </div>

            ))}

          </div>

        ) : (

          <p className="text-center text-gray-500 mt-16 text-xl">
            No campaigns created yet.
          </p>

        )}

      </div>

      <Footer />

    </div>
  );
}

export default Campaigns;
