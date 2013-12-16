# Invoke Jekyll Skeleton

[TOC]

Skeleton code to set up a static website that is generated with Jekyll, with a layout and styling backed by Boostrap.

Currently uses

* [Jekyll](http://jekyllrb.com/) 1.2.1
* [Bootstrap](http://getbootstrap.com/) 3.0

# Installation

This has only been tested on OS X and Linux.

*Ruby* is a key requirement

## Mac

Ruby is already installed by default on Mac.
From this point onwards, you simply need to install [Jekyll](http://jekyllrb.com/)

* `gem install jekyll`
* `cd` path-to-jekyll-site
* `jekyll server --watch --port 4000` - This command tells Jekyll to spin off a standalone webserver which can be accessed from http://localhost:4000 . In addition any changes you make to the folder will be automatically built (this does NOT include changes to the less files)

## Linux

* Install Ruby for Linux via [RVM](https://rvm.io)
    * `sudo apt-get install curl`
    * `\curl -sSL https://get.rvm.io | bash -s stable`
* Follow same instructions as Mac
