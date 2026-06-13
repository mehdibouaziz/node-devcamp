import {model, Schema} from 'mongoose';
import slugify from "slugify";
import geocoder from "../../middleware/geocoder.ts";
import Course from "../courses/course.model.ts";
import log from "../../utils/niceConsole.ts";

export type BootcampLocation = {
    type: 'Point',
    coordinates: number[],
    formattedAddress?: string,
    street?: string,
    city?: string,
    state?: string,
    zipcode?: string,
    country?: string
}

interface IBootcamp {
    name: string,
    slug?: string,
    description: string,
    website?: string,
    phone?: string,
    email?: string,
    address: string,
    location?: BootcampLocation,
    careers: string[],
    averageRating?: number,
    averageCost?: number,
    photo?: string,
    housing?: boolean,
    jobAssistance?: boolean,
    jobGuarantee?: boolean,
    acceptGi?: boolean,
    createdAt?: string,
    // user: ????
}

const bootcampSchema = new Schema<IBootcamp>({
        name: {
            type: String,
            required: [true, 'Please add a name'],
            unique: true,
            trim: true,
            maxlength: [50, "Name can't be more than 50 characters"]
        },
        slug: String,
        description: {
            type: String,
            required: [true, 'Please add a description'],
            maxlength: [500, "Description can't be more than 50 characters"]
        },
        website: {
            type: String,
            match: [
                /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
                'Please add a valid URL'
            ]
        },
        phone: {
            type: String,
            maxlength: [20, "Phone number can't be more than 20 characters"]
        },
        email: {
            type: String,
            match: [
                /^\S+@\S+\.\S+$/,
                'Please add a valid email'
            ]
        },
        address: {
            type: String,
            required: [true, 'Please add an address']
        },
        location: {
            // GeoJSON Point
            type: {
                type: String,
                enum: ['Point']
            },
            coordinates: {
                type: [Number],
                index: '2dsphere'
            },
            formattedAddress: String,
            street: String,
            city: String,
            state: String,
            zipcode: String,
            country: String
        },
        careers: {
            // Array of strings
            type: [String],
            required: true,
            enum: [
                'Web Development',
                'Mobile Development',
                'UI/UX',
                'Data Science',
                'Business',
                'Other'
            ]
        },
        averageRating: {
            type: Number,
            min: [1, 'Rating must be at least 1'],
            max: [10, 'Rating must can not be more than 10']
        },
        averageCost: Number,
        photo: {
            type: String,
            default: 'no-photo.jpg'
        },
        housing: {
            type: Boolean,
            default: false
        },
        jobAssistance: {
            type: Boolean,
            default: false
        },
        jobGuarantee: {
            type: Boolean,
            default: false
        },
        acceptGi: {
            type: Boolean,
            default: false
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
        // user: {
        //     type: mongoose.Schema.ObjectId,
        //     ref: 'User',
        //     required: true
        // }
    },
    {
        toJSON: {virtuals: true},
        toObject: {virtuals: true},
    });

// Create bootcamp slug from the name
bootcampSchema.pre('save', function () {
    this.slug = slugify(this.name, {lower: true});
});

// Geocoding
bootcampSchema.pre('save', async function () {
    this.location = await geocoder(this.address);
})

// cascading delete
bootcampSchema.pre('deleteOne',
    { document: true, query: false },  // this works for bootcamp.deleteOne, not for Bootcamp.findByIdAndDelete
    async function () {
    log.warning(`Courses attached to bootcamp ${this._id} deleted`)
    await Course.deleteMany({
        bootcamp: this._id,
    })
})

// populate courses
bootcampSchema.virtual('courses', {
    ref: 'Course',
    localField: '_id',
    foreignField: 'bootcamp',
    justOne: false
})

const Bootcamp = model<IBootcamp>('Bootcamp', bootcampSchema);

export default Bootcamp;
