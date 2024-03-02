const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
  // List of API endpoints that do not require token authentication
  const excludedEndpoints = [
    "/owner/registerOwner",
    "/owner/loginOwner",
    // Add more excluded endpoints as needed
  ];

  // Check if the current API endpoint is excluded from token authentication
  if (excludedEndpoints.includes(req.originalUrl)) {
    return next();
  }

  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).send({ message: 'no token provided' });
  }

  try {
    // Verify and decode the token
    const decoded = jwt.verify(token, 'my_secret_key');

    // Attach the user data to the request object
    req.user = decoded;
    console.log(req.user.email);

    next();
  } catch (error) {
    // Token verification failed or expired
    res.status(401).json({ message: 'Invalid token' });
  }
}

function generateAccessToken(email) {
  return jwt.sign({ email: email }, "my_secret_key", {
    expiresIn: "15 days",
  });
}

module.exports = {
  authenticateToken,
  generateAccessToken,
};


