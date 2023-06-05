import Users from "../Models/signUpModel.js"
import bcrypt  from "bcrypt"
import jwt from "jsonwebtoken"



const secretKey='@@key'//This is my secret key

const SignUpController=async(req,res)=>{
    try{ 
        const data=req.body
        if (data.length === 0) {
            return res.status(400).json({ message: "Empty data" });
          }
        const salt= await bcrypt.genSalt(8);
        const hashedPassword= await bcrypt.hash(data.Password, salt);
        data.Password=hashedPassword

        const existinguser= await Users.findOne({Email: data.Email})
        if(existinguser){
            res.status(200).json({
                message:"email already in use"
            })
            
        }
        else{
            let userInfo=new Users({
                Firstname:data.Firstname,
                Lastname:data.Lastname,
                Email:data.Email,
                Username: data.Username,
                Password: data.Password
           })
          
           const savedData = await userInfo.save();
           if(savedData.length==0){
            res.send("empty data")
           }
           const token=jwt.sign({userId:savedData._id},secretKey)
            res.json({
                message:"account successfully  created",
                token:token
            })
        



        }
        
        }
        catch(err){
            console.log("some error:",err)
            res.send("some error occured")
        }
    
        
}
const Login=async(req,res)=>{
    try{ 
        const data=req.body
        const existingUserEmail=await Users.findOne({Email: data.Email})
       
        if(existingUserEmail ){
            const existingUserEmailPassword= await bcrypt.compare(data.Password,existingUserEmail.Password)

            if(existingUserEmailPassword){
                const token=jwt.sign({userId:existingUserEmail._id},secretKey)

                res.status(200).json({
                    message:"Login succesful",
                    token:token
                   })
            }else{
                res.status(200).json({
                    message:"your password is incorrect"
                })
            }
            
          
        }
        else{
           
            res.send("Create your account ,or check your credentials")
        



        }
        
        }
        catch(err){
            console.log("some error:",err)
            res.send("some error occured")
        }
    
        
}

export {SignUpController,Login};