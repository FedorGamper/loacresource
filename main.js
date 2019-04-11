var ble = require("./ble/ble.js");
var argv = require('yargs')
  .usage("Usage: sudo node $0 -c config.json")
  .alias("h", "help").describe("h", "Show Help").help("h")
  .alias("v", "verbose").describe("v", "Show debug information").boolean("v")
  .alias("c", "config").describe("c", "path to the config file")
  .demandOption(["c"]).argv

//for example let onboard led blink
//var RpiLeds = require("rpi-leds");
//var leds = new RpiLeds(); 

// check if file ends with .json, option i for case insensitive
if(argv.c.match(".json$", "i")){
  var config = require("./" + argv.c);
}
else{
  console.log("Give config file as a .json file");
  process.exit();
}

// require protocol, catch if the cyber suite is not supported
try {
  var loac = require("loacprotocol").init(config.suite);
} catch (err) {
  console.log(err);
  process.exit()
}

var trustStore = config.trustStore;
var timeDerivationThreshold = config.derivationThreshold;
var name = config.name;
var UUID = config.uuid;
global.status = "ready";
global.verbose = argv.v;

if(verbose){
  console.log("Resource Name: "+ name+
  "\nResource UUID: " +UUID +
  "\nTrusted Public Keys: " +trustStore +
  "\nTime derivation threshold: " + timeDerivationThreshold
  )}

// create the resource
var resource = new loac.Resource(name, trustStore.CA, trustStore.PA, timeDerivationThreshold);

if(argv.v){
  console.log("Resource instance created")
}

/**
 * function called when data are sent to the access request is sent to the resource
 * @param {Buffer} data - The data recived from the write request on the resource
 */

function callback(data) {
  if(argv.v){
    console.log("BLE data recived: "+data);
  }
  try{
    resource.checkAccessRequest(data, accessGranted);
  }
  catch(err){
    console.error(err);
  }
}

/**
 * This funktion handels the communication with the resource hardware once the request is validated
 * @param {String} description - The type of valid request the user made
 */
function accessGranted(username, description) {
  if(argv.v){
    console.log("user : " + username+" wants to: "+description)
  }
  //todo actually do something
  status = "busy"
  //blink status light for 5 sec
//  leds.status.blink();
  var waitTill = new Date(new Date().getTime() + 20 * 1000);
  while(waitTill > new Date()){}
//  leds.reset()
  status = "ready"
  //todo handle multiple access types
  //console.log("You Succsessfully accessed the resource!!! \nAccess Description:"+description);
}

//starting the buetooth low energy service
ble.start(name, ()=>loac.utils.dateToUnixTime(new Date()), UUID, callback);