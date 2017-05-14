from fabric.api import cd, env, run

env.hosts = ('ryanmiling.com',)
env.forward_agent = True
env.user = 'ryan'

site_location = '/apps/personal_site'

def deploy():
    """ Deploy the latest code in git's master branch to production. """
    with cd(site_location):
        run('git reset HEAD --hard')
        run('git pull origin master')
