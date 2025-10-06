import React, { useContext, useEffect, useState } from "react";
import ShopContext from "../context/ShopContext";
import ProductItem from "./ProductItem";
import Title from "../components/Title";

const RelatedProduct = ({ ageCategory, category, id }) => {
  const { products } = useContext(ShopContext);

  const [related, setRelated] = useState([]);

  useEffect(() => {

    if (products.length > 0) {
      let productCopy = products.slice();

      productCopy = productCopy.filter(
        (item) =>
          item.category?.includes(category) &&
          item.ageCategory?.includes(ageCategory)
      );
      
      // exclude the current product
      productCopy = productCopy.filter((item) => String(item._id) !== String(id));

      // shuffle
      productCopy = productCopy.sort(() => 0.5 - Math.random());

      // take 5
      setRelated(productCopy.slice(0, 5));
    }
  }, [products, ageCategory, category, id]);

  if (!related.length) return null;

  return (
    <div className="my-24">
      <div className="text-center text-3xl py-2">
        <Title text1={"RELATED"} text2={"PRODUCTS"} />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {related.map((item, index) => (
            <ProductItem
              key={index}
              id={item._id}
              name={item.name}
              price={item.price}
              image={item.images?.[0]}
              offer={item.offer}
              offerPrice={item.offerPrice}
              offerStartDate={item.offerStartDate}
              offerEndDate={item.offerEndDate}
            />
        ))}
      </div>
    </div>
  );
};

export default RelatedProduct;
