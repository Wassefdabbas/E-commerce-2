import Product from '../models/Products.js';
import { v2 as cloudinary } from 'cloudinary';

// Helper to parse comma-separated arrays
const parseArrayField = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  return value.split(',').map(item => item.trim()).filter(Boolean);
};

// @desc    Get all products (public, active only)
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res) => {
  try {
    const { sort, search, ...queryFilters } = req.query;
    // const pageNum = Number(page);
    // const limitNum = Number(limit);

    let filter = { isActive: true };

    // Dynamic filters
    for (const key in queryFilters) {
      const value = queryFilters[key];
      if (key === 'size') {
        filter[key] = { $in: parseArrayField(value) };
      } else if (key === 'minPrice' || key === 'maxPrice') {
        filter.price = filter.price || {};
        if (key === 'minPrice') filter.price.$gte = Number(value);
        if (key === 'maxPrice') filter.price.$lte = Number(value);
      } else if (key === 'category' || key === 'ageCategory') {
        filter[key] = value; // Single string match
      } else {
        filter[key] = value;
      }
    }

    // Text search
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      filter.$or = [
        { name: searchRegex },
        { description: searchRegex },
        { category: searchRegex },
        { ageCategory: searchRegex },
        { tags: { $in: [searchRegex] } }, // For tags array
      ];
    }

    const products = await Product.find(filter)
      .sort(sort || '-createdAt')
      // .limit(limitNum)
      // .skip((pageNum - 1) * limitNum)
      ;

    const totalProducts = await Product.countDocuments(filter);

    res.json({
      success: true,
      products,
      // currentPage: pageNum,
      // totalPages: Math.ceil(totalProducts / limitNum),
      totalProducts,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error: error.message });
  }
};

