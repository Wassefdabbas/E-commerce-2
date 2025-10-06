import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true
    },
    description: {
      type: String,
      default: ""
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"]
    },
    offer: {
      type: Number,
      min: [0, "offer cannot be negative"],
      max: [99, "offer cannot be more than 100"],
      default: null
    },
    offerPrice: {
      type: Number,
      default: null // If null or not present, there is no offer
    },
    offerStartDate: {
      type: Date,
      // The validator function makes this field required ONLY if an offer exists.
      validate: {
        validator: function (value) {
          // 'this' refers to the document being saved.
          // If there is an offer > 0, then a value for this field MUST exist.
          if (this.offer && this.offer > 0) {
            return value != null;
          }
          return true;
        },
        message: 'Offer Start Date is required when an offer percentage is set.'
      }
    },
    offerEndDate: {
      type: Date,
      validate: {
        validator: function (value) {
          if (this.offer && this.offer > 0) {
            return value != null;
          }
          return true;
        },
        message: 'Offer End Date is required when an offer percentage is set.'
      }
    },
    category: [
      {
        type: String,
        enum: ["topwear", "bottomwear", "winterwear", "shirt", "pant", "jacket"],
        required: [true, "Category is required"]
      }
    ],
    size: [
      {
        type: String,
        enum: ["XS", "S", "M", "L", "XL", "XXL"],
        required: true
      }
    ],
    ageCategory: [{
      type: String,
      enum: ["Baby", "Kids", "Men", "Women", "Unisex"],
      required: true
    }],
    // color: [
    //   String
    // ],
    images: [
      {
        type: String, // Store image URLs
        required: true
      }
    ],
    imagePublicIds: [
      {
        type: String, // Store the ID for deleting from Cloudinary
        required: true
      }
    ],
    tags: [
      {
        type: String,
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    bestSeller: {
      type: Boolean,
    },
  },
  { timestamps: true }
);


// Virtual property to check if an offer is currently active
productSchema.virtual("onOffer").get(function () {
  const now = new Date();
  const hasValidPrice = this.offerPrice != null && this.offerPrice > 0;
  const isWithinDateRange =
    (!this.offerStartDate || this.offerStartDate <= now) &&
    (!this.offerEndDate || this.offerEndDate >= now);
  return hasValidPrice && isWithinDateRange;
});

// Mongoose Pre-Save Hook to calculate offerPrice
productSchema.pre("save", function (next) {
  if (this.isModified("offer") || this.isModified("price")) {
    if (this.offer && this.offer > 0 && this.offer < 100) {
      this.offerPrice = this.price - (this.price * this.offer) / 100;
    } else {
      this.offerPrice = null;
    }
  }
  next();
});

// export default mongoose.model("Products", productSchema);
export default mongoose.models.Products || mongoose.model("Products", productSchema)