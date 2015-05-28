# LeadsPortal
## Leads portal for Spons department, Shaastra 2016
- After cloning the repo, ```cd``` into this ditectory and then execute ```npm install && bower install``` through terminal.
- If you don't have ```npm``` installed, then first you need to install ```nvm```,
  * If you are on linux, execute 
  ```curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.25.3/install.sh | bash``` from the terminal.
  * If you are on windows, you need to install it from [here](https://github.com/coreybutler/nvm-windows).
- Change the ```nodejs``` version by executing ```nvm install 0.10.35 && nvm use 0.10.35```.
- Then run ```npm install -g bower grunt grunt-cli express yo```.
- Make sure you have ```mongodb``` installed. Else you can install it from your software-center. 
- Then run ```grunt serve```
- If you are installing a new ```bower``` or ```npm``` package, do that using ```--save``` flag. 
For example, ```npm install --save <package name>``` or ```bower install --save <package name>```. This will ensure that the ```<package name>``` is saved in the respective ```package.json``` and ```bower.json``` files respectively.
- You must install ```ruby``` and ```sass``` for ```grunt serve``` to launch the app properly. You can install ```rvm``` and ```sass``` from these commands,
  * ```gpg --keyserver hkp://keys.gnupg.net --recv-keys 409B6B1796C275462A1703113804BB82D39DC0E3``` 
  * ```\curl -sSL https://get.rvm.io | bash -s stable --ruby``` 
  * ```sudo su -c "gem install sass"```
- You also need to install ```robomongo``` from [here](http://robomongo.org/) which is an interface to view your ```mongodb data```.
