import {
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import toast
from "react-hot-toast";

import Navbar
from "../components/Navbar";

import Footer
from "../components/Footer";

import Input
from "../components/Input";

import Button
from "../components/Button";

import {
  createCampaign,
} from "../api/campaignApi";

function CreateCampaign() {

  const navigate = useNavigate();

  const [loading, setLoading] =
    useState(false);

  const [formData, setFormData] =
    useState({

      title: "",

      description: "",

      category: "",

      goalAmount: "",

      deadline: "",

      location: "",

      coverImage: null,

      gallery: [],
    });

  // HANDLE INPUT CHANGES

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });
  };

  // HANDLE IMAGE UPLOADS

  const handleImageChange = (e) => {

    const files =
      Array.from(e.target.files);

    setFormData({
      ...formData,

      coverImage:
        files[0],

      gallery:
        files,
    });
  };

  // SUBMIT FORM

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      setLoading(true);

      const campaignData =
        new FormData();

      campaignData.append(
        "title",
        formData.title
      );

      campaignData.append(
        "description",
        formData.description
      );

      campaignData.append(
        "category",
        formData.category
      );

      campaignData.append(
        "goalAmount",
        formData.goalAmount
      );

      campaignData.append(
        "deadline",
        formData.deadline
      );

      campaignData.append(
        "location",
        formData.location
      );

      // COVER IMAGE

      campaignData.append(
        "coverImage",
        formData.coverImage
      );

      // GALLERY IMAGES

      formData.gallery.forEach(
        (image) => {

          campaignData.append(
            "gallery",
            image
          );
        }
      );

      await createCampaign(
        campaignData
      );

      toast.success(
        "Campaign created successfully"
      );

      navigate("/campaigns");

    } catch (err) {

      console.log(err);

      toast.error(
        err.response?.data?.message ||
        "Failed to create campaign"
      );

    } finally {

      setLoading(false);

    }
  };

  return (

    <div className="min-h-screen bg-bg">

      <Navbar />

      <main className="section-container">

        <div className="page-container flex justify-center">

          <div className="w-full max-w-3xl">

            {/* HEADER */}

            <div className="section-heading">

              <div className="badge">

                Create Campaign

              </div>

              <h1 className="section-title mt-6">

                Start a fundraiser

              </h1>

              <p className="section-subtitle">

                Share your story, upload campaign visuals,
                and connect with supporters who care.

              </p>

            </div>

            {/* FORM */}

            <form
              onSubmit={handleSubmit}
              className="card mt-12 space-y-8 p-8 md:p-10"
            >

              {/* TITLE */}

              <Input
                label="Campaign Title"
                type="text"
                name="title"
                placeholder="Enter campaign title"
                value={formData.title}
                onChange={handleChange}
                required
              />

              {/* DESCRIPTION */}

              <div>

                <label className="label">

                  Description

                </label>

                <textarea
                  name="description"
                  rows="6"
                  placeholder="Tell people your story..."
                  value={formData.description}
                  onChange={handleChange}
                  className="input resize-none"
                  required
                />

              </div>

              {/* CATEGORY */}

              <Input
                label="Category"
                type="text"
                name="category"
                placeholder="Medical, Education, Community..."
                value={formData.category}
                onChange={handleChange}
                required
              />

              {/* GOAL */}

              <Input
                label="Funding Goal"
                type="number"
                name="goalAmount"
                placeholder="Enter amount"
                value={formData.goalAmount}
                onChange={handleChange}
                required
              />

              {/* DEADLINE */}

              <Input
                label="Campaign Deadline"
                type="date"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
              />

              {/* LOCATION */}

              <Input
                label="Location"
                type="text"
                name="location"
                placeholder="Enter campaign location"
                value={formData.location}
                onChange={handleChange}
              />

              {/* IMAGE UPLOAD */}

              <div>

                <label className="label">

                  Campaign Images

                </label>

                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="input cursor-pointer"
                  required
                />

                {/* PREVIEW */}

                {formData.gallery.length > 0 && (

                  <div className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-3">

                    {formData.gallery.map(
                      (image, index) => (

                        <img
                          key={index}
                          src={URL.createObjectURL(image)}
                          alt="Preview"
                          className="h-32 w-full rounded-2xl object-cover"
                        />

                      )
                    )}

                  </div>

                )}

              </div>

              {/* SUBMIT */}

              <Button
                className="w-full justify-center"
                disabled={loading}
              >

                {
                  loading
                    ? "Creating campaign..."
                    : "Create Campaign"
                }

              </Button>

            </form>

          </div>

        </div>

      </main>

      <Footer />

    </div>
  );
}

export default CreateCampaign;