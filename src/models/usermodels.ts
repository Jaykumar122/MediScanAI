import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "Please provide a first name"],
      maxlength: [30, "First name should be under 30 characters"],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, "Please provide a last name"],
      maxlength: [30, "Last name should be under 30 characters"],
      trim: true,
    },
    name: {
      type: String,
      required: [true, "Please provide a name"],
      maxlength: [60, "Name should be under 60 characters"],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Please provide an email"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
    },

    mobileNumber: {
      type: String,
      required: [true, "Please provide a mobile number"],
      unique: true,
      trim: true,
    },

    role: {
      type: String,
      enum: ["patient", "doctor", "pharmacist", "admin"],
      default: "patient",
      required: [true, "Please provide a role"],
    },

    govId: {
      type: String,
      required: function() {
        // govId not required for admin users
        return this.role !== "admin";
      },
      trim: true,
    },

    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: [8, "Password should be at least 8 characters"],
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    isAdmin: {
      type: Boolean,
      default: false,
    },

    // Patient-specific fields
    age: {
      type: Number,
      required: function() {
        return this.role === "patient";
      },
      min: [0, "Age must be a positive number"],
      max: [150, "Please provide a valid age"],
    },

    bloodType: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", ""],
      required: function() {
        return this.role === "patient";
      },
    },

    // Doctor-specific fields
    specialization: {
      type: String,
      required: function() {
        return this.role === "doctor";
      },
      trim: true,
    },

    // OAuth
    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },
    githubId: {
      type: String,
      unique: true,
      sparse: true,
    },
    appleId: {
      type: String,
      unique: true,
      sparse: true,
    },

    provider: {
      type: String,
      enum: ["local", "google", "github", "apple"],
      default: "local",
    },

    profilePicture: {
      type: String,
      default: null,
    },

    isCredentialVerified: {
      type: Boolean,
      default: false,
    },

    forgotPasswordToken: String,
    forgotPasswordTokenExpiry: Date,
    verifyToken: String,
    verifyTokenExpiry: Date,
  },
  { timestamps: true }
);

// Index for role-based queries
userSchema.index({ role: 1 });

// Index for email lookups
userSchema.index({ email: 1 });

// Pre-save middleware to sync isAdmin with role
userSchema.pre('save', function(next) {
  // Sync isAdmin flag with admin role
  if (this.role === 'admin') {
    this.isAdmin = true;
  }
  
  // Auto-generate name from firstName and lastName if not provided
  if (!this.name && this.firstName && this.lastName) {
    this.name = `${this.firstName} ${this.lastName}`;
  }
  
  next();
});

// Method to check if user is admin
userSchema.methods.isAdminUser = function() {
  return this.role === 'admin' || this.isAdmin === true;
};

// Method to get user display name
userSchema.methods.getDisplayName = function() {
  return this.name || `${this.firstName} ${this.lastName}`;
};

// Method to get safe user object (without sensitive data)
userSchema.methods.toSafeObject = function() {
  const obj = this.toObject();
  delete obj.password;
  delete obj.forgotPasswordToken;
  delete obj.forgotPasswordTokenExpiry;
  delete obj.verifyToken;
  delete obj.verifyTokenExpiry;
  delete obj.__v;
  return obj;
};

export default mongoose.models.User || mongoose.model("User", userSchema);