import type {Model, PopulateOptions} from "mongoose";
import type {ParsedQs} from "qs";

type QueryResult<M extends Model<any>> =
    Awaited<ReturnType<M['find']>>;

export type complexQueryResults<M extends Model<any>> = {
    data: QueryResult<M>;
    count: number;
    pagination: Record<string, any>;
}

async function complexQuery<M extends Model<any>>(
    reqQ: ParsedQs,
    model: M,
    populate?: PopulateOptions
): Promise<complexQueryResults<M>> {
    const reqQuery = {...reqQ};

    // fields to exclude
    const excludedKeys = ['select', 'sort', 'limit', 'page'];
    const filteredQuery = {...reqQuery};
    excludedKeys.forEach((key) => delete filteredQuery[key]);

    // Format operators
    const queryStr = JSON.stringify(filteredQuery).replace(/\b(gt|gte|lt|lte|in)\b/g, (match) => `$${match}`);

    // Final query
    const query = model.find(JSON.parse(queryStr));

    // SELECT
    if (reqQuery.select && typeof reqQuery.select === 'string') {
        const selectKeys = reqQuery.select.split(',').join(' ');
        query.select(selectKeys);
    }

    // SORT
    if (reqQuery.sort && typeof reqQuery.sort === 'string') {
        const sortFields = reqQuery.sort.split(',').join(' ');
        query.sort(sortFields);
    } else {
        query.sort('-createdAt')
    }

    // PAGINATION
    const page = (reqQuery.page && typeof reqQuery.page === 'string') ? parseInt(reqQuery.page, 10) : 1;
    const limit = (reqQuery.limit && typeof reqQuery.limit === 'string') ? parseInt(reqQuery.limit, 10) : 25;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await model.countDocuments();
    const pagination = {
        ...(endIndex < total ? {next: {page: page + 1, limit}} : {}),
        ...(startIndex > 0 ? {prev: {page: page - 1, limit}} : {}),
    }

    query.skip(startIndex).limit(limit);

    // POPULATE
    if (populate) {
        query.populate(populate);
    }

    const data = await query as QueryResult<M>;

    return {
        count: data.length,
        data,
        pagination
    }
}

export default complexQuery;