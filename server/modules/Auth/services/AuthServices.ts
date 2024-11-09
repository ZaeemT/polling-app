import { LoginDto, RegisterDto } from "../dto";
import { db } from "../../../DB";
import { Utils } from "../../../utils/utils";
import { IUser } from "../../User/model/IUser";
// import validator from "validator";

class AuthService {
    login = async (loginDto: LoginDto) => {
        const { email, password } = loginDto;

        const user = await db.users.findOne({ email });
        if (!user) {
            return Utils.getResponse("User not found", 404);
        }

        if (!(await Utils.verifyPassword(password, user.password))) {
            return Utils.getResponse("Invalid credentials", 400);
        }

        const token = Utils.generateToken({ userId: user._id });

        const response = { user: user, token };

        return Utils.getResponse("Login successful", 200, response);
    }

    register = async (registerDto: RegisterDto) => {
        const { username, email, password } = registerDto;

        // if (!validator.isStrongPassword(password)) {
        //     return Utils.getResponse("Password not strong enough", 422);
        // }

        const exists = await db.users.findOne({ email });
        if (exists) {
            return Utils.getResponse("Email already exists", 200);
        }

        const hashedPassword = await Utils.hashPassword(password);
        const newUser: IUser = {
            username,
            email,
            password: hashedPassword,
            createdAt: new Date
        }
        const user = db.users.insertOne(newUser);
        
        if ((await user).acknowledged) {
            const token = Utils.generateToken({ userId: (await user).insertedId });
            const response = { user: newUser, token }
            return Utils.getResponse("Registration successful", 201, response); 
        } else {
            return Utils.getResponse("Registration failed", 500);
        }
    }
}

const authService = new AuthService();

export { authService };