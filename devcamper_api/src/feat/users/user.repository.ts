import User, {type IUser} from "./user.model.ts";
import bcrypt from "bcryptjs";
import {Types} from "mongoose";

const createUser = async (body: IUser) => {
    const {password, ...rest} = body;
    const hashedPassword = password ? await bcrypt.hash(password, 10) : null;

    const user = new User({
        ...rest,
        password: hashedPassword,
    });
    await user.save();

    // avoid returning restricted fields (eg password)
    return User.find(user._id);
}

const createUsers = async (users: IUser[]) => {
    for (const user of users) {
        await createUser(user);
    }
}

const deleteUser = async (id: Types.ObjectId) => {
    const user = User.find(id);
    if (!user) {
        return;
    }
    user.deleteOne();
}

export default {
    createUser,
    createUsers,
    deleteUser,
}