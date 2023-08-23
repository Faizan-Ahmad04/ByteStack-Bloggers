const { createHmac, randomBytes } = require("crypto");
const { Schema, model } = require("mongoose");
const {createTokenForUser} = require('../services/authontication');

const userSchema = new Schema(
  {
    fullname: {
      type: String,
      required: true, // Corrected typo here
    },
    email: {
      type: String,
      required: true, // Corrected typo here
      unique: true,
    },
    salt: {
      type: String,
    },
    password: {
      type: String,
      required: true, // Corrected typo here
    },
    profileImageURL: {
      type: String,
      default: "/images/default.jpg",
    },
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },
  },
  { timestamps: true }
);

userSchema.pre("save", function (next) {
  const user = this;

  if (!user.isModified("password")) return;
  // console.log(user.password);

  const salt = randomBytes(16).toString();
  // console.log(salt);
  const hashedPassword = createHmac("sha256", salt)
    .update(user.password)
    .digest("hex");

  user.salt = salt;
  user.password = hashedPassword;
  next();
});

userSchema.static("matchPasswordAndgenerateToken", async function (email, password) {
  const user = await this.findOne({ email });
  if (!user) throw new Error("User not found");

  const salt = user.salt;
  const hashedPassword = user.password;

  const userProvidedHash = createHmac("sha256", salt)
    .update(password)
    .digest("hex");

  if (hashedPassword !== userProvidedHash)
    throw new Error("Incorrect Password");

  const token = createTokenForUser(user);
  return token;
});

const User = model("user", userSchema);

module.exports = User;
