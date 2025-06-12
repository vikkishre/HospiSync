const jwt=require('jsonwebtoken')
require('dotenv').config()

const verifyToken=(req,res,next)=>{
    const authHeader=req.headers.authorization;
    if(!authHeader)
           return  res.status(401).json({message: 'Missing Authorization Header'})

    const token=authHeader.split(' ')[1]
    if (!token) return res.status(402).json({ message: 'Token missing' });

    try{
        const decoded = jwt.verify(token,process.env.JWT_SECRET)
        req.user=decoded
        next()
    }catch(e)
    {
        return res(400).status.json({message: 'Invalid Token'})
    }

}
const restrictroles=(...roles)=>(req,res,next)=>{
    if(!roles.includes(req.user.role))
        return res.status(403).json({message:"Access Denied"})
    next();
}

module.exports={verifyToken,restrictroles}