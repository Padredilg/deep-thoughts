const jwt = require('jsonwebtoken');

const secret = 'mysecretsshhhhh';
const expiration = '2h';

module.exports = {
    signToken: function({ username, email, _id }) {
        const payload = { username, email, _id };
        return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
    },
    authMiddleware: function({req}){
        let token = req.body.token || req.query.token || req.headers.authorization;
        if(req.headers.authorization){
            //split 'bearer' from token and get only the last element, trim it if spaces.
            token = token.split(' ').pop().trim();
        }
        if(!token){
            return req;
        }
        try{
            //secret with verify needs to match the one used when token was signed
            const { data } = jwt.verify(token, secret, {maxAge: expiration});
            req.user = data;
        }
        catch{
            console.log('Invalid token');
        }
        return req;
    }
}