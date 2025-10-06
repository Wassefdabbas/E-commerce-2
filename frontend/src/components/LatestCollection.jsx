import React, { useContext, useEffect, useState } from 'react'
import ShopContext from '../context/ShopContext';
import Title from './Title'
import ProductItem from './ProductItem'
const LatestCollection = () => {
  const { products } = useContext(ShopContext)
  const [latestProducts, setLatestProducts] = useState([])

  useEffect(() => {
    const activeProduct = products.filter(item => item.isActive);
    setLatestProducts(activeProduct.slice(0, 10));
  }, [products])

  return (
    <div className="my-10">
      <div className='text-center py-8 text-3xl'> <Title text1={'LATEST'} text2={'COLLECTIONS'} /> </div>
      {/* rendering product */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
        {latestProducts.map(item => (
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
            isActive={item.isActive}
          />
        ))}
      </div>
    </div>
  )
}

export default LatestCollection
