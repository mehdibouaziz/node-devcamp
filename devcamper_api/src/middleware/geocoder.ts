import fetch from 'node-fetch';
import type {FeatureCollection} from "geojson";
import log from "../utils/niceConsole.ts";
import type {BootcampLocation} from "../feat/bootcamps/bootcamp.model.ts";
import {getRandomPoint} from "../utils/randomPoint.ts";


const geocoder = async (q: string) : Promise<BootcampLocation> => {
    if(process.env.GEOCODER_ACTIVATED !== 'true') {return getRandomPoint()}

    const res = await fetch(`https://photon.komoot.io/api/?q=${q}&limit=1`);
    const geoJson = await res.json() as FeatureCollection;

    const feature = geoJson.features[0];

    if(!feature){
        log.warning('Geocoder: no results found')
    }
    if(feature && feature.geometry.type !== 'Point'){
        log.warning('Geocoder: result found, but geometry not of type Point')
    }

    if(feature && feature.geometry.type === 'Point'){
        return {
            type: 'Point',
            coordinates: [feature.geometry.coordinates[0] || 0,feature.geometry.coordinates[1] || 0],
            street: feature.properties?.street || '',
            city: feature.properties?.city || '',
            state: feature.properties?.state || '',
            zipcode: feature.properties?.postcode || '',
            country: feature.properties?.country || '',
            formattedAddress: getFormattedAddress(feature.properties?.housenumber, feature.properties?.street, feature.properties?.postcode, feature.properties?.city, feature.properties?.countrycode),
        }
    } else {
        return getRandomPoint();
    }
}

const getFormattedAddress = (
    number?: number,
    street?: string,
    postcode?: string,
    city?: string,
    countryCode?: string
    ) => {
    let address = '';
    if(street){address += `${[number, street].join(' ')}`}
    if(postcode || city){address += `, ${[postcode, city].join(' ')}`}
    if(countryCode){address += `, ${countryCode}`}
    return address;
}

export default geocoder;