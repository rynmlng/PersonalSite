from fabric.api import cd, env, run

env.hosts = ('ryanmiling.com',)
env.user = 'ryan'

def deploy():
    """ Deploy the latest code in git's master branch to production. """
    cd('/home/ubuntu/apps/PersonalSite')
    run('git pull origin master')
    # TODO do we need to kick the wsgi handler?
