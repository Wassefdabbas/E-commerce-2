import React, { useContext, useEffect, useState } from "react";
import ShopContext from "../context/ShopContext";
import Title from './Title';
import ProductItem from './ProductItem';

const BestSeller = () => {
  const { products } = useContext(ShopContext);
  const [bestSeller, setBestSeller] = useState([]);

  useEffect(() => {
    const bestProduct = products.filter((item) => item.bestSeller && item.isActive).slice(0, 5);
    setBestSeller(bestProduct);
  }, [products]);

  return (
    <div className="my-10">
      <div className='text-center py-8 text-3xl'>
        <Title text1={'BEST'} text2={'SELLERS'} />
      </div>
       <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
        {bestSeller.map(item => (
          <ProductItem
  key={item._id}
  id={item._id}
  image={item.images?.[0]}
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
  );
};

export default BestSeller;
