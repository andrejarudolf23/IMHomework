const path = require('path');
const Config = require('./Config');
const ApiHandler = require('./ApiHandler');
const fs = require('fs').promises;


class Stats {
    constructor() {
        this.statsFilePath = path.join(__dirname, '..', '..', 'stats.json');
    }

    fetchDataAndUpdateStatsFile = async () => {
        console.log("Started fetching data, aggregating it and writing it in a file");
        let allStats = {};

        for (const org of Config.organizations) {
            const { organizationId, masterKey } = org;

            const sessionToken = await ApiHandler.fetchSessionToken(masterKey);
            const orgDetails = await ApiHandler.fetchOrgDetails(organizationId, sessionToken);
            const orgName = orgDetails.name;
            const projectIds = await ApiHandler.fetchProjectIds(organizationId, sessionToken);

            let orgStats = {};

            for (const projectId of projectIds) {
                const project = await ApiHandler.fetchProjectDetails(projectId, sessionToken);

                let monthValue;
                let createdAt;

                if (project.status == "finished") {
                    createdAt = new Date(project.completedAt);
                    monthValue = `${createdAt.getMonth() + 1}`;
                } else {
                    createdAt = new Date(project.createdAt);
                    monthValue = `${createdAt.getMonth() + 1}`;
                }

                if (parseInt(monthValue) < 10) {
                    monthValue = '0' + monthValue;
                }
                const yearMonth = `${createdAt.getFullYear()}-${monthValue}`;

                if (!orgStats[yearMonth]) {
                    orgStats[yearMonth] = {
                        orgName: orgName,
                        finishedProjects: 0,
                        unfinishedProjects: 0,
                        projectCountByPackage: {},
                        deletedProjects: 0,
                        paidProjects: 0,
                        unpaidProjects: 0,
                        totalSmartTags: 0,
                        averageSmartTagsCount: 0,
                        totalProcessingTime: 0,
                        averageProcessingTime: 0,
                        projectCountByScanner: {},
                        totalAreaScanned: 0,
                        projectCount: 0
                    };
                }

                orgStats[yearMonth].projectCount++;

                if (project.status == 'finished') {
                    orgStats[yearMonth].finishedProjects++;
                    orgStats[yearMonth].totalProcessingTime += this.millisecondsToHours(new Date(project.completedAt) - new Date(project.submittedAt));
                    orgStats[yearMonth].averageProcessingTime = orgStats[yearMonth].totalProcessingTime / orgStats[yearMonth].projectCount;
                } else {
                    orgStats[yearMonth].unfinishedProjects++;
                }

                if (project.deleted) {
                    orgStats[yearMonth].deletedProjects++;
                }

                if (project.paid) {
                    orgStats[yearMonth].paidProjects++;
                } else {
                    orgStats[yearMonth].unpaidProjects++;
                }

                orgStats[yearMonth].totalSmartTags += project.smartTagsCount;
                orgStats[yearMonth].averageSmartTagsCount = orgStats[yearMonth].totalSmartTags / orgStats[yearMonth].projectCount;
                orgStats[yearMonth].totalAreaScanned += project.areaTotal;

                if (!orgStats[yearMonth].projectCountByPackage[project.package]) {
                    orgStats[yearMonth].projectCountByPackage[project.package] = 0;
                }

                orgStats[yearMonth].projectCountByPackage[project.package]++;

                if (!orgStats[yearMonth].projectCountByScanner[project.scannerId]) {
                    orgStats[yearMonth].projectCountByScanner[project.scannerId] = 0;
                }

                orgStats[yearMonth].projectCountByScanner[project.scannerId]++;
            }

            allStats[org.organizationId] = orgStats;
        }

        try {
            await fs.writeFile(this.statsFilePath, JSON.stringify(allStats));
            console.log("Data written successfully");
        } catch (error) {
            console.error("Error writing stats file: ", error);
        }
    }

    millisecondsToHours = (milliseconds) => {
        const hours = milliseconds / (1000 * 60 * 60);
        return hours;
    }
}

module.exports = new Stats();