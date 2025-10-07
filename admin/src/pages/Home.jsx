import React from 'react';
import { Link } from 'react-router-dom';
import { Package, PlusCircle, List, ShoppingBag } from 'lucide-react';
import { StatCard } from '../components/StatCard'; // Assuming StatCard is a separate component

const Home = ({ productCount, orderCount }) => {
  return (
    <div className="p-4">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Welcome back, Admin!</h1>
        <p className="text-gray-500">Here's a summary of your store's activity.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={<Package className="text-orange-800" size={24} />}
          title="Total Products"
          value={productCount || 0} // 2. Use the prop here (with a fallback for 0)
          color="bg-orange-100"
        />
        <StatCard
          icon={<ShoppingBag className="text-green-800" size={24} />}
          title="Total Orders"
          value={orderCount || 0} // 2. Use the prop here (with a fallback for 0)
          color="bg-green-100"
        />
        {/* You can add more StatCards for orders, customers etc. here */}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link to="/add" className="bg-blue-500 text-white p-4 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-600 transition-colors">
            <PlusCircle size={20} />
            <span>Add New Product</span>
          </Link>
          <Link to="/list" className="bg-gray-600 text-white p-4 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-700 transition-colors">
            <List size={20} />
            <span>View All Products</span>
          </Link>
          <Link to="/listOrders" className="bg-gray-600 text-white p-4 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-700 transition-colors">
            <ShoppingBag size={20} />
            <span>View All Orders</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;