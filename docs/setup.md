# Setup
This is a comprehensive guide to set up this personal site on a server. Steps found below are under the assumption that this is a dedicated server with no other conflicting applications running. Instructions provided below are for **Ubuntu 16.04.2 LTS**.


## Overall
This full stack web application consists of the following environment:

* Django - web application framework
* gunicorn - manages a Python web application
* Fabric - Python utility to perform remote server operations
* Less - CSS formatting
* MongoDB - document database
* NGINX - web server
* Python - underlying language supporting Django
* Supervisord - process control system for services to stay alive
* Redis - key-value database as a cache & session backend

There are some bits of software that are overhead for what we need to accomplish and that's with the intention of futureproofing some exciting projects coming down the pike.


## Build Out The Environment
All of this is done as a root user:

1. The website will have all of its content found within `/apps/PersonalSite` so `mkdir /apps` and `git clone` this repository.
2. `cd` into the git repository and `pip install` requirements via `pip install -r requirements.txt`
3. `apt-get install` the following...
    * mongodb-org
    * nginx
    * npm
    * python2.7
    * python-dev
    * redis-server
    * supervisor
4. Install LESS compilation tools via `npm install -g less less-plugin-clean-css`

The last bit of files required are sensitive, untracked configurations. Copy over a `PersonalSite/web_server/main/local_settings.py` file from a known working server. **Do not share this, keep it secure.**


## Non-dedicated server
If this application needs to be set up on a server that is not dedicated and has shared resources an alternative approach is required.

1. Install `virtualenv` via `sudo apt-get install virtualenv`
2. Activate a virtual environment from within the app's repository via `source venv/bin/activate`
3. `pip install` Python packages while the virtual environment is activated


## Databases
This application requires 2 databases to be started & configured - MongoDB & Redis.


### MongoDB
After MongoDB is installed you must get it up and running. Run Mongo as a daemon to ensure you need not worry about starting it everytime: `mongod --fork --logpath /var/log/mongodb/mongodb.log`


### Redis
Redis requires some additional configuration for the application. Follow [this guide](http://michal.karzynski.pl/blog/2013/07/14/using-redis-as-django-session-store-and-cache-backend/) to ensure everything is properly configured, including required sockets.


## Configuring Web Services
Rather than repeat everything from an excellent tutorial, I suggest reading it. Look in the **Resources** section for the **Full Stack Tutorial.**


## Resources
* [Installing MongoDB on Ubuntu](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/)
* [Running MongoDB in the background](https://docs.mongodb.com/manual/tutorial/manage-mongodb-processes/)
* [Setting up Redis as a Django backend](http://michal.karzynski.pl/blog/2013/07/14/using-redis-as-django-session-store-and-cache-backend/)
* [Django/NGINX/gunicorn Complete Full Stack Tutorial](http://michal.karzynski.pl/blog/2013/06/09/django-nginx-gunicorn-virtualenv-supervisor/)
