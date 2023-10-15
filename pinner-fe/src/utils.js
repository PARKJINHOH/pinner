//
// Internal utils
//
import EXIF from 'exif-js';

/**
 * Convert degrees to radians
 *
 * @param {number} degrees
 * @returns
 */
const radians = (degrees) => degrees * Math.PI / 180;

/**
 * 두 좌표간의 거리를 구한다.
 *
 * @param {Point} c1
 * @param {Point} c2
 * @returns distance
 */
function distance(c1, c2) {
    // Convert latitude and longitude to radians
    const lat1 = radians(c1.lat);
    const lon1 = radians(c1.lng);
    const lat2 = radians(c2.lat);
    const lon2 = radians(c2.lng);

    // Use the Haversine formula to calculate the distance
    let dlon = lon2 - lon1;
    let dlat = lat2 - lat1;
    let a = Math.sin(dlat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dlon / 2) ** 2;
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    let distance = 6371 * c; // 6371 is the radius of the Earth in kilometers
    return distance;
}

/**
 * Draws a line using Polyline component for each group of journeys by date
 *
 * @param {Journey} j
 * @returns {boolean}
 */
export function is_journey_has_location(j) {
    return j.geoLocationDto.lat !== 0 && j.geoLocationDto.lng !== 0;
}

/**
 * 여러 좌표들의 경계를 구한다.
 *
 * 경계를 구할 수 없을 경우에는 null을 반환
 *  - points의 길이가 1 이하인 경우
 *
 * @param {Point[]} points
 * @returns {google.maps.LatLngBoundsLiteral?}
 */
function bounds(points) {
    if (!points || points.length <= 1) {
        return null;
    }

    const minLat = Math.min(...points.map(p => p.lat));
    const maxLat = Math.max(...points.map(p => p.lat));
    const minLng = Math.min(...points.map(p => p.lng));
    const maxLng = Math.max(...points.map(p => p.lng));

    return {
        south: minLat,
        north: maxLat,
        west: minLng,
        east: maxLng
    }
}

/**
 * 여러 좌표들의 경계를 구한다.
 *
 * Travel.journeys의 길이가 하나 이하이거나 Journey.geoLocationDto가 (0, 0)이면 nu
 *
 * @param {Travel} travel
 * @returns {google.maps.LatLngBoundsLiteral?}
 */
export function boundsOfTravel(travel) {
    const points = travel.journeys
        .filter(is_journey_has_location)
        .map(j => j.geoLocationDto);

    return bounds(points);
}

/**
 * 여러 좌표들의 경계를 구한다.
 *
 * @param {google.maps.LatLngBoundsLiteral} bounds
 * @returns {boolean}
 */
export function boundsHasInfo(bounds) {
    if (!bounds) {
        return false;
    }

    return bounds.south !== 0 &&
        bounds.north !== 0 &&
        bounds.west !== 0 &&
        bounds.east !== 0;
}

//
// Exported
//

/**
 * 여러 좌표들의 중심점을 구한다.
 *
 * @param {Point[]} points
 * @returns {Point}
 */
export function centerOfPoints(points) {
    let latMin = Infinity;
    let latMax = -Infinity;
    let lngMin = Infinity;
    let lngMax = -Infinity;

    for (let i = 0; i < points.length; i++) {
        latMin = Math.min(latMin, points[i].lat);
        latMax = Math.max(latMax, points[i].lat);
        lngMin = Math.min(lngMin, points[i].lng);
        lngMax = Math.max(lngMax, points[i].lng);
    }

    const lat = (latMin + latMax) / 2;
    const lng = (lngMin + lngMax) / 2;

    return { lat: lat, lng: lng };
}

/**
 * 여러 좌표들의 중심점과 가장 멀리 떨어진 좌표의 거리를 구한다.
 *
 * @param {Point[]} points
 * @returns {Point}
 */
export function radiusOfPoints(points) {
    const center = centerOfPoints(points);

    let radius = 0;
    for (let point of points) {
        let d = distance(center, point);
        if (d > radius) {
            radius = d;
        }
    }

    return radius;
}


// By using below formula, we can calculate the zoom level of the map
//     meters_per_pixel = 156543.03392 * Math.cos(latLng.lat() * Math.PI / 180) / Math.pow(2, zoom)
//
// See also:
//     [google map API zoom range - Stack Overflow](https://stackoverflow.com/questions/9356724/google-map-api-zoom-range)
//     [Google Maps V3 - How to calculate the zoom level for a given bounds - Stack Overflow](https://stackoverflow.com/questions/6048975/google-maps-v3-how-to-calculate-the-zoom-level-for-a-given-bounds)
export function zoomLevelOfTravel(travel) {
    const radius = radiusOfPoints(travel.journeys.map(j => j.geoLocationDto));
    const zoom = Math.log2(156543.03392 * Math.cos(travel.journeys[0].geoLocationDto.lat * Math.PI / 180) / (radius * 1000 * 2));
    return zoom;
}

export const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

/**
 * 도분초 좌표를 도로 변환
 * @param {number[]} 좌표(도분초)
 * @returns {number} 좌표(도)
 */
function convertDegree([d, m, s]) {
    return d + (m / 60) + (s / 3600);
}

/**
 * EXIF 데이터가 필요한 항목을 가지고 있는지 확인
 * @param {any} exifData
 * @returns {boolean}
 */
function checkExifInfo(exifData) {
    return exifData && exifData["GPSLongitude"] && exifData["GPSLatitude"] && exifData["DateTimeOriginal"];
}

/**
 * @typedef {Point & {
 *     date: string, // asdf
 * }} ExifData
 */

/**
 * EXIF 데이터가 필요한 항목을 가지고 있는지 확인
 * @param {any} exifData
 * @returns {ExifData}
 */
function extractExifInfo(exifData) {
    return {
        lng: convertDegree(exifData["GPSLongitude"]),
        lat: convertDegree(exifData["GPSLatitude"]),
        date: exifData["DateTimeOriginal"],
    };
}

/**
 * File에서 필요한 EXIF 정보 추출
 * @param {File} file
 * @returns {Promise<ExifData>}
 */
export function extractExifDataFromFile(file) {
    return new Promise((resolve, reject) => {
        EXIF.getData(file, function () {
            const exifData = EXIF.getAllTags(this);
            if (checkExifInfo(exifData)) {
                resolve(extractExifInfo(exifData));
            } else {
                resolve(null);
            }
        });
    });
}