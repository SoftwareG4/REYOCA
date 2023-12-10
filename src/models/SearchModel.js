
const db = require('../../dbcon');
const distanceService = require('../services/distanceService');

const searchRadius = 10;    // in miles

// Base search query
const searchQuery_part1 = `
    SELECT v.*
    FROM vehicles v
    LEFT JOIN transaction_history th ON v._ID = th.vehicle_id
    WHERE ((th.vehicle_id IS NULL)
    OR (th.booking_end < ? OR th.booking_start > ?))
`;

const searchQuery_part2 = `
GROUP BY v._ID
HAVING COUNT(th._ID) = COUNT(CASE WHEN th.booking_end < ? OR th.booking_start > ? THEN 1 END)
`;

class SearchModel {

    static #userLocation    = null;
    static #startDate       = null;
    static #endDate         = null;
    static #filterColumns   = null;
    static #sortByCol       = null;
    static #isDesc          = false;

    /**
    * Function to search available vehicles with the given filters
    * 
    * @param {Array} userLocation Coordinates of the user's given location
    * @param {Date} startDate Start date and time of the user's given input
    * @param {Date} endDate End date and time of the user's given input
    * @param {JSON} filterColumns Key-Value pairs of filters
    * @param {String} sortByCol Column name to be sorted by
    * @param {Boolean} isDesc Sorting order
    * @param {Function} callback Callback Function
    */
    static searchAvailableVehicles(callback) {
        try {
            const dbCon = db();
            dbCon.connect((err) => {
                if (err) {
                    return callback(err, null);
                }

                let query = this.#setFilterColumns(this.#filterColumns, this.#sortByCol, this.#isDesc);

                const searchParameters = [this.#startDate, this.#endDate, this.#startDate, this.#endDate];
                console.log(query);
                dbCon.query(query, searchParameters, async (err, result) => {
                    if (err) {
                        console.log(err);
                        return callback(err, null);
                    }

                    console.log("Original results: ", result);

                    let searchRadiusResult = [];
                    result.forEach((item, index, arr) => {
                        arr[index].dist = distanceService.getAerialDistance(this.#userLocation[0], this.#userLocation[1], item['latitude'], item['longitude']);
                        if(arr[index].dist < searchRadius) {
                            searchRadiusResult.push(arr[index]);
                        }
                    });

                    let destinationList = searchRadiusResult.map(item => {return {lat: item['latitude'], lng: item['longitude']}});
                    console.log("Destination List: ", destinationList, destinationList.length);
                    if(destinationList.length != 0) {
                        let remainingNum = destinationList.length%25;
                        let iterNum = (destinationList.length - remainingNum)/25;
                        let distanceListTemp, distanceList = [];
                        let i = 0;
                        while(i < iterNum) {
                            distanceListTemp = await distanceService.getTravelDistance([{lat: this.#userLocation[0], lng: this.#userLocation[1]}], destinationList.slice(i*25, (i+1)*25));
                            console.log("distanceListTemp: ", distanceListTemp);
                            distanceList = distanceList.concat(distanceListTemp);
                            i++;
                        }
                        if(remainingNum != 0) {
                            distanceListTemp = await distanceService.getTravelDistance([{lat: this.#userLocation[0], lng: this.#userLocation[1]}], destinationList.slice(i*25, destinationList.length));
                            console.log("distanceListTemp: ", distanceListTemp);
                            distanceList = distanceList.concat(distanceListTemp);
                        }

                        searchRadiusResult.forEach((item, index, arr) => {
                            arr[index].travelDist = distanceList[index];
                        });
                        result = JSON.stringify({"response": searchRadiusResult});
                        return callback(null, result);
                    } else {
                        result = JSON.stringify({"response": []});
                        return callback(null, result);
                    }
                });
            });
        } catch(err) {
            console.log(err);
            return callback(err, null);
        }
    }


    /**
    * Function to get recommended cars
    * 
    * @param {Array} userLocation Coordinates of the user's given location
    * @param {Date} startDate Start date and time of the user's given input
    * @param {Date} endDate End date and time of the user's given input
    * @param {JSON} filterColumns Key-Value pairs of filters
    * @param {String} sortByCol Column name to be sorted by
    * @param {Boolean} isDesc Sorting order
    * @param {Function} callback Callback Function
    */
    static getRecommendations(callback) {
        try {
            const dbCon = db();
            dbCon.connect((err) => {
                if (err) {
                    return callback(err, null);
                }

                let query = this.#setFilterColumns(this.#filterColumns, this.#sortByCol, this.#isDesc);

                const searchParameters = [this.#startDate, this.#endDate, this.#startDate, this.#endDate];
                console.log(query);
                dbCon.query(query, searchParameters, async (err, result) => {
                    if (err) {
                        console.log(err);
                        return callback(err, null);
                    }

                    console.log("Original results: ", result);

                    let searchRadiusResult = [];
                    result.forEach((item, index, arr) => {
                        arr[index].dist = distanceService.getAerialDistance(this.#userLocation[0], this.#userLocation[1], item['latitude'], item['longitude']);
                        if(arr[index].dist < searchRadius) {
                            searchRadiusResult.push(arr[index]);
                        }
                    });

                    let destinationList = searchRadiusResult.map(item => {return {lat: item['latitude'], lng: item['longitude']}});
                    console.log("Destination List: ", destinationList);
                    let distanceList = await distanceService.getTravelDistance([{lat: this.#userLocation[0], lng: this.#userLocation[1]}], destinationList);
                    console.log("distanceList: ", distanceList);

                    searchRadiusResult.forEach((item, index, arr) => {
                        arr[index].travelDist = distanceList[index];
                    });


                    let recommendations = [];
                    console.log("searchRadiusResult: ", searchRadiusResult);

                    // storing lowest priced car among search results
                    recommendations.push(searchRadiusResult[0]);

                    let index = 1, maxRating = 0, maxRatingIndex = 0;
                    while(index < searchRadiusResult.length) {
                        if(searchRadiusResult[index].rating != null && searchRadiusResult[index].rating > maxRating) {
                            maxRating = searchRadiusResult[index].rating;
                            maxRatingIndex = index;
                        }
                        index++;
                    }
                    // storing highest rated car among search results
                    recommendations.push(searchRadiusResult[maxRatingIndex]);

                    result = JSON.stringify({"response": recommendations});
                    return callback(null, result);
                });
            });
        } catch(e) {
            console.log(e);
        }
    }


    static setSearchParam (user_loc, start_date, end_date, filter_col, sort_by_col, is_desc) {
        if (start_date && end_date) {
            let today = new Date();
            let startDate = new Date(start_date);
            let endDate = new Date(end_date);

            console.log(today);
            // Start and end date can only be in the future
            if (today > startDate || today > endDate) {
                console.log(today > startDate);
                console.log(today > endDate);
                return false;
            }
            // Start date can only be before the end date
            if (startDate >= endDate) {
                console.log("Future");
                return false;
            }
        }
        this.#userLocation    = user_loc;
        this.#startDate       = start_date;
        this.#endDate         = end_date;
        this.#filterColumns   = filter_col;
        this.#sortByCol       = sort_by_col;
        this.#isDesc          = is_desc;
        return true;
    }


    // Private Helper Functions

   /**
    * Function to add filters and sort parameters to the base search query
    * 
    * @param {JSON} filter_columns Key-Value pairs of filters
    * @param {String} sort_by_col Column name to be sorted by
    * @param {Boolean} is_desc Sorting order
    * @returns Search query including the filters and sort parameters
    */
    static #setFilterColumns (filter_columns, sort_by_col, is_desc) {
        let query = searchQuery_part1;
        
        if (filter_columns != null && Object.keys(filter_columns).length !== 0) {
            const filters = Object.keys(filter_columns).map(column => {
                let value = filter_columns[column];
                if (typeof value === 'string') {
                    value = `'${value.replace(/'/g, "\\'")}'`;
                } else if (typeof value === 'number') {
                    value = value;
                } else {
                    value = `'${String(value).replace(/'/, "\\'")}'`;
                }
                return `${column} = ${value}`;
            });
            query += ' AND ';
            query += filters.join(' AND ');
        }

        query += searchQuery_part2;

        if (sort_by_col != null) {
            query += ` ORDER BY ${sort_by_col}`;
            if (is_desc) {
                query += " DESC";
            }
        }
        
        return query;
    }
}

module.exports = SearchModel;
