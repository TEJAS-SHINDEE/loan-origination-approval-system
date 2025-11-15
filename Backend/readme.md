# Backend README

## Setup Instructions

-   I created the backend using Node.js, Express, and MongoDB.
-   Install dependencies using: `pnpm install`.
-   Run the backend locally using: `pnpm start`.

## Environment Variables

-   Create a `.env` file in the root.
-   Example variables:
    -   `MONGO_URI=mongodb://localhost:27017/loanDB`
    -   `PORT=5000`
    -   `JWT_SECRET=your_secret_key`

## Database Setup

-   Create collections: `users`, `customers`, `loanapplications`,
    `loanofficers`.
-   Seed initial data for testing using `seed.js`.

## API Documentation

-   **User Routes**
    -   `POST /auth/register` - register a new user.
    -   `POST /auth/login` - login user.
-   **Loan Routes**
    -   `POST /loans/apply` - apply for a loan.
    -   `POST /loans/pending/officer` - get pending loans for a specific
        officer.
    -   `POST /loans/approved/officer` - get approved loans for officer.
    -   `POST /loans/rejected/officer` - get rejected loans for officer.
-   **Officer Routes**
    -   `GET /officer/list` - get all loan officers with name,
        customerId, and branch.

## How to Run

-   Clone the repository.
-   Install dependencies.
-   Set up `.env` file.
-   Start the backend: `pnpm start`.
-   Backend API runs on `http://localhost:5000`.
