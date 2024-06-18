const axios = require('axios');

class ApiHandler {
    
    constructor() {}

    fetchSessionToken = async (masterKey) => {
        const apiURL = 'https://stage.insidemaps.com/api/v2/sessionToken';
        
        const apiAuthConfig = {
            headers: {
                'Authorization': `Bearer ${masterKey}`
            }
        };
    
        try {
            const response = await axios.get(apiURL, apiAuthConfig);
            return response.data.data;
    
        } catch (error) {
            console.log("Error, please see: " + error);
        } 
    }

}