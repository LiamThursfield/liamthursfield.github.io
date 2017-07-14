// TODO: REMOVE THIS VAR
var DEBUG_CHECK_FOR_URL = false; // DEBUG: should we check for a playlist url

var api_key = getApiKey();
var playlist_id = getPlaylistId();

//TODO: REMOVE CHECK FOR DEBUG URL
// if there is no playlist url:
if (!playlist_id && DEBUG_CHECK_FOR_URL) {
    alert("No URL was entered. Re-directing to the home page.");
    window.location.href = 'index.html';
}

// otherwise, a url was entered:
var span_playlist_id = document.getElementById("playlist-id"); // get the span that will display the url
span_playlist_id.innerHTML = playlist_id + " <br/>" + api_key; // display the url

retrievePlaylist(api_key, playlist_id, showPlaylistInfo);

function showPlaylistInfo(data) {
    var playlist = getPlaylistFromData(data);
    for (key in playlist) {
        alert("Key: " + key + ". Data: " + playlist[key]);
    }
}