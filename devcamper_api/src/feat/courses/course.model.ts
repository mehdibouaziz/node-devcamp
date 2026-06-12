import {model, Schema, Types} from 'mongoose';


interface ICourse {
    title: string;
    description: string;
    weeks: number;
    tuition: number;
    minimumSkill: string;
    scholarshipsAvailable: boolean;
    createdAt?: string;
    bootcamp: Types.ObjectId;
    // user: Types.ObjectId;
}

const courseSchema = new Schema<ICourse>({
    title: {
        type: String,
        trim: true,
        required: [true, 'Please add a course title']
    },
    description: {
        type: String,
        required: [true, 'Please add a description']
    },
    weeks: {
        type: Number,
        required: [true, 'Please add number of weeks']
    },
    tuition: {
        type: Number,
        required: [true, 'Please add a tuition cost']
    },
    minimumSkill: {
        type: String,
        required: [true, 'Please add a minimum skill'],
        enum: ['beginner', 'intermediate', 'advanced']
    },
    scholarshipsAvailable: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    bootcamp: {
        type: Schema.Types.ObjectId,
        ref: 'Bootcamp',
        required: true
    },
    // user: {
    //     type: Schema.Types.ObjectId,
    //     ref: 'User',
    //     required: true
    // }
})

const Course = model<ICourse>('Course', courseSchema);

export default Course;