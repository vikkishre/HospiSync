const jwt=require("jsonwebtoken")
require('dotenv').config()

function generateTokens(user)
{
    return jwt.sign(
        {
            id:user.id,
            role:user.role
        },
        process.env.JWT_SECRET,
        {
            expiresIn:'8h'
        }
    )
}
module.exports=generateTokens;