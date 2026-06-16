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


const fetchBootcamps = async (reqQuery: ParsedQs) => {

    // fields to exclude
    const excludedKeys = ['select', 'sort', 'limit', 'page'];
    const filteredQuery = {...reqQuery};
    excludedKeys.forEach((key) => delete filteredQuery[key]);

    // Format operators
    const queryStr = JSON.stringify(filteredQuery).replace(/\b(gt|gte|lt|lte|in)\b/g, (match) => `$${match}`);

    // Final query
    const query = Bootcamp.find(JSON.parse(queryStr));

    // SELECT
    if (reqQuery.select && typeof reqQuery.select === 'string') {
        const selectKeys = reqQuery.select.split(',').join(' ');
        query.select(selectKeys);
    }

    // SORT
    if (reqQuery.sort && typeof reqQuery.sort === 'string') {
        const sortFields = reqQuery.sort.split(',').join(' ');
        log.text(reqQuery.sort)
        query.sort(sortFields);
    } else {
        query.sort('-createdAt')
    }


    // PAGINATION
    const page = (reqQuery.page && typeof reqQuery.page === 'string') ? parseInt(reqQuery.page, 10) : 1;
    const limit = (reqQuery.limit && typeof reqQuery.limit === 'string') ? parseInt(reqQuery.limit, 10) : 25;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Bootcamp.countDocuments();
    const pagination = {
        ...(endIndex < total ? {next: {page: page + 1, limit}} : {}),
        ...(startIndex > 0 ? {prev: {page: page - 1, limit}} : {}),
    }

    query.skip(startIndex).limit(limit);

    // POPULATE
    query.populate({
        path: 'courses',
        select: 'name description'
    });

    const bootcamps = await query;

    return {
        bootcamps,
        pagination
    };
};

const fetchBootcamp = async (id?: string|string[]) => {
    return Bootcamp.findById(id).populate({
        path: 'courses',
        select: 'name description'
    });
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
    createBootcamp,
    updateBootcamp,
    deleteBootcamp,
    fetchBootcampsByRadius,
    uploadPhoto,
};