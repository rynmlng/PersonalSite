from django.conf.urls import include, url
from django.contrib import admin

from main import views


urlpatterns = (
    url(r'^$', views.index, name='index'),
)

urlpatterns += (
    url(r'^blog/', include('blog.urls')),
)