// @desc    Get offer products (active offers only)
// @route   GET /api/products/offers
// @access  Public
export const getOfferProducts = async (req, res) => {
  try {
    const { sort, search, ...queryFilters } = req.query;
    // const pageNum = Number(page);
    // const limitNum = Number(limit);
    const now = new Date();

    let filter = {
      isActive: true,
      offerPrice: { $ne: null, $gt: 0 },
      offerStartDate: { $lte: now },
      offerEndDate: { $gte: now },
    };

    // Apply same dynamic filters as getProducts
    for (const key in queryFilters) {
      const value = queryFilters[key];
      if (key === 'size') {
        filter[key] = { $in: parseArrayField(value) };
      } else if (key === 'minPrice' || key === 'maxPrice') {
        filter.offerPrice = filter.offerPrice || {}; // Filter on offerPrice for offers
        if (key === 'minPrice') filter.offerPrice.$gte = Number(value);
        if (key === 'maxPrice') filter.offerPrice.$lte = Number(value);
      } else if (key === 'category' || key === 'ageCategory') {
        filter[key] = value;
      } else {
        filter[key] = value;
      }
    }

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      filter.$or = [
        { name: searchRegex },
        { description: searchRegex },
        { category: searchRegex },
        { ageCategory: searchRegex },
        { tags: { $in: [searchRegex] } },
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
    res.status(500).json({ message: 'Error fetching offers', error: error.message });
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({success: true, product});
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product', error: error.message });
  }
};

// @desc    Create product
// @route   POST /api/products
// @access  Admin
export const createProduct = async (req, res) => {
  try {
    const { name, price, size, category, ageCategory, tags, description, offer, offerStartDate, offerEndDate, bestSeller } = req.body;

    const missingFields = [];
    if (!name) missingFields.push('name');
    if (!price || price <= 0) missingFields.push('price');
    if (!size) missingFields.push('size');
    if (!category) missingFields.push('category');
    if (!ageCategory) missingFields.push('ageCategory');

    if (offer && offer > 0) {
      if (!offerStartDate) missingFields.push('offerStartDate');
      if (!offerEndDate) missingFields.push('offerEndDate');
      if (new Date(offerStartDate) >= new Date(offerEndDate)) {
        return res.status(400).json({ message: 'Offer start date must be before end date' });
      }
    }

    if (missingFields.length > 0) {
      return res.status(400).json({ message: `Missing required fields: ${missingFields.join(', ')}` });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'Please upload at least one image.' });
    }

    // Parse arrays
    const parsedSize = parseArrayField(size);
    const parsedTags = parseArrayField(tags);
    const parsedCategory = parseArrayField(category);


    if (parsedSize.length === 0) {
      return res.status(400).json({ message: 'Size must be provided (e.g., comma-separated: S,M,L)' });
    }

    const images = req.files.map(file => file.path);
    const imagePublicIds = req.files.map(file => file.filename);

    const product = new Product({
      name,
      description: description || '',
      price: Number(price),
      size: parsedSize,
      category: parsedCategory,
      ageCategory,
      tags: parsedTags,
      offer: offer ? Number(offer) : null,
      offerStartDate: offerStartDate ? new Date(offerStartDate) : null,
      offerEndDate: offerEndDate ? new Date(offerEndDate) : null,
      images,
      imagePublicIds,
      bestSeller
    });

    const createdProduct = await product.save();
    res.status(201).json({success: true, message: "Product created successfully", product: createdProduct});
  } catch (error) {
    res.status(400).json({ message: 'Error creating product', error: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Get the list of images the user wants to keep from the frontend
    // Default to an empty array if not provided
    const existingImages = req.body.existingImages ? JSON.parse(req.body.existingImages) : [];

    // --- Image Deletion Logic ---
    // Find which images were removed by comparing the original list with the "kept" list
    const imagesToDelete = product.images.filter(imgUrl => !existingImages.includes(imgUrl));
    
    if (imagesToDelete.length > 0) {
      // Find the corresponding public IDs for the URLs to be deleted
      const publicIdsToDelete = product.imagePublicIds.filter((id, index) => 
        imagesToDelete.includes(product.images[index])
      );
      
      if (publicIdsToDelete.length > 0) {
        // Delete only the removed images from Cloudinary
        await cloudinary.api.delete_resources(publicIdsToDelete);
      }
    }

    // --- Image Upload and Update Logic ---
    let newImageUrls = [];
    let newImagePublicIds = [];

    // Upload new files if they exist
    if (req.files && req.files.length > 0) {
      newImageUrls = req.files.map(file => file.path);
      newImagePublicIds = req.files.map(file => file.filename);
    }

    // Combine the kept images with the newly uploaded ones
    product.images = [...existingImages, ...newImageUrls];
    
    // We also need to update public IDs correctly
    const keptPublicIds = product.imagePublicIds.filter((id, index) => 
      existingImages.includes(product.images[index])
    );
    product.imagePublicIds = [...keptPublicIds, ...newImagePublicIds];


    // --- Update Other Product Fields ---
    const { size, tags, category, offer, offerStartDate, offerEndDate, ...otherFields } = req.body;
    
    // Parse array fields from the request body
    const parsedSize = parseArrayField(size);
    const parsedTags = parseArrayField(tags);
    const parsedCategory = parseArrayField(category);

    if (offer && offer > 0) {
      if (!offerStartDate || !offerEndDate || new Date(offerStartDate) >= new Date(offerEndDate)) {
        return res.status(400).json({ message: 'Invalid offer dates' });
      }
    }

    // Update all other fields on the product object
    Object.assign(product, {
      ...otherFields,
      size: parsedSize.length > 0 ? parsedSize : product.size,
      tags: parsedTags.length > 0 ? parsedTags : product.tags,
      category: parsedCategory.length > 0 ? parsedCategory : product.category, // Add this line for category
      offer: offer ? Number(offer) : product.offer,
      offerStartDate: offerStartDate ? new Date(offerStartDate) : product.offerStartDate,
      offerEndDate: offerEndDate ? new Date(offerEndDate) : product.offerEndDate,
    });
    
    // Set boolean fields correctly, as FormData sends them as strings
    product.isActive = otherFields.isActive === 'true';
    product.bestSeller = otherFields.bestSeller === 'true';

    const updatedProduct = await product.save();
    res.json({ success: true, message: "Product updated successfully!", product: updatedProduct });

  } catch (error) {
    console.error("Error updating product:", error); // Log the full error
    res.status(400).json({ success: false, message: 'Error updating product', error: error.message });
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Admin
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    if (product.imagePublicIds && product.imagePublicIds.length > 0) {
      await cloudinary.api.delete_resources(product.imagePublicIds);
    }
    await product.deleteOne();
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product', error: error.message });
  }
};

export const getProductCategories = async (req, res) => {
  try {
    const categories = await Product.distinct('category');
    res.status(200).json({ success: true, categories });
  } catch (error) {
    console.error('Error fetching product categories:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};


// @desc    Get all products (admin, includes inactive)
// @route   GET /api/products/admin/all
// @access  Admin
export const getAllProductsAdmin = async (req, res) => {
  try {
    const { sort}  = req.query;
    // const pageNum = Number(page);
    // const limitNum = Number(limit);

    const products = await Product.find({})
      .sort(sort || "-createdAt")
      // .limit(limitNum)
      // .skip((pageNum - 1) * limitNum);

    const totalProducts = await Product.countDocuments();

    res.json({
      success: true,
      products,
      // currentPage: pageNum,
      // totalPages: Math.ceil(totalProducts / limitNum),
      totalProducts,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching all products", error: error.message });
  }
};

// In controllers/productController.js

// ... (at the end of the file, before the last export if you have one)

// @desc    Update a product's active status
// @route   PATCH /api/products/:id/status
// @access  Admin
export const updateProductStatus = async (req, res) => {
  try {
    const { isActive } = req.body;

    // Basic validation
    if (typeof isActive !== 'boolean') {
      return res.status(400).json({ success: false, message: 'Invalid "isActive" value provided.' });
    }

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    product.isActive = isActive;
    const updatedProduct = await product.save();

    res.json({ success: true, message: 'Product status updated.', product: updatedProduct });
  } catch (error) {
    console.error("Error updating product status:", error);
    res.status(500).json({ success: false, message: 'Server error while updating status.' });
  }
};