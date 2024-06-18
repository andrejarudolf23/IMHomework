const Stats = require('./class/Stats');

const action = () => new Promise((resolve, reject) => {
    //console.log("Action initialized");
    return setTimeout(async () => {
        await Stats.updateStatsFile();
        resolve();
    }, 10000)
})
const actionRecursion = () => {
    action().then(() => {
        setTimeout(actionRecursion, 1000);
    })
}
actionRecursion();