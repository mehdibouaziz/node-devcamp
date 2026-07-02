import {Model, model, Schema, Types} from 'mongoose';


export interface IReviewDocument {
    title: string;
    text: string;
    rating: number;
    bootcamp: Types.ObjectId;
    user: Types.ObjectId;
    createdAt?: string;
}

export interface IReview extends IReviewDocument {
    // methods
}

export interface IReviewModel extends Model<IReview> {
    // statics
}

const ReviewSchema = new Schema({
    title: {
        type: String,
        trim: true,
        required: [true, 'Please add a title'],
        maxlength: 100,
    },
    text: {
        type: String,
        required: [true, 'Please add some text'],
    },
    rating: {
        type: Number,
        min: 1,
        max: 10,
        required: [true, 'Please add a rating between 1 and 10'],
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
})

// Limit to 1 review per user per bootcamp
ReviewSchema.index({bootcamp: 1, user: 1}, {unique: true});

const Review: IReviewModel = model<IReview, IReviewModel>('Review', ReviewSchema);

export default Review;