import jwt from 'jsonwebtoken'

export const verifyToken = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        if(!token)
            return res.status(401).json({msg: "No token provided"});

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req._id = decoded.id;
        next();
    } catch(error){
        return res.status(401).json({msg: "Invalid token"});
    }
}