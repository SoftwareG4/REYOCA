
const db = require('../../dbcon');
const {getRole} = require('../services/JWTauth');


const insertQuery = `
    INSERT INTO vehicles (
        make,
        model,
        type,
        renter_id,
        price,
        latitude,
        longitude,
        state,
        city,
        fuel_type,
        address) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
`;

class VehicleModel {
    static #make;
    static #model;
    static #type;
    static #renter_id;
    static #price;
    static #latitude;
    static #longitude;
    static #state;
    static #city;
    static #fuel_type;
    static #year;
    static #address;

    static insertVehicle(callback) {
        try {
            const dbCon = db();
            dbCon.connect((err) => {
                if (err) {
                    console.log(err);
                    return callback(err, false);
                }
                const sql = `
                INSERT INTO vehicles (
                    make,
                    model,
                    type,
                    renter_id,
                    price,
                    latitude,
                    longitude,
                    state,
                    city,
                    fuel_type,
                    year,
                    address
                ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?);`;

                let values = [
                    this.#make, 
                    this.#model, 
                    this.#type, 
                    this.#renter_id,
                    this.#price,
                    this.#latitude,
                    this.#longitude,
                    this.#state,
                    this.#city,
                    this.#fuel_type,
                    this.#year,
                    this.#address
                ];

                dbCon.query(sql, values, async (err) => {
                    if (err) {
                        console.log(err);
                        return callback(err, false);
                    }
                    return callback(null, true);
                });
            });
        } catch (err) {
            console.log(err);
            return callback(err, false);
        }
    }

    static async setInsertParam (
        make,
        model,
        type,
        renterId,
        price,
        lat,
        lng,
        state,
        city,
        fuel_type,
        year,
        address) {
            const typeList = ["car", "suv", "minivan", "van", "truck"];
            const fuelTypeList = ["DIESEL", "ELECTRIC", "HYBRID", "GASOLINE"];
            if (!typeList.includes(type)) {
                console.log("type Not OK");
                return false;
            }
            if (!fuelTypeList.includes(fuel_type)) {
                console.log("fuel_type Not OK");
                return false;
            }
            console.log("before get role");
            let user_role = await getRole(renterId);
            console.log("after get role", user_role);
            if (user_role != "renter") {
                console.log("role Not OK: ", user_role);
                return false;
            }
            
            this.#make = make;
            this.#model = model;
            this.#type = type;
            this.#renter_id = renterId;
            this.#price = price;
            this.#latitude = lat;
            this.#longitude = lng;
            this.#state = state;
            this.#city = city;
            this.#fuel_type = fuel_type;
            this.#year = year;
            this.#address = address;
            return true;
    }
}
module.exports = VehicleModel;
