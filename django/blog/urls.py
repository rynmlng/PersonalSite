from django.conf.urls import url
from django.contrib import admin

from blog import views

urlpatterns = (
    url(r'^blog/ajax_posts$', views.ajax_posts, name='ajax_posts'),
)
