// TODO: REMOVE THIS VAR
var DEBUG = true;
var DEBUG_CHECK_FOR_URL = false; // DEBUG: should we check for a playlist url
var DEBUG_SHOW_ID_AND_KEY = false;


var api_key = getApiKey();
var playlist_id = getPlaylistId();

//TODO: REMOVE CHECK FOR DEBUG URL
// if there is no playlist url:
if (!playlist_id && DEBUG_CHECK_FOR_URL) {
    alert("No URL was entered. Re-directing to the home page.");
    window.location.href = 'index.html';
}
if (DEBUG) {
	playlist_id = "PLE7E8B7F4856C9B19";
}
if (DEBUG_SHOW_ID_AND_KEY) {
	var span_playlist_id = document.getElementById("playlist-id"); // get the span that will display the url
	span_playlist_id.innerHTML = playlist_id + " <br/>" + api_key; // display the url
}

retrievePlaylist(api_key, playlist_id, showPlaylistInfo);

function showPlaylistInfo(data) {
    var playlist = getPlaylistFromData(data);
//	saveText( JSON.stringify(playlist), "filename.json" );
//	var d = new Date(playlist['publishedAt']);
//	console.log(getShortMonth(d.getMonth()));
//    for (key in playlist) {
//        console.log("Key: " + key + ". Data: " + playlist[key]);
//    }
	document.getElementById("playlist-title").innerHTML = playlist['title'];
	document.getElementById("playlist-author").innerHTML = playlist['channelTitle'];
	document.getElementById("playlist-uploaded-date").innerHTML = 
		formatDate(new Date(playlist['publishedAt']));	
	document.getElementById("playlist-description").innerHTML = playlist['description'];
	document.getElementById("playlist-thumbnail").setAttribute("src",
        playlist['thumbnails']["high"]["url"]);
	
	
}