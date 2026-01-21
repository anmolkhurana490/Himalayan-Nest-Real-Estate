import { User } from '../config/db.js';
import bcrypt from 'bcrypt';
import { generateToken } from '../utils/jwtHandlers.js';

export const registerUser = async (req, res) => {
    const { firstName, lastName, email, phone, password, userType } = req.body;
    if (!firstName || !lastName || !email || !phone || !password || !userType) {
        return res.status(400).json({
            success: false,
            message: 'Please fill all the fields'
        });
    }

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User already exists with this email'
            });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = await User.create({
            name: `${firstName} ${lastName}`,
            email, phone,
            password: hashedPassword,
            role: userType
        });

        // Remove password from response
        const userResponse = {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            phone: newUser.phone,
            role: newUser.role,
            firstName,
            lastName
        };

        return res.status(201).json({
            success: true,
            message: 'User registered successfully',
            user: userResponse
        });
    } catch (error) {
        console.error('Error registering user:', error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

export const loginUser = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: 'Please provide email and password'
        });
    }

    try {
        // Find user by email
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'User not found'
            });
        }

        // Check password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Generate JWT token
        const token = generateToken({ id: user.id, email: user.email, role: user.role });

        // Remove password from response
        const userResponse = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            firstName: user.name.split(' ')[0],
            lastName: user.name.split(' ')[1] || ''
        };

        // Set cookie and return response
        res.cookie('access-token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        return res.status(200).json({
            success: true,
            message: 'Login successful',
            user: userResponse
        });
    } catch (error) {
        console.error('Error logging in user:', error.message);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

export const logoutUser = (req, res) => {
    try {
        // Clear the cookie
        res.clearCookie('access-token');
        return res.status(200).json({
            success: true,
            message: 'Logout successful'
        });
    } catch (error) {
        console.error('Error logging out user:', error.message);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

export const getCurrentUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Remove password from response
        const userResponse = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            firstName: user.name.split(' ')[0],
            lastName: user.name.split(' ')[1] || '',
            phone: user.phone,
            bio: user.bio,
            createdAt: user.createdAt,
        };

        return res.status(200).json({
            success: true,
            message: 'Profile fetched successfully',
            user: userResponse
        });
    } catch (error) {
        console.error('Error fetching current user:', error.message);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

export const updateUserProfile = async (req, res) => {
    const { name, phone, bio } = req.body;

    if (!name || !phone) {
        return res.status(400).json({
            success: false,
            message: 'Please provide all required fields'
        });
    }

    try {
        const user = await User.findByPk(req.user.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Update user details
        user.name = name;
        user.phone = phone;
        if (bio) user.bio = bio; // Bio is optional

        await user.save();

        // Remove password from response
        const userResponse = {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            firstName: user.name.split(' ')[0],
            lastName: user.name.split(' ')[1] || '',
            bio: user.bio,
            createdAt: user.createdAt,
        };

        return res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            user: userResponse
        });
    } catch (error) {
        console.error('Error updating profile:', error.message);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}