import { User } from "../models/user/User.js";

export const createAdminUser = async () => {
  try {
    const adminEmail = "admin@gmail.com";
    const adminPassword = "admin123";

    const existingAdmin = await User.findOne({ where: { email: adminEmail } });
    if (!existingAdmin) {
      await User.create({
        name: "Admin User",
        email: adminEmail,
        password: adminPassword,
        isAdmin: true,
      });
      console.log("Admin user created with email:", adminEmail, "and password:", adminPassword);
    } else {
      console.log("Admin user already exists.");
    }
  } catch (error) {
    console.error("Error creating admin user:", error);
  }
};
