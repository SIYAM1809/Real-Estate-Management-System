import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaMapMarkerAlt, FaHeart, FaRegHeart, FaMoneyBillWave } from "react-icons/fa";
import { toggleFavorite } from "../../features/favorites/favoriteSlice";
import { toast } from "react-toastify";

function PropertyItem({ property }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { favorites = [] } = useSelector((state) => state.favorites) || {};

  // ✅ Buyer-only favorites
  const canUseFavorites = Boolean(user && user.role === "buyer");

  const isFavorite = canUseFavorites
    ? favorites.some((fav) => {
        if (!fav) return false;
        const favId = fav._id ? fav._id.toString() : fav.toString();
        const currentId = property?._id ? property._id.toString() : "";
        return favId === currentId;
      })
    : false;

  const handleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast.error("Please login to save favorites");
      return;
    }

    if (user.role !== "buyer") {
      toast.error("Favorites are available for buyers only.");
      return;
    }

    dispatch(toggleFavorite(property._id));

    if (isFavorite) toast.info("Removed from favorites");
    else toast.success("Added to favorites");
  };

  const imgSrc =
    property?.images && property.images.length > 0
      ? property.images[0]?.url || property.images[0]
      : "https://via.placeholder.com/800x500";

  const title = property?.title || "Untitled Listing";
  const city = property?.location?.city || "Unknown";
  const category = property?.category || "Land";
  const price = Number(property?.price || 0);

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 260, damping: 18 }}
      className="relative"
    >
      <Link
        to={`/property/${property._id}`}
        className="group block overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-soft transition"
      >
        {/* Image */}
        <div className="relative h-56 bg-slate-100 overflow-hidden">
          <motion.img
            src={imgSrc}
            alt={title}
            className="h-full w-full object-cover"
            initial={{ scale: 1 }}
            whileHover={{ scale: 1.06 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            loading="lazy"
          />
          {/* gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition" />

          {/* Category badge */}
          <div className="absolute left-3 top-3">
            <div className="rounded-full bg-white/85 backdrop-blur border border-white/40 px-3 py-1 text-xs font-extrabold text-slate-800 shadow-sm">
              {category}
            </div>
          </div>

          {/* Heart (buyer only) */}
          {canUseFavorites && (
            <motion.button
              onClick={handleFavorite}
              className="absolute right-3 top-3 z-10 grid h-10 w-10 place-items-center rounded-full bg-white/90 backdrop-blur border border-white/40 shadow-sm"
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.06 }}
              aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
              title={isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
              <AnimatePresence mode="wait" initial={false}>
                {isFavorite ? (
                  <motion.span
                    key="fav"
                    initial={{ scale: 0.7, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.7, opacity: 0 }}
                    transition={{ duration: 0.18 }}
                  >
                    <FaHeart className="text-red-500 text-lg" />
                  </motion.span>
                ) : (
                  <motion.span
                    key="notfav"
                    initial={{ scale: 0.7, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.7, opacity: 0 }}
                    transition={{ duration: 0.18 }}
                  >
                    <FaRegHeart className="text-slate-500 text-lg" />
                  </motion.span>
                )}
              </AnimatePresence>

              {/* little ping when favorited */}
              <AnimatePresence>
                {isFavorite && (
                  <motion.span
                    className="absolute inset-0 rounded-full border border-red-300"
                    initial={{ scale: 0.9, opacity: 0.6 }}
                    animate={{ scale: 1.6, opacity: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.55, ease: "easeOut" }}
                  />
                )}
              </AnimatePresence>
            </motion.button>
          )}

          {/* Hover CTA */}
          <div className="absolute bottom-3 left-3 right-3 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition duration-300">
            <div className="rounded-xl bg-white/85 backdrop-blur border border-white/40 px-3 py-2 text-xs font-bold text-slate-800 shadow-sm">
              View details →
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-5">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-lg font-extrabold text-slate-900 line-clamp-1">{title}</h3>
            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-extrabold text-emerald-700 border border-emerald-100">
              Available
            </span>
          </div>

          <div className="mt-2 flex items-center gap-2 text-sm text-slate-600">
            <FaMapMarkerAlt className="text-slate-400" />
            <span className="line-clamp-1">{city}</span>
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
            <span className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-slate-900 text-white">
                <FaMoneyBillWave className="text-sm" />
              </span>
              {price ? price.toLocaleString() : "N/A"}
            </span>

            <span className="text-xs font-bold text-slate-500">Land</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default PropertyItem;
