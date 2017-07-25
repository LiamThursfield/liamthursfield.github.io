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
* @id - the id of the playlist to retrieve
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
* Retrieve the requested playlist via the YouTupe Playlists api
* @id - the id of the playlist to retrieve
* @nextPageToken - the API retrieves playlistItems in pages, so if there is a nextPageToken
*	then there is another page of playlistItems to retrieve
*/
function retrievePlaylistItems(key, id, callback, nextPageToken = null) {
	var url = "https://www.googleapis.com/youtube/v3/playlistItems?key=" + key +
		"&part=snippet" +
		"&playlistId=" + id;
	
	if (nextPageToken != null) {
		url += "&pageToken=" + nextPageToken;
	}
	$.get(url, callback);
}

/**
* This function returns a PlaylistItem from data that is retrieved
* via the Youtube API
*/
function getPlaylistItemFromData (data) {
	var id = data.snippet.resourceId.videoId;
	var title = data.snippet.title;
	var author = data.snippet.channelTitle;
	var uploaded_date = data.snippet.publishedAt;
	var description = data.snippet.description;
	var thumbnail = data.snippet.thumbnails.medium.url
	var position = data.snippet.position;
	
	item = new PlaylistItem(
		id, title, author, uploaded_date, description, thumbnail, position
	);
	
	return item; 
}

/**
* A Playlist item, is an object that contains the key details 
* of a youtube video in a Youtube Playlist
*/
function PlaylistItem(id, title, author, uploaded_date, description, thumbnail, position, video_length=0) {
	this.id = id;
	this.title = title;
	this.author = author;
	this.uploaded_date = uploaded_date;
	this.description = description;
	this.thumbnail = thumbnail;
	this.position = position;
	this.video_length = 0;
}


/**
* A function that takes a playlist item, and fetches its length via the Youtube API
*/
function retrieveVideoLength(key, playlistItem) {
	var url = "https://www.googleapis.com/youtube/v3/videos?key=" + key +
		"&part=contentDetails" +
		"&id=" + playlistItem.id;
	
	return jQuery.ajax({
		url: url,
		success: function(result) {
			var video_length = result.items[0].contentDetails.duration
			console.log(video_length);
			playlistItem.video_length = video_length;
			
			var lengthSource = document.getElementById(playlistItem.id + "-length");
			if (lengthSource != null) {
				lengthSource.textContent = video_length;
			}
		}
	});
	
}

/**
* A PlaylistItemView, is an object that contains the html to show a PlayListItem
* @playlistItem - the playlist item to show
*/
function PlayListItemView(playlistItem, grid_pos={col_start:0, col_end:0, row_start:0, row_end:0}) {
	this.playlistItem = playlistItem;
	this.id = playlistItem.id;
	this.title = playlistItem.title;
	this.author = playlistItem.author;
	this.uploaded_date = playlistItem.uploaded_date;
	this.description = playlistItem.description;
	this.thumbnail = playlistItem.thumbnail;
	this.position = playlistItem.position;
	this.video_length = playlistItem.video_length;
	
	this.col_start = grid_pos.col_start;
	this.col_end = grid_pos.col_end;
	this.row_start = grid_pos.row_start;
	this.row_end = grid_pos.row_end;
	
	
	PlayListItemView.prototype.toString = function() {
		var html_view = "";
		// add opening card div, with the grid position
		html_view += "<div id='" + this.id + "' class='video-item card' style='"  +
			"grid-column-start:" + this.col_start + ";" +
			"grid-column-end:" + this.col_end + ";" +
			"grid-row-start:" + this.row_start + ";" +
			"grid-row-end:" + this.row_end + ";" +
			"'>";
		
		// add thumbnail
		html_view += "<div class='thumbnail'><img src='" + this.thumbnail + "' alt='Video Thumbnail'/>" + 
			"<p class='playlist-length'><span id='" + this.id + "-length'>" + this.video_length + "</span></p>"
			+ "</div>";
		
		// add opening content div
		html_view += "<div class='content'>";
		
		// add video title
		html_view += "<h3 class='video-title'>" + this.title + "</h3>";
		
		// add author and uploaded date
		html_view += "<p><span class='uploaded-author'>" + this.author + "</span> " +
			"<span class='uploaded-date'>- " + formatDate(new Date(this.uploaded_date)) + "</span></p>";
		
		// if the description is > 100 chars, shorten it and add "..."
		var shortDescription = "";
		if (this.description.length > 100) {
			shortDescription = this.description.substr(0, 100) + "...";
		}
		// add description
		html_view += "<p class='description'>" + shortDescription + "</p>";
		
		// add closing content div
		html_view += "</div>"
		
		// add closing card div
		html_view += "</div>"
		
		return html_view;
	}
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