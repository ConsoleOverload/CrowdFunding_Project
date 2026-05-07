import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function CreateCampaign() {
return ( <div className="min-h-screen bg-gray-100">

  <Navbar />

  <div className="max-w-3xl mx-auto py-16 px-6">

    <div className="bg-white shadow-xl rounded-2xl p-10">

      <h1 className="text-4xl font-bold text-gray-800">
        Start a Fundraiser
      </h1>

      <p className="text-gray-500 mt-3">
        Create a campaign and raise support for your cause.
      </p>

      <form className="mt-10 space-y-6">

        <div>
          <label className="block mb-2 text-gray-700">
            Campaign Title
          </label>

          <input
            type="text"
            placeholder="Enter campaign title"
            className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block mb-2 text-gray-700">
            Description
          </label>

          <textarea
            rows="5"
            placeholder="Describe your campaign"
            className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>

        <div>
          <label className="block mb-2 text-gray-700">
            Goal Amount
          </label>

          <input
            type="number"
            placeholder="Enter target amount"
            className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block mb-2 text-gray-700">
            Deadline
          </label>

          <input
            type="date"
            className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block mb-2 text-gray-700">
            Upload Image
          </label>

          <input
            type="file"
            className="w-full"
          />
        </div>

        <button
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl text-lg transition"
        >
          Create Campaign
        </button>

      </form>

    </div>

  </div>

  <Footer />

</div>

);
}

export default CreateCampaign;
