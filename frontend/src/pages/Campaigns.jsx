import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CampaignCard from "../components/CampaignCard";
import campaigns from "../data/campaigns";

function Campaigns() {
return ( <div className="min-h-screen bg-gray-100">

  <Navbar />

  <section className="px-8 py-16">

    <h1 className="text-5xl font-bold text-center text-gray-800">
      Explore Campaigns
    </h1>

    <p className="text-center text-gray-600 mt-4">
      Support causes that matter.
    </p>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-14">

      {campaigns.map((campaign) => (
        <CampaignCard
          key={campaign.id}
          campaign={campaign}
        />
      ))}

    </div>

  </section>

  <Footer />

</div>


);
}

export default Campaigns;
