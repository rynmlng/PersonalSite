from django.conf import settings
from django.db import models
from pymongo import MongoClient


class MongoDatabase(object):
    DATABASE_NAME = None

    def __init__(self):
        if not self.DATABASE_NAME:
            raise ValueError('A database name must be provided at the class-level.')

        # TODO should `client` or `database` be a cached_property and in case the connection times out it refreshes?
        client = MongoClient(
            settings.MONGO_DATABASE['blog']['HOST'],
            settings.MONGO_DATABASE['blog']['PORT']
        )

        self.database = getattr(client, self.DATABASE_NAME)

    def get_collection(self, collection_name):
        """ Return a pymongo collection from the database. """
        return getattr(self.database, collection_name)


class BlogDatabase(MongoDatabase):
    DATABASE_NAME = settings.MONGO_DATABASE['blog']['NAME']
