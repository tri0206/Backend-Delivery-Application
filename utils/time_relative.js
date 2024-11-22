module.exports = (current, previous) => {

    var msPerMinute = 60 * 1000;
    var msPerHour = msPerMinute * 60;
    var msPerDay = msPerHour * 24;
    var msPerMonth = msPerDay * 30;
    var msPerYear = msPerDay * 365;

    var elapsed = current - previous;

    if (elapsed < msPerMinute) {
        return 'Does ' + Math.round(elapsed / 1000) + ' seconds';
    }

    else if (elapsed < msPerHour) {
        return 'Does ' + Math.round(elapsed / msPerMinute) + ' minutes';
    }

    else if (elapsed < msPerDay) {
        return 'Does ' + Math.round(elapsed / msPerHour) + ' hours';
    }

    else if (elapsed < msPerMonth) {
        return 'Approximately ' + Math.round(elapsed / msPerDay) + ' days';
    }

    else if (elapsed < msPerYear) {
        return 'Approximately ' + Math.round(elapsed / msPerMonth) + ' months';
    }

    else {
        return 'Approximately ' + Math.round(elapsed / msPerYear) + ' years';
    }
}