var bleno = require('bleno');

var BlenoCharacteristic = bleno.Characteristic;

class AccessCharacteristic extends BlenoCharacteristic {
    
    /**
     * @param {String} uuid - hexadecimal 128-bit uuid in following format xxxxxx-xxxx-xxxx-xxxxxxxx
     * @param {descriptor} descriptor - bleno descriptor for the characteristic
     * @param {callback} callback - function that will be called after the write request was made
     */
    constructor(uuid, descriptor, callback) {
        super({
            uuid: uuid,
            descriptors: [descriptor],
            properties: ['write'],
            value: null
        });
        this._updateValueCallback = callback;

    }

    onWriteRequest(data, offset, withoutResponse, callback) {
        this._updateValueCallback(data);
    }

}


module.exports = AccessCharacteristic;