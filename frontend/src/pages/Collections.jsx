import React, { useContext, useMemo, useState } from "react";
import ShopContext from "../context/ShopContext";
import { assets } from "../assets/frontend_assets/assets";
import ProductItem from "../components/ProductItem";
import FilterButton from "../components/FilterButton";

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

const Collections = () => {
  const { products, search, showSearch } = useContext(ShopContext);
  const [showFilter, setShowFilter] = useState(false);
  const [selectedAgeCategories, setSelectedAgeCategories] = useState(new Set());
  const [selectedCategories, setSelectedCategories] = useState(new Set());
  const [selectedSizes, setSelectedSizes] = useState(new Set());
  const [offerOnly, setOfferOnly] = useState(false);
  const [sortBy, setSortBy] = useState("relevant");

  const toggleSetValue = (setFn, currentSet, value) => {
    const next = new Set(currentSet);
    if (next.has(value)) next.delete(value);
    else next.add(value);
    setFn(next);
  };

  const filteredAndSorted = useMemo(() => {
    let list = (products || []).filter((p) => p.isActive !== false);

    if (selectedAgeCategories.size > 0) {
      list = list.filter((p) => {
        const productAgeCategories = [].concat(p.ageCategory || []);
        return productAgeCategories.some((ageCat) =>
          selectedAgeCategories.has(ageCat)
        );
      });
    }

    if (selectedCategories.size > 0) {
      list = list.filter((p) => {
        const productCategorySet = new Set(
          [].concat(p.category || []).map((c) => c.toLowerCase())
        );
        return [...selectedCategories].some((selectedCat) =>
          productCategorySet.has(selectedCat)
        );
      });
    }

    if (selectedSizes.size > 0) {
      list = list.filter((p) => {
        const productSizes = [].concat(p.sizes || p.size || []);
        return productSizes.some((s) => selectedSizes.has(String(s)));
      });
    }

    if (offerOnly) {
      list = list.filter(
        (p) =>
          Boolean(
            p.offer &&
              p.offer > 0 &&
              new Date(p.offerStartDate).getTime() <= Date.now() &&
              new Date(p.offerEndDate).getTime() >= Date.now()
          ) || Boolean(p.offerPrice && p.offerPrice < (p.price || 0))
      );
    }

    if (sortBy === "price_low_high") {
      list = [...list].sort(
        (a, b) =>
          Number(a.offerPrice || a.price) - Number(b.offerPrice || b.price)
      );
    } else if (sortBy === "price_high_low") {
      list = [...list].sort(
        (a, b) =>
          Number(b.offerPrice || b.price) - Number(a.offerPrice || a.price)
      );
    } else if (sortBy === "newest") {
      list = [...list].sort(
        (a, b) => Number(b.date || 0) - Number(a.date || 0)
      );
    }

    if (showSearch && search.trim() !== "") {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          (p.name || "").toLowerCase().includes(q) ||
          []
            .concat(p.category || [])
            .some((c) => c.toLowerCase().includes(q)) ||
          []
            .concat(p.ageCategory || [])
            .some((ac) => ac.toLowerCase().includes(q)) ||
          [].concat(p.tags || []).some((tag) => tag.toLowerCase().includes(q))
      );
    }

    return list;
  }, [
    products,
    selectedAgeCategories,
    selectedCategories,
    selectedSizes,
    offerOnly,
    sortBy,
    search,
    showSearch,
  ]);

  return (
    <div className="py-6 px-4 max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Filter Sidebar */}
        <div className="lg:w-64 bg-white rounded-lg shadow p-4">
          <button
            onClick={() => setShowFilter((v) => !v)}
            className="w-full flex items-center justify-between text-lg font-semibold mb-4 cursor-pointer"
          >
            <span>FILTERS</span>
            <img
              className={`h-4 transition-transform lg:hidden ${
                showFilter ? "rotate-180" : ""
              }`}
              src={assets.dropdown_icon}
              alt="Toggle filters"
            />
          </button>

          <div
            className={`lg:block ${showFilter ? "block" : "hidden"} space-y-6`}
          >
            {/* Offer Filter */}
            <div>
              <h3 className="mb-2 text-sm font-semibold uppercase">
                Only Offers
              </h3>
              <FilterButton
                option="Show products on offer"
                isSelected={offerOnly}
                onToggle={() => setOfferOnly((v) => !v)}
              />
            </div>

            {/* Age Category Filter */}
            <div>
              <h3 className="mb-2 text-sm font-semibold uppercase">
                Age Category
              </h3>
              <div className="flex flex-wrap gap-2">
                {AGE_CATEGORY_OPTIONS.map((option) => (
                  <FilterButton
                    key={option}
                    option={option}
                    isSelected={selectedAgeCategories.has(option)}
                    onToggle={() =>
                      toggleSetValue(
                        setSelectedAgeCategories,
                        selectedAgeCategories,
                        option
                      )
                    }
                  />
                ))}
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <h3 className="mb-2 text-sm font-semibold uppercase">Category</h3>
              <div className="flex flex-wrap gap-2">
                {CATEGORY_OPTIONS.map((option) => (
                  <FilterButton
                    key={option}
                    option={option}
                    isSelected={selectedCategories.has(option)}
                    onToggle={() =>
                      toggleSetValue(
                        setSelectedCategories,
                        selectedCategories,
                        option
                      )
                    }
                  />
                ))}
              </div>
            </div>

            {/* Size Filter */}
            <div>
              <h3 className="mb-2 text-sm font-semibold uppercase">Size</h3>
              <div className="flex flex-wrap gap-2">
                {SIZE_OPTIONS.map((option) => (
                  <FilterButton
                    key={option}
                    option={option}
                    isSelected={selectedSizes.has(option)}
                    onToggle={() =>
                      toggleSetValue(setSelectedSizes, selectedSizes, option)
                    }
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">SPECIAL OFFERS</h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                {filteredAndSorted.length} items
              </span>
              <select
                className="border rounded px-4 py-2"
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

          {/* Product Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredAndSorted.map((item) => (
              <ProductItem
                key={item._id}
                id={item._id}
                image={item.images && item.images[0]}
                name={item.name}
                price={item.price}
                offer={item.offer}
                offerPrice={item.offerPrice}
                offerStartDate={item.offerStartDate}
                offerEndDate={item.offerEndDate}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Collections;
