const {validateToken} = require('../services/authontication');

function checkForAuthenticationCookie(cookieName) {
    return (req, res, next) => {
        const tokenCookieValue = req.cookies[cookieName];
        if (!tokenCookieValue) {
            return next(); // Return here to prevent further execution
        }

        try {
            const userPayload = validateToken(tokenCookieValue);
            req.user = userPayload;
            return next(); // Return here to continue with the next middleware
        } catch (error) {
            // Handle the error here if needed
            return next(error); // Pass the error to the error-handling middleware
        }
    };
}


module.exports = {
    checkForAuthenticationCookie,
}