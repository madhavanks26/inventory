import dotenv from "dotenv";

// Load variables from .env file
dotenv.config();

// Export environment variables (optional step to centralize access)
export const { 
    DB_HOST, 
    DB_USER, 
    DB_PASS, 
    DB_DATABASE,
    PORT 
} = process.env;