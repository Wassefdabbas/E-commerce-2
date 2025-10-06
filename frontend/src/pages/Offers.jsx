import React, { useContext, useMemo, useState } from "react";
import ShopContext from "../context/ShopContext";
import ProductItem from "../components/ProductItem";
import { assets } from "../assets/frontend_assets/assets";
import Newsletter from "../components/Newsletter";

const AGE_CATEGORY_OPTIONS = ["Men", "Women", "Kids", "Baby"];
const CATEGORY_OPTIONS = [
  "topwear",
  "bottomwear",
  "winterwear",
  "shirt",
  "pant",
  "jacket",
];
const SIZE_OPTIONS = ["XS", "S", "M", "L", "XL", "XXL"];

const Offers = () => {
  const { products, isProductOnOffer, search, showSearch } =
    useContext(ShopContext);
  const [showFilter, setShowFilter] = useState(false);
  const [selectedAgeCategories, setSelectedAgeCategories] = useState(new Set());
  const [selectedCategories, setSelectedCategories] = useState(new Set());
  const [selectedSizes, setSelectedSizes] = useState(new Set());
  const [sortBy, setSortBy] = useState("relevant");

  const toggleSetValue = (setFn, currentSet, value) => {
    const next = new Set(currentSet);
    if (next.has(value)) next.delete(value);
    else next.add(value);
    setFn(next);
  };

  // First, get the base list of only products on offer
  const offerProducts = useMemo(() => {
    if (!products) {
      return [];
    }
    const activeOfferProduct = products.filter((item) => item.isActive);
    return activeOfferProduct.filter((product) => isProductOnOffer(product));
  }, [products, isProductOnOffer]);

  // Then, apply filters and sorting ON TOP of the offerProducts list
  const filteredAndSorted = useMemo(() => {
    // Start with the offerProducts list, not the entire product list.
    let list = [...offerProducts];

    if (selectedAgeCategories.size > 0) {
      list = list.filter((p) => selectedAgeCategories.has(p.ageCategory));
    }
    if (selectedCategories.size > 0) {
      list = list.filter((p) =>
        selectedCategories.has((p.category || "").toLowerCase())
      );
    }
    if (selectedSizes.size > 0) {
      list = list.filter((p) => {
        const sizes = p.sizes || p.size || [];
        if (!Array.isArray(sizes)) return false;
        return sizes.some((s) => selectedSizes.has(String(s)));
      });
    }

    if (sortBy === "price_low_high") {
      list.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sortBy === "price_high_low") {
      list.sort((a, b) => Number(b.price) - Number(a.price));
    } else if (sortBy === "newest") {
      list.sort((a, b) => Number(b.date || 0) - Number(a.date || 0));
    }

    if (showSearch && search.trim() !== "") {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          (p.name || "").toLowerCase().includes(q) ||
          (p.category || "").toLowerCase().includes(q) ||
          (p.ageCategory || "").toLowerCase().includes(q) ||
          p.tags ||
          "".toLowerCase().includes(q)
      );
    }

    return list;
  }, [
    offerProducts,
    selectedAgeCategories,
    selectedCategories,
    selectedSizes,
    sortBy,
    search,
    showSearch,
  ]);

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10">
        <div className="min-w-60">
          <p
            onClick={() => setShowFilter((v) => !v)}
            className="my-2 text-xl flex items-center cursor-pointer gap-2"
          >
            FILTERS
            <img
              className={`h-3 sm:hidden transition-transform ${
                showFilter ? "rotate-90" : ""
              }`}
              src={assets.dropdown_icon}
              alt=""
            />
          </p>

          {/* Age Category Filter */}
          <div
            className={`border border-gray-300 dark:border-neutral-700 pl-5 py-3 mt-6 ${
              showFilter ? "" : "hidden"
            } sm:block`}
          >
            <p className="mb-3 text-sm font-medium">AGE CATEGORY</p>
            <div className="flex flex-col gap-2 text-sm font-light text-gray-700 dark:text-gray-300">
              {AGE_CATEGORY_OPTIONS.map((option) => (
                <label key={option} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="w-3 accent-black dark:accent-white"
                    checked={selectedAgeCategories.has(option)}
                    onChange={() =>
                      toggleSetValue(
                        setSelectedAgeCategories,
                        selectedAgeCategories,
                        option
                      )
                    }
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Category Filter */}
          <div
            className={`border border-gray-300 dark:border-neutral-700 pl-5 py-3 my-5 ${
              showFilter ? "" : "hidden"
            } sm:block`}
          >
            <p className="mb-3 text-sm font-medium">CATEGORY</p>
            <div className="flex flex-col gap-2 text-sm font-light text-gray-700 dark:text-gray-300">
              {CATEGORY_OPTIONS.map((option) => (
                <label key={option} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="w-3 accent-black dark:accent-white"
                    checked={selectedCategories.has(option)}
                    onChange={() =>
                      toggleSetValue(
                        setSelectedCategories,
                        selectedCategories,
                        option
                      )
                    }
                  />
                  <span className="capitalize">{option}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Size Filter */}
          <div
            className={`border border-gray-300 dark:border-neutral-700 pl-5 py-3 my-5 ${
              showFilter ? "" : "hidden"
            } sm:block`}
          >
            <p className="mb-3 text-sm font-medium">SIZE</p>
            <div className="flex flex-col gap-2 text-sm font-light text-gray-700 dark:text-gray-300">
              {SIZE_OPTIONS.map((option) => (
                <label key={option} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="w-3 accent-black dark:accent-white"
                    checked={selectedSizes.has(option)}
                    onChange={() =>
                      toggleSetValue(setSelectedSizes, selectedSizes, option)
                    }
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Right content / Product Grid */}
        <div className="flex-1">
          <div className="flex justify-between items-center text-base sm:text-2xl mb-4">
            <h2 className="font-medium">SPECIAL OFFERS</h2>
            <div className="flex items-center gap-3 text-sm">
              <p className="text-gray-600 dark:text-gray-300">
                {filteredAndSorted.length} items
              </p>
              <select
                className="text-sm border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-gray-800 dark:text-gray-200 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="relevant">Sort by: Relevance</option>
                <option value="price_low_high">Price: Low to High</option>
                <option value="price_high_low">Price: High to Low</option>
                <option value="newest">Newest</option>
              </select>
            </div>
          </div>

          {/* --- 5. DISPLAY THE CORRECT LIST --- */}
          {filteredAndSorted.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredAndSorted.map((item) => (
                <ProductItem
                  key={item._id}
                  id={item._id}
                  image={item.image}
                  name={item.name}
                  price={item.price}
                  offer={item.offer}
                  offerPrice={item.offerPrice}
                  offerStartDate={item.offerStartDate}
                  offerEndDate={item.offerEndDate}
                />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">
              No offers match your current filters.
            </p>
          )}
        </div>
      </div>
      <Newsletter />
    </>
  );
};

export default Offers;
