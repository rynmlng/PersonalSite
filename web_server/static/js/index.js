var CONTENT_BOX_MARGIN = 20;

var RECTANGLE_COLOR_CLASS_WEIGHTS = {
  'beige': 3,
  'blue': 2,
  'red': 5,
  'eggshellWhite': 8
};

var BACKGROUND_COVER_CLASS = '<div class="background-cover"></div>';
var RECTANGLE_GUTTER = 10;
var RECTANGLE_SIDE = 100;
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

function fitRectangles($container, isPackeryEnabled) {
  /* Dynamically fit random rectangles within our scalar constraints and
   *   add or remove them from the DOM.
   *
   * If the packery lib has been instantiated use that, otherwise DOM insertion/deleton directly.
   */
  var pageArea = $('.main').height() * $(window).width(),
      rectanglesArea = 0;

  //pageArea += pageArea * (2 * RECTANGLE_GUTTER / RECTANGLE_SIDE); // account for gutters, etc.

  var doRemoveRectangles = false,
      rectanglesToRemove = [];

  $container.find('.rectangle').each(function(i, rectangle) {
    var $rectangle = $(rectangle),
        rectangleArea = $rectangle.height() * $rectangle.width();

    if (doRemoveRectangles) {
      rectanglesToRemove.push($rectangle);
    } else if (rectanglesArea > pageArea) {
      // all further discovered rectangles should be removed to keep the background minimal
      doRemoveRectangles = true;

      rectanglesToRemove.push($rectangle);
    } else {
      rectanglesArea += rectangleArea;
    }
  });

  // remove rectangles in one fell swoop
  if (rectanglesToRemove.length > 0) {
    if (isPackeryEnabled) {
      $container.packery('remove', rectanglesToRemove);
    } else {
      rectanglesToRemove.remove();
    }
  }

  var rectanglesToAdd = [];

  // after scanning through all rectangles we still have more to add
  if (rectanglesArea < pageArea) {
    var colorClassHeatMap = getRandomHeatMap(RECTANGLE_COLOR_CLASS_WEIGHTS),
        i = 0;

    while (rectanglesArea < pageArea) {
      // cycle the heat map for a perfect distribution
      var colorCSSClass = colorClassHeatMap[i % colorClassHeatMap.length];

      var rectangleSideScalar = RECTANGLE_SIZE_SCALARS[Math.floor(Math.random() * RECTANGLE_SIZE_SCALARS.length)];

      var $rectangle = $('<div class="rectangle ' + colorCSSClass +
              ' height' + rectangleSideScalar +
              ' width' + rectangleSideScalar +
              '"><div class="grunge"></div></div>');

      rectanglesToAdd.push($rectangle);
      i++;

      // this is the calculation we use for rectangle sizes - larger ones need to account for smaller ones with gutters
      rectanglesArea += Math.pow((RECTANGLE_SIDE * rectangleSideScalar) + (RECTANGLE_GUTTER * (rectangleSideScalar - 1)), 2);
    }
  }

  var diff = (rectanglesArea - pageArea);

  // add rectangles in one fell swoop
  if (rectanglesToAdd.length > 0) {
    if (isPackeryEnabled) {
      $container.packery('addItems', rectanglesToAdd);
    } else {
      $container.append(rectanglesToAdd);
    }
  }
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
  /* Auto-scrolling when links in the navigation are clicked.
   *   i.e. more animated relative links
   */
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
      });
  });
}

function addNavigationWaypoints() {
  /** Add waypoints to the navigation to allow a floating navigation when
   *    the original navigation is out of the viewport.
   */
  var FLOATING_NAVIGATION_TOP_OFFSET = 20;

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

function addSocialLabelPopUps() {
  /* Pop-up the label on the social network when hovering over. */
  $('.networks .network').hover(function() {
    $(this).children('.label').animate({bottom: 0}, 100);
  }, function() {
    var $label = $(this).children('.label');
    $label.animate({bottom: -1 * $label.outerHeight()}, 100);
  });

}

function renderMarkdown() {
  /* Render all HTML elements with the class name 'markdown' with markdown styling.
   *   If markdown has been done before, we will reuse the same created container.
   **/
  $('.markdown').each(function() {
    var renderedText = marked($(this).text());

    var $markdownRenderedContainer = $(this).next('.markdown-rendered');
    if ($markdownRenderedContainer.length == 0) {
        $markdownRenderedContainer = $('<div class="markdown-rendered"></div>');
        $markdownRenderedContainer.html(renderedText);

        $markdownRenderedContainer.insertAfter($(this));
    } else {
        $markdownRenderedContainer.html(renderedText);
    }

    $(this).hide();
  });
}

function setupBackground(isFirstLoad) {
  /* Build the body background, specifically the rectangles. */
  var $background = $('.background'),
      $backgroundCover = $('.background-cover');

  // make the cover have no effect on DOM rectangle calcuations
  $backgroundCover.height(0);

  fitRectangles($background, !isFirstLoad);

  if (isFirstLoad) {
    $background.packery({
      columnWidth: RECTANGLE_SIDE,
      itemSelector: '.rectangle',
      gutter: RECTANGLE_GUTTER
    });
  } else {

  }

  $backgroundCover.height($background.height());
}

function setupNavigation() {
  addNavigationWaypoints(); // must be first b/c of click bindings we'll add to the navigation links
  addNavigationAutoScrolling();

  var $floatingNavigation = $('.navigation .links.floating'),
      $staticNavigation = $('.navigation .links.static');
}

function setupContent() {
  addGalleryPreview();
  addSocialLabelPopUps();
  renderMarkdown();
}

$(function() {
  overridePackeryToCenter();

  var contentResetQueue = [];

  setupNavigation();
  setupContent();
  setupBackground(true);

  // Need to reset for any responsiveness.
  // In case it's a "drag resize" wait a few seconds to see if another event happens.
  $(window).resize(function() {
    var queueEntryTime = Date.now();
    contentResetQueue.push(queueEntryTime);

    setTimeout(function() {
      if (Math.max.apply(null, contentResetQueue) == queueEntryTime) {
        contentResetQueue = [];
        setupNavigation();
        setupContent();
        setupBackground(false);
      }
    }, 200);
  });

});
