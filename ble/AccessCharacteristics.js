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

        var onWriteRequestStartTime = Date.now();

        
        //chop the 0 bytes of the end of the access request
        var i = data.length - 1
        for (; i > 0; i--) {
            if (data[i] == 0xff )
                break;
        }
        data = data.slice(0, i);

        this._checkAccessRequestCallback(data); //checks the Access Request


        var onWriteRequestEndTime = Date.now();
        var processingTime = onWriteRequestEndTime - onWriteRequestStartTime;
        console.log("Processing Time: " + processingTime + "ms");

        callback(this.RESULT_SUCCESS); // response to the BLE the wirte reqest
    }
}


module.exports = AccessCharacteristic;