import { useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { getFavorites } from "../features/favorites/favoriteSlice";
import PropertyItem from "../components/properties/PropertyItem";
import { FaSearch, FaFilter, FaTimes, FaSortAmountDownAlt } from "react-icons/fa";
import axios from "axios";
import { API_BASE } from "../utils/apiBase";

const LAND_CATEGORIES = ["Residential Plot", "Commercial Plot", "Agricultural Land", "Industrial Land"];

const SkeletonCard = () => (
  <div className="card p-4 animate-pulse">
    <div className="h-40 rounded-xl bg-slate-100" />
    <div className="mt-4 h-4 w-2/3 rounded bg-slate-100" />
    <div className="mt-2 h-4 w-1/2 rounded bg-slate-100" />
    <div className="mt-4 h-9 w-full rounded-xl bg-slate-100" />
  </div>
);

function Properties() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [filters, setFilters] = useState({
    keyword: "",
    city: "",
    category: "All",
    maxPrice: "",
  });

  const [displayProperties, setDisplayProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sort, setSort] = useState("new");

  useEffect(() => {
    fetchFilteredProperties();

    if (user?.role === "buyer") {
      dispatch(getFavorites());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, user]);

  const queryStr = useMemo(() => {
    const qs = `${API_BASE}/api/properties?keyword=${encodeURIComponent(filters.keyword)}&city=${encodeURIComponent(
      filters.city
    )}&category=${encodeURIComponent(filters.category)}&maxPrice=${encodeURIComponent(filters.maxPrice)}`;
    return qs;
  }, [filters]);

  const fetchFilteredProperties = async () => {
    setLoading(true);
    try {
      const response = await axios.get(queryStr);
      const list = Array.isArray(response.data) ? response.data : [];
      setDisplayProperties(list);
    } catch (error) {
      console.error("Search Error:", error?.message || error);
      setDisplayProperties([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchFilteredProperties();
  };

  const onChange = (e) => {
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const clearFilters = () => {
    setFilters({ keyword: "", city: "", category: "All", maxPrice: "" });
    setSort("new");
    setTimeout(fetchFilteredProperties, 0);
  };

  const sortedProperties = useMemo(() => {
    const arr = [...displayProperties];
    if (sort === "price_asc") arr.sort((a, b) => (a?.price || 0) - (b?.price || 0));
    if (sort === "price_desc") arr.sort((a, b) => (b?.price || 0) - (a?.price || 0));
    return arr;
  }, [displayProperties, sort]);

  const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.04 } } };
  const item = { hidden: { y: 10, opacity: 0 }, show: { y: 0, opacity: 1, transition: { duration: 0.35 } } };

  return (
    <div className="bg-noise min-h-screen">
      <div className="container-shell py-10">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
                Available Land Listings
              </h1>
              <p className="mt-2 text-sm text-slate-600">
                Filter fast, shortlist smart. Results:{" "}
                <span className="font-bold text-slate-900">{sortedProperties.length}</span>
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="chip">
                <FaSortAmountDownAlt />
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="bg-transparent text-xs font-semibold outline-none"
                >
                  <option value="new">Sort: Default</option>
                  <option value="price_asc">Price: Low → High</option>
                  <option value="price_desc">Price: High → Low</option>
                </select>
              </div>

              <button onClick={clearFilters} className="btn-outline">
                <FaTimes className="mr-2" />
                Clear
              </button>
            </div>
          </div>
        </motion.div>

        {/* FILTERS */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-5 sm:p-6 shadow-soft mb-10"
        >
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
            <div className="md:col-span-4">
              <label className="label">Keyword</label>
              <div className="relative">
                <FaSearch className="absolute left-3 top-3.5 text-slate-400" />
                <input
                  type="text"
                  name="keyword"
                  value={filters.keyword}
                  onChange={onChange}
                  placeholder="Search land..."
                  className="input pl-10"
                />
              </div>
            </div>

            <div className="md:col-span-3">
              <label className="label">City</label>
              <input
                type="text"
                name="city"
                value={filters.city}
                onChange={onChange}
                placeholder="e.g. Dhaka"
                className="input"
              />
            </div>

            <div className="md:col-span-3">
              <label className="label">Land Type</label>
              <select name="category" value={filters.category} onChange={onChange} className="input">
                <option value="All">All Types</option>
                {LAND_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="label">Max Price</label>
              <input
                type="number"
                name="maxPrice"
                value={filters.maxPrice}
                onChange={onChange}
                placeholder="Any"
                className="input"
                min="0"
              />
            </div>

            <div className="md:col-span-12 flex flex-col sm:flex-row gap-3 mt-2">
              <button type="submit" className="btn-soft px-5 py-3">
                <FaFilter className="mr-2" />
                Search
              </button>

              <div className="text-xs text-slate-500 flex items-center">
                Tip: Keep filters minimal — keyword + city usually gets best results.
              </div>
            </div>
          </form>
        </motion.div>

        {/* RESULTS */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 9 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : sortedProperties.length > 0 ? (
          <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedProperties.map((property) => (
              <motion.div key={property._id} variants={item} whileHover={{ y: -4 }} transition={{ type: "spring", stiffness: 260, damping: 18 }}>
                <PropertyItem property={property} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="card p-10 text-center border-dashed"
            >
              <h3 className="text-lg font-bold text-slate-800">No listings found.</h3>
              <p className="mt-2 text-sm text-slate-600">Try removing filters or searching a different city.</p>
              <button onClick={clearFilters} className="btn-outline mt-5">
                Reset filters
              </button>
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}

export default Properties;
