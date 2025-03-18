const { User } = require("../model/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

class UserController {
    // Add User
    async addUser(req, res) {
        try {
            const { FirstName, LastName, Age, Email, Password, ContactNumber } = req.body;

            // Check if email already exists
            const existingUser = await User.findOne({ Email });
            if (existingUser) {
                return res.status(400).json({ success: false, message: "Email already registered" });
            }

            // Hash password before saving
            const hashedPassword = await bcrypt.hash(Password, 10);

            const newUser = new User({
                FirstName,
                LastName,
                Age,
                Email,
                Password: hashedPassword,
                ContactNumber
            });

            await newUser.save();
            console.log("✓ Successfully added user: ", newUser);
            res.status(201).json({ success: true, message: "User registered successfully" });
        } catch (err) {
            console.log("x Error adding user: ", err);
            res.status(500).json({ success: false, error: err.message });
        }
    }

    // Retrieve Users
    async getUsers(req, res) {
        try {
            const users = await User.find().select("-Password"); // Exclude password field
            console.log("✓ Successfully retrieved users: ", users);
            res.json(users);
        } catch (err) {
            console.log("x Error retrieving users: ", err);
            res.status(500).json({ success: false, error: err.message });
        }
    }

    // Update User
    async updateUser(req, res) {
        const { id } = req.params;
        const { FirstName, LastName, Age, Email, ContactNumber } = req.body;

        try {
            let user = await User.findById(id);
            if (!user) return res.status(404).json({ message: "User not found" });

            // Update user fields
            user.FirstName = FirstName;
            user.LastName = LastName;
            user.Age = Age;
            user.Email = Email;
            user.ContactNumber = ContactNumber;

            await user.save();
            console.log("✓ Successfully updated user: ", user);
            res.json({ success: true });
        } catch (err) {
            console.log("x Error updating user: ", err);
            res.status(500).json({ success: false, error: err.message });
        }
    }

    // Delete User
    async deleteUser(req, res) {
        const { id } = req.params;

        try {
            const user = await User.findByIdAndDelete(id);
            if (!user) return res.status(404).json({ message: "User not found" });

            console.log("✓ Successfully deleted user: ", user);
            res.json({ success: true });
        } catch (err) {
            console.log("x Error deleting user: ", err);
            res.status(500).json({ success: false, error: err.message });
        }
    }

    // User Login
    async loginUser(req, res) {
        const { Email, Password } = req.body;

        try {
            const user = await User.findOne({ Email });
            if (!user) return res.status(400).json({ success: false, message: "Invalid credentials" });

            const isMatch = await bcrypt.compare(Password, user.Password);
            if (!isMatch) return res.status(400).json({ success: false, message: "Invalid credentials" });

            // Generate JWT token
            const token = jwt.sign({ id: user._id }, "your_jwt_secret", { expiresIn: "1h" });

            console.log("✓ User logged in successfully: ", user);
            res.json({ success: true, token, user });
        } catch (err) {
            console.log("x Error logging in user: ", err);
            res.status(500).json({ success: false, error: err.message });
        }
    }
}

module.exports = new UserController();
