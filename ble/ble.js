var bleno = require('bleno');
var AccessCharacteristic = require('./AccessCharacteristics.js');
var ReadCharacteristics = require("./ReadCharacteristics")

function start(name, UUID, callback, v) {
    var accessDescriptor = new bleno.Descriptor({uuid:"3333", value: "This is the characteristic to sent the access request"});
    var descriptor = new bleno.Descriptor({uuid:"1233", value: "TODOO Change Me"})
    // A characteristic can have zero or multiple descriptors
    var accessCharacteristics = new AccessCharacteristic(UUID.accReq, accessDescriptor, callback);
    var timeCharacteristics = new ReadCharacteristics(UUID.time, descriptor, Date.now );
    var nameCharacteristics = new ReadCharacteristics(UUID.name, descriptor, name);
    var statusCharacteristics = new ReadCharacteristics(UUID.state, descriptor, "open")

    // A Service can have zero or multiple characteristics
    var accessService = new bleno.PrimaryService({
        uuid: UUID.service,
        characteristics: [
            accessCharacteristics,
            timeCharacteristics,
            nameCharacteristics,
            statusCharacteristics
        ]
      });

    //
    // Wait until the BLE radio powers on before attempting to advertise.
    // If you don't have a BLE radio, then it will never power on!
    //
    bleno.on('stateChange', function (state) {
        if (state === 'poweredOn') {
            //
            // We will also advertise the service ID in the advertising packet,
            // so it's easier to find.
            //
            bleno.startAdvertising("LOAC", [accessService.uuid], function (err) {
                if (err) {
                    // todo Error handling
                    console.error(err);
                }
            });
        } 
        else {
            if(v){
                console.error("Bluetooth could not swich on. Check device if it supports Buetooth Low Energy")
            }
            bleno.stopAdvertising();
        }
    });

    bleno.on('advertisingStart', function(err) {
        if (!err) {
          if(v){
            console.log('Start Advertising Service...');
            }
          //
          // Once we are advertising, it's time to set up our services,
          // along with our characteristics.
          //
          bleno.setServices([
            accessService
          ]);
          if(v){
              console.log("Services added")
          }
        }
      });

}

module.exports.start = start;