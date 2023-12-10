const { Client } = require('@googlemaps/google-maps-services-js');

/**
 * Returns distance between 2 locations given by their coordinates
 * 
 * @param {number} lat1 Latitude of location 1
 * @param {number} lon1 Longitude of location 1
 * @param {number} lat2 Latitude of location 2
 * @param {number} lon2 Longitude of location 2
 * @returns {number} Distance of location 1 and location 2
 */
function getAerialDistance(lat1, lon1, lat2, lon2) {
    // console.log(lat1, lon1, lat2, lon2);
    if ((lat1 == lat2) && (lon1 == lon2)) {
        return 0;
    }
    else {
        var radlat1 = Math.PI * lat1/180;
        var radlat2 = Math.PI * lat2/180;
        var theta = lon1-lon2;
        var radtheta = Math.PI * theta/180;
        var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        if (dist > 1) {
            dist = 1;
        }
        dist = Math.acos(dist);
        dist = dist * 180/Math.PI;
        dist = dist * 60 * 1.1515;
        // console.log(dist);
        return dist;
    }
}

/**
* Returns the distance matrix between originList and destinationList
* 
* @param {number} originList list of latitude and longitude of all origins
* @param {number} destinationList list of latitude and longitude of all destinations
* @returns {number} Distance matrix between originList and destinationList
*/
function getTravelDistance(originList, destinationList) {
    const client = new Client();

    const params = {
        origins: originList,
        destinations: destinationList,
        units: 'imperial', // or 'metric'
        mode: 'driving',
        key: process.env.MAPS_API_KEY,
    };

    return new Promise((resolve, reject) => {
        client.distancematrix({ params: params })
        .then(response => {
            const elements = response.data.rows[0].elements;
            // console.log("distance elements: ", elements);
            distanceList = elements.map((item) => {
                return parseFloat(item.distance.text.slice(0, -3).replaceAll(',', ''));
            })
            resolve(distanceList);
        })
        .catch(error => {
            console.error('Error fetching distance matrix:', error);
            reject(error);
        });
    });
}

module.exports = {
    getAerialDistance,
    getTravelDistance
}