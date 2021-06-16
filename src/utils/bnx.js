import TronWeb, {BigNumber} from "tronweb"
// import { BigNumber } from "bignumber.js"
const regx_split = /[-.]/
const regex_number_sub = /(\d)(?=(\d{3})+$)/g

BigNumber.prototype.formatCurrency = function (thou = ",", dec = ".", sym = "$") {
    return this.toFixed(2).toString().split(regx_split).reverse().reduceRight(function (t, c, i) {
        return (i === 2) ? "-" + t : (i === 1) ? t + c.replace(regex_number_sub, "$1" + thou) : t + dec + c
    }, sym)
}
BigNumber.prototype.formatSun = function (thou = ",", dec = ".", sym = "$") {
    return this.toFixed(6).toString().split(regx_split).reverse().reduceRight(function (t, c, i) {
        return (i === 2) ? "-" + t : (i === 1) ? t + c.replace(regex_number_sub, "$1" + thou) : t + dec + c
    }, sym)
}
BigNumber.prototype.unitMoney = function (thou = ",", dec = ".", sym = "$") {
    return this.toFixed(1).toString().split(regx_split).reverse().reduceRight(function (t, c, i) {
        return (i === 2) ? "-" + t : (i === 1) ? t + c.replace(regex_number_sub, "$1" + thou) : t + dec + c
    }, sym)
}

function ___fromSunBNLong(number_string) {
    try {
        let sum = TronWeb.fromSun("0")
        if (TronWeb.utils.isBigNumber(number_string)) {
            const amount = number_string.toNumber()
            sum = TronWeb.fromSun(amount)
        }
        if (_isBigNumber(number_string)) {
            if (number_string.hasOwnProperty("_hex")) {
                const bn = new BigNumber(number_string._hex)
                sum = TronWeb.fromSun(bn)
            }
        }

        return sum.formatSun(",", ".", "")
    } catch (e) {
        console.error(e)
        return 0
    }
}

function ___fromSunBnShort(number_string) {
    try {
        let sum = TronWeb.fromSun("0")
        if (TronWeb.utils.isBigNumber(number_string)) {
            const amount = number_string.toNumber()
            sum = TronWeb.fromSun(amount)
        }
        if (_isBigNumber(number_string)) {
            if (number_string.hasOwnProperty("_hex")) {
                const bn = new BigNumber(number_string._hex)
                sum = TronWeb.fromSun(bn)
            }
        }

        return sum.formatCurrency(",", ".", "")
    } catch (e) {
        console.error(e)
        return 0
    }
}

/**
 * to math number
 * @param number_string
 * @returns {number|any}
 */
function ___fromSun(number_string) {
    try {
        if (TronWeb.utils.isBigNumber(number_string)) {
            const amount = number_string.toNumber()
            return parseFloat(TronWeb.fromSun(amount))
        }
        if (_isBigNumber(number_string)) {
            if (number_string.hasOwnProperty("_hex")) {
                const bn = new BigNumber(number_string._hex)
                return parseFloat(TronWeb.fromSun(bn))
            }
        }

        if (typeof number_string === "string") {
            const bignumer = TronWeb.toBigNumber(number_string)
            const amount = bignumer.toNumber()
            return parseFloat(TronWeb.fromSun(amount))
        }

        if (typeof number_string === "number") {
            return parseFloat(TronWeb.fromSun(number_string))
        }

        return 0
    } catch (e) {
        console.error(e)
        return 0
    }
}

function _isBigNumber(numberex) {
    if (TronWeb.utils.isBigNumber(numberex)) {
        return true
    }
    if (typeof numberex === "object") {
        if (numberex.hasOwnProperty("_isBigNumber")) {
            return numberex._isBigNumber
        }
        if (numberex.hasOwnProperty("_hex")) {
            return true
        }
    }
    return false
}

function ___fromSun2Floor(number_string) {
    try {
        const num = ___fromSun(number_string)
        return Math.floor(num)
    } catch (e) {
        console.error(e)
        return 0
    }
}

function ___fromTrxToSun(number_unknown) {
    try {
        if (typeof number_unknown === "string") {
            const bignumer = TronWeb.toBigNumber(number_unknown)
            return bignumer.multipliedBy(1000000).toNumber()
        }
        if (typeof number_unknown === "number") {
            return TronWeb.toBigNumber(number_unknown).multipliedBy(1000000).toNumber()
        }
        if (TronWeb.utils.isBigNumber(number_unknown)) {
            return number_unknown.multipliedBy(1000000).toNumber()
        }
        if (typeof number_unknown === "object" && number_unknown.hasOwnProperty("_isBigNumber")) {
            if (number_unknown._isBigNumber && number_unknown.hasOwnProperty("_hex")) {
                const val = new BigNumber(number_unknown._hex)
                return val.multipliedBy(1000000).toNumber()
            } else {
                console.log("failed to create big number")
            }
        }
        // eslint-disable-next-line no-throw-literal
        throw "Not ready for ___fromTrxToSun..."
    } catch (e) {
        console.error(e)
        return 0
    }
}

