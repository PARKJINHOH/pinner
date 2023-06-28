/**
 * 주어진 journey의 가장 첫 이미지의 ID를 반환
 *
 * @param {Journey} journey
 * @returns {string|null}
 */
export function representPhotoIdOfJourney(journey) {
    for (let j = 0; j < journey.photos.length; j++) {
        return journey.photos[j];
    }

    return null;
}

/**
 * 주어진 travel의 가장 첫 이미지의 ID를 반환
 *
 * @param {Travel} travel
 * @returns {string|null}
 */
export function representPhotoIdOfTravel(travel) {
    for (let i = 0; i < travel.journeys.length; i++) {
        const journey = travel.journeys[i];

        const photoId = representPhotoIdOfJourney(journey);
        if (photoId !== null) {
            return photoId;
        }
    }
    return null;
}