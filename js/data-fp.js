(function($) {
	$(document).ready(function() {
		//var feedsUrl = '';

		var feed_data = {
			dataset_count: 0,
			open_dataset_count: 0,
			recently_published_count: 0,
			tweets: [],
			blog_posts: []
		}

		/*$.ajax({
			url: feedsUrl
		})
		.done(function(result) {*/
			// Stubbing result from feeds
			var result = {
				"totalDatasets": 3604,
				"openGovDatasetCount": 24,
				"last90daysDatasets": 14,
				"dataBCTweets": [{
					"user_name": "Data_BC",
					"user_url": "http://t.co/84EO06J018",
					"text": "Read about the <a href=\"https://twitter.com/#!/search?q=%23BCDev\" title=\"#BCDev\" class=\"tweet-url hashtag\" rel=\"nofollow\">#BCDev</a> experiment to pay developers for @<a class=\"tweet-url username\" href=\"https://twitter.com/GitHub\" data-screen-name=\"GitHub\" rel=\"nofollow\">GitHub</a> pull requests: <a href=\"https://t.co/ztYSDQZQIR\" rel=\"nofollow\">https://t.co/ztYSDQZQIR</a> <a href=\"https://twitter.com/#!/search?q=%23bcdev\" title=\"#bcdev\" class=\"tweet-url hashtag\" rel=\"nofollow\">#bcdev</a> @<a class=\"tweet-url username\" href=\"https://twitter.com/WavefrontAC\" data-screen-name=\"WavefrontAC\" rel=\"nofollow\">WavefrontAC</a>",
					"created_at": "17 hours ago",
					"url": "https://twitter.com/Data_BC/status/710240526314950656"
				}, {
					"user_name": "Data_BC",
					"user_url": "http://t.co/84EO06J018",
					"text": "RT @<a class=\"tweet-url username\" href=\"https://twitter.com/WavefrontAC\" data-screen-name=\"WavefrontAC\" rel=\"nofollow\">WavefrontAC</a>: Can you help @<a class=\"tweet-url username\" href=\"https://twitter.com/CityofVancouver\" data-screen-name=\"CityofVancouver\" rel=\"nofollow\">CityofVancouver</a> improve street activity coordination? Carol Noble explains issue to <a href=\"https://twitter.com/#!/search?q=%23BCDev\" title=\"#BCDev\" class=\"tweet-url hashtag\" rel=\"nofollow\">#BCDev</a> <a href=\"https://twitter.com/#!/search?q=%23WaveGuide\" title=\"#WaveGuide\" class=\"tweet-url hashtag\" rel=\"nofollow\">#WaveGuide</a> https:…",
					"created_at": "17 hours ago",
					"url": "https://twitter.com/Data_BC/status/710237836373417985"
				}],
				"dataBCBlogPosts": [{
					"title": "DriveBC Webcam Open Data Released, BCDevExchange Discovery Day March 16",
					"url": "http://blog.data.gov.bc.ca/2016/03/drivebc-webcam-open-data-released-bcdevexchange-discovery-day-march-16/"
				}, {
					"title": "Pay for Pull – What We Learned So Far",
					"url": "http://blog.data.gov.bc.ca/2016/03/pay-for-pull-what-we-learned-so-far/"
				}, {
					"title": "BritishColumbia.ca: A Digital Hub of Community Data",
					"url": "http://blog.data.gov.bc.ca/2016/02/britishcolumbia-ca-a-digital-hub-of-community-data/"
				}, {
					"title": "Pay for Pull",
					"url": "http://blog.data.gov.bc.ca/2016/01/pay-for-pull/"
				}, {
					"title": "DataBC updates and expands public Web Map Services",
					"url": "http://blog.data.gov.bc.ca/2015/12/databc-updates-and-expands-public-web-map-services/"
				}],
				"recentDatasets": [{
					"title": "BC HighwayCams",
					"url": "http://catalogue.data.gov.bc.ca/dataset/bc-highway-cams"
				}, {
					"title": "British Columbia Greenhouse Gas Emissions ARCHIVE",
					"url": "http://catalogue.data.gov.bc.ca/dataset/british-columbia-greenhouse-gas-emissions-archive"
				}, {
					"title": "Regulated Private Water Utilities",
					"url": "http://catalogue.data.gov.bc.ca/dataset/regulated-private-water-utilities"
				}],
				"popularDatasets": [{
					"title": "COALFILE Database",
					"url": "http://catalogue.data.gov.bc.ca/dataset/coalfile-database"
				}, {
					"title": "MSP Blue Book",
					"url": "http://catalogue.data.gov.bc.ca/dataset/msp-blue-book"
				}, {
					"title": "VRI - Forest Vegetation Composite Polygons and Rank 1 Layer",
					"url": "http://catalogue.data.gov.bc.ca/dataset/vri-forest-vegetation-composite-polygons-and-rank-1-layer"
				}]
			};
			feed_data.dataset_count = result.totalDatasets;
			feed_data.open_dataset_count = result.openGovDatasetCount;
			feed_data.recently_published_count = result.last90daysDatasets;
			feed_data.tweets = result.dataBCTweets;
			feed_data.blog_posts = result.dataBCBlogPosts;
			feed_data.recent_datasets = result.recentDatasets;
			feed_data.popular_datasets = result.popularDatasets;

			updateCKANData(feed_data);
			updateBlogFeed(feed_data);
			updateTwitterFeed(feed_data);
		/*});*/
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
		}

		if(feedData.recent_datasets) {
			var $recentDatasetsContainer = $('.recent-datasets');

			for(var i in feedData.recent_datasets) {
				var dataset = feedData.recent_datasets[i];
				$recentDatasetsContainer.append($('<li></li>').html($('<a target="_blank"></a>').attr('href', dataset.url).html(dataset.title)));
			}
		}

		if(feedData.popular_datasets) {
			var $popularDatasetsContainer = $('.popular-datasets');

			for(var i in feedData.popular_datasets) {
				var dataset = feedData.popular_datasets[i];
				$popularDatasetsContainer.append($('<li></li>').html($('<a target="_blank"></a>').attr('href', dataset.url).html(dataset.title)));
			}
		}
	}

	function updateBlogFeed(feedData) {
		if(feedData.blog_posts) {
			var $placeholder = $('.feed.blog .placeholder').clone().removeClass('placeholder');
			var $feedEntry = $('.feed.blog .feedEntry');
			$feedEntry.html('');

			var blog_posts = feedData.blog_posts;
			for(var i = 0; i < blog_posts.length; i++) {
				var entryData = blog_posts[i];
				var $entry = $placeholder.clone();
				$entry.find('.url').attr('href', entryData.url);
				$entry.find('.title').html(entryData.title);

				$feedEntry.append($entry);
			}
		}
	}

	function updateTwitterFeed(feedData) {
		if(feedData.blog_posts) {
			var $placeholder = $('.feed.twitter .placeholder').clone().removeClass('placeholder');
			var $feedEntry = $('.feed.twitter .feedEntry');
			$feedEntry.html('');

			var tweets = feedData.tweets;
			for(var i = 0; i < tweets.length; i++) {
				var tweetData = tweets[i];
				var $tweet = $placeholder.clone();
				$tweet.find('.text').html(tweetData.text);
				$tweet.find('.date').html($('<a></a>').attr('href', tweetData.url).html(tweetData.created_at));

				$feedEntry.append($tweet);
			}
		}
	}
})(jQuery);