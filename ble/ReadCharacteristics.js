var bleno = require('bleno');

var BlenoCharacteristic = bleno.Characteristic;

class ReadCharacteristic extends BlenoCharacteristic {
    constructor(uuid, descriptor, value) {
        super({
            uuid: uuid,
            descriptors: [descriptor],
            properties: ['read'],
            value: null
        });
        this._value = value;
        
    }

    onReadRequest(offset, callback) {
        var value = this._value;
        if(typeof(value) === "function"){
            value = value()
            console.log(value)
        }
        //value = value.toString('hex');
        callback(this.RESULT_SUCCESS, new Buffer(value));
    }
}


module.exports = ReadCharacteristic;