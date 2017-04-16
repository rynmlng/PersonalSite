from abc import ABCMeta, abstractproperty

from django.conf import settings
from django.db import models
from pymongo import MongoClient


class MongoDatabase(object):
    DATABASE_NAME = None
    CONNECTION_TIMEOUT = 10

    def __init__(self):
        if not self.DATABASE_NAME:
            raise ValueError('A database name must be provided at the class-level.')

        client = MongoClient(
            settings.MONGO_DATABASE['blog']['HOST'],
            settings.MONGO_DATABASE['blog']['PORT'],
            connectTimeoutMS=self.CONNECTION_TIMEOUT
        )

        self.database = getattr(client, self.DATABASE_NAME)

    def get_collection(self, collection_name):
        """ Return a pymongo collection from the database. """
        return getattr(self.database, collection_name)


class BlogDatabase(MongoDatabase):
    DATABASE_NAME = settings.MONGO_DATABASE['blog']['NAME']


class SimpleModel(object):
    """ Simple representation of a model requiring fields to be defined on instantiation. """

    @abstractproperty
    def fields(self):
        pass

    def __init__(self, **values):
        missing_fields = []
        for field in self.fields:
            if field not in values:
                missing_fields.append(field)
            else:
                setattr(self, field, values[field])

        if missing_fields:
            raise ValueError('Fields are missing from the model definition. ({})'.format(','.join(missing_fields)))

    def serialize(self):
        return {field: getattr(self, field) for field in self.fields}

    __metaclass__ = ABCMeta


class BlogPost(SimpleModel):
    """ Represents a blog post to save to the database. """

    @property
    def fields(self):
        return ('content', 'created_datetime', 'title')
