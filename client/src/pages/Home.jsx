import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaArrowRight, FaShieldAlt, FaRegClock, FaMapMarkedAlt, FaCheck, FaStar, FaHome, FaCity, FaWarehouse, FaTree } from "react-icons/fa";
import PropertyItem from "../components/properties/PropertyItem";
import heroImage from "../assets/hero_modern_home.png";
import luxuryVilla from "../assets/luxury_villa.png";
import modernApartment from "../assets/modern_apartment.png";
import cozyCottage from "../assets/cozy_cottage.png";

function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    },
  };

  const mockProperties = [
    {
      _id: "1",
      title: "Luxury Villa in Beverly Hills",
      location: { city: "Beverly Hills" },
      price: 4500000,
      category: "Villa",
      images: [luxuryVilla]
    },
    {
      _id: "2",
      title: "Modern Apartment in Downtown",
      location: { city: "New York" },
      price: 1200000,
      category: "Apartment",
      images: [modernApartment]
    },
    {
      _id: "3",
      title: "Cozy Cottage by the Lake",
      location: { city: "Lake Tahoe" },
      price: 850000,
      category: "House",
      images: [cozyCottage]
    }
  ];

  return (
    <div className="overflow-hidden">
      {/* HERO SECTION */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary-400/20 blur-[100px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] rounded-full bg-emerald-400/20 blur-[100px]" />
        </div>

        <div className="container-shell">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid lg:grid-cols-2 gap-12 items-center"
          >
            {/* Left Content */}
            <div className="space-y-8">
              <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 shadow-sm text-xs font-semibold text-slate-600">
                <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                #1 Real Estate Platform
              </motion.div>

              <motion.h1 variants={itemVariants} className="text-5xl lg:text-7xl font-bold tracking-tight text-slate-900 leading-tight">
                Find your <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-emerald-500">
                  dream home
                </span>
                <br /> today.
              </motion.h1>

              <motion.p variants={itemVariants} className="text-lg text-slate-600 max-w-xl leading-relaxed">
                Connect with thousands of verified listings, trusted sellers, and a seamless buying experience. The map-first real estate platform you've been waiting for.
              </motion.p>

              <motion.div variants={itemVariants} className="flex flex-wrap gap-4">
                <Link to="/properties" className="btn-primary px-8 py-4 text-base shadow-xl shadow-primary-500/20">
                  Browse Properties <FaArrowRight className="ml-2" />
                </Link>
                <Link to="/register" className="btn-secondary px-8 py-4 text-base">
                  List Your Property
                </Link>
              </motion.div>

              <motion.div variants={itemVariants} className="pt-8 flex items-center gap-8 text-slate-500">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-3">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="h-10 w-10 rounded-full border-2 border-white bg-slate-200" />
                    ))}
                  </div>
                  <div className="text-sm font-semibold">
                    <span className="text-slate-900">10k+</span> Happy Users
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                    <FaStar />
                  </div>
                  <div className="text-sm font-semibold">
                    <span className="text-slate-900">4.9/5</span> Rating
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right Image/Graphic */}
            <motion.div variants={itemVariants} className="relative hidden lg:block">
              <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl shadow-slate-200 border-4 border-white transform rotate-2 hover:rotate-0 transition-transform duration-500">
                <img
                  src={heroImage}
                  alt="Modern Home"
                  className="w-full h-auto object-cover"
                />

                {/* Floating Card */}
                <div className="absolute bottom-8 left-8 bg-white/90 backdrop-blur-md p-4 rounded-xl shadow-lg max-w-xs transition-transform hover:scale-105">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600 text-xl font-bold">
                      RP
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">Recent Property</div>
                      <div className="text-xs text-slate-500">Beverly Hills, CA</div>
                      <div className="text-sm font-bold text-primary-600 mt-1">$4,500,000</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute top-10 right-10 -z-10 h-full w-full border-2 border-slate-200 rounded-3xl translate-x-4 translate-y-4" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CATEGORY BROWSE SECTION */}
      <section className="py-16 bg-slate-50">
        <div className="container-shell">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900">Browse by Category</h2>
            <p className="mt-2 text-slate-600">Find the perfect property type for your lifestyle.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: "House", icon: <FaHome />, count: "120+ Listings" },
              { name: "Apartment", icon: <FaCity />, count: "85+ Listings" },
              { name: "Commercial", icon: <FaWarehouse />, count: "40+ Listings" },
              { name: "Land", icon: <FaTree />, count: "30+ Listings" }
            ].map((cat) => (
              <Link
                to={`/properties?category=${cat.name}`}
                key={cat.name}
                className="group bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md hover:border-primary-200 transition-all text-center"
              >
                <div className="h-16 w-16 mx-auto rounded-full bg-primary-50 text-primary-600 flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform">
                  {cat.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-900">{cat.name}</h3>
                <p className="text-sm text-slate-500 mt-1">{cat.count}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES GRID */}
      <section className="py-20 bg-white">
        <div className="container-shell">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-slate-900">Why Choose SyntaxEstate?</h2>
            <p className="mt-4 text-slate-600">We provide a premium experience for both buyers and sellers, ensuring safety, speed, and reliability.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <FaShieldAlt className="text-2xl text-blue-600" />,
                title: "Secure & Verified",
                desc: "Every listing is manually verified by our admins to ensure authenticity and prevent fraud."
              },
              {
                icon: <FaMapMarkedAlt className="text-2xl text-emerald-600" />,
                title: "Map-Based Search",
                desc: "Visualize properties with our interactive map to find the perfect location for your needs."
              },
              {
                icon: <FaRegClock className="text-2xl text-purple-600" />,
                title: "Instant Notifications",
                desc: "Get real-time email alerts when a property matching your criteria gets listed."
              }
            ].map((feature, idx) => (
              <div key={idx} className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-lg transition-shadow duration-300">
                <div className="h-14 w-14 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PROPERTIES */}
      <section className="py-20 bg-slate-50 relative overflow-hidden">
        <div className="container-shell">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold text-slate-900">Featured Listings</h2>
              <p className="mt-2 text-slate-600">Explore our most exclusive properties selected for you.</p>
            </div>
            <Link to="/properties" className="hidden md:flex items-center gap-2 text-primary-600 font-semibold hover:gap-3 transition-all">
              View All <FaArrowRight />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mockProperties.map(property => (
              <PropertyItem key={property._id} property={property} />
            ))}
          </div>

          <div className="mt-12 text-center md:hidden">
            <Link to="/properties" className="btn-outline w-full justify-center">
              View All Properties
            </Link>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-24">
        <div className="container-shell">
          <div className="relative rounded-3xl bg-slate-900 overflow-hidden px-8 py-16 md:px-16 text-center lg:text-left flex flex-col lg:flex-row items-center justify-between gap-12">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-20">
              <svg className="h-full w-full" width="100%" height="100%" viewBox="0 0 800 800">
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>
            </div>

            <div className="relative z-10 max-w-xl">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to find your dream home?</h2>
              <p className="text-slate-400 text-lg">Join thousands of satisfied users who have found their perfect property through SyntaxEstate. Start your journey today.</p>
            </div>

            <div className="relative z-10 flex flex-col sm:flex-row gap-4">
              <Link to="/register" className="btn bg-white text-slate-900 hover:bg-slate-100 border-none px-8 py-4 text-base">
                Get Started Now
              </Link>
              <Link to="/properties" className="btn border border-slate-700 text-white hover:bg-slate-800 px-8 py-4 text-base">
                Browse Listings
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
