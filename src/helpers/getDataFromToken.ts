import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export const getDataFromToken = (request: NextRequest) => {
    try {
        // 1. Retrieve the token from the cookies
        // Make sure the cookie name matches what you set during login (usually "token")
        const token = request.cookies.get("token")?.value || '';

        if (!token) {
            throw new Error("No token found");
        }

        // 2. Verify the token using your secret key
        // Ensure process.env.TOKEN_SECRET is defined in your .env file
        const decodedToken: any = jwt.verify(token, process.env.TOKEN_SECRET!);

        // 3. Return the user ID from the payload
        // Note: Check your Login API to see if you saved it as 'id' or '_id'
        return decodedToken.id; 

    } catch (error: any) {
        throw new Error(error.message);
    }
}