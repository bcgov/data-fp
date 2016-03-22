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

			console.log(feed_data);
		}

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

			updateCKANData(feed_data);
			updateBlogFeed(feed_data);
			updateTwitterFeed(feed_data);

			localStorage.setItem('feedData', JSON.stringify(feed_data));
		});
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

				console.log($tweet.html());

				$feedEntry.append($tweet);
			}
		}
	}
})(jQuery);