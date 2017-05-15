# Deploy
In order to make deployments we will make use of a Python library called [Fabric](http://www.fabfile.org/).

## Instructions
1. `cd` into the root directory of the git repo for this project.
2. Run `bin/fab uptime` to ensure the remote server exists and you have proper permissions.
3. In order to deploy new code run `bin/fab deploy`.

Understand the implications of running commands and make sure to read the fabfile [here](https://github.com/rynmlng/PersonalSite/blob/master/config/fabric/fabfile.py).
