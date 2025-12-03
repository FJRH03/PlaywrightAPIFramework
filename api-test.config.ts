import dotenv from 'dotenv';
import path from 'path';
dotenv.config({path: path.resolve(__dirname, '.env')});

// THIS FILE CONTAINS ENVIRONMENT CONFIG AND VALUES
const processENV = process.env.TEST_ENV;
const env = processENV || 'dev';
console.log(`TEST ENVIRONMENT: ${env}`);

const config = {
    apiUrl: 'https://conduit-api.bondaracademy.com/api',
    userEmail: 'franktest@test.com',
    userPassword: 'Test1234'
}

if(env === 'qa'){
    config.userEmail = 'franktestapi@test.com';
    config.userPassword =  "Test1234";
}

if(env === 'prod'){
    // Readed from env variables.
    if(! process.env.PROD_USERNAME || ! process.env.PROD_PASSWORD){
        throw Error(`Missing required environment variables`);
    }
    config.userEmail = process.env.PROD_USERNAME; 
    config.userPassword = process.env.PROD_PASSWORD;
}

export { config }