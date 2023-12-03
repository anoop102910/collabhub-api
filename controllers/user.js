import bcrypt from "bcrypt";
import User from "../models/user.js";
import { generateToken } from "../utils/generateToken.js";

export async function signup(req, res) {
  try {
    const { username, firstName, lastName, email, password, gender, available, domain } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Username or email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      firstName,
      lastName,
      email,
      gender,
      available,
      domain,
      password: hashedPassword,
    });

    const user = await newUser.save();
    const token = generateToken(user._id, user.fullName);
    res.status(200).json({ message: "User created succesfully", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function signin(req, res) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = generateToken(user._id, user.fullName);
    // console.log(token);
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getUsers(req, res) {
  try {
    const { name, domain, gender, available, page, limit } = req.query;

    const filter = {};

    if (name) {
      const nameRegex = new RegExp(name, "i");
      filter.$or = [{ firstName: nameRegex }, { lastName: nameRegex }];
    }

    if (domain) {
      filter.domain = domain;
    }

    if (gender) {
      filter.gender = gender;
    }

    if (available !== undefined) {
      filter.available = available.toLowerCase() === "true";
    }

    const users = await User.find(filter)
      .select("-password")
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json({ success: true, users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}
