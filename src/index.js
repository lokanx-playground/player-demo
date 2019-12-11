"use strict";
(function() {
    const BACKLEND_API = "https://api.myjson.com/bins/so5pk"
    const DUMMY_MOVIE_URL = "toystory.mp4"
    let activeMovie = -1;
    let movieData = {};
    
    function showErrorMessage(msg) {
        $("#errorMessageContainer").html(msg||"Something went wrong...").show();
    }

    function playMovie(movieId) {
        if (movieId === activeMovie) {
            return;
        }    

        const playerContainer = $("#playerContainer");
        
        if (activeMovie > -1) {
            playerContainer.empty();
        }

        
        //const movieUrl = movieData[movieId].video;
        const movieUrl = DUMMY_MOVIE_URL; // Using a dummy since example movies seems to be down
        activeMovie = movieId;
        playerContainer.append("<video src='" + movieUrl + "' class='player' autoplay controls/>").removeClass("player");        
    }

    function renderPoster(posterData) {
        const posterMarkupTpl = `
            <div id='movie_{MovieId}' data-id='{MovieId}' class='float-left movieItem' >
                <span>
                    <img class='poster' src='{PosterUrl}' title='{MovieDescription}'>
                </span><br>
                <span>{PosterTitle}</span>
            </div>
        `;
        const posterMarkup = posterMarkupTpl
            .replace(/{PosterUrl}/g, posterData.image)
            .replace(/{PosterTitle}/g, posterData.name)
            .replace(/{MovieDescription}/g, posterData.description)
            .replace(/{MovieId}/g, posterData.id);

        $("#metadataContainer").append(posterMarkup);
        $("#movie_" + posterData.id).bind("click", (element) => {
            console.log(element);
            playMovie($(element.currentTarget).attr("data-id"));
        }).tooltip({ "track": true });
        movieData[posterData.id] = posterData; 
    }

    function renderPage(data) {
        console.log(data);
        for(let i = 0; i < data.length; i++) {
            renderPoster(data[i]);
        }
        $("#mainContentContainer").show();
    }
    
    function loadData() {
        $.getJSON( BACKLEND_API, {
            format: "json"
          }).done((data) => {
            renderPage(data);
          }).fail((jqxhr, textStatus, error) => {
            showErrorMessage("Failed load content...");
            var err = textStatus + ", " + error;
            console.log( "Request Failed: " + err );
          });
    }

    $(document).ready(() => {
        loadData();
    });
}())