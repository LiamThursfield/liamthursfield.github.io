// TODO: REMOVE THIS VAR
var DEBUG = false;

var api_key = getApiKey();
var playlist_id = getPlaylistId();

var playlistItems = [];
var playListItemViews = [];

// whilst debugging: provide a playlist id
if (DEBUG) {
	playlist_id = "PLE7E8B7F4856C9B19";
}

// if there is no playlist url:
if (!playlist_id) {
    alert("No URL was entered. Re-directing to the home page.");
    window.location.href = 'index.html';
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
        playlist['thumbnails']["medium"]["url"]);
	
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
				grid_pos.col_end = 5;
			}
			
			// add the playlistItemView to the list
			playListItemViews.push(
				new PlayListItemView(playlistItems[count], grid_pos)
			);
			
			// show the playlist item view
			video_grid.innerHTML += (playListItemViews[count].toString());
			
			// hide the Loading div
			document.getElementById("loading-videos").style.display = "none";
			
			// get the video length
			retrieveVideoLength(api_key, playlistItems[count]);
		}
		
	}
}


