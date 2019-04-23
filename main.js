var ble = require("./ble/ble.js");
var coffeeMaker = require("./coffeeMaker.js");

var argv = require('yargs')
  .usage("Usage: sudo node $0 -c config.json")
  .alias("h", "help").describe("h", "Show Help").help("h")
  .alias("v", "verbose").describe("v", "Show debug information").boolean("v")
  .config().alias("config","c").describe("c", "Path to the config file").coerce("c",(arg)=>{return require("./"+arg)})
  .demandOption(["c"]).argv

var config = argv.c

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

if (verbose) {
  console.log("Resource Name: " + name +
    "\nResource UUID: " + JSON.stringify(UUID) +
    "\nTrusted Public Keys: " + JSON.stringify(trustStore) +
    "\nTime derivation threshold: " + timeDerivationThreshold
  )
}

// create the resource
var resource = new loac.Resource(name, trustStore.IA, trustStore.PA, timeDerivationThreshold);
var coffeeMaker = new coffeeMaker();

if (argv.v) {
  console.log("Resource instance created")
}

/**
 * function called when data are sent to the access request is sent to the resource
 * @param {Buffer} data - The data recived from the write request on the resource
 */

function callback(data) {
  if (argv.v) {
    console.log("BLE data recived: " + data.toString('hex'));
  }
  try {
    resource.checkAccessRequest(data, accessGranted);
  } catch (err) {
    console.error(err);
  }
}

/**
 * This funktion handels the communication with the resource hardware once the request is validated
 * @param {String} description - The type of valid request the user made
 */
function accessGranted(username, description) {
  if (argv.v) {
    console.log("user : " + username + " wants to: " + description)
  }

  switch (description) {
    case "brew small coffee":
      coffeeMaker.makeCoffee(1);
      break;
    case "brew large coffee":
      coffeeMaker.makeCoffee(2);
      break;
    /* 
    case "get logfile":
      if(username === trustStore.RO){
        //todo send the log file back
      }
    */
    default:
      throw "Description not supported"
  }
}

//starting the buetooth low energy service
ble.start(name, () => loac.utils.dateToUnixTime(new Date()), UUID, callback);