// TODO: REMOVE THIS VAR
var DEBUG = false;
var DEBUG_CHECK_FOR_URL = false; // DEBUG: should we check for a playlist url
var DEBUG_SHOW_ID_AND_KEY = false;


var api_key = getApiKey();
var playlist_id = getPlaylistId();

var playlistItems = [];

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
		for (var count= 0; count < playlistItems.length; count++) {
			retrieveVideoLength(api_key, playlistItems[count]);
		}
	}
}


