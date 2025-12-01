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
    config.userEmail = "";
    config.userPassword =  "";
}

export { config }