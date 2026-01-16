import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import bcrypt from 'bcryptjs'

export const register = async (req, res) => {
    try {
        const {name, phone, email, password} = req.body;
        if(!email || !password)
            return res.status(400).json({msg: 'Email and password required'});

        const existing = await User.findOne({
            $or: [{email}, {phone}]
        });

        if(existing)
            return res.status(400).json({msg: 'User already registered'});

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const user = await User.create({
            name,
            email,
            phone,
            passwordHash: hash 
        });

        return res.status(201).json({msg: 'User registered ', user});

    } catch (error) {
        console.error(error);
        return res.status(500).json({msg: 'Server error'});
    }
}

export const login = async (req, res) => {
    try {
        const {email, password} = req.body;
        if(!email || !password)
            return res.status(400).json({msg: 'Email and password required'});

        const user = await User.findOne({email});
        if(!user)
            return res.status(404).json({msg: 'User not found'});

        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if(!isMatch)
            return res.status(401).json({msg: 'Invalid credentials'});

        const token = jwt.sign(
            {id: user._id, phone: user.phone},
            process.env.JWT_SECRET,
            {expiresIn: '7d'}
        );

        console.log('token ', token);
        console.log('hasCompletedOnbaording ', user.hasCompletedOnboarding);
        user.hasCompletedOnboarding = true;
        

        return res.json({
            msg: 'Login successful',
            token,
            user:{
                id: user._id,
                email: user.email,
                phone: user.phone,
                name: user.name,
                hasCompletedOnboarding: true
            }
        })

    } catch (error) {
        console.error(error);
        return res.status(500).json({msg: 'Server error'});
    }
}