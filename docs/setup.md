# Setup

## First-time

Clone this repo into your target directory.

### Python requirements

1.`cd` into the repo's root directory.
2. In the repo's root directory run `virtualenv venv`
3. `source venv/bin/activate`
4. `pip install -r requirements.txt`


### MongoDB
  * https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/


### Apache 2
  * sudo apt-get install apache2 apache2-dev


### mod_wsgi
  * http://modwsgi.readthedocs.io/en/develop/user-guides/quick-installation-guide.html


## Starting the server

1. Start MongoDB via `mongod`
2. Start the web server...
  1. `cd` into your repo's root.
  2. `cd django`
  3. `./manage.py runserver` to start the web server

TODO starting the databases
