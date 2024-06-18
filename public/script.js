document.addEventListener('DOMContentLoaded', () => {
    const monthInput = document.getElementById('month');
    const statsDiv = document.getElementById('stats');
    const refreshButton = document.getElementById('refreshButton');
    let autoRefreshTimeout;

    getCurrentYearMonth = () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = (now.getMonth() + 1).toString().padStart(2, '0');
        return `${year}-${month}`;
    }

    fetchStats = async (yearMonth) => {   
        console.log("Function called");       
        let stats;
        try {
            const response = await fetch(`/api/stats/${yearMonth}`);
            stats = await response.json();

        } catch (error) {
            console.log("Error fetching stats: " + error);
            return;
        }

        this.displayStats(stats);
    }

    displayStats = (stats) => {
        statsDiv.innerHTML = '';

        if (Object.keys(stats).length == 0) {
            statsDiv.innerHTML = "There are no projects in the selected month for any of the available organizations, please select another month";
            return;
        }
        Object.keys(stats).forEach(orgId => {
            const orgStats = stats[orgId];

            const orgSection = document.createElement('div');
            orgSection.className = 'org-section';

            const orgTitle = document.createElement('h2');
            orgTitle.textContent = `Organization: ${orgStats.orgName}`;
            orgSection.appendChild(orgTitle);

            const table = document.createElement('table');
            const thead = document.createElement('thead');
            thead.innerHTML = '<tr><th>Metric</th><th>Value</th></tr>';

            table.appendChild(thead);

            const tbody = document.createElement('tbody');

            const metrics = [
                { name: 'Finished Projects', value: orgStats.finishedProjects },
                { name: 'Unfinished Projects', value: orgStats.unfinishedProjects },
                { name: 'Deleted Projects', value: orgStats.deletedProjects },
                { name: 'Paid Projects', value: orgStats.unpaidProjects },
                { name: 'Total Area Scanned (sqft)', value: orgStats.totalAreaScanned.toFixed(1) },
                { name: 'Average Smart Tags per Project', value: orgStats.averageSmartTagsCount.toFixed(1) },
                { name: 'Average Project Processing Time (hours)', value: orgStats.averageProcessingTime.toFixed(1) },
            ];

            metrics.forEach(metric => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${metric.name}</td>    
                    <td>${metric.value}</td>    
                `;
                tbody.appendChild(row);
            })

            Object.keys(orgStats.projectCountByPackage).forEach(package => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>Projects in '${package}' package</td>
                    <td>${orgStats.projectCountByPackage[package]}</td>
                `

                tbody.appendChild(row);
            })

            Object.keys(orgStats.projectCountByScanner).forEach(scannerId => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>Number of project scanned by scanner ID ${scannerId}</td>
                    <td>${orgStats.projectCountByScanner[scannerId]}</td>
                `;
                tbody.appendChild(row);
            })

            table.appendChild(tbody);
            orgSection.appendChild(table);
            statsDiv.appendChild(orgSection);
        })

    };

    setAutoRefresh = (yearMonth) => {
        if(autoRefreshTimeout) {
            clearTimeout(autoRefreshTimeout);
        }

        fetchStats(yearMonth);
        autoRefreshTimeout = setInterval(() => fetchStats(yearMonth), 10000);
    }
    
    monthInput.value = getCurrentYearMonth();

    monthInput.addEventListener('change', () => {
        setAutoRefresh(monthInput.value);
    })

    refreshButton.addEventListener('click', () => {
        setAutoRefresh(monthInput.value);
    })

    setAutoRefresh(monthInput.value);
});