var bleno = require('bleno');

var BlenoCharacteristic = bleno.Characteristic;

class ReadCharacteristic extends BlenoCharacteristic {
    constructor(uuid, descriptor, value) {
        super({
            uuid: uuid,
            descriptors: [descriptor],
            properties: ['read'],
            value: value
        });
    }

    onReadRequest(offset, callback) {
        value = this.value;
        if(typeof(value) === "function"){
            value = value()
        }
        //value = value.toString('hex');
        callback(this.RESULT_SUCCESS, this._value);
    }
}


module.exports = ReadCharacteristic;