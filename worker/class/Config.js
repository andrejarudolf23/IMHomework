const path = require('path');

class Config {
    constructor() {
        this.configFilePath = path.join(__dirname, '..', 'config.json');
        this.config = this.loadConfig();
    }   

    loadConfig = () => {
        try {
            return require(this.configFilePath);
        } catch (error) {
            console.error('Error loading config file: ' + error);
        }
    }

    get organizations() {
        return this.config.organizations;
    }
}

module.exports = new Config();