site
====

[![](https://raw.github.com/raine/site/master/assets/screenshot.png)](http://raine.github.io)

### Tools and Libraries Used

* [nanoc](http://nanoc.ws), a static site generator
* [IcoMoon](http://icomoon.io), an icon fonts generator
* [Bootstrap](http://getbootstrap.com) for the layout
* [Fancybox](http://fancyapps.com/fancybox/), a jQuery lightbox plugin

### Points of Interest

* [Rakefile](https://github.com/raine/site/blob/master/Rakefile), deployment to GitHub and Dropbox.


### Setup

```sh
$ gem install nanoc -v 3.8
$ gem install uglifier rainpress
$ rake init_github_pages
```
