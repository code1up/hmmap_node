(function() {
	var _lat = 53.641186;
	var _lng = -2.099836;

	var _map;
	var _infoWindow;

	var _getInfoWindow = function(options) {
		if (!_infoWindow) {
			_infoWindow = new google.maps.InfoWindow();
		}

		var latLng = new google.maps.LatLng(options.lat, options.lng);

		_infoWindow.setPosition(latLng);
		_infoWindow.setContent(options.title);

		return _infoWindow;
	};

	function _addMarker(options) {
		var marker = new google.maps.Marker({
			map: _map,
			position: new google.maps.LatLng(options.lat, options.lng),
			animation: google.maps.Animation.DROP,
			clickable: true,
			title: options.title
		});

		google.maps.event.addListener(marker, "click", function() {
			var infoWindow = _getInfoWindow(options);

			infoWindow.open(_map, marker);
		});

		return marker;
	}

	function _enablePusherLogging() {
		Pusher.log = function(message) {
			if (window.console && window.console.log) {
				window.console.log(message);
			}
		};
	}

	function _subscribeToPusher() {
		var pusher = new Pusher("c13c8931dbb6382da0ab");
		var channel = pusher.subscribe("my_app");

		channel.bind("pusher:subscription_succeeded", function() {
			$("#divColor").text("subscribed");
		});

		channel.bind("my_points", function(message) {
			var date = new Date();
			var messageString = JSON.stringify(message);

			$("#divColor").text(messageString);

			var marker = _addMarker({
				lat: message.lat,
				lng: message.lng,
				title: JSON.stringify(message)
			});
		});		
	}

	function _initMap() {
		// Get map canvas DOM node.
		var canvas = $("#mapCanvas")[0];

		// Set up map.
		var mapOptions = {
			center: new google.maps.LatLng(_lat, _lng),
			zoom: 16,
			mapTypeId: google.maps.MapTypeId.TERRAIN
		};

		// Create map.
		_map = new google.maps.Map(canvas, mapOptions);

		var marker = _addMarker({
			lat: _lat,
			lng: _lng,
			title: "Hello, World."
		});
	}

	$(document).ready(function() {
		_enablePusherLogging();
		_subscribeToPusher();
		_initMap();
	});
}());
