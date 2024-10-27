const jwt =require("jsonwebtoken");
const User = require("../models/User");
const authenticateToken = (req, res, next) => {
  const authHeader = req.header("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: "Token is not valid" });
  }
};

const verifyJWT = async(req, res, next)=>{
   try {
      // console.log("req.cookies.accessToken  : ", req.cookies.accessToken)
    const token=  await req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer", "")
    console.log("token", token);
    
    if(!token){
      return res.status(401).json({ message: "unauthorized request" });
     
    }
 
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
 
    const user =await User.findById(decodedToken?._id).select("-password -refreshToken")
 
    if(!user){
     return res.status(401).json({ message: "invalid access token" });
     
    }
    
     req.user =user;
 
    next();
   } catch (error) {
    console.error("invalid access token:", error);
    return { success: false, message: "invalid access token" };
   }
}

module.exports= verifyJWT;