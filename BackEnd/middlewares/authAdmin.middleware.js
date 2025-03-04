import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { Admin } from "../Models/admin.model.js";

export const verifyAdminJWT = asyncHandler(async (req,res,next) => {
    try {
      const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
  
      if(!token){
          return new ApiError(401, "Unauthorized request")
      }
  
      const decodedTokenInfo = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
      const user = await Admin.findById(decodedTokenInfo?._id)
      .select("-refreshToken -password")
  
      if(!user){
          //discuss about frontend
          throw new ApiError(401, "Invalid access token")
      }
  
      req.user = user
      next()
    } catch (error) {
     throw new ApiError(401, error?.message || "Invalid access token")
    }
     
 
 }) 