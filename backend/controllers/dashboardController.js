import Product from '../models/Products.js';

export const getProductsDashboard = async (req, res) => {
  try {
    const { sort, search,  isActive } = req.query;
    // const pageNum = Number(page) || 1; // Guard against NaN
    // const limitNum = Math.max(1, Math.min(Number(limit) || 10, 100)); // Cap 1-100

    let filter = {}; // All products for admin

    // Apply isActive filter if specified
    if (isActive !== undefined) {
      filter.isActive = isActive === 'true';
    }

    // Text search
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      filter.$or = [
        { name: searchRegex },
        { description: searchRegex },
        { category: searchRegex },
        { ageCategory: searchRegex },
        { tags: { $elemMatch: searchRegex } }, // Fixed: Use $elemMatch for regex in array
      ];
    }

    const products = await Product.find(filter)
      .sort(sort || '-createdAt')
      // .limit(limitNum)
      // .skip((pageNum - 1) * limitNum);

    const totalProducts = await Product.countDocuments(filter);

    res.json({
      products,
      // currentPage: pageNum,
      // totalPages: Math.ceil(totalProducts / limitNum),
      totalProducts,
    });
  } catch (error) {
    console.error('Error in getProductsDashboard:', error); // Better logging
    res.status(500).json({ message: 'Error fetching dashboard products', error: error.message });
  }
};