var bleno = require('bleno');

var BlenoCharacteristic = bleno.Characteristic;

class AccessCharacteristic extends BlenoCharacteristic {
    constructor(uuid, descriptor, callback) {
        super({
            uuid: uuid,
            descriptors: [descriptor],
            properties: ['write'],
            //secure: ['write'],
            value: null
        });
        this._updateValueCallback = callback;

    }

    onWriteRequest(data, offset, withoutResponse, callback) {
        console.log(data);
        this._updateValueCallback(data);
    }

}


module.exports = AccessCharacteristic;