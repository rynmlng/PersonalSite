from collections import namedtuple
from datetime import datetime
import json
import os
import os.path

from django.conf import settings
from django.core.management.base import BaseCommand

from blog.models import BlogPost
from blog.services.posts import PostService
from blog.utils import user_prompt


MAX_TITLE_LENGTH = 50


def command_function(func):
    """ Provides additional support for command fnuctions including formatting output. """
    def func_wrapper(self, *args, **kwargs):
        self.stdout.write('')
        return func(self, *args, **kwargs)

    return func_wrapper


def get_post_info_from_file(file_location):
    """ For a given blog post's file location return its information as a BlogPost object. """
    if not os.path.exists(file_location):
        raise IOError('{} file does not exist.'.format(file_location))

    with open(file_location, 'rb') as json_file:
        file_json = json.load(json_file)

        try:
            created_datetime = datetime.fromtimestamp(file_json['created_datetime'])
        except (TypeError, ValueError):
            raise ValueError('Timestamp {} in {} is malformed'.format(file_json['created_datetime'], file_location))

        return BlogPost(
            content=file_json['content'],
            created_datetime=created_datetime,
            title=file_json['title']
        )


class Command(BaseCommand):
    help = 'Manage blog post content in the database.'

    def add_arguments(self, parser):
        """ Add command line arguments to the command. """
        parser.add_argument(
            '-l', '--list',
            action='store_true', dest='list', default=False,
            help='List all blog posts by title.'
        )

        parser.add_argument(
            '-s', '--sync',
            action='store_true', dest='sync', default=False,
            help='Sync all posts from the file system to the database, validating on title name.'
        )

    def handle(self, *args, **options):
        if options['list']:
            self.list_posts()

        if options['sync']:
            self.sync_posts()

    @command_function
    def list_posts(self):
        """ List all blog posts by title. """
        self.stdout.write('Getting all posts from the database...')

        all_posts = list(PostService().get_all_posts())
        if not all_posts:
            self.stdout.write('No posts were found.')
        else:
            for i, post in enumerate(all_posts, start=1):
                self.stdout.write('{:>3}. {} {}'.format(
                    i, post['title'][:MAX_TITLE_LENGTH], post['created_datetime'].strftime('%m/%d/%y'))
                )

    @command_function
    def sync_posts(self):
        """ Sync all blog posts from the file system to the database. """
        post_service = PostService()

        database_posts = {}
        for post in post_service.get_all_posts('created_datetime', 'title'):
            database_posts[post['title']] = post['created_datetime']

        self.stdout.write('{} posts found in the database.'.format(len(database_posts)))

        file_posts = []
        for filename in os.listdir(settings.CONTENT_DIR):
            if filename.endswith('.json'):
                post = get_post_info_from_file(os.path.join(settings.CONTENT_DIR, filename))
                file_posts.append(post)

        self.stdout.write('{} posts found on the file system.'.format(len(file_posts)))

        self.stdout.write('')
        self.stdout.write('Is Synced?  {{:^{}}}'.format(MAX_TITLE_LENGTH).format('Title'))

        posts_to_sync = []
        if database_posts:
            for file_post in file_posts:
                if database_posts.get(file_post.title) == file_post.created_datetime:
                    is_synced = True
                else:
                    is_synced = False

                if is_synced:
                    sync_status = u'\u2713'
                else:
                    sync_status = ' '
                    posts_to_sync.append(file_post)

                self.stdout.write(u'      [{}]        {}'.format(sync_status, file_post.title[:MAX_TITLE_LENGTH]))
        else:
            for post in file_posts:
                self.stdout.write('      [ ]        {}'.format(post.title[:MAX_TITLE_LENGTH]))
                posts_to_sync.append(post)

        self.stdout.write('')
        if posts_to_sync:
            user_answer = user_prompt('{} posts to sync, proceed?'.format(len(posts_to_sync)), ('y','N'))

            if user_answer == 'y':
                result = post_service.save_posts(posts_to_sync)
                self.stdout.write('{} posts have been saved to the database.'.format(len(result.inserted_ids)))
        else:
            self.stdout.write('There are no posts to sync.')
