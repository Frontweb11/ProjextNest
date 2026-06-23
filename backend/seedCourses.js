const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Course = require("./models/Course.js");
const User = require("./models/User.js");

dotenv.config();

const courses = [
  {
    title: "React 3 Basics",
    description:
      "Learn fundamentals of React including components, props, and state.",
    price: 0,
    thumbnail: "",
    category: "frontend",
    tags: ["react", "javascript"],
  },
  {
    title: "Advanced 3  Node.js",
    description:
      "Master backend development with Express, APIs, and authentication.",
    price: 49,
    thumbnail: "",
    category: "backend",
    tags: ["node", "express"],
  },
  {
    title: "Fullstack 3  MERN Project",
    description: "Build a complete MERN stack application from scratch.",
    price: 99,
    thumbnail: "",
    category: "fullstack",
    tags: ["mongodb", "express", "react", "node"],
  },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const admin = await User.findOne({ role: "admin" });

    if (!admin) {
      console.log("❌ No admin user found — create an admin first");
      process.exit(1);
    }

    await Course.deleteMany();

    for (const courseData of courses) {
      await Course.create({ ...courseData, instructor: admin._id });
    }

    console.log(`✅ ${courses.length} courses seeded successfully`);

    await mongoose.connection.close();
    process.exit();
  } catch (err) {
    console.log("❌ Error seeding courses:", err.message);
    process.exit(1);
  }
};

seed();
