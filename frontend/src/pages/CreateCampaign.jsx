import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function CreateCampaign() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    goal: "",
    image: null,
  });

  // Handle text inputs
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle image upload
  const handleImageChange = (e) => {

    const file = e.target.files[0];

    const reader = new FileReader();

    reader.onloadend = () => {

      setFormData({
        ...formData,
        image: reader.result,
      });

    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  // Submit form
  const handleSubmit = (e) => {
    e.preventDefault();

    const currentUser = JSON.parse(
      localStorage.getItem("currentUser")
    );

    const newCampaign = {
      id: Date.now(),
      title: formData.title,
      description: formData.description,
      goal: formData.goal,
      image: formData.image,
      creator: currentUser?.name,
    };

    const existingCampaigns =
      JSON.parse(localStorage.getItem("campaigns")) || [];

    existingCampaigns.push(newCampaign);

    localStorage.setItem(
      "campaigns",
      JSON.stringify(existingCampaigns)
    );

    alert("Campaign Created Successfully!");

    navigate("/campaigns");
  };

  return (
    <div className="min-h-screen bg-gray-100">

      <Navbar />

      <div className="max-w-3xl mx-auto py-16 px-6">

        <div className="bg-white shadow-xl rounded-2xl p-10">

          <h1 className="text-4xl font-bold text-gray-800">
            Start a Fundraiser
          </h1>

          <p className="text-gray-500 mt-3">
            Create a campaign and raise support for your cause.
          </p>

          <form
            onSubmit={handleSubmit}
            className="mt-10 space-y-6"
          >

            {/* Campaign Title */}
            <div>

              <label className="block mb-2 text-gray-700">
                Campaign Title
              </label>

              <input
                type="text"
                name="title"
                placeholder="Enter campaign title"
                value={formData.title}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none"
                required
              />

            </div>

            {/* Description */}
            <div>

              <label className="block mb-2 text-gray-700">
                Description
              </label>

              <textarea
                rows="5"
                name="description"
                placeholder="Describe your campaign"
                value={formData.description}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none"
                required
              ></textarea>

            </div>

            {/* Goal Amount */}
            <div>

              <label className="block mb-2 text-gray-700">
                Goal Amount
              </label>

              <input
                type="number"
                name="goal"
                placeholder="Enter target amount"
                value={formData.goal}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none"
                required
              />

            </div>

            {/* Upload Image */}
            <div>

              <label className="block mb-2 text-gray-700">
                Upload Campaign Image
              </label>

              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full border border-gray-300 rounded-xl px-4 py-3"
                required
              />

            </div>

            {/* Image Preview */}
            {formData.image && (

              <div>

                <p className="mb-2 text-gray-700">
                  Image Preview
                </p>

                <img
                  src={formData.image}
                  alt="preview"
                  className="w-full h-64 object-cover rounded-xl"
                />

              </div>

            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl text-lg"
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
