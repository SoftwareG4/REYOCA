
const db = require('../../dbcon');

// Base search query
const searchQuery = `
    SELECT * FROM vehicles v
      JOIN transaction_history th ON v._ID = th.vehicle_id
     WHERE (? < th.booking_start AND ? < th.booking_start) 
        OR (? > th.booking_end AND ? > th.booking_end)
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
                dbCon.query(query, searchParameters, (err, result) => {
                    if (err) {
                        console.log(err);
                        return callback(err, null);
                    }

                    result.forEach((item, index, arr) => {
                        arr[index].dist = this.#calcDistance(this.#userLocation[0], this.#userLocation[1], item['latitude'], item['longitude']);
                    });

                    result = JSON.stringify({"response": result});
                    return callback(null, result);
                });
            });
        } catch(e) {
            console.log(e);
        }
    }


    static setSearchParam (user_loc, start_date, end_date, filter_col, sort_by_col, is_desc) {
        this.#userLocation    = user_loc;
        this.#startDate       = start_date;
        this.#endDate         = end_date;
        this.#filterColumns   = filter_col;
        this.#sortByCol       = sort_by_col;
        this.#isDesc          = is_desc;
    }


    // Private Helper Functions

    /**
     * Returns distance between 2 locations given by their coordinates
     * 
     * @param {number} lat1 Latitude of location 1
     * @param {number} lon1 Longitude of location 1
     * @param {number} lat2 Latitude of location 2
     * @param {number} lon2 Longitude of location 2
     * @returns {number} Distance of location 1 and location 2
     */
    static #calcDistance(lat1, lon1, lat2, lon2) {
        console.log(lat1, lon1, lat2, lon2);
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
            console.log(dist);
            return dist;
        }
    }

   /**
    * Function to add filters and sort parameters to the base search query
    * 
    * @param {JSON} filter_columns Key-Value pairs of filters
    * @param {String} sort_by_col Column name to be sorted by
    * @param {Boolean} is_desc Sorting order
    * @returns Search query including the filters and sort parameters
    */
    static #setFilterColumns (filter_columns, sort_by_col, is_desc) {
        let query = searchQuery;
        
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
