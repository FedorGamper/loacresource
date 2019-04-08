var bleno = require('bleno');

var BlenoCharacteristic = bleno.Characteristic;

class ReadCharacteristic extends BlenoCharacteristic {
    constructor(uuid, descriptor, value, v=false) {
        super({
            uuid: uuid,
            descriptors: [descriptor],
            properties: ['read'],
            value: null
        });
        this._value = value;
        this.verbose = v;
        
    }

    onReadRequest(offset, callback) {
        var value = this._value;
        if(typeof(value) === "function"){
            value = value().toString();
        }
        if(this.verbose){
            console.log("The value of characteristic:"+ this.uuid +" is: "+value);
        }
        callback(this.RESULT_SUCCESS, new Buffer(value));
    }
}


module.exports = ReadCharacteristic;