# REYOCA - Rent Your Car

Welcome to REYOCA (short for Rent Your Car), an innovative web application that empowers individuals to rent out their vehicles and enter the world of car-sharing. REYOCA offers a unique opportunity for car owners to monetize their idle vehicles, all while contributing to the eco-friendly car-sharing movement. This README file will guide you through the essential information about this project.

## Table of Contents

1. [Project Overview](#project-overview)
2. [Getting Started](#getting-started)
3. [User Accounts](#user-accounts)
4. [Server-Side and Data Collection](#server-side-and-data-collection)
5. [Business Rules and Policies](#business-rules-and-policies)
6. [Data Usage](#data-usage)

---

### Project Overview

REYOCA is designed to revolutionize the way people think about car ownership and car rental. With the rise of remote work, many cars remain unused for extended periods, and REYOCA aims to make the most of this untapped resource. The web application offers the following key features:

- **Account Types:** Users can create two types of accounts: Renter and Rentee.
- **Renter Account:** Owners can add their vehicles, necessary documents, pickup locations, and government-issued IDs.
- **Rentee Account:** Consumers can create accounts using their state-issued driving licenses.
- **Rating System:** Both Renters and Rentees have separate ratings.
- **Browsing:** Non-registered users can browse available cars in their vicinity but need to be a Rentee to make bookings.
- **Admin Access:** Admin accounts allow developers to manage user accounts.

The application utilizes a database to store user information, trip details, and more. The primary development technologies include HTML, CSS, JavaScript, REST APIs for database communication, and browser cache for session management. Additionally, Gmail authentication and Google Maps API integration are implemented for user convenience.

---

### Getting Started

To get started with REYOCA, follow these steps:

1. **Clone the Repository:** Clone the project repository to your local machine.

   ```bash
   git clone https://github.com/SoftwareG4/reyoka.git
   ```

2. **Set Up Dependencies:** Ensure you have the necessary dependencies installed, including a web server and database server.

3. **Configure Environment:** Configure environment variables, such as database credentials and API keys, as needed.

4. **Run the Application:** Start the web application by launching the server.

   ```bash
   node app.js
   ```

5. **Access the Application:** Open your web browser and navigate to `http://localhost:3000` (or the appropriate URL as specified in your environment).

---

### User Accounts

1. **Renter Account:**
   - Renter accounts are for car owners who want to rent out their vehicles.
   - Users must provide vehicle details, documents, pickup location, and government-issued ID.
   - Renter accounts can add multiple vehicles over time.

2. **Rentee Account:**
   - Rentee accounts are for consumers looking to rent vehicles.
   - Users must create accounts using their state-issued driving licenses.

3. **Ratings:**
   - Both Renters and Rentees have separate rating systems based on their interactions.

---

### Server-Side and Data Collection

**Available to All Users (Including Visitors):**

- **Vehicle Catalog:**
  - Contains an overview of all cars and their availability.
  - Operations include browsing cars with filters (availability, car type, renter rating, price, etc.).

- **Vehicle Details:**
  - Contains detailed information about each vehicle from the catalog (e.g., miles run, insurance coverage, image links).
  - Operations include viewing details, reviews, future availability, and car images.

**Available to Rentee Users (Registered Users):**

- **User Rentee:**
  - Contains user profiles for all Rentees, including login credentials, rating, and reviews.
  - Operations include updating profile information, address, driver's license number, etc.

- **Cart:**
  - Contains details of items added to the cart for Rentee users.
  - Operations include modifying cart items and completing the checkout process.

**Available to Renter Users (Registered Users):**

- **User Renter:**
  - Contains user profiles for all Renters, including login credentials, rating, and reviews.
  - Operations include updating profile information, address, ID number, etc.

- **Vehicle Details (Renter Version):**
  - In addition to operations available to users, Renter users can also update vehicle details.

---

### Business Rules and Policies

**Vehicle Catalog:**
- Details of cars available within a 50-mile radius of the user's location.
- Users cannot view the catalog if their location is not provided for catalog search.

**Vehicle Details:**
- Two cars cannot have the same license plate.

**User Rentee:**
- Two users cannot have the same username.
- Renters cannot give Rentees a review until after the trip is finished.

**Cart:**
- If a car in the cart is no longer available or the trip's start date has passed, it will be removed from the cart.

**User Renter:**
- Rentees cannot give Renters a review until the booking is completed.
- Renters can decide to cancel a booking, but it will decrease their rating. Excessive cancellations may lead to account suspension.

---

### Data Usage

For the purpose of this project, synthetic data has been manually created. Given the nature of the project, demonstrating the application's functionality is possible with a few dozen entries, which can be achieved through manual entry.

Please note that this README provides an overview of the project. Detailed installation and configuration instructions, as well as code structure, can be found in the project documentation.

Thank you for choosing REYOCA. Enjoy your car-sharing journey!
