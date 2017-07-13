/**
* This file contains all the functions required for this site
*/


/**
* Get the playlist id from the $_GET arguments
*/
function getPlaylistId() {    
    args = location.search.substr(1).split(/&/); // create an array, containing all the GET args
    for (var i=0; i<args.length; ++i) { // loop through the args
        var tmp = args[i].split(/=/); // split the arg into key=>value pair array
        // if the current arg is the 'playlist-url' arg:
        if (tmp[0] == "playlist-url") {
            var playlist_url = decodeURIComponent(tmp[1]); // decode the youtube playlist url (e.g '%3A' into ':')
            playlist_url = playlist_url.split("list="); // split the url into the main url and the playlist id
            return playlist_url[1]; // return the playlist id - in the second element of the array
        }
    }
    return null; // there is no playlist id to return 
}