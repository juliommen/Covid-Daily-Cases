module.exports = function (date) {

    if (date.length != 10) {
        return false;
    }

    var date_check = new Date(parseInt(date.slice(0, 4)), parseInt(date.slice(5, 7)) - 1, parseInt(date.slice(8)));
    date_check = date_check.toISOString().slice(0, 10)

    if (date_check == date) {
        return true;
    }

    return false;
}
