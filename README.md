# INNODEV 2K24 <br>

## FeedMeNow
## Team Name: Web Deviola 
 <br>

### Contributors <br>
*[Pranay Pandey](https://github.com/pandeyg0012)*  <br>
*[Jatin Garg](https://github.com/jatingarg0410)*  <br>
*[Priyanshu Tripathi](https://github.com/tripathi08)*  <br>
*[Manasvi Pathak](https://github.com/pathakmanasvi25)*  <br>

### Proposed Features: <br>
*User dashboard with landing page showing various restaurants and food items <br>
*Feature to add upto three restaurants in user cart  <br>
*Feature to checkout from cart with payment integration <br>
*Restaurant dashboard containing menu of restaurant (which they'll make themselves by adding food items or deleting items) <br>
*Order history  <br>
*Admin authorisation for restaurants for their verification <br>
*Reviews for restaurants <br>

### Innovation: <br>
Mutli cart feature wherein a user can add food iteams from three different restaurants in his cart.<br>
User can place order for any of those three restauarnts in one go during checkout. <br>

# Project Setup

This guide will help you set up the project by installing the necessary npm modules for both the frontend and backend.<br>
CLONE this project using 
```
git clone https://github.com/pandeyg00121/FeedMeNow.git
```

## Installation

To get started, you'll need to install the npm modules for both the client-side and server-side of the application.

### Frontend Installation

Navigate to the client directory and install the dependencies:

```bash
cd client
npm install
```

### Backend Installation

Navigate to the server directory and install the dependencies:

```bash
cd server
npm install
```
### Env Declaration
```
MONGODB_URL = Your_Database_Connection_URI
PORT = Your_PORT_number
NODE_ENV = Your_DEV_environment

BIG_DATA_API_KEY = Your_BIG-DATA_API_KEY
JWT_SECRET = Your_JWT_SECRET_KEY
JWT_EXPIRES_IN = Your_JWT_TOKEN_EXPIRATION_TIME

EMAIL_FROM = Your_EMAIL_ACCOUNT
EMAIL_PASSWORD = Your_ACCOUNT_PASSWORD
EMAIL_HOST = HOST_OF_SMTP_SERVER
EMAIL_PORT = PORT

STRIPE_SECRET = Your_STRIPE_BACKEND_SECRET_KEY
```
```
npm start
```
**Tech Stack used** <br>
1.	Frontend: React.js <br>
2.	Backend: Node.js with Express <br>
3.	Database: MongoDB for storing restaurant information, user data, and order details <br>
4.	Authentication: JSON Web Tokens (JWT) for secure user authentication <br>
5.	Payment Integration: Stripe API for secure and efficient payment processing <br>
6.	Mapping and Geolocation: Google Maps GeoCodeAPI for location-based services <br>

