document.addEventListener('DOMContentLoaded', () => {
    const monthInput = document.getElementById('month');
    const statsDiv = document.getElementById('stats');
    const refreshButton = document.getElementById('refreshButton');

    getCurrentYearMonth = () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = (now.getMonth() + 1).toString().padStart(2, '0');
        return `${year}-${month}`;
    }

    fetchStats = async (yearMonth) => {
        try {
            console.log("Hello");
            const response = await fetch(`/api/stats/${yearMonth}`);
            console.log("Response is: " + response);
            console.log("Response type is: " + typeof(response));
        } catch (error) {
            console.log("Error fetching stats: " + error);
            return;
        }
    }
});