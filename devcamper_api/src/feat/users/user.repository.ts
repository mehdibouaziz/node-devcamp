import User, {type IUserDocument} from "./user.model.ts";
import bcrypt from "bcryptjs";
import {Types} from "mongoose";
import type {ParsedQs} from "qs";
import complexQuery from "../../utils/complexQuery.ts";


const getUsers = async (reqQuery: ParsedQs) => {
    return await complexQuery(reqQuery, User);
}

const getUser = async (id?: string | string[]) => {
    return User.findById(id)
    // todo add populate?
}

const getOneUserByFields = async (userFields: Partial<IUserDocument>) => {
    return User.findOne({...userFields});
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

const updateUser = async (id: Types.ObjectId, body: Partial<IUserDocument>) => {
    const {name, email} = body;

    return User.findByIdAndUpdate(id, {
        name,
        email,
    }, {
        new: true,
        runValidators: true
    });
}

const resetPassword = async (id: Types.ObjectId, password: string) => {
    const hashedPassword = password ? await bcrypt.hash(password, 10) : null;

    return User.findByIdAndUpdate(id, {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpire: null,
    }, {
        new: true,
        runValidators: true
    });
}

const deleteUser = async (id: Types.ObjectId) => {
    const user = User.find(id);
    if (!user) {
        return;
    }
    user.deleteOne();
}

export default {
    getUsers,
    getUser,
    getOneUserByFields,
    getUserByEmail,
    createUser,
    createUsers,
    updateUser,
    resetPassword,
    deleteUser,
}