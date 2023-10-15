/**
* @typedef {object} Travel
* @property {number} id
* @property {number} orderKey
* @property {string} title
* @property {Journey[]} journeys
*/

/**
* @typedef {object} Journey
* @property {number} id
* @property {number} orderKey
* @property {string} date
* @property {string[]} hashtags
* @property {Photo[]} photos
* @property {geoLocationDto} geoLocationDto
*/

/**
* @typedef {object} Photo
 * @property {number} id
 * @property {string} src
 * @property {number} fileSize
 * @property {number} width
 * @property {number} height
*/

/**
* @typedef {object} geoLocationDto
* @property {number} lat
* @property {number} lng
* @property {string} name
 * @property {string} countryCd
*/

/**
* @typedef {object} Point
* @property {number} lat
* @property {number} lng
*/