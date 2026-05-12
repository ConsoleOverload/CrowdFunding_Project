function AdminCampaignTable({
  campaigns,
  onApprove,
  onReject,
  onDelete,
}) {

  return (

    <div className="overflow-x-auto bg-white rounded-2xl shadow-md">

      <table className="w-full text-left border-collapse">

        <thead className="bg-blue-600 text-white">

          <tr>

            <th className="p-5">
              Title
            </th>

            <th className="p-5">
              Creator
            </th>

            <th className="p-5">
              Goal
            </th>

            <th className="p-5">
              Status
            </th>

            <th className="p-5">
              Actions
            </th>

          </tr>

        </thead>

        <tbody>

          {
            campaigns.map((campaign) => (

              <tr
                key={campaign._id}
                className="border-b hover:bg-gray-50"
              >

                <td className="p-5">

                  {campaign.title}

                </td>

                <td className="p-5">

                  {
                    campaign.creator?.name ||
                    "Unknown"
                  }

                </td>

                <td className="p-5">

                  ₹{campaign.goal}

                </td>

                <td className="p-5">

                  <span className="capitalize font-medium">

                    {campaign.status}

                  </span>

                </td>

                <td className="p-5">

                  <div className="flex gap-3 flex-wrap">

                    <button
                      onClick={() =>
                        onApprove(campaign._id)
                      }
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
                    >
                      Approve
                    </button>

                    <button
                      onClick={() =>
                        onReject(campaign._id)
                      }
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg"
                    >
                      Reject
                    </button>

                    <button
                      onClick={() =>
                        onDelete(campaign._id)
                      }
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
                    >
                      Delete
                    </button>

                  </div>

                </td>

              </tr>

            ))
          }

        </tbody>

      </table>

    </div>
  );
}

export default AdminCampaignTable;