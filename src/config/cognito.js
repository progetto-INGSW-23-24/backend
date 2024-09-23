import AWS from 'aws-sdk'; 
import { COGNITO_REGION } from './environment.js';


AWS.config.update({
    region: COGNITO_REGION, 
})

const cognito = new AWS.CognitoIdentityServiceProvider(); 

export default cognito; 