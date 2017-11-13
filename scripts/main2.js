// add document.ready loadSearchResults functions

(function($) {
    function loadSearchResults(data, status) {
        var list = [];
        $(data.results.artistmatches.artist).each(function(i) {
            var a = '<li class="artist"><a class="artist-name" id="' + this.mbid + '" href="http://' + this.url + '">' + this.name + '</a> <a class="artist-preview" href="http://' + this.url + '" title="'+ this.name +'">peek</a></li>';
            list.push(a);
        });
        $("#artistSearchResults").slideDown().removeClass("loading").html(list.join(""))
        .find("a.artist-name").click(function() {
            $("#artistSearchResults").slideUp();
            $("#artistAlbums").slideUp().add("#similarArtists").addClass("loading");

            var artist = $(this).text();
            $("#currentArtist").hide().text(artist).show("slide", { direction: "right" }, "slow");

            return false;
        });
    }
    
    $(document).ready(function() {
        $("#artistSearch").submit(
            function(e) {
                var url = $(this).attr("action") + "?callback=?";
                var data = {
                    "method": $("#method").val(),
                    "api_key": $("#api_key").val(),
                    "format": $("#format").val(),
                    "artist": $("#artist").val(),
                    "limit": 5
                };
                var callback = loadSearchResults;
                $("#artistSearchResults").empty().addClass("loading");
                $.getJSON(url, data, callback);
                return false;
            }
        );
    });
})(jQuery);