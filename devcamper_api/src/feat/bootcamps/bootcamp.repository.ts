import type {ParsedQs} from "qs";
import Bootcamp, {type IBootcamp} from "./bootcamp.model.ts";
import log from "../../utils/niceConsole.ts";
import Course from "../courses/course.model.ts";
import slugify from "slugify";
import geocoder from "../../middleware/geocoder.ts";
import type {UploadedFile} from "express-fileupload";
import {Types} from "mongoose";
import * as path from "node:path";
import type {NextFunction} from "express";
import ErrorResponse from "../../utils/errorResponse.ts";
import complexQuery from "../../utils/complexQuery.ts";


const fetchBootcamps = async (reqQuery: ParsedQs) => {
    return await complexQuery(reqQuery, Bootcamp, {
        path: 'courses',
        select: 'name description'
    });
};

const fetchBootcamp = async (id?: string|string[]) => {
    return Bootcamp.findById(id).populate({
        path: 'courses',
        select: 'name description'
    });
}

const getBootcampByUser = async (userId: Types.ObjectId) => {
    return Bootcamp.find({
        user: userId,
    })
}

const createBootcamp = async (body: IBootcamp) => {
    const data = {
        ...body,
        slug: slugify(body.name, {lower: true}),
        location: await geocoder(body.address),
    };
    const bootcamp = new Bootcamp(data);
    return bootcamp.save();
}

const createBootcamps = async (bootcamps: IBootcamp[]) => {
    for (const bootcamp of bootcamps) {
        await createBootcamp(bootcamp);
    }
}

const updateBootcamp = async (data: IBootcamp, id?: string|string[]) => {
    return Bootcamp.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true
    });
}

const deleteBootcamp = async (id: string) => {
    const bootcamp = await Bootcamp.findById(id);
    if (!bootcamp) {
        return;
    }
    log.warning(`Courses attached to bootcamp ${bootcamp.id} deleted`)
    await Course.deleteMany({
        bootcamp: bootcamp.id,
    })
    await bootcamp.deleteOne();
}

const fetchBootcampsByRadius = async (reqQuery: ParsedQs) => {
    const longitude: number = reqQuery.lon ? +reqQuery.lon : 0;
    const latitude: number = reqQuery.lat ? +reqQuery.lat : 0;
    const distance: number = reqQuery.dist ? +reqQuery.dist : 0;
    const unit: string = reqQuery.unit === 'mi' ? 'mi' : 'km';

    // Calc radius
    const earthRadius: number = unit === 'mi' ? 3963 : 6378;
    const radius: number = distance / earthRadius;

    return Bootcamp.find({
        location: {$geoWithin: {$centerSphere: [[longitude, latitude], radius]}}
    });
}

const uploadPhoto = async (bootcampId: Types.ObjectId, file: UploadedFile, next: NextFunction) => {
    // create custom file name
    file.name = `bootcamp_img_${bootcampId}_${path.parse(file.name).ext}`;

    return file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
        if (err) {
            return next(new ErrorResponse(`Issue with file upload`, 500));
        }

        await Bootcamp.findByIdAndUpdate(bootcampId, {
            photo: file.name,
        }, {
            new: true,
            runValidators: true
        });
        return true;
    });
}

export default {
    fetchBootcamps,
    fetchBootcamp,
    getBootcampByUser,
    createBootcamp,
    createBootcamps,
    updateBootcamp,
    deleteBootcamp,
    fetchBootcampsByRadius,
    uploadPhoto,
};