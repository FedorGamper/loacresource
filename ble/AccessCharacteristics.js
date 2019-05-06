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

        try{

            //chop the 0 bytes of the end of the access request
            var i = data.length - 1
            for (; i > 0; i--) {
                if (data[i] == 0xff )
                    break;
            }
            data = data.slice(0, i);


            var dataReadTime = Date.now() - onWriteRequestStartTime;
            console.log("Data read time: " + dataReadTime + " ms");

            this._checkAccessRequestCallback(data); //checks the Access Request

            console.log("Response: RESULT_SUCCESS");
            callback(this.RESULT_SUCCESS); // response to the BLE the wirte reqest
        }
        catch(err)
        {
            console.log("Response: RESULT_UNLIKELY_ERROR");
            callback(this.RESULT_UNLIKELY_ERROR);
        }
        
        var processingTime = Date.now(); - onWriteRequestStartTime;
        console.log("Processing time: " + processingTime + "ms");
    }
}


module.exports = AccessCharacteristic;