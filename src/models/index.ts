import mongoose, { Document, Schema } from "mongoose";
import { UserRole } from "@/lib/enums/roles";
import { TourStatus, TourDifficulty, TourPriceType } from "@/lib/enums/tour";
import { TestimonialStatus } from "@/lib/enums/testimonial";
import { ContactStatus } from "@/lib/types/enums";
import { BlogStatus } from "@/lib/enums/blog";
import { SEOFields } from "@/lib/types/seo";

// Tour Model
export interface ITour extends Document {
  title: string;
  description: string;
  shortDescription: string;
  price: number;
  priceType: TourPriceType;
  duration: string;
  location: string;
  category: string;
  images: string[];
  highlights: string[];
  itinerary: {
    day: number;
    title: string;
    description: string;
  }[];
  includes: string[];
  excludes: string[];
  difficulty: TourDifficulty;
  groupSize: number;
  rating: number;
  reviews: number;
  featured: boolean;
  status: TourStatus;
  seo?: SEOFields;
  createdAt: Date;
  updatedAt: Date;
}

const TourSchema = new Schema<ITour>(
  {
    title: { type: String },
    description: { type: String },
    shortDescription: { type: String },
    price: { type: Number },
    priceType: {
      type: String,
      enum: Object.values(TourPriceType),
      default: TourPriceType.PER_PERSON,
    },
    duration: { type: String },
    location: { type: String },
    category: { type: String },
    images: [{ type: String }],
    highlights: [{ type: String }],
    itinerary: [
      {
        day: { type: Number },
        title: { type: String },
        description: { type: String },
      },
    ],
    includes: [{ type: String }],
    excludes: [{ type: String }],
    difficulty: {
      type: String,
      enum: TourDifficulty,
      default: TourDifficulty.EASY,
    },
    groupSize: { type: Number, default: 10 },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviews: { type: Number, default: 0 },
    featured: { type: Boolean, default: false },
    status: {
      type: String,
      enum: Object.values(TourStatus),
      default: TourStatus.ACTIVE,
    },
    seo: {
      metaTitle: { type: String, default: "" },
      metaDescription: { type: String, default: "" },
      slug: { type: String, default: "" },
      focusKeyword: { type: String, default: "" },
      ogImage: { type: String, default: "" },
    },
  },
  {
    timestamps: true,
    strict: true,
  },
);

// Booking Model
export interface IBooking extends Document {
  tourId: mongoose.Types.ObjectId;
  userId?: mongoose.Types.ObjectId;
  customerInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address?: string;
  };
  bookingDetails: {
    startDate: Date;
    endDate: Date;
    participants: number;
    totalPrice: number;
    specialRequests?: string;
  };
  payment: {
    method: "Credit Card" | "PayPal" | "Bank Transfer" | "Cash";
    status: "Pending" | "Completed" | "Failed" | "Refunded";
    transactionId?: string;
    paidAt?: Date;
  };
  status: "Pending" | "Confirmed" | "Cancelled" | "Completed";
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    tourId: { type: Schema.Types.ObjectId, ref: "Tour", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    customerInfo: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String },
    },
    bookingDetails: {
      startDate: { type: Date, required: true },
      endDate: { type: Date, required: true },
      participants: { type: Number, required: true, min: 1 },
      totalPrice: { type: Number, required: true },
      specialRequests: { type: String },
    },
    payment: {
      method: {
        type: String,
        enum: ["Credit Card", "PayPal", "Bank Transfer", "Cash"],
        required: true,
      },
      status: {
        type: String,
        enum: ["Pending", "Completed", "Failed", "Refunded"],
        default: "Pending",
      },
      transactionId: { type: String },
      paidAt: { type: Date },
    },
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Cancelled", "Completed"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  },
);

// Customer User Model (for frontend users)
export interface ICustomerUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  password?: string;
  role: UserRole.SUPER_ADMIN;
  profileImage?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  preferences: {
    notifications: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

const CustomerUserSchema = new Schema<ICustomerUser>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    password: { type: String },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.SUPER_ADMIN,
    },
    profileImage: { type: String },
    address: {
      street: { type: String },
      city: { type: String },
      state: { type: String },
      zipCode: { type: String },
      country: { type: String },
    },
    preferences: {
      notifications: { type: Boolean, default: true },
    },
  },
  {
    timestamps: true,
  },
);

// Contact/Inquiry Model
export interface IContact extends Document {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: ContactStatus;
  createdAt: Date;
  updatedAt: Date;
}

const ContactSchema = new Schema<IContact>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    status: {
      type: String,
      enum: Object.values(ContactStatus),
      default: ContactStatus.NEW,
    },
  },
  {
    timestamps: true,
  },
);

// Blog Model
export interface IBlog extends Document {
  title: string;
  excerpt: string;
  content: string;
  author: string;
  category: string;
  tags: string[];
  featuredImage?: string;
  status: BlogStatus;
  featured: boolean;
  publishedAt?: Date;
  seo?: SEOFields;
  createdAt: Date;
  updatedAt: Date;
}

const BlogSchema = new Schema<IBlog>(
  {
    title: { type: String, required: true },
    excerpt: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: String, required: true },
    category: { type: String, required: true },
    tags: [{ type: String }],
    featuredImage: { type: String },
    status: {
      type: String,
      enum: Object.values(BlogStatus),
      default: BlogStatus.DRAFT,
    },
    featured: { type: Boolean, default: false },
    publishedAt: { type: Date },
    seo: {
      metaTitle: { type: String, default: "" },
      metaDescription: { type: String, default: "" },
      slug: { type: String, default: "" },
      focusKeyword: { type: String, default: "" },
      ogImage: { type: String, default: "" },
    },
  },
  {
    timestamps: true,
  },
);

