import type {ParsedQs} from 'qs';

type MongoOperator = {
    $lte?: number;
    $gte?: number;
    $lt?: number;
    $gt?: number;
};
type Filter = Record<string, string | number | MongoOperator>;

const queryParser: (query: ParsedQs) => Filter = (query) => {
    const reqQuery = {...query};

    const queryStr = JSON.stringify(reqQuery).replace(/\b(gt|gte|lt|lte|in)\b/g, (match) => `$${match}`);

    return JSON.parse(queryStr)
}

export default queryParser;