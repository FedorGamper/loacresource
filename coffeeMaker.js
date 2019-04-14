var gpio = require("onoff").Gpio;
var sleep = require("sleep").sleep;

class coffeeMaker {

    constructor(){
        let pinSingle = 17; //gpio pin for the single coffee
        let pinDouble = 16; //gpio pin for the double coffee
        let relaySingle = new gpio(pinSingle, "high"); //set voltage high immediately  
        let relayDouble = new gpio(pinDouble, "high");

        if(verbose){
            console.log("Relays are inizialized");
        }
    }

    makeCoffee(count) { 
        switch(count){
            case 1: relay = relaySingle; pin = pinSingle; break;
            case 2: relay = relayDouble; pin = pinDouble; break;
            default : throw "CoffeeMaker: no valid coffee count"; 
        }

        relay.writeSync(0);
        if(verbose){
            console.log("GPIO pin "+ pin +" set to low");
        }

        sleep(1); // click the button one second
        relay.writeSync(1)
        if(verbose){
            console.log("GPIO pin "+ pin +" set to high");
        }
    }
    unexport(){
        relaySingle.unexport;
        relayDouble.unexport;
        
        if(verbose){
            console.log("Pins Unexported")
        }
    }
}
module.exports = coffeeMaker;