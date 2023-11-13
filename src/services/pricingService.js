// pricingService.js

function calculatePrice(vehicleId, startDate, endDate, additionalDrivers, childSeats, insurance, otherAddOns) {
    // Replace the following variables with your actual pricing information
    const basePricePerDay = 50; // Base price per day
    const additionalDriverFeePerDay = 10; // Additional driver fee per day
    const childSeatFeePerDay = 5; // Child seat fee per day
    const otherAddOnsPrice = 20; // Fixed price for other add-ons
    const insuranceFeePerDay = 10; // Insurance fee per day
  
    const startDateTime = new Date(startDate);
    const endDateTime = new Date(endDate);
    const durationInDays = Math.ceil((endDateTime - startDateTime) / (1000 * 60 * 60 * 24));
  
    const basePrice = basePricePerDay * durationInDays;
    const additionalDriverFee = additionalDrivers * additionalDriverFeePerDay * durationInDays;
    const childSeatFee = childSeats * childSeatFeePerDay * durationInDays;
    const insuranceFee = insurance ? insuranceFeePerDay * durationInDays : 0;


    const totalPrice = basePrice + additionalDriverFee + childSeatFee + otherAddOnsPrice + insuranceFee;
  
    return totalPrice;
  }
  
  module.exports = {
    calculatePrice,
  };
  