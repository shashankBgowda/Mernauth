import bcrypt from "bcrypt";
import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
    const { name, email, password } = req.body;
    // Validate input
    if(!name || !email || !password) {
        return res.json({ success:false, statuscode:400, statmessage: "Please fill all the fields" });
    }
    try {
        // Check if user already exists
        const existingUser = await userModel.findOne({email});

        if(existingUser) {
            return res.json({ success: false, statuscode: 400, message: "User with this email already exists" });
        }           
        const hashedPassword = await bcrypt.hash(password, 10);
        const User = new userModel({name,email,password: hashedPassword});
        await User.save(); // Save user to database
        return res.json({ success: true, statuscode: 201, message: "User registered successfully" });

        const token = jwt.sign({ id: User._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.cookie("token", token, {httponly: true, 
                                    secure: process.env.NODE_ENV==='production', 
                                    sameSite: process.env.NODE_ENV==='production' ? 'none' : 'strict', 
                                    maxage: 24 * 60 * 60 * 1000 }); 
        return res.json({success: true}); // Return success response
        // Set cookie with token
        return res.json({ success: true, statuscode: 201, message: "User registered successfully", token });
    } catch (error) {
        return res.json({ success: false, statuscode: 500, message: "Internal server error" , message: error.message });
    } 
}

//controller function for user login
// This function handles user login by checking credentials and returning a JWT token if successful.
export const login = async (req, res) => {
    const { email, password } = req.body;
    // Validate input
    if(!email || !password) {
        return res.json({ success: false, statuscode: 400, message: "Please fill all the fields" });
    }
    try {
        // Check if user exists
        const user = await userModel.findOne({email});
        if(!user) {
            return res.json({ success: false, statuscode: 400, message: "User with this email does not exist" });
        }
        // Check passwords from request body and in database
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) {
            return res.json({ success: false, statuscode: 400, message: "Incorrect password" });
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });// Generate JWT token
        // Set cookie with token
        res.cookie("token", token, {httponly: true, 
                                    secure: process.env.NODE_ENV==='production', 
                                    sameSite: process.env.NODE_ENV==='production' ? 'none' : 'strict', 
                                    maxage: 24 * 60 * 60 * 1000 }); 
        // Set cookie with token
        return res.json({ success: true, statuscode: 200, message: "Login successful", token });
    } catch (error) {
        return res.json({ success: false, statuscode: 500, statmessage: "Internal server error", message: error.message });
    }
}

//controller function for user logout
// This function handles user logout by clearing the JWT token cookie.
export const logout = async (req, res) => {
    try{
        response.clearCookie("token", {httpOnly: true, 
                                       secure: process.env.NODE_ENV === 'production', 
                                       sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict'
                                    });
            return res.json({ success: true, statuscode: 200, message: "Logout successful" });
    }catch(error){
        return res.json({ success: false, statuscode: 500, message: "Internal server error", message: error.message });
    }
}