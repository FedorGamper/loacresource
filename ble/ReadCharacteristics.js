var bleno = require('bleno');

var BlenoCharacteristic = bleno.Characteristic;

class ReadCharacteristic extends BlenoCharacteristic {
    /**
    * @param {String} uuid - hexadecimal 128-bit uuid in following format xxxxxx-xxxx-xxxx-xxxxxxxx
    * @param {Descriptor} descriptor - bleno descriptor for the characteristic
    * @param {String | function} value - value or function to calculate the value to display
    */
    constructor(uuid, descriptor, value) {
        super({
            uuid: uuid,
            descriptors: [descriptor],
            properties: ['read'],
            value: null
        });
        //not in this.value since that can not be changed
        this._value = value;
        
    }

    onReadRequest(offset, callback) {
        var value = this._value;

        //compute the function if the value is a function
        //e.g. current time should always return the current time of the device
        if(typeof(value) === "function"){
            value = value().toString();
        }

        if(global.verbose){
            console.log("The value of characteristic:"+ this.uuid +" is: "+value);
        }

        //answers the read request
        callback(this.RESULT_SUCCESS, new Buffer(value));
    }
}


module.exports = ReadCharacteristic;