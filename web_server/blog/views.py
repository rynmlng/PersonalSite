import json

from django.http import HttpResponse

from blog.services.posts import PostService


def ajax_posts(request):
    """ Get all blog posts ordered by created date, descending. """
    post_service = PostService()

    all_posts = post_service.get_all_posts('created_date', 'content')

    json_response = json.dumps(all_posts)

    return HttpResponse(json_response, content_type='application/json')
