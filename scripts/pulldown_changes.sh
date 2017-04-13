#!/bin/bash

APP_DIR='/apps/personal_site/'
DEV_DIR='~/Development/PersonalSite/'

echo Pulling down files from $APP_DIR into this directory...
command sudo cp -R $APP_DIR/* $(pwd)
echo Done
