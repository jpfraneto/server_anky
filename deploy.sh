#!/bin/bash

# Navigate to the repository directory
cd /anky_backend

# Pull the latest changes from the master branch of the repo
git pull origin master

# Add any other commands you might need. For example:
# npm install (If you want to update Node.js packages)
pm2 restart anky_backend
