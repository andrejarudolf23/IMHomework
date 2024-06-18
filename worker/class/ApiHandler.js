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
            return null;
        } 
    }
    
    fetchOrgDetails = async (organizationId, sessionToken) => {
        try {
            const response = await axios.get(`https://stage.insidemaps.com/api/v2/organizations/${organizationId}`, {
                headers: {
                    'Authorization': `Bearer ${sessionToken}`
                }
            });
            return response.data.data;
          
        } catch (error) {
            console.error(`Error fetching organization details for org id ${organizationId}`, error);
            return null;
        }
    }
    
    fetchProjectIds = async (organizationId, sessionToken) => {
        try {
            const response = await axios.get(`https://stage.insidemaps.com/api/v2/organizations/${organizationId}/projects`, {
                headers: {
                    'Authorization': `Bearer ${sessionToken}`
                }
            });
            return response.data.data;
        } catch (error) {
            console.error('Error fetching project IDs from API:', error);
            return null;
        }
    }

    async fetchProjectDetails(projectId, sessionToken) {
        try {
            const response = await axios.get(`https://stage.insidemaps.com/api/v2/projects/${projectId}`, {
                headers: {
                    'Authorization': `Bearer ${sessionToken}`
                }
            });
            const projectData = response.data.data;
            //console.log("Project data status is" + projectData.status);
            //console.log("Project data PAID is" + projectData.paid);
            return projectData; 
        } catch (error) {
            console.error(`Error fetching project details for project ${projectId}:`, error);
            return null;
        }
    }

}

module.exports = new ApiHandler();