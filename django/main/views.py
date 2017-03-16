from django.shortcuts import render

from blog.services.posts import PostService


def index(request):
    """ Returns the site's main index. """
    post_service = PostService()

    blog_posts = list(post_service.get_all_posts())

    return render(request, 'index.html', {'blog_posts': blog_posts})