function toBigNumber(number_unknown) {
    try {
        if (typeof number_unknown === "string") {
            return TronWeb.toBigNumber(number_unknown)
        }
        if (typeof number_unknown === "number") {
            return TronWeb.toBigNumber(number_unknown)
        }
        if (TronWeb.utils.isBigNumber(number_unknown)) {
            return number_unknown
        }
        if (_isBigNumber(number_unknown)) {
            if (number_unknown._isBigNumber && number_unknown.hasOwnProperty("_hex")) {
                return new BigNumber(number_unknown._hex)
            } else {
                console.log("failed to create big number")
            }
        }
        return TronWeb.toBigNumber(number_unknown)
    } catch (e) {
        console.error(e)
        return 0
    }
}

function byBigNumberFloat(number_unknown) {
    try {
        if (TronWeb.utils.isBigNumber(number_unknown)) {
            return number_unknown.formatSun(",", ".", "")
        }
        if (_isBigNumber(number_unknown)) {
            if (number_unknown._isBigNumber && number_unknown.hasOwnProperty("_hex")) {
                const bn = new BigNumber(number_unknown._hex)
                return bn.formatSun(",", ".", "")
            } else {
                console.log("failed to create big number")
            }
        }
        return "N/A"
    } catch (e) {
        console.error(e)
        return "E"
    }
}

function toNumber(number_unknown) {
    try {
        let prenum = TronWeb.toBigNumber(0)
        if (TronWeb.utils.isBigNumber(number_unknown)) {
            prenum = number_unknown
        } else if (_isBigNumber(number_unknown)) {
            if (number_unknown.hasOwnProperty("_hex")) {
                prenum = new BigNumber(number_unknown._hex)
            } else {
                console.log("failed to create big number")
            }
        } else if (typeof number_unknown === "string") {
            prenum = TronWeb.toBigNumber(number_unknown)
        } else if (typeof number_unknown === "number") {
            prenum = TronWeb.toBigNumber(number_unknown)
        }

        return prenum.toNumber()
    } catch (e) {
        console.error(e)
        return 0
    }
}

/**
 * all the calculations for sum
 * @param list
 * @returns {number}
 */

function sum(list) {
    let c = 0
    list.forEach((num, i) => {
        let amou = 0
        if (_isBigNumber(num)) {
            amou = toNumber(num)
        } else {
            amou = parseInt(num)
        }
        c = c + amou
    })
    return c
}

function trx(value) {
    const sun = toBigNumber(1000000)
    if (!_isBigNumber(value)) {
        const sunamount = toBigNumber(value)
        const trxamtf = sunamount.div(sun)
        if (trxamtf.isGreaterThan(0)) {
            return trxamtf.formatCurrency(",", ".", "")
        } else {
            return "-"
        }
    } else {
        return ___fromSunBnShort(value)
    }
}

function trxLong(value) {
    if (!_isBigNumber(value)) {
        const sun = toBigNumber(1000000)
        const sunamount = toBigNumber(value)
        const trx = sunamount.div(sun)
        if (trx.isGreaterThan(0)) {
            return trx.formatSun(",", ".", "")
        } else {
            return "-"
        }
    } else {
        return ___fromSunBNLong(value)
    }
}

function trxUnit(value) {
    const sun = toBigNumber(1000000)
    if (isNaN(value)) {
        return "-"
    }
    if (!_isBigNumber(value)) {
        const sunamount = toBigNumber(value)
        const trx = sunamount.div(sun)
        if (trx.isGreaterThan(0)) {
            return trx.unitMoney(",", ".", "")
        } else {
            return "-"
        }
    } else {
        const trx = value.div(sun)
        if (trx.isGreaterThan(0)) {
            return trx.unitMoney(",", ".", "")
        } else {
            return "-"
        }
    }
}

function hexUnitFloat(value) {
    if (isNaN(value)) {
        return 0
    } else if (_isBigNumber(value)) {
        return ___fromSun(value)
    } else {
        return parseFloat(value)
    }
}

