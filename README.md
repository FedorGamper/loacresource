# This is the implementation of the LOAC protocol for the resource

This is just a proof of concept and not a save implementation.

## To install on a Raspberry pi 3 follow the following steps:


Install Raspbian 
<https://www.raspberrypi.org/downloads/raspbian/>

Install nodejs version **8**
```
curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -  
sudo apt-get install -y nodejs
```

Install Bleno and the loacProtocol library
```
sudo apt-get install bluetooth bluez libbluetooth-dev libudev-dev  
npm install  
```
## Start the application

Start the application by running following command in the Terminal:

```
sudo node main.js -c config.json
```

To get some debug information run:
```
sudo node main.js -c config.json -v
```



