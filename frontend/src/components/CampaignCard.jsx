function CampaignCard({ campaign }) {

const percentage =
(campaign.raised / campaign.goal) * 100;

return (
<a
href={`/campaign/${campaign.id}`}
className="block bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-2xl transition duration-300"
>


  <img
    src={campaign.image}
    alt={campaign.title}
    className="h-56 w-full object-cover"
  />

  <div className="p-5">

    <h2 className="text-2xl font-semibold text-gray-800">
      {campaign.title}
    </h2>

    <p className="mt-3 text-gray-600">
      {campaign.description}
    </p>

    {/* Progress */}
    <div className="mt-5">

      <div className="w-full bg-gray-200 rounded-full h-3">

        <div
          className="bg-blue-600 h-3 rounded-full"
          style={{ width: `${percentage}%` }}
        ></div>

      </div>

      <div className="flex justify-between mt-2 text-sm text-gray-600">
        <span>Raised: ₹{campaign.raised}</span>
        <span>Goal: ₹{campaign.goal}</span>
      </div>

    </div>

    <button className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl transition">
      Donate Now
    </button>

  </div>

</a>


);
}

export default CampaignCard;