function txtUnit(value) {
    if (isNaN(value)) {
        return "-"
    } else if (_isBigNumber(value)) {
        return toNumber(value)
    } else {
        return parseInt(value)
    }
}

function blocktime(value) {
    const myDate = new Date(parseInt(value) * 1000)
    const HH = myDate.getHours()
    const MM = myDate.getMinutes()
    const SS = myDate.getSeconds()
    return `${HH}:${MM}:${SS}`
}

function hexBlockTime(value) {
    return txtUnit(blocktime(value))
}

function duration_ms(value) {
    const f = parseInt(value)
    const mm = Math.floor(f / 60)
    const tm = parseInt(value) % 60
    return `${mm}:${tm}`
}

function duration(value) {
    if (value > 0) {
        const secs = parseInt(value)

        const hours = Math.floor(secs / (60 * 60))

        const divisor_for_minutes = secs % (60 * 60)
        const minutes = Math.floor(divisor_for_minutes / 60)

        const divisor_for_seconds = divisor_for_minutes % 60
        const seconds = Math.ceil(divisor_for_seconds)

        const obj = {
            h: hours,
            m: minutes,
            s: seconds
        }

        if (obj.h > 0) {
            return `${obj.h}:${obj.m}:${obj.s}`
        }

        if (obj.m > 0) {
            return `${obj.m}:${obj.s}`
        }
    } else {
        return "0"
    }
}

function timeConverter(UNIX_timestamp) {
    const a = new Date(UNIX_timestamp * 1000)
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    const year = a.getFullYear()
    const month = months[a.getMonth()]
    const date = a.getDate()
    const hour = a.getHours()
    const min = a.getMinutes()
    const sec = a.getSeconds()
    const strtime = date + " " + month + " " + year + " " + hour + ":" + min + ":" + sec
    return strtime
}

function FillZero(p, fill_up) {
    return new Array(fill_up - String(p).length + 1).join("0") + String(p)
}

function coinbase(value) {
    const valuec = parseFloat(value)
    if (valuec > 0) {
        return Number(valuec).formatCurrency(",", ".", "")
    } else {
        return "0.00"
    }
}

function generateReferCode() {
    const chars = "1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
    const serialLength = 5
    let randomSerial = ""
    let i
    let randomNumber
    for (i = 0; i < serialLength; i = i + 1) {
        randomNumber = Math.floor(Math.random() * chars.length)
        randomSerial += chars.substring(randomNumber, randomNumber + 1)
    }
    return randomSerial
}

function romanize(num) {
    if (!+num) {
        return false
    }
    const digits = String(+num).split("")
    const key = ["", "C", "CC", "CCC", "CD", "D", "DC", "DCC", "DCCC", "CM",
        "", "X", "XX", "XXX", "XL", "L", "LX", "LXX", "LXXX", "XC",
        "", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX"]
    let roman = ""
    let i = 3
    while (i--) {
        roman = (key[+digits.pop() + (i * 10)] || "") + roman
    }
    return Array(+digits.join("") + 1).join("M") + roman
}

function deromanize(str) {
    const stc = str.toUpperCase()
    const validator = /^M*(?:D?C{0,3}|C[MD])(?:L?X{0,3}|X[CL])(?:V?I{0,3}|I[XV])$/
    const token = /[MDLV]|C[MD]?|X[CL]?|I[XV]?/g
    const key = {
        M: 1000,
        CM: 900,
        D: 500,
        CD: 400,
        C: 100,
        XC: 90,
        L: 50,
        XL: 40,
        X: 10,
        IX: 9,
        V: 5,
        IV: 4,
        I: 1
    }

    let num = 0
    let m = ""
    if (!(stc && validator.test(stc))) {
        return false
    }
    // eslint-disable-next-line no-cond-assign
    while (m = token.exec(stc)) {
        num += key[m[0]]
    }
    return num
}

function txtUnitRomanize(value) {
    if (isNaN(value)) {
        return "-"
    } else if (_isBigNumber(value)) {
        return romanize(toNumber(value))
    } else {
        return romanize(parseInt(value))
    }
}

export {
    romanize,
    deromanize,
    ___fromSun,
    ___fromSun2Floor,
    ___fromTrxToSun,
    ___fromSunBnShort,
    ___fromSunBNLong,
    _isBigNumber,
    generateReferCode,
    byBigNumberFloat,
    toNumber,
    toBigNumber,
    FillZero,
    trx,
    trxLong,
    trxUnit,
    hexUnitFloat,
    txtUnit,
    txtUnitRomanize,
    duration,
    hexBlockTime,
    blocktime,
    sum,
    coinbase
}
