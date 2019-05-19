var gpio = require("onoff").Gpio;
//var sleep = require("sleep").sleep;

class coffeeMaker {

    constructor(){
        //initialize the pins that controls the relays
        this.pinSingle = 17; //gpio pin for the single coffee
        this.pinDouble = 16; //gpio pin for the double coffee
        this.relaySingle = new gpio(this.pinSingle, "out"); 
        this.relayDouble = new gpio(this.pinDouble, "out");

        if(verbose){
            console.log("Relays are initialized");
        }
    }

    makeCoffee(count) { 
        switch(count){
            case 1: 
                this.relay = this.relaySingle; 
                this.preparationTime = 75; //the coffee machine has max 1 min 15 sec to make a single coffee
                break;
            case 2: 
                this.relay = this.relayDouble;
                this.preparationTime = 105; //the coffee machine has max 1 min 45 sec to make a single coffee
                break;
            default : 
                throw "CoffeeMaker: no valid coffee count"; 
        }
        
        //set status characteristic to busy
        status = "busy";

        //close the cirquit
        this.relay.writeSync(1);
        if(verbose){
            console.log("GPIO pin set to :" + this.relay.readSync());
        }

        //sleep(1); // click the button one second
        setTimeout(()=>{
            this.relay.writeSync(0)
            if(verbose){
                console.log("GPIO pin set to :" + this.relay.readSync());
            }
            }
            , 1000);

        //set status back to ready after the preparation time is over
        setTimeout(()=>{
            status = "ready"
            if(verbose){
                console.log("Coffee is done");
            }
        },this.preparationTime * 1000);
        }

    unexport(){
        this.relaySingle.unexport;
        this.relayDouble.unexport;
        
        if(verbose){
            console.log("Pins Unexported")
        }
    }
}
module.exports = coffeeMaker;