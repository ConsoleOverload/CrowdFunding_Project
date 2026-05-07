import Navbar from "../components/Navbar";
import CampaignCard from "../components/CampaignCard";
import Footer from "../components/Footer";
import campaigns from "../data/campaigns";


function Home() {
return ( <div className="min-h-screen bg-gradient-to-bg from-blue-50 to-white">

  <Navbar />

  {/* Hero Section */}
  <section className="flex flex-col items-center justify-center text-center px-6 py-24">

    <h1 className="text-5xl md:text-6xl font-bold text-gray-800 leading-tight">
      Fund Dreams. <br />
      Change Lives.
    </h1>

    <p className="mt-6 text-lg text-gray-600 max-w-2xl">
      A trusted crowdfunding platform where people can
      support meaningful causes, education, startups,
      medical emergencies and more.
    </p>

    <div className="mt-8 flex gap-4">

      <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl text-lg transition">
        Start Fundraiser
      </button>

      <button className="border border-gray-400 hover:bg-gray-100 px-6 py-3 rounded-xl text-lg transition">
        Explore Campaigns
      </button>

    </div>

  </section>

  {/* Featured Campaigns */}
  <section className="px-8 py-20 bg-white">

    <h2 className="text-4xl font-bold text-center text-gray-800">
      Featured Campaigns
    </h2>

    <p className="text-center text-gray-600 mt-4">
      Discover fundraisers that are changing lives.
    </p>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-14">
{campaigns.map((campaign) => ( <CampaignCard
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

export default Home;
