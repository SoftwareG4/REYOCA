// pricingService.js


//====================================================== Tested function, works well ===================================================

function calculatePrice(basePrice, startDate, endDate, additionalDrivers, childSeats, insurance, otherAddOns) {
    // Replace the following variables with your actual pricing information
    const basePricePerDay = basePrice; // Base price per day
    const additionalDriverFeePerDay = 10; // Additional driver fee per day
    const childSeatFeePerDay = 5; // Child seat fee per day
    const otherAddOnsPrice = 20; // Fixed price for other add-ons
    const insuranceFeePerDay = 10; // Insurance fee per day
  
    const startDateTime = new Date(startDate);
    const endDateTime = new Date(endDate);
    const durationInDays = Math.ceil((endDateTime - startDateTime) / (1000 * 60 * 60 * 24));
  
    const CurrentPrice = basePricePerDay * durationInDays;
    const additionalDriverFee = additionalDrivers * additionalDriverFeePerDay * durationInDays;
    const childSeatFee = childSeats * childSeatFeePerDay * durationInDays;
    const insuranceFee = insurance*1 ? insuranceFeePerDay * durationInDays : 0;


    const totalPrice = CurrentPrice + additionalDriverFee + childSeatFee + otherAddOnsPrice + insuranceFee;
  
    return totalPrice;
  }


//====================================================== Needs more testing ===================================================

const db = require('../../dbcon');

// async function calculatePrice(vehicleId, startDate, endDate, additionalDrivers, childSeats, insurance, otherAddOns) {
//   try {
//     const connection = db(); // Get a database connection

//     // Fetch pricing details from the database
//     const pricingQuery = 'SELECT * FROM pricing WHERE vehicle_id = ?';
//     const pricingResult = await connection.query(pricingQuery, [vehicleId]);

//     if (pricingResult.length === 0) {
//       throw new Error('Pricing details not found for the specified vehicle.');
//     }

//     const pricingDetails = pricingResult[0];

//     // Calculate base price
//     const startDateTime = new Date(startDate);
//     const endDateTime = new Date(endDate);
//     const durationInDays = Math.ceil((endDateTime - startDateTime) / (1000 * 60 * 60 * 24));
//     const basePrice = pricingDetails.base_price_per_day * durationInDays;

//     // Calculate additional fees
//     const additionalDriverFee = additionalDrivers * pricingDetails.additional_driver_fee_per_day * durationInDays;
//     const childSeatFee = childSeats * pricingDetails.child_seat_fee_per_day * durationInDays;
//     const insuranceFee = insurance ? pricingDetails.insurance_fee_per_day * durationInDays : 0;
//     const otherAddOnsPrice = pricingDetails.other_add_ons_price;

//     // Calculate demand-based pricing
//     const demandMultiplier = await calculateDemandMultiplier(vehicleId, startDate, endDate);
//     const demandBasedPrice = basePrice * demandMultiplier;

//     // Calculate total price including demand-based pricing
//     const totalPrice = demandBasedPrice + additionalDriverFee + childSeatFee + insuranceFee + otherAddOnsPrice;

//     // Close the database connection
//     connection.end();

//     return totalPrice;
//   } catch (error) {
//     console.error('Error calculating price:', error.message);
//     throw error;
//   }
// }


async function calculateDemandMultiplier(vehicleId, startDate, endDate) {
  try {
    const connection = db(); // Get a database connection

    const availabilityResult = SearchModel.searchAvailableVehicles(callback);

    if (availabilityResult.length === 0) {
      throw new Error('Availability details not found for the specified vehicle and dates.');
    }

    const availableVehicles = availabilityResult[0].available_vehicles;

    let demandMultiplier;

    if (availableVehicles >= 10) {
      demandMultiplier = 1; // No adjustment for high availability
    } else if (availableVehicles >= 5) {
      demandMultiplier = 1.1; // Increase the price by 10% for moderate availability
    } else {
      demandMultiplier = 1.2; // Increase the price by 20% for low availability
    }

    connection.end();

    return demandMultiplier;
  } catch (error) {
    console.error('Error calculating demand multiplier:', error.message);
    throw error;
  }
}
  
  module.exports = {
    calculatePrice,
  };
  
