// const jwt = require('jsonwebtoken');
// const user = require('../model/UserData'); 

exports.ensureAuthenticated = async (req, res, next) => {
  try {
    // Extract the token from the Authorization header (Bearer <token>)
    let token = req.headers.authorization;

    // Log the headers and token for debugging purposes
    console.log("req.headers:", req.headers);
    console.log("token:", token);

    // Check if token is present
    if (!token) {
      return res.status(401).json({ error: "User not logged in" });
    }

    // Split the token to extract the Bearer part
    token = token.split(" ")[1];

    // If the token is not present after splitting
    if (!token) {
      return res.status(401).json({ error: "User not logged in" });
    }

    // Verify the JWT token
    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        console.error("JWT verification error:", err);
        return res.status(403).json({ message: "Invalid access token" });
      }

      // If the token is valid, fetch the user details from the database
      try {
        const userDetail = await user.findOne({ _id: decoded?.data });

        // If user is not found in the database
        if (!userDetail) {
          return res.status(404).json({ message: "User details not found", data: {} });
        }

        // Attach the user information to the request object for further use in subsequent middleware/routes
        req.user = userDetail;

        // User found, proceed to the next middleware
        return next();
      } catch (dbError) {
        console.error("Database error:", dbError);
        return res.status(500).json({ message: "Database error", error: dbError.message });
      }
    });
  } catch (error) {
    console.error("Error in authentication middleware:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};
