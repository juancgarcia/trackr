Simple stat tracking and regurgitation web app built in plain nodejs with mongoose models.

# Installation/Dependencies
sudo apt-get install git node npm mongo # (or equivalent install command for your system)

git clone git@github.com:juancgarcia/trackr.git
cd trackr
npm install


# Configuration

create a db in mongo
ex: 'climate'

add a user to this db with RW access, and provide a password
ex:
    username: trackr-user
    password: fakepass

export an environment variable `mongoCreds` for your mongo connection details
the connection string is of the form:

username:passwort@server:port/dbname

ex:
mongoCreds=trackr-user:fakepass@localhost:27017/climate && export mongoCreds


# Run server

node trackr