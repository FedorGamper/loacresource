var ble = require("./ble/ble.js");

var coffeeMaker = require("./coffeeMaker.js");
var argv = require('yargs')
  .usage("Usage: sudo node $0 -c config.json")
  .alias("h", "help").describe("h", "Show Help").help("h")
  .alias("v", "verbose").describe("v", "Show debug information").boolean("v")
  .alias("c", "config").describe("c", "path to the config file")
  .demandOption(["c"]).argv


// check if file ends with .json, option i for case insensitive
if (argv.c.match(".json$", "i")) {
  var config = require("./" + argv.c);
} else {
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
var coffeeMaker = new coffeeMaker();

if (verbose) {
  console.log("Resource Name: " + name +
    "\nResource UUID: " + JSON.stringify(UUID) +
    "\nTrusted Public Keys: " + JSON.stringify(trustStore) +
    "\nTime derivation threshold: " + timeDerivationThreshold
  )
}

// create the resource
var resource = new loac.Resource(name, trustStore.IA, trustStore.PA, timeDerivationThreshold);

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
    case "Make one coffee":
      coffeeMaker.makeCoffee(1);
      break;
    case "Make two coffees":
      coffeeMaker.makeCoffee(2);
      break;
    default:
      throw "Description not supported"
  }
}

//starting the buetooth low energy service
ble.start(name, () => loac.utils.dateToUnixTime(new Date()), UUID, callback);