import {Model, model, Schema, Types} from 'mongoose';
import Bootcamp from "../bootcamps/bootcamp.model.ts";


export interface ICourse {
    title: string;
    description: string;
    weeks: number;
    tuition: number;
    minimumSkill: string;
    scholarshipsAvailable: boolean;
    createdAt?: string;
    bootcamp: Types.ObjectId;
    user: Types.ObjectId;
}

export interface CourseModelType extends Model<ICourse> {
    getAverageCost(bootcampId: Types.ObjectId): Promise<void>;
}

const courseSchema = new Schema<ICourse, CourseModelType>({
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
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    statics: {
        async getAverageCost(bootcampId) {
            const aggregate = await this.aggregate([
                {
                    $match: {bootcamp: bootcampId},
                },
                {
                    $group: {
                        _id: '$bootcamp',
                        averageCost: {$avg: '$tuition'}
                    }
                }
            ]);
            const newAverageCost = aggregate[0]?.averageCost ?
                Math.ceil(aggregate[0]?.averageCost / 10) * 10
                : null;

            await Bootcamp.findByIdAndUpdate(bootcampId, {
                averageCost: newAverageCost,
            });
        }
    }
});

const Course = model<ICourse, CourseModelType>('Course', courseSchema);

export default Course;