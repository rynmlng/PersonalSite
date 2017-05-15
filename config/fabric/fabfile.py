from fabric.api import cd, env, run, sudo

env.hosts = ('ryanmiling.com',)
env.forward_agent = True
env.user = 'ryan'

site_location = '/apps/PersonalSite'


def deploy():
    """ Deploy the latest code in git's master branch to production. """
    with cd(site_location):
        sudo('git reset HEAD --hard')
        sudo('git pull origin master')


def uptime():
    """ Lightweight command to ensure the remote server is up and running. """
    run('uptime')
