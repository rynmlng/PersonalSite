from django.utils.functional import cached_property

from blog.models import BlogDatabase


class PostService(object):
    """ Service that harnesses all business logic and CRUD ops with blog posts. """

    @cached_property
    def collection(self):
        return BlogDatabase().get_collection('post')

    def get_all_posts(self, *fields):
        """ Get all blog posts, returned as an iterable DB cursor yielding dictionaries.
            Optionally passing in fields restricts the objects' fields returned.
        """
        if fields:
            return self.collection.find(projection=fields)
        else:
            return self.collection.find()

    def save_post(self, post):
        """ Save a blog post to the database and return its inserted id. """
        return self.collection.insert_one(post.serialize())

    def save_posts(self, posts):
        """ Bulk save blog posts to the database and return their inserted ids. """
        return self.collection.insert_many(map(lambda post: post.serialize(), posts))
