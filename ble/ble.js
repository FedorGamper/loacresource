var bleno = require('bleno');
var AccessCharacteristic = require('./AccessCharacteristics.js');
var ReadCharacteristics = require("./ReadCharacteristics")

/**
 * Starts the BLE advertisement and adds the service and the characteristics
 * @param {String} name - the name of the resource
 * @param {function} timeFunc - function that returns the current time, formatted in the correct format for the protocol
 * @param {object} uuid - hexadecimal 128-bit uuid in following format xxxxxx-xxxx-xxxx-xxxxxxxx for all characteristics and services
 * @param {function} callback - function that is called when the write request was made
 */
function start(name, timeFunc, UUID, callback) {
    // Descriptors that describe the characteristics
    // 2901 = Characteristic User Description
    var accessDescriptor = new bleno.Descriptor({uuid:"2901", value: "This is the characteristic to sends the access request"});
    var timeDescriptor = new bleno.Descriptor({uuid:"2901", value: "This is the characteristic to sends the time of the resource"})
    var nameDescriptor = new bleno.Descriptor({uuid:"2901", value: "This is the characteristic to sends the name of the resource"})
    var statusDescriptor = new bleno.Descriptor({uuid:"2901", value: "This is the characteristic to sends the status of the resource"})

    // A characteristic can have zero or multiple descriptors
    var accessCharacteristics = new AccessCharacteristic(UUID.accReq, accessDescriptor, callback);

    //read characteristics
    var timeCharacteristics = new ReadCharacteristics(UUID.time, timeDescriptor, timeFunc);
    var nameCharacteristics = new ReadCharacteristics(UUID.name, nameDescriptor, name);
    var statusCharacteristics = new ReadCharacteristics(UUID.state, statusDescriptor, global.status)

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
            if(verbose){
                console.error("Bluetooth could not swich on. Check device if it supports Buetooth Low Energy")
            }
            bleno.stopAdvertising();
        }
    });

    bleno.on('advertisingStart', function(err) {
        if (!err) {
          if(verbose){
            console.log('Start Advertising Service...');
            }
          //
          // Once we are advertising, it's time to set up our services,
          // along with our characteristics.
          //
          bleno.setServices([
            accessService
          ]);
          if(verbose){
              console.log("Services added")
          }
        }
      });

}

module.exports.start = start;