const JWT = require('jsonwebtoken');

const secret = "@super@alvi$@";

function createTokenForUser(user) {
    const payload = {
        _id: user._id,
        email: user.email,
        profileImageURL: user.profileImageURL,
        rol: user.rol,
        fullname: user.fullname,
    };

    const token = JWT.sign(payload, secret);
    return token;
}

function validateToken(token) {
    const payload = JWT.verify(token, secret);
    return payload;
}

module.exports = {
    createTokenForUser,
    validateToken,
}