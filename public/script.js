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
});