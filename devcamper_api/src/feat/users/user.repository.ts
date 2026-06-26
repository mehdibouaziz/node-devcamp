import User, {type IUserDocument} from "./user.model.ts";
import bcrypt from "bcryptjs";
import {Types} from "mongoose";
import type {ParsedQs} from "qs";
import complexQuery from "../../utils/complexQuery.ts";


const fetchUsers = async (reqQuery: ParsedQs) => {
    return await complexQuery(reqQuery, User);
}

const fetchUser = async (id?: string | string[]) => {
    return User.findById(id)
    // todo add populate?
}

const getUserByEmail = async (email: string, withPassword: boolean = false) => {
    const query = User.findOne({
        email
    });
    if(withPassword){
        query.select("+password");
    }

    return query;
}

const createUser = async (body: IUserDocument) => {
    const {password, ...rest} = body;
    const hashedPassword = password ? await bcrypt.hash(password, 10) : null;

    const user = new User({
        ...rest,
        password: hashedPassword,
    });
    await user.save();

    // avoid returning restricted fields (eg password)
    return User.findOne(user._id);
}

const createUsers = async (users: IUserDocument[]) => {
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
    fetchUsers,
    fetchUser,
    getUserByEmail,
    createUser,
    createUsers,
    deleteUser,
}