const jwt = require('express-jwt');
const { secret } = require('../config');
const db = require('../_helpers/db');

module.exports = authorize;

function authorize() {
    return [
        // authenticate JWT token and attach decoded token to request as req.user
        jwt({ secret, algorithms: ['HS256'] }),

        // attach full user record to request object
        async (req, res, next) => {
            // check if Authorization header uses Bearer token
            if (!req.headers.authorization || req.headers.authorization.split(' ')[0] !== 'Bearer') {
                return res.status(401).json({ message: 'Unauthorized Bearer token' });
            }

            // get user with id from token 'sub' (subject) property
            const user = await db.User.findByPk(req.user.sub);

            console.log(user);
            // check user still exists
            if (!user) {
                return res.status(401).json({ message: 'Unauthorized' });
            }

            // authorization successful
            req.user = user.get();
            next();
        }
    ];
}