// Testimonial Model
export interface ITestimonial extends Document {
  name: string;
  content: string;
  rating: number;
  image?: string;
  location?: string;
  tourId?: mongoose.Types.ObjectId;
  status: TestimonialStatus;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const TestimonialSchema = new Schema<ITestimonial>(
  {
    name: { type: String, required: true },
    content: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    image: { type: String },
    location: { type: String },
    tourId: { type: Schema.Types.ObjectId, ref: "Tour" },
    status: {
      type: String,
      enum: Object.values(TestimonialStatus),
      default: TestimonialStatus.ACTIVE,
    },
    featured: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
);

// Guest Comment Model for Blogs
export interface IComment extends Document {
  blogId: mongoose.Types.ObjectId;
  name: string;
  email: string;
  website?: string;
  content: string;
  status: "Pending" | "Approved" | "Rejected";
  parentId?: mongoose.Types.ObjectId; // For nested replies
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema = new Schema<IComment>(
  {
    blogId: { type: Schema.Types.ObjectId, ref: "Blog", required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    website: { type: String },
    content: { type: String, required: true },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
    parentId: { type: Schema.Types.ObjectId, ref: "Comment" },
    ipAddress: { type: String },
    userAgent: { type: String },
  },
  {
    timestamps: true,
  },
);

// Create models
if (process.env.NODE_ENV === "development") {
  delete (mongoose.models as Record<string, unknown>).Tour;
}
export const Tour =
  mongoose.models.Tour || mongoose.model<ITour>("Tour", TourSchema);
export const Booking =
  mongoose.models.Booking || mongoose.model<IBooking>("Booking", BookingSchema);
export const CustomerUser =
  mongoose.models.CustomerUser ||
  mongoose.model<ICustomerUser>("CustomerUser", CustomerUserSchema);
export const Contact =
  mongoose.models.Contact || mongoose.model<IContact>("Contact", ContactSchema);
export const Blog =
  mongoose.models.Blog || mongoose.model<IBlog>("Blog", BlogSchema);

export const Testimonial =
  mongoose.models.Testimonial ||
  mongoose.model<ITestimonial>("Testimonial", TestimonialSchema);
export const Comment =
  mongoose.models.Comment || mongoose.model<IComment>("Comment", CommentSchema);

// User Model
export interface IUser extends Document {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isActive: boolean;
  isEmailVerified: boolean;
  lastLogin?: Date;
  passwordChangedAt?: Date;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
    },
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
    },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.SUPER_ADMIN,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    lastLogin: {
      type: Date,
    },
    passwordChangedAt: {
      type: Date,
    },
    resetPasswordToken: {
      type: String,
    },
    resetPasswordExpires: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

// Hash password before saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const bcrypt = await import("bcryptjs");
    this.password = await bcrypt.hash(this.password, 12);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Update passwordChangedAt when password is modified
UserSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();
  this.passwordChangedAt = new Date(Date.now() - 1000);
  next();
});

// Instance method to check password
UserSchema.methods.comparePassword = async function (
  candidatePassword: string,
): Promise<boolean> {
  const bcrypt = await import("bcryptjs");
  return bcrypt.compare(candidatePassword, this.password);
};

// Instance method to check if password changed after JWT was issued
UserSchema.methods.changedPasswordAfter = function (
  JWTTimestamp: number,
): boolean {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      (this.passwordChangedAt.getTime() / 1000).toString(),
      10,
    );
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

// Static method to find user by email
UserSchema.statics.findByEmail = function (email: string) {
  return this.findOne({ email: email.toLowerCase() });
};

export const User =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

// OTP Model
export interface IOTP extends Document {
  email: string;
  otp: string;
  type: "email_verification" | "password_reset" | "login_verification";
  expiresAt: Date;
  isUsed: boolean;
  attempts: number;
  createdAt: Date;
  updatedAt: Date;
}

const OTPSchema = new Schema<IOTP>(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
    },
    otp: {
      type: String,
      required: [true, "OTP is required"],
      length: [6, "OTP must be 6 digits"],
    },
    type: {
      type: String,
      enum: ["email_verification", "password_reset", "login_verification"],
      required: [true, "OTP type is required"],
    },
    expiresAt: {
      type: Date,
      required: [true, "Expiration date is required"],
      default: () => new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
    },
    isUsed: {
      type: Boolean,
      default: false,
    },
    attempts: {
      type: Number,
      default: 0,
      max: [3, "Maximum 3 attempts allowed"],
    },
  },
  {
    timestamps: true,
  },
);

// Index for efficient queries
OTPSchema.index({ email: 1, type: 1 });
OTPSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Static method to generate OTP
OTPSchema.statics.generateOTP = function (): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Static method to find valid OTP
OTPSchema.statics.findValidOTP = function (
  email: string,
  otp: string,
  type: string,
) {
  return this.findOne({
    email: email.toLowerCase(),
    otp,
    type,
    isUsed: false,
    expiresAt: { $gt: new Date() },
    attempts: { $lt: 3 },
  });
};

// Instance method to mark OTP as used
OTPSchema.methods.markAsUsed = function () {
  this.isUsed = true;
  return this.save();
};

// Instance method to increment attempts
OTPSchema.methods.incrementAttempts = function () {
  this.attempts += 1;
  return this.save();
};

export const OTP =
  mongoose.models.OTP || mongoose.model<IOTP>("OTP", OTPSchema);

// Category Model
export interface ICategory extends Document {
  name: string;
  slug: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String },
  },
  {
    timestamps: true,
  },
);

export const Category =
  mongoose.models.Category ||
  mongoose.model<ICategory>("Category", CategorySchema);
