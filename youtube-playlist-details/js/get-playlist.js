// TODO: REMOVE THIS VAR
var DEBUG = false;
var DEBUG_CHECK_FOR_URL = false; // DEBUG: should we check for a playlist url
var DEBUG_SHOW_ID_AND_KEY = false;


var api_key = getApiKey();
var playlist_id = getPlaylistId();

var playlistItems = [];
var playListItemViews = [];

//TODO: REMOVE CHECK FOR DEBUG URL
// if there is no playlist url:
if (!playlist_id && DEBUG_CHECK_FOR_URL) {
    alert("No URL was entered. Re-directing to the home page.");
    window.location.href = 'index.html';
}
if (DEBUG) {
	playlist_id = "PLdQ5Kj7BrK-GyMtecfP21KsAxptXwnC4a";
}
if (DEBUG_SHOW_ID_AND_KEY) {
	var span_playlist_id = document.getElementById("playlist-id"); // get the span that will display the url
	span_playlist_id.innerHTML = playlist_id + " <br/>" + api_key; // display the url
}

// retrieve the playlist and show its details
retrievePlaylist(api_key, playlist_id, showPlaylistInfo);

/**
* Show the playlist details
*/
function showPlaylistInfo(data) {
    var playlist = getPlaylistFromData(data);
	
	document.getElementById("playlist-title").innerHTML = playlist['title'];
	document.getElementById("playlist-author").innerHTML = playlist['channelTitle'];
	document.getElementById("playlist-uploaded-date").innerHTML = 
		formatDate(new Date(playlist['publishedAt']));	
	document.getElementById("playlist-description").innerHTML = playlist['description'];
	document.getElementById("playlist-thumbnail").setAttribute("src",
        playlist['thumbnails']["high"]["url"]);
	
	// ensure the playlist item list is empty, then get all the videos in the playlist
	playlistItems = [];
	retrievePlaylistItems(api_key, playlist_id, loadPlaylistItems);
	
}

// load the playlist items (videos)
function loadPlaylistItems(data) {
	var nextPage = null;
	//  details are loaded in pages, so a check is made for the key: nextPageToken
	if (data.hasOwnProperty("nextPageToken")) {
		nextPage = data.nextPageToken;
	}
	
	// add the playlist items to the list
	for (var count = 0; count < data.items.length; count++) {
		playlistItems.push(getPlaylistItemFromData(
			data.items[count]
		));
	}
	
	// if there is another page to load - load it
	// otherwise, get the video lengths for the playlist items
	if (nextPage != null) {
		retrievePlaylistItems(api_key, playlist_id, loadPlaylistItems, nextPage);
	} else {
		// the video grid
		var video_grid = document.getElementsByClassName("video-grid")[0];
		var numRows = Math.floor((playlistItems.length + 1) / 2);
		video_grid.setAttribute("style", "grid-template-rows: repeat(" + numRows + ", auto 15px)!important;");
		
		// show the video cards
		for (var count = 0; count < playlistItems.length; count++) {
			var grid_pos = {}
			// use the count to determine the grid position of the video card
			// there are two columns, so:
			// 	even count should be in the first column (0-index)
			// 	odd count should be in the second column
			if (count % 2 == 0) {
				// even count - first column
				grid_pos.col_start = 1;
				grid_pos.col_end = 2;
			} else {
				// odd count - secoind column
				grid_pos.col_start = 3;
				grid_pos.col_end = 4;
			}
			
			// determine the row position
			grid_pos.row_start = (Math.floor(count / 2) * 2) + 1;
			grid_pos.row_end = grid_pos.row_start + 1;
			
			playListItemViews.push(
				new PlayListItemView(playlistItems[count], grid_pos)
			);
			
			video_grid.innerHTML += (playListItemViews[count].toString());
			
			// get the video length
			retrieveVideoLength(api_key, playlistItems[count]);
		}
		
	}
}


