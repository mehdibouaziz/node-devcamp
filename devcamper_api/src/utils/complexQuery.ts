import type {ParsedQs} from 'qs';
import type {Model} from "mongoose";
import log from "./niceConsole.ts";

type MongoOperator = {
    $lte?: number;
    $gte?: number;
    $lt?: number;
    $gt?: number;
};

type Filter = Record<string, string | number | MongoOperator>;

type PaginationObj = {
    page: number;
    limit: number;
    startIndex: number;
    next?: {page: number, limit: number};
}

type TQueryParser = (query: ParsedQs, model: Model<any>, pagination: PaginationObj) => Promise<Document[]>;


/**
 * Parse and execute complex mongo queries, incl. operators like $lte, sort, select, paginate, etc
 * @param query
 * @param model
 * @param pagination
 */
const complexQuery: TQueryParser = async (query, model, pagination) => {
    const reqQuery = {...query};

    // fields to exclude
    const excludedKeys = ['select', 'sort', 'limit', 'page'];
    excludedKeys.forEach((key) => delete reqQuery[key]);

    // Format operators
    const queryStr = JSON.stringify(reqQuery).replace(/\b(gt|gte|lt|lte|in)\b/g, (match) => `$${match}`);

    // Final query
    const complexQuery = model.find(JSON.parse(queryStr));

    // Select keys
    if(query.select && typeof query.select === 'string') {
        const selectKeys = query.select.split(',').join(' ');
        complexQuery.select(selectKeys);
    }

    // Sort results
    if(query.sort && typeof query.sort === 'string') {
        const sortFields = query.sort.split(',').join(' ');
        log.text(query.sort)
        complexQuery.sort(sortFields);
    } else {
        complexQuery.sort('-createdAt')
    }


    const {startIndex, limit} = pagination;
    complexQuery.skip(startIndex).limit(limit);

    return complexQuery;
}

export const getPagination = async (query: ParsedQs, model: Model<any>): Promise<PaginationObj> => {
    const page = (query.page && typeof query.page === 'string') ? parseInt(query.page, 10) : 1;
    const limit = (query.limit && typeof query.limit === 'string') ? parseInt(query.limit, 10) : 25;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await model.countDocuments();

    return {
        page,
        limit,
        startIndex,
        ...(endIndex < total ? {next: {page: page+1, limit}} : {}),
        ...(startIndex > 0 ? {prev: {page: page-1, limit}} : {}),
    };
}

export default complexQuery;