# PersonalSite

## Next Steps
### Features
* [x] Download all external assets
  * [x] Lato font and include via css link tags
  * [x] imgur image and implement local

* [ ] Mobile-friendly
  * [ ] Hamburger button for nav
  * [ ] Single image clicked goes to full-screen (what about small preview?)
  * [ ] Font-sizes (move to em?)

* [ ] Identity gallery should be images uploaded manually, weekly
  * [ ] Compress images, thumbnails?

* [ ] Top-down CSS review & cleanup, nix anything commented

* [ ] Mobile, narrow-browser CSS

* [ ] Navigation
  * [x] Waypoint to hide/show nav
  * [x] Bookmark nav movement
  * [ ] Go to Top link (kind of lame, maybe just make the first section identity?
  * [ ] Clicking on Identity goes to top of page, b/c Identity section is at the top

* [ ] Section UIs
  * [ ] Identity
  * [x] Nav (all that's left is to make a position fixed
  * [ ] Quote
  * [ ] Social
  * [ ] Blog (collection of thoughts, full breakdowns too)

* [ ] Copyright blog material

### Bugs
* [x] First and second banner don't align on their left side. Taking off `justify-content: center` fixes it,
        but breaks everything else.
* [ ] Gallery preview should disappear when nav is engaged mid-preview. A mouse-out event may help.
* [ ] Laggy when scrolling due to making all images opaque.

## Coding Style
To encourage unified coding style and system file structure here are some guidelines to follow for contribution:

* Indentation - use 2-spaces, no tabs
* Casing
  * JavaScript is camelcased
  * Less is all lowercase, hyphens for word separation
  * HTML is all lowercase, hyphens for word separation
  * Files are all lowercase, underscores for word separation
* Commenting
  * All functions should have their signatures commented because names alone cannot explain what something does.
  * Comments elsewhere should be lightweight enough that they need not be highly maintained.

## Future Ideas
* Add flip effect to the main web page
* Leave all content on 1 web page, be dynamic, load lazily

## References
* [Live Codepen](http://codepen.io/anon/pen/ZLzLYE)
* [CSS text shadows & embossing](https://designshack.net/articles/css/12-fun-css-text-shadows-you-can-copy-and-paste/)
* [CSS text shadows & embossing 2](http://css-snippets.com/engraved-text/)
* [CSS flexbox guide](https://css-tricks.com/snippets/css/a-guide-to-flexbox/)
* [CSS+JS Scotch tape effcet](http://codepen.io/oloman/pen/gDbmL)
* [JS Packery](http://packery.metafizzy.co/layout.html)
* [JS Flipping containers](https://nnattawat.github.io/flip/)
