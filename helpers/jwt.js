const {expressjwt:expressjwt} = require('express-jwt');

// using jwt-token as a middelware to identify the reachable url without the authentication
function authJwt() {
    const secret = process.env.secret;
    const api = process.env.API_URL;
    return expressjwt({
        secret,
        algorithms: ['HS256'], // algo used by hash
        isRevoked: isRevoked
    }).unless({
        path: [
            // using regular expressions to allow api call without authentication
            {url: /\/public\/uploads(.*)/ , methods: ['GET', 'OPTIONS'] },  // open urls only GET
            {url: /\/e-shopping\/products(.*)/ , methods: ['GET', 'OPTIONS'] }, // open urls only GET
            {url: /\/e-shopping\/categories(.*)/ , methods: ['GET', 'OPTIONS'] }, // open urls only GET
            {url: /\/e-shopping\/orders(.*)/,methods: ['GET', 'OPTIONS', 'POST']},  // open urls only GET, POST
            `${api}/users/login`, // this will allow user to genreate auth-token for its validation  
            `${api}/users/register`, // this will allow user to register their credentials in db
        ]
    })
}

// payload -> inside token data 
// asuming only 2 rols admin, user 
// if admin then allowed access otherwise not 
async function isRevoked(req, token) {
    // is asses revoked or not 
    return !token.payload.isAdmin; 

}



module.exports = authJwt