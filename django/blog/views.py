from django.http import HttpResponse

import json


def ajax_posts(request):
    """ Get all blog posts ordered by created date, descending. """
    response_payload = {}

    # TODO get posts and load them into response_payload

    json_response = json.dumps(response_payload)

    return HttpResponse(json_response, content_type='application/json')
