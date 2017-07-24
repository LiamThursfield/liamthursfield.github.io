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


/**
* Retrieve the requested playlist via the YouTupe Playlists api
* @playlistId - the id of the playlist to retrieve
*/
function retrievePlaylist(key, id, callback) {
    $.get(
        "https://www.googleapis.com/youtube/v3/playlists?key=" + key + 
        "&part=snippet" +
        "&id=" + id, 
        callback
    ); // end of $.get()
} // end of retrievePlaylist()

/**
* Uses the data object returned from retrievePlaylist()
* Extracts the playlist details
*/
function getPlaylistFromData(data)  {
    return data.items[0].snippet;
}



/**
* Return the Month Text for a month integer
* E.g. return January for 0; December for 11
*/
function getFullMonth(monthInt) {
	var months = [
		"January", "February", "March", "April", "May", "June",
		"July", "August", "September", "October", "November", "December"
	];
	
	return months[monthInt];
}

/**
* Return the 3 part string of the Month Text for a month integer
* E.g. return Jan for 0; Dec for 11
*/
function getShortMonth(monthInt) {
	return getFullMonth(monthInt).substr(0, 3);
}

/**
* Return the date in the format: DD MM YYYY
* e. 21 January 2017
*/
function formatDate(dateToFormat) {
	var day = dateToFormat.getDate();
	var month = getFullMonth(dateToFormat.getMonth());
	var year = dateToFormat.getFullYear();
	
	return day + " " + month + " " + year;
}




/**
* Save a text object to a file, and download it
* E.g a JSON.stringify() object
*
* Debug method to show the JSON contents
*/
function saveText(text, filename){
	var a = document.createElement('a');
	a.setAttribute('href', 'data:text/plain;charset=utf-u,'+encodeURIComponent(text));
	a.setAttribute('download', filename);
	a.click()
}