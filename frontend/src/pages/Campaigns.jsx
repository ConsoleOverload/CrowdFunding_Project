import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Campaigns() {

  // GET CAMPAIGNS
  const campaigns =
    JSON.parse(localStorage.getItem("campaigns")) || [];

  // HANDLE DONATION
  const handleDonate = (campaign) => {

    const options = {

      // RAZORPAY TEST KEY
      key: "rzp_test_SmQ1FHCAyXTtW4",

      amount: 500 * 100,

      currency: "INR",

      name: "CrowdFund",

      description: `Donation for ${campaign.title}`,

      image:
        "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",

      handler: function (response) {

        alert(
          "Payment Successful!\nPayment ID: " +
            response.razorpay_payment_id
        );
      },

      prefill: {

        name: "Donor",

        email: "donor@example.com",

        contact: "9999999999",
      },

      notes: {

        campaignTitle: campaign.title,
      },

      theme: {

        color: "#2563eb",
      },
    };

    const razorpay =
      new window.Razorpay(options);

    razorpay.open();
  };

  return (

    <div className="min-h-screen bg-gray-100">

      <Navbar />

      <section className="py-20 px-8">

        <div className="max-w-7xl mx-auto">

          <h1 className="text-5xl font-bold text-center text-gray-800">

            Explore Campaigns

          </h1>

          <p className="text-center text-gray-500 mt-4 text-lg">

            Support causes that matter.

          </p>

          {campaigns.length === 0 ? (

            <p className="text-center mt-16 text-gray-500 text-xl">

              No campaigns created yet.

            </p>

          ) : (

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mt-16">

              {campaigns.map((campaign, index) => (

                <div
                  key={index}
                  className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition duration-300"
                >

                  {/* IMAGE */}

                  <img
                    src={campaign.image}
                    alt={campaign.title}
                    className="w-full h-64 object-cover"
                  />

                  {/* CONTENT */}

                  <div className="p-6">

                    <h2 className="text-3xl font-bold text-gray-800">

                      {campaign.title}

                    </h2>

                    <p className="text-gray-600 mt-4">

                      {campaign.description}

                    </p>

                    <p className="mt-5 text-blue-600 font-bold text-xl">

                      Goal: ₹{campaign.goal}

                    </p>

                    <p className="mt-2 text-gray-500">

                      Created by: {campaign.creator}

                    </p>

                    {/* DONATE BUTTON */}

                    <button
                      onClick={() =>
                        handleDonate(campaign)
                      }
                      className="w-full mt-6 bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition"
                    >
                      Donate Now
                    </button>

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>

      </section>

      <Footer />

    </div>
  );
}

export default Campaigns;
