from django.shortcuts import render


def index(request):
    """ Returns the site's main index. """
    return render(request, 'index.html')
