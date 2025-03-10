import User from "../models/UserSchema.js";
import bcrypt from "bcryptjs";

export const SignupUser = async (req, res,) => {
    try{
        const {name, email, password} = req.body;

         console.log(name, email, password);

        if(!name || !email || !password){
            return res.status(400).json({
                success: false,
                message: "Please enter All Fields",
            }) 
        }

        let user = await User.findOne({email});

        if(user){
            return res.status(409).json({
                success: false,
                message: "User already Exists",
            });
        }

        //preparing encrypted for storing db
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        console.log(hashedPassword);
        let newUser = await User.create({
            name, 
            email, 
            password: hashedPassword, 
        });

        return res.status(200).json({
            success: true,
            message: "User Created Successfully",
            user: newUser
        });
    }
    catch(err){
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }

}
export const LoginUser = async (req, res) => {
    try{
        const { email, password } = req.body;

        console.log(email, password);
  
        if (!email || !password){
            return res.status(400).json({
                success: false,
                message: "Please enter All Fields",
            }); 
        }
    
        const user = await User.findOne({ email });
    
        if (!user){
            return res.status(401).json({
                success: false,
                message: "User not found",
            }); 
        }
    
        const isMatch = await bcrypt.compare(password, user.password);
    
        if (!isMatch){
            return res.status(401).json({
                success: false,
                message: "Incorrect Email or Password",
            }); 
        }

        delete user.password;

        return res.status(200).json({
            success: true,
            message: `Welcome back, ${user.name}`,
            user,
        });

    }
    catch(err){
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
}
