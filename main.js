var ble = require("./ble/ble.js");
var argv = require('yargs')
  .usage("Usage: sudo node $0 -c config.json")
  .alias("h", "help").describe("h", "Show Help").help("h")
  .alias("v", "verbose").describe("v", "Show debug information").boolean("v")
  .alias("c", "config").describe("c", "path to the config file")
  .demandOption(["c"]).argv

// check if file ends with .json, option i for case insensitive
if(argv.c.match(".json$", "i")){
  var config = require("./" + argv.c);
}
else{
  console.error("Give config file as a .json file");
  process.exit();
}

// require protocol, catch if the cyber suite is not supported
try {
  var loac = require("loacprotocol")(config.suite);
} catch (err) {
  console.error(err);
  process.exit()
}

var trustStore = config.trustStore;
var timeDerivationThreshold = config.derivationThreshold;
var name = config.name;
var serviceUUID = config.suuid;

if(argv.v){
  console.log("Resource Name: "+ name+
  "\nResource Service UUID: " +serviceUUID +
  "\nTrusted Public Keys: " +trustStore +
  "\nTime derivation threshold: " + timeDerivationThreshold
  )}

// create the resource
var resource = new loac.Resource(name, trustStore.CA, trustStore.PA, timeDerivationThreshold);

if(argv.v){
  console.log("Resource instance created")
}

//function called when data are sent to the access request is sent to the resource
function callback(value) {
  if(argv.v){
    console.log(value);
  }
  try{
    resource.checkAccessRequest(value, accessGranted);
  }
  catch(err){
    console.error(err);
  }
}

function accessGranted(description) {
  //todo actually do something
  //todo handle multiple access types
  console.log("You Succsessfully accessed the resource!!! \nAccess Description:"+description);
}

//starting the buetooth low energy service
ble.start(name, serviceUUID, callback, argv.v);


