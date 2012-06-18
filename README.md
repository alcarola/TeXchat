# TeXchat

## About

This is a trivial modification of [TeXchat](http://github.com/jbenet/TeXchat) built by [Juan Batiz-Benet](http://github.com/jbenet).

## Install

You first need to install node; use [this version](http://nodejs.org/dist/v0.6.19/node-v0.6.19.tar.gz). 

Then do

    git clone https://github.com/alcarola/TeXchat/ texchat
    cd texchat
    npm install

Start the chat server using

    node backend/server.js

and go to [http://localhost:8080/](http://localhost:8080/) in your favorite
web browser.


## License

TeXchat is under the MIT License.
All dependency libraries are each under their own license.


## Contact

Feel free to contact me.


##TODO##

Make TeXchat runnable in an Apache server.

Make script to start node daemon on server boot.

Use local mathjax installation.

Translate into Swedish

Show LaTeX source if clicked.

Write chatlog to disk.


