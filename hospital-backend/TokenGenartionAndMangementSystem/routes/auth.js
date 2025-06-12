const express=require('express')
const bcrypt = require('bcrypt')
const db =require('../../db/db')
const generateToken=require('../utils/token')
const {verifyToken,restrictroles}=require('../../middleware/auth')

const router=express.Router();

router.post('/admin/create-user',verifyToken,restrictroles('admin'),
async (req,res)=>{
    try{
        const {username,password,role}=req.body
        if(!username||!password||!role)
                return res.status(404).json({ message:'Missing fields'})
        const userExists= await db.query('SELECT * FROM users WHERE username=$1',[username])
        if(userExists.rows.length>0)
                return res.status(404).json({message: 'User already Exists'})
        const hashedPassword = await bcrypt.hash(password,10)

        const newUser=await db.query('INSERT INTO users(username,password,role) VALUES($1,$2,$3) RETURNING id,username,role',[username,hashedPassword,role])
        res.status(201).json({message:'User Created',user:newUser.rows[0]})
    }catch(e)
    {
        res.status(500).json({ message: 'Server error', error: e.message });
    }
}
)
router.post('/login',async (req,res)=>{
    const {username,password}=req.body
    if(!username||!password)
            return res.status(400).json({message:'Username and password required'})
   try{
    const userRes= await db.query('SELECT * FROM users WHERE username=$1',[username])
    const user=userRes.rows[0]
    if(!user)
        return res.status(400).json({message:'Invalid Credentials'})
    const validPassword=await bcrypt.compare(password,user.password);
    if(!validPassword)
            return res.status(400).json({message:'Invalid Credentials'})
    const token =generateToken({id:user.id,role:user.role})
    return res.status(201).json({message:'Login Succesfull',token,user:{id:user.id,username:user.username,role:user.role}})
   }catch(err)
   {
    return res.status(500).json({message:'Server error',error:err.message})
   }
})
module.exports=router