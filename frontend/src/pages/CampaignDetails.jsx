import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function CampaignDetails() {
return ( <div className="min-h-screen bg-gray-100">


  <Navbar />

  <div className="max-w-6xl mx-auto px-6 py-16">

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

      <div>
        <img
          src="https://images.unsplash.com/photo-1521791136064-7986c2920216"
          alt="campaign"
          className="w-full  object-cover rounded-2xl shadow-lg"
        />
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-8">

        <h1 className="text-4xl font-bold text-gray-800">
          Help Build a School
        </h1>

        <p className="mt-6 text-gray-600 leading-relaxed">
          This campaign helps underprivileged children
          access better education and infrastructure.
        </p>

        <div className="mt-8">

          <div className="w-full bg-gray-200 rounded-full h-4">
            <div className="bg-blue-600 h-4 rounded-full w-1/2"></div>
          </div>

          <div className="flex justify-between mt-3 text-gray-700">
            <span>Raised: ₹25,000</span>
            <span>Goal: ₹50,000</span>
          </div>

        </div>

        <button className="mt-10 w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl text-xl transition">
          Donate Now
        </button>

      </div>

    </div>

  </div>

  <Footer />

</div>


);
}

export default CampaignDetails;
