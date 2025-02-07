function initAQM1602 () {
    basic.pause(100)
    writeCommand(56)
    writeCommand(57)
    writeCommand(20)
    writeCommand(115)
    writeCommand(86)
    writeCommand(108)
    writeCommand(56)
    writeCommand(1)
    writeCommand(12)
}
function READ_TEMP (TEMP_Commamd: number) {
    pins.i2cWriteNumber(
    TEMP_ADDRESS,
    TEMP_Commamd,
    NumberFormat.UInt8BE,
    true
    )
    TEMP_READ_VAL = pins.i2cReadNumber(TEMP_ADDRESS, NumberFormat.UInt8BE, false)
    return TEMP_READ_VAL
}
// 62=0x3E
// 
// 16384=0x4000
function writeData (dat: string) {
    pins.i2cWriteNumber(
    LCD_ADDRESS,
    16384 + dat.charCodeAt(0),
    NumberFormat.UInt16BE,
    false
    )
    basic.pause(1)
}
function Init_TEMP () {
    pins.i2cWriteNumber(
    TEMP_ADDRESS,
    3,
    NumberFormat.UInt8BE,
    true
    )
    pins.i2cWriteNumber(
    TEMP_ADDRESS,
    128,
    NumberFormat.UInt8BE,
    false
    )
}
function writeCommand (command: number) {
    pins.i2cWriteNumber(
    LCD_ADDRESS,
    0 + command,
    NumberFormat.UInt16BE,
    false
    )
    basic.pause(20)
}
let msg = ""
let temperture_TXT = 0
let temperture = 0
let tmp_L = 0
let tmp_H = 0
let TEMP_READ_VAL = 0
let LCD_ADDRESS = 0
let TEMP_ADDRESS = 0
TEMP_ADDRESS = 72
LCD_ADDRESS = 62
Init_TEMP()
initAQM1602()
serial.redirectToUSB()
basic.pause(1000)
basic.forever(function () {
    tmp_H = READ_TEMP(0)
    tmp_L = READ_TEMP(1)
    temperture = tmp_H * 256 + tmp_L
    temperture_TXT = Math.round(temperture / 13)
    temperture = temperture_TXT / 10
    serial.writeValue("Temperture", temperture)
    basic.showNumber(temperture)
    msg = convertToText(temperture_TXT)
    writeCommand(1)
    writeCommand(0)
    for (let index = 0; index <= msg.length - 2; index++) {
        writeData(msg.charAt(index))
    }
    writeData(".")
    writeData(msg.charAt(msg.length - 1))
    writeData(String.fromCharCode(13 * 16 + 15))
    writeData("C")
    basic.pause(1000)
})
