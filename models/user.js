import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    id: Number,
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      enum: ["male", "female"],
      required: true,
    },
    avatar: String,
    domain: {
      type: String,
      required: true,
    },
    available: {
      type: Boolean,
      defualt: true,
    },
  },
  {
    timestamps: true,
    virtuals: {
      fullName: function () {
        return `${this.first_name} ${this.last_name}`;
      },
    },
  }
);

userSchema.query.byName = function (query) {
  return this.where({ name: new RegExp(query, "i") });
};

const User = mongoose.model("User", userSchema);

export default User;
