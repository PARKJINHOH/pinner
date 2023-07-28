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
* @property {string[]} photos
* @property {geoLocationDto} geoLocationDto
*/

/**
* @typedef {object} geoLocationDto
* @property {number} lat
* @property {number} lng
* @property {string} name
*/

/**
* @typedef {object} Point
* @property {number} lat
* @property {number} lng
*/