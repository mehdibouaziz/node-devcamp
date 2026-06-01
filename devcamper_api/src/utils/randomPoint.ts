import type {BootcampLocation} from "../feat/bootcamps/bootcamp.model.ts";

export const getRandomPoint = (): BootcampLocation => {
    const coords = [
        (Math.random() - 0.5) * 360,
        (Math.random() - 0.5) * 180
    ];

    return {
        type: 'Point',
        coordinates: coords,
    }
}