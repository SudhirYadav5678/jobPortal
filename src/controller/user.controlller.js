
import bcrypt from "bcryptjs"
import { User } from "../models/user.models.js"
import jwt from "jsonwebtoken"
// register user 
const registeruser = async function (req, res) {
    try {
        const { fullname, email, phone, password, role } = req.body //user details.
        if (!fullname || !email || !phone || !password || !role) {
            console.log("Please provide complete inforamtion in the given filed.");
            return res.status(400).json({
                message: "Something is missing in user register",
                status: 400,
                success: false
            })
        };

        //email check
        const user = await User.findOne({ email });
        if (user) {
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
        return res.status(200).json({
            message: "User register successfully",
            success: true
        })
    } catch (error) {
        console.log("Register Fail!!!", error);
        // res.status(400).json({
        //     message: "User register Fail",
        //     status: 400,
        //     success: false
        // })
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
        let user = await User.findOne(email);
        if (!user) {
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

        //jsonwebtoken


        const tokenData = {
            userId: user._id
        }
        const token = jwt.sign(tokenData, process.env.SECRET_KEY, { expireIn: "2d" })

        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phone,
            role: user.role,
            profile: user.profile
        }

        //cookie
        res.status(200).cookie("token", token, { maxAge: 1 * 24 * 60 * 60 * 1000, httpOnly: true, sameSite: 'strict' }.json({
            message: `Welcone ${User.fullname}`,
            user,
            success: true
        }))
    } catch (error) {
        console.log("Login Fail due to error", error);
    }



}

//logout 
const userlogout = async (req, res) => {
    try {
        return res.status(200).cookie("token", "", { maxAge: 0 }).json({  //token use for the logout.
            message: "Logged out successfully.",
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}


//update user
const updateProfile = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, bio, skills } = req.body;

        const file = req.file;
        // cloudinary uri data
        const fileUri = getDataUri(file);
        const cloudResponse = await cloudinary.uploader.upload(fileUri.content);



        let skillsArray;
        if (skills) {
            skillsArray = skills.split(",");
        }
        const userId = req.id; // middleware authentication
        let user = await User.findById(userId);

        if (!user) {
            return res.status(400).json({
                message: "User not found.",
                success: false
            })
        }
        // updating data
        if (fullname) user.fullname = fullname
        if (email) user.email = email
        if (phoneNumber) user.phoneNumber = phoneNumber
        if (bio) user.profile.bio = bio
        if (skills) user.profile.skills = skillsArray

        // resume comes later here...
        if (cloudResponse) {
            user.profile.resume = cloudResponse.secure_url // save the cloudinary url
            user.profile.resumeOriginalName = file.originalname // Save the original file name
        }


        await user.save();

        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        }

        return res.status(200).json({
            message: "Profile updated successfully.",
            user,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}
export { registeruser, userLogin, userlogout, updateProfile }