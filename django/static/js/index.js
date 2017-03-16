var CONTENT_BOX_MARGIN = 20;

var MAX_RECTANGLES = 100;

var RECTANGLE_COLOR_CLASS_WEIGHTS = {
  'beige': 3,
  'blue': 2,
  'red': 5,
  'eggshellWhite': 8
};

var RECTANGLE_WIDTH = 100;

var RECTANGLE_SIZE_SCALARS = [1, 2, 3];


function getRandomHeatMap(weightedMap) {
  // Converts a value-weighted map to a heat map array, randomizing orientation.
  // e.g. {'x': 1, 'y': 2} -> {1: 'x', 2: 'y', 3: 'y'}
  var heatMap = [];

  for (var value in weightedMap) {
    if (weightedMap.hasOwnProperty(value)) {
      var weight = weightedMap[value];

      for (var i = 0; i < weight; i++) {
        heatMap.push(value);
      }
    }
  }

  var randomizedHeatMap = [],
      randomOffset = Math.floor(Math.random() * heatMap.length);

  for (var i = 0; i < heatMap.length; i++) {
    randomizedHeatMap.push(heatMap[(i + randomOffset) % heatMap.length]);
  }

  return randomizedHeatMap;
}

function addRandomRectangles($container) {
  /* Dynamically generate random rectangles within our scalar constraints and add to the DOM. */
  var colorClassHeatMap = getRandomHeatMap(RECTANGLE_COLOR_CLASS_WEIGHTS);

  var $rectangles = [];

  for (var i = 0; i < MAX_RECTANGLES; i++) {
    // cycle the heat map for a perfect distribution
    var colorCSSClass = colorClassHeatMap[i % colorClassHeatMap.length];

    var rectangleHeightScalar = RECTANGLE_SIZE_SCALARS[Math.floor(Math.random() * RECTANGLE_SIZE_SCALARS.length)],
        rectangleWidthScalar = RECTANGLE_SIZE_SCALARS[Math.floor(Math.random() * RECTANGLE_SIZE_SCALARS.length)];

    var $rectangle = $('<div class="rectangle ' + colorCSSClass +
            ' height' + rectangleHeightScalar +
            ' width' + rectangleWidthScalar +
            '"><div class="grunge"></div></div>');

    $rectangles.push($rectangle);
  }

  $container.append($rectangles);
}

function overridePackeryToCenter() {
  /* Override packery to center all items.
   * See http://packery.metafizzy.co/extras.html
   */
	var __resetLayout = Packery.prototype._resetLayout;
	Packery.prototype._resetLayout = function() {
		__resetLayout.call( this );
		// reset packer
		var parentSize = getSize( this.element.parentNode );
		var colW = this.columnWidth + this.gutter;
		this.fitWidth = Math.floor( ( parentSize.innerWidth + this.gutter ) / colW ) * colW;
		this.packer.width = this.fitWidth;
		this.packer.height = Number.POSITIVE_INFINITY;
		this.packer.reset();
	};

	Packery.prototype._getContainerSize = function() {
		// remove empty space from fit width
		var emptyWidth = 0;
		for ( var i=0, len = this.packer.spaces.length; i < len; i++ ) {
			var space = this.packer.spaces[i];
			if ( space.y === 0 && space.height === Number.POSITIVE_INFINITY ) {
				emptyWidth += space.width;
			}
		}

		return {
			width: this.fitWidth - this.gutter - emptyWidth,
			height: this.maxY - this.gutter
		};
	};

	// always resize
	Packery.prototype.needsResizeLayout = function() {
		return true;
	};
}

function addNavigationAutoScrolling() {
  var $links = $('.navigation .links'),
      navHeight = $links.height();

  $links.children('.link').each(
    function(i, link) {
      $(link).click(function() {
        var $section = $($(this).data('section-selector'));

        $('html, body').animate({
            scrollTop: $section.offset().top - navHeight
          }, 200, 'swing');

        $section.addClass('focus');
        // TODO should be a smoother way to make the scroll happen
      });
  });
}

function addNavigationWaypoints() {
  /** Add waypoints to the navigation to allow a floating navigation when
   *    the original navigation is out of the viewport.
   */
  var FLOATING_NAVIGATION_TOP_OFFSET = 0;

  var waypoint = new Waypoint({
    element: $('.navigation .links.static')[0],
    handler: function(direction) {
      var $floatingNavigation = $('.navigation .links.floating'),
          $staticNavigation = $('.navigation .links.static');

      if (direction == 'down') {
        $floatingNavigation.show();
        $staticNavigation.addClass('hidden');
      } else {
        $floatingNavigation.hide();
        $staticNavigation.removeClass('hidden');
      }
    },
    offset: FLOATING_NAVIGATION_TOP_OFFSET
  });

}

function addContentBoxWaypoints() {
  /* Add waypoints to the page's content boxes to allow focus-toggling
   *   when content comes into the viewport.
   *
   * Here are the rules:
   * - Scrolling down: when content-box is showing its bottom 100px, remove from focus
   * - Scrolling up: when content-box is showing its bottom 100px, put in focus
   *
   * - Scrolling down: when content-box is showing its top 100px, put in focus
   * - Scrolling up: when content-box is only showing top 100px, remove from focus
   */
  $('.content-box').each(
    function(i, contentBox) {
      var contentBoxHeight = $(contentBox).outerHeight(),
          viewportEdgeStartFade = 200; // px

      var topWaypoint = new Waypoint({
        element: contentBox,
        handler: function(direction) {
          if (direction == 'down') {
            $(this.element).removeClass('focus');
          } else {
            $(this.element).addClass('focus');
          }
        },
        offset: -1 * (contentBoxHeight - viewportEdgeStartFade)
      });

      var waypoint = new Waypoint({
        element: contentBox,
        handler: function(direction) {
          if (direction == 'down') {
            $(this.element).addClass('focus');
          } else {
            $(this.element).removeClass('focus');
          }
        },
        offset: window.innerHeight - viewportEdgeStartFade
      });
    }
  );
}

function addGalleryPreview() {
  /* Add look-and-feel of the gallery including hovering and preview movement
   * based on the mouse.
   */
  var $gallery = $('.gallery'),
      $previewPhoto = $gallery.children('.preview-photo');

  $gallery.children('.photo').hover(function() {
    $previewPhoto.css('backgroundImage', $(this).css('backgroundImage'));
    $previewPhoto.show();

    var photoHeight = $(this).outerHeight(),
        photoWidth = $(this).outerWidth(),
        photoPosition = $(this).offset();

    var photoPositionLeft = photoPosition.left,
        photoPositionTop = photoPosition.top,
        photoPositionBottom = photoPositionTop + photoHeight,
        photoPositionRight = photoPositionLeft + photoWidth;

    // TODO is document the right container to bind the event to?
    $gallery.mousemove(function(eventData) {
      if ((eventData.pageX < photoPositionLeft) ||
          (eventData.pageX > photoPositionRight) ||
          (eventData.pageY < photoPositionTop) ||
          (eventData.pageY > photoPositionBottom)) {

        $previewPhoto.hide();
        $(this).unbind('mousemove');
      } else {
        // percent down the image we should translate on the y-axis
        var yOffsetPercent = Math.round(100 * (eventData.pageY - photoPositionTop) / photoHeight) + '%';

        $previewPhoto.css('backgroundPositionY', yOffsetPercent);
      }
    });

    // Once we hover over the image if the mouse moves left, right, above, or below the image hide the preview
  });
}

function renderMarkdown() {
  /* Render all HTML elements with the class name 'markdown' with markdown styling. */
  $('.markdown').each(function() {
    $(this).html(marked($(this).text()));
  });
}

function setupBackground(reloadPackery) {
  /* Build the body background, specifically the rectangles. */
  var $background = $('.background');

  if (reloadPackery) {
    $background.packery('reloadItems');
  } else {
    addRandomRectangles($background);

    $background.packery({
      columnWidth: RECTANGLE_WIDTH,
      itemSelector: '.rectangle',
      gutter: 10
    });
  }
}

function setupNavigation() {
  addNavigationWaypoints(); // must be first b/c of click bindings we'll add to the navigation links
  addNavigationAutoScrolling();
}

function setupContent() {
  addContentBoxWaypoints();
  addGalleryPreview();
  renderMarkdown();
}

$(function() {
  // TODO The distance from the top of the last content box to the end of the page should be the user's viewport,
  //        therefore you should be able to roughly calculate how many squares you need b/c they are all 100px.

  overridePackeryToCenter();

  setupBackground();
  setupNavigation();
  setupContent();

  // Need to reset for any responsiveness.
  $(window).resize(function() {
    setupBackground(true);
    setupNavigation();
    setupContent();
  });

});
