function formatTime(date) {
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    var day = date.getDate()

    var hour = date.getHours()
    var minute = date.getMinutes()
    var second = date.getSeconds()


    return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
    n = n.toString()
    return n[1] ? n : '0' + n
}

function getStrLength(str) {
    ///<summary>获得字符串实际长度，中文2，英文1</summary>
    ///<param name="str">要获得长度的字符串</param>
    var realLength = 0, len = str.length, charCode = -1;
    for (var i = 0; i < len; i++) {
        charCode = str.charCodeAt(i);
        if (charCode >= 0 && charCode <= 128) realLength += 1;
        else realLength += 2;
    }

    return realLength;
};

function checkMobile(mobile) {
    var reg = /^1[3|4|5|7|8][0-9]\d{4,8}$/i;

    if (reg.test(mobile)) {
        return true;
    }

    return false;
}

function fomatFloat(src, pos) {
    return Math.round(src * Math.pow(10, pos)) / Math.pow(10, pos);
}

function isEmptyObject(e) {
    var t;
    for (t in e)
        return !1;
    return !0
}
function listNum(arr) {
    var temp;
    for (var i = 1; i < arr.length; i++) {
        for (var j = 0; j < i; j++) {
            if (arr[j] > arr[i]) {
                temp = arr[j];
                arr[j] = arr[i];
                arr[i] = temp;
            }
        }
    }
    return arr;
}

module.exports = {
    formatTime: formatTime,
    getStrLength: getStrLength,
    checkMobile: checkMobile,
    fomatFloat: fomatFloat,
    isEmptyObject: isEmptyObject,
    listNum: listNum
}
