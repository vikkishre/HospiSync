const express=require('express')
const db=require('../../db/db')


const router=express.Router()

router.get('/equipment',async (req,res)=>{
    try{
        const result=await db.query('SELECT * FROM equipment ORDER BY id ASC')
        res.json(result.rows)
    }catch(e)
    {
        console.log('Error Fetching Equipment')
        res.status.json({message:' Error Fetching Equipment',error:e.message})
    }
})

module.exports=router