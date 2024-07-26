
import bcrypt from "bcryptjs"
import User from "../models/user.models.js"
// register user 
const registeruser = async function (req, res) {
    try {
        const { fullname, email, phone, password, role } = req.body //user details.
        if (!fullname && !email && !phone && !password && !role) {
            console.log("Please provide complete inforamtion in the given filed.");
            return res.status(400).json({
                message: "Something is missing in user register",
                status: 400,
                success: false
            })
        };

        //email check
        const emailExist = await User.findOne(email);
        if (emailExist) {
            return res.status(400).json({
                message: "Email already exist.",
                status: 400,
                success: false
            })
        }

        //password hash
        const passwordBcrypt = await bcrypt.hash(password, 10);

        //User register in database
        await User.create({
            fullname,
            email,
            phone,
            password: passwordBcrypt,
            role
        })
    } catch (error) {
        console.log("Register Fail!!!", error);
        res.status(400).json({
            message: "User register Fail",
            status: 400,
            success: false
        })
    }
}


//LoginUser
const userLogin = async function (req, res) {
    try {
        const { email, password, role } = req.body;
        if (!email && !password || !role) {
            console.log("Field Are required");
            return res.status(400).json({
                message: "Login fail",
                success: false
            })
        }

        //email check
        const emailCheck = await User.findOne(email);
        if (!emailCheck) {
            console.log("email does not exist");
            return res.status(400).json({
                message: "email does not exist",
                success: false
            })
        }

        //password check
        const passwordCheck = await bcrypt.compare(password, User.password);
        if (!passwordCheck) {
            return req.status(400).json({
                message: "password is incorrect",
                success: false
            })
        }
    } catch (error) {
        console.log("Login Fail due to error", error);
    }
}

export { registeruser }