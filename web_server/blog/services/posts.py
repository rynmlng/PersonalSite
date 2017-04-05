from blog.models import BlogDatabase


class PostService(object):
    """ Service that provides harnesses all business logic and interactions with blog posts. """

    def get_all_posts(self):
        """ Get all blog posts, returned as an iterable DB cursor.
            When iterated over this returns a list of dictionaries with keys content, created_datetime, and _id.
        """
        return BlogDatabase().get_collection('post').find()

    # TODO save blogs w/a created_date & content

    def save_post(self, created_datetime, content):
        """ Save a blog post being provided the datetime is was created and the markdown content.
            The datetime must be provided because datetime.dates are not BSON-serializable.
        """
        post = {'created_datetime': created_datetime, 'content': content}

        #BlogDatabase().get_collection('post').insert_one(
