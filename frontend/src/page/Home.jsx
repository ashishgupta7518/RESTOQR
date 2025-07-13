import Footer from "../components/Footer";
import Pricing from "../components/Pricing";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import HomeDash from "../components/HomeDash";

const RestaurantQRUI = () => {
  return (
    <div className="font-sans text-gray-800">

      <Navbar />
      <Hero />

      {/* How It Works */}
      <section className="py-20 px-4 text-center">
        <h2 className="text-3xl font-bold mb-4">How It Works</h2>
        <p className="text-lg mb-12 max-w-2xl mx-auto">
          Our platform makes it easy for restaurants to create digital menus and for customers to access them instantly.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {["Register", "Add Menu Items", "Generate QR Code"].map((title, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow">
              <h3 className="text-xl font-semibold mb-2">{title}</h3>
              <p>
                {title === "Register" && "Create an account for your restaurant and access your dashboard to manage your menu."}
                {title === "Add Menu Items" && "Enter your menu items with descriptions, prices, and optional images for a complete menu."}
                {title === "Generate QR Code" && "Create a unique QR code for your restaurant that customers can scan to view your menu."}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Dashboard Preview */}
      <HomeDash/>
      <Pricing />
      <Footer />
    </div>
  );
};

export default RestaurantQRUI;
