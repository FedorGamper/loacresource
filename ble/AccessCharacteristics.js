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
        this._checkAccessRequestCallback = callback;

    }

    onWriteRequest(data, offset, withoutResponse, callback) {
        callback(this.RESULT_SUCCESS); // response to the BLE the wirte reqest

        var i = data.length-1
        for(; i>0; i--)
        {
            if(data[i] != 0)
                break;
        }

        data = data.slice(0, i+1);

        console.log("Received " + data.length + " bytes");

        this._checkAccessRequestCallback(data); //checks the Access Request
    }
}


module.exports = AccessCharacteristic;