(function($) {
	$(document).ready(function() {
		var feedsUrl = 'https://dbcfeeds.api.gov.bc.ca/';

		var feed_data = {
			dataset_count: 0,
			open_dataset_count: 0,
			recently_published_count: 0,
			tweets: [],
			blog_posts: []
		}

		var cachedFeedData = localStorage.getItem('feedData');
		if(cachedFeedData) {
			feed_data = JSON.parse(cachedFeedData);

			updateCKANData(feed_data);
			updateBlogFeed(feed_data);
			updateTwitterFeed(feed_data);
		}

		setTimeout(function() {
			$.ajax({
				url: feedsUrl
			})
			.done(function(result) {
				feed_data.dataset_count = result.totalDatasets;
				feed_data.open_dataset_count = result.openGovDatasetCount;
				feed_data.recently_published_count = result.last90daysDatasets;
				feed_data.tweets = result.dataBCTweets;
				feed_data.blog_posts = result.dataBCBlogPosts;
				feed_data.recent_datasets = result.recentDatasets;
				feed_data.popular_datasets = result.popularDatasets;
				feed_data.popular_services = result.popularServices;
				feed_data.popular_applications = result.popularApplications;

				updateCKANData(feed_data);
				updateBlogFeed(feed_data);
				updateTwitterFeed(feed_data);

				localStorage.setItem('feedData', JSON.stringify(feed_data));
			});
		}, 10);

		// Load the first slide (if it's visible)
		var $firstSlideIframe = $('#databc-homepage-carousel .item:first-child iframe');
		if($firstSlideIframe.is(':visible')) {
			var src = $firstSlideIframe.data('src');
			$firstSlideIframe.attr('src', src);
		}

		$('#databc-homepage-carousel').bind('slid.bs.carousel', function(e) {
			// Lazy load the iframe src
			if(e.relatedTarget) {
				var $target = $(e.relatedTarget);
				var $iframe = $target.find('iframe');
				if(!$iframe.attr('src')) {
					var src = $iframe.data('src');
					$iframe.attr('src', src);
				}
			}
		});

		var navHeight = $('#header-main-row1').height();
		var $header = $('#header');
		var $headerSearch = $('.header-search');
		$(window).scroll(function(e) {
			var scroll = $(window).scrollTop();

			// Scrolled past nav
			if(scroll >= navHeight) {
				$header.addClass('collapsed-header');
				if($headerSearch.attr('aria-expanded') == "true") {
					$headerSearch.addClass('in');
				}
			}
			else {
				if($( window ).width() >= 768) {
					$header.removeClass('collapsed-header');
				}
				$headerSearch.removeClass('in');
			}
		});

		$(window).resize(function() {
			if($( window ).width() < 768) {
				$header.addClass('collapsed-header');
			}
			else {
				var scroll = $(window).scrollTop();
				if(scroll < navHeight) {
					$header.removeClass('collapsed-header');
				}
			}
		});
		$(window).trigger('resize');

		// -----------------------
		// Typeahead configuration
		// -----------------------
        var engine = new Bloodhound({
          name: 'package_search',
          local: [],
          remote: {
            url: 'https://catalogue.data.gov.bc.ca/api/3/action/package_autocomplete?q=',
            prepare: function (query, settings) {
            settings.url += encodeURIComponent(query);
	            settings.type = 'POST';
	            settings.contentType = "application/json; charset=UTF-8";
	            return settings;
	       },
            filter: function(response) {
                return response.result;
            }
          },
          datumTokenizer: function(d) {
            return Bloodhound.tokenizers.whitespace(d.title);
          },
          queryTokenizer: Bloodhound.tokenizers.whitespace
        });



        // kicks off the loading/processing of `local` and `prefetch`
        engine.initialize();

        $('.search:not(.gov)').typeahead({
          hint: true,
          highlight: true,
          minLength: 4
        },
        {
          name: 'datasets',
          displayKey: 'title',
          // `ttAdapter` wraps the suggestion engine in an adapter that
          // is compatible with the typeahead jQuery plugin
          source: engine.ttAdapter()
        });

        $(document).on('typeahead:selected', function(e, suggestion, dataset) {
	      var name = suggestion.name;
	      window.location.href = 'https://catalogue.data.gov.bc.ca/dataset/' + name;
	    });

	    // -----------------------
		// End Typeahead configuration
		// -----------------------
	});

	function updateCKANData(feedData) {
		if(feedData.dataset_count) {
			$('.dataset_count').html(feedData.dataset_count);
		}

		if(feedData.open_dataset_count) {
			$('.open_dataset_count').html(feedData.open_dataset_count);
		}

		if(feedData.recently_published_count) {
			$('.recently_published_count').html(feedData.recently_published_count);
			var baseUrl = $('.recently_published_count_url').data('href');

			var today = new Date();
			var threeMonthsAgo = new Date();
			threeMonthsAgo.setMonth(today.getMonth() - 3);

			today.setUTCHours(0,0,0,0);
			threeMonthsAgo.setUTCHours(0,0,0,0);

			var dateString = "?q=record_publish_date:[" + threeMonthsAgo.toISOString() + " TO " + today.toISOString() + "]";
			var fullUrl = baseUrl + dateString;

			$('.recently_published_count_url').attr('href', fullUrl);
		}

		if(feedData.recent_datasets) {
			populateCKANContainer(feedData.recent_datasets, '.recent-datasets');
		}

		if(feedData.popular_datasets) {
			populateCKANContainer(feedData.popular_datasets, '.popular-datasets');
		}

		if(feedData.popular_services) {
			populateCKANContainer(feedData.popular_services, '.popular-services');
		}

		if(feedData.popular_applications) {
			populateCKANContainer(feedData.popular_applications, '.popular-applications');
		}
	}

	function updateBlogFeed(feedData) {
		if(feedData.blog_posts) {
			var $placeholder = $('.feed.blog .placeholder').clone();
			var $feedEntry = $('.feed.blog .feedEntry');
			$feedEntry.empty();

			var blog_posts = feedData.blog_posts;
			for(var i = 0; i < blog_posts.length; i++) {
				var entryData = blog_posts[i];
				var $entry = $placeholder.clone().removeClass('placeholder');
				$entry.find('.url').attr('href', entryData.url);
				$entry.find('.title').html(entryData.title);

				$feedEntry.append($entry);
			}
		}
	}

	function updateTwitterFeed(feedData) {
		if(feedData.tweets) {
			var $placeholder = $('.feed.twitter .placeholder').clone();
			var $feedEntry = $('.feed.twitter .feedEntry');
			$feedEntry.empty();

			var tweets = feedData.tweets;
			for(var i = 0; i < tweets.length; i++) {
				var tweetData = tweets[i];
				var $tweet = $placeholder.clone().removeClass('placeholder');
				$tweet.find('.text').html(tweetData.text);
				$tweet.find('.date').html($('<a></a>').attr('href', tweetData.url).html(tweetData.created_at));

				$feedEntry.append($tweet);
			}
		}
	}

	function populateCKANContainer(datasets, eleTarget) {
		var $container = $(eleTarget);

		if($container.length > 0) {
			$container.empty();

			for(var i in datasets) {
				var dataset = datasets[i];
				$container.append($('<li></li>').html($('<a target="_blank"></a>').attr('href', dataset.url).html(dataset.title)));
			}
		}
	}
})(jQuery);