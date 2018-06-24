// Rules taken from https://en.wikipedia.org/wiki/Points_of_the_compass
const directions = {
    'North': 0,
    'North-northeast': 22.50,
    'Northeast': 45,
    'East-northeast': 67.50,
    'East': 90,
    'East-southeast': 112.50,
    'Southeast': 135,
    'South-southeast': 157.50,
    'South': 180,
    'South-southwest': 202.50,
    'Southwest': 225,
    'West-southwest': 247.50,
    'West': 270,
    'West-northwest': 292.50,
    'Northwest': 315,
    'North-northwest': 337.50,
};

export default function getCompassDirection(deg) {
    let currDir = 'North';
    let currDeg = directions[currDir];
    let diff = Math.abs(deg - currDeg);

    for (let dir in directions) {
        currDeg = directions[dir];
        const newDiff = Math.abs(deg - currDeg);
        
        if (newDiff < diff) {
            diff = newDiff;
            currDir = dir;
        }
    }

    return currDir;
}