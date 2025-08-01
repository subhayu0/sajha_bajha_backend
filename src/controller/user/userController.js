import { User } from '../../models/index.js'
import { CartItem } from '../../models/user/CartItem.js'
import { Product } from '../../models/Product.js'


/**
 *  fetch all users
 */
const getAll = async (req, res) => {
    try {
        //fetching all the data from users table
        const users = await User.findAll();
        res.status(200).send({ data: users, message: "successfully fetched data" })
    } catch (e) {
        res.status(500).json({ error: 'Failed to fetch users' });
    }
}

/** 
 *  create new user
*/

const create = async (req, res) => {

    try {
        const body = req.body
        console.log(req.body)
        //validation
        if (!body?.email || !body?.name || !body?.password)
            return res.status(500).send({ message: "Invalid paylod" });
        const users = await User.create({
            name: body.name,
            email: body.email,
            password: body.password
        });
        res.status(201).send({ data: users, message: "successfully created user" })
    } catch (e) {
        console.log(e)
        res.status(500).json({ error: 'Failed to fetch users' });
    }
}

/**
 *  update existing user
 */

const update = async (req, res) => {

    try {
        const { id = null } = req.params;
        const body = req.body;
        console.log(req.params)
        //checking if user exist or not
        const oldUser = await User.findOne({ where: { id } })
        if (!oldUser) {
            return res.status(500).send({ message: "User not found" });
        }
        oldUser.name = body.name;
        oldUser.password = body.password || oldUser.password;
        oldUser.email = body.email
        oldUser.save();
        res.status(201).send({ data: oldUser, message: "user updated successfully" })
    } catch (e) {
        console.log(e)
        res.status(500).json({ error: 'Failed to update users' });
    }
}

/**
 *  delete user 
 */
const delelteById = async (req, res) => {

    try {
        const { id = null } = req.params;
        const oldUser = await User.findOne({ where: { id } })

        //checking if user exist or not
        if (!oldUser) {
            return res.status(500).send({ message: "User not found" });
        }
        oldUser.destroy();
        res.status(201).send({ message: "user deleted successfully" })
    } catch (e) {
        res.status(500).json({ error: 'Failed to fetch users' });
    }
}

/**
 *  fetch user by id
 */
const getById = async (req, res) => {

    try {
        const { id = null } = req.params;
        const user = await User.findOne({ where: { id } })
        if (!user) {
            return res.status(500).send({ message: "User not found" });
        }
        res.status(201).send({ message: "user fetched successfully", data: user })
    } catch (e) {
        res.status(500).json({ error: 'Failed to fetch users' });
    }
}

/**
 * Add product to user's cart or update quantity if already present
 */
const addToCart = async (req, res) => {
    try {
        const userId = req.params.id;
        const { productId, quantity } = req.body;

        if (!productId || !quantity) {
            return res.status(400).send({ message: "Product ID and quantity are required" });
        }

        // Check if product exists
        const product = await Product.findOne({ where: { id: productId } });
        if (!product) {
            return res.status(404).send({ message: "Product not found" });
        }

        // Check if cart item already exists for user and product
        let cartItem = await CartItem.findOne({ where: { userId, productId } });

        if (cartItem) {
            // Update quantity
            cartItem.quantity += quantity;
            await cartItem.save();
        } else {
            // Create new cart item
            cartItem = await CartItem.create({ userId, productId, quantity });
        }

        res.status(200).send({ message: "Product added to cart", data: cartItem });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Failed to add product to cart" });
    }
};

/**
 * Get all products in user's cart with quantities
 */
const getCart = async (req, res) => {
    try {
        const userId = req.params.id;
        const cartItems = await CartItem.findAll({
            where: { userId },
            include: [{ model: Product }],
        });
        res.status(200).send({ message: "Cart fetched successfully", data: cartItems });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Failed to fetch cart" });
    }
};

/**
 * Remove product from user's cart
 */
const removeFromCart = async (req, res) => {
    try {
        const userId = req.params.id;
        const productId = req.params.productId;

        const cartItem = await CartItem.findOne({ where: { userId, productId } });
        if (!cartItem) {
            return res.status(404).send({ message: "Cart item not found" });
        }

        await cartItem.destroy();
        res.status(200).send({ message: "Product removed from cart" });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Failed to remove product from cart" });
    }
};

/**
 * Update quantity of product in user's cart
 */
const updateCartQuantity = async (req, res) => {
    try {
        const userId = req.params.id;
        const productId = req.params.productId;
        const { quantity } = req.body;

        if (!quantity || quantity < 1) {
            return res.status(400).send({ message: "Quantity must be at least 1" });
        }

        const cartItem = await CartItem.findOne({ where: { userId, productId } });
        if (!cartItem) {
            return res.status(404).send({ message: "Cart item not found" });
        }

        cartItem.quantity = quantity;
        await cartItem.save();

        res.status(200).send({ message: "Cart quantity updated", data: cartItem });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Failed to update cart quantity" });
    }
};

/**
 * Update current user's profile
 */
const updateProfile = async (req, res) => {
    try {
        console.log("updateProfile called");
        console.log("Request body:", req.body);
        console.log("Request user:", req.user);
        
        // Get user ID from the authenticated token
        const userId = req.user?.user?.id;
        console.log("User ID:", userId);
        
        if (!userId) {
            console.log("User not authenticated");
            return res.status(401).send({ message: "Not authenticated" });
        }

        const { firstName, lastName, currentPassword, newPassword } = req.body;
        
        // Fetch the current user
        console.log("Fetching user with ID:", userId);
        const user = await User.findOne({ where: { id: userId } });
        console.log("User found:", user);
        
        if (!user) {
            console.log("User not found in database");
            return res.status(404).send({ message: "User not found" });
        }

        // If password change is requested, verify current password
        if (newPassword || currentPassword) {
            console.log("Password change requested");
            // Both currentPassword and newPassword must be provided
            if (!currentPassword) {
                console.log("Current password is missing");
                return res.status(400).send({ message: "Current password is required to change password" });
            }
            
            if (!newPassword) {
                console.log("New password is missing");
                return res.status(400).send({ message: "New password is required" });
            }
            
            // Verify current password
            console.log("Verifying current password");
            if (user.password !== currentPassword) {
                console.log("Current password is incorrect");
                return res.status(401).send({ message: "Current password is incorrect" });
            }
            
            // Update password
            console.log("Updating password");
            user.password = newPassword;
        }

        // Update name by combining first and last name
        if (firstName || lastName) {
            console.log("Updating name");
            user.name = `${firstName || ''} ${lastName || ''}`.trim();
        }

        // Save the updated user
        console.log("Saving user");
        await user.save();
        console.log("User saved successfully");

        // Return updated user data (excluding password)
        console.log("Preparing response");
        const userData = user.toJSON();
        delete userData.password;

        res.status(200).send({ 
            data: userData, 
            message: "Profile updated successfully" 
        });
    } catch (e) {
        console.error("Update Profile Error:", e);
        console.error("Error stack:", e.stack);
        res.status(500).send({ error: "Failed to update profile" });
    }
};

export const userController = {
    getAll,
    create,
    getById,
    delelteById,
    update,
    addToCart,
    getCart,
    removeFromCart,
    updateCartQuantity,
    updateProfile
}