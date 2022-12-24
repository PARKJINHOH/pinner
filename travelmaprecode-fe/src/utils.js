//
// Internal utils
//

// Convert degrees to radians
const radians = (degrees) => degrees * Math.PI / 180;

// 두 좌표간의 거리를 구한다.
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

// 여러 좌표들의 경계를 구한다.
function bounds(points) {
    const minLat = Math.min(...points.map(p => p.lat));
    const maxLat = Math.max(...points.map(p => p.lat));
    const minLng = Math.min(...points.map(p => p.lng));
    const maxLng = Math.max(...points.map(p => p.lng));

    return {
        minLat: minLat,
        maxLat: maxLat,
        minLng: minLng,
        maxLng: maxLng
    }
}

//
// Exported
//

// 여러 좌표들의 중심점을 구한다.
export function centerOfPoints(points) {
    const sum = points.reduce((acc, v) => {
        return {
            lat: acc.lat + v.lat,
            lng: acc.lng + v.lng
        }
    }, { lat: 0, lng: 0 });

    return {
        lat: sum.lat / points.length,
        lng: sum.lng / points.length
    }
}

// 여러 좌표들의 중심점과 가장 멀리 떨어진 좌표의 거리를 구한다.
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
