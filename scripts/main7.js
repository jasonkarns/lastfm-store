// add shopping cart view

var lfm = {
    cart : []
};

(function($) {
    $.ajaxSetup({
        url: "https://ws.audioscrobbler.com/2.0/?callback=?",
        data: {
            //"api_key": "9885f563b9665afd771ffe66a454037e",
            "api_key": "b25b959554ed76058ac220b7b2e0a026",
            "format": "json"
        }
    });

    function loadSearchResults(data, status) {
        var list = [];
        $(data.results.artistmatches.artist).each(function(i) {
            var a = '<li class="artist"><a class="artist-name" id="' + this.mbid + '" href="http://' + this.url + '">' + this.name + '</a> <a class="artist-preview" href="http://' + this.url + '" title="'+ this.name +'">peek</a></li>';
            list.push(a);
        });
        $("#artistSearchResults").slideDown().removeClass("loading").html(list.join(""))
        .find("a.artist-name").click(loadArtist);
    }
    
    function loadArtist(e){
        e.preventDefault();
        $("#artistSearchResults").slideUp();
        $("#artistAlbums").slideUp().add("#similarArtists").addClass("loading");

        var artist = $(this).text();
        $("#currentArtist").hide().text(artist).show("slide", { direction: "right" }, "slow");
        getTopAlbums(artist);
        getSimilar(artist);
    }

    function getTopAlbums(artist) {
        var url;
        var data = {
            "method": "artist.getTopAlbums",
            "artist": artist,
            "limit":14
        };
        var callback = function(data) {
            var albums;
            if (data.topalbums && data.topalbums.album) {
                albums = $.map(data.topalbums.album, renderAlbums);
            }
            else {
                albums = ['<li><span class="none">No albums found.</span></li>'];
            }
            $("#artistAlbums").removeClass("loading").slideDown()
            .prev("h3").fadeIn().end()
            .find("ul.coverflow").html(albums.join(""))
            .coverflow({items:"img", slider: ".ui-slider"})
            .find(".album-image").draggable({helper: 'clone'});
        };
        $.getJSON(url, data, callback);
    }

    function renderAlbums(n, i) {
        if (i > 13) return null;
        return '<li class="album"><img class="album-image" src="' + n.image[2]['#text'] + '" title="' + n.name + '" alt="\'' + n.name + '\' cover art"/></li>';
    }

    function renderArtists(n, i) {
        return '<li class="artist"><img class="artist-image" src="' + n.image[2]['#text'] + '" title="' + n.name + '"/><a class="artist-name" id="' + n.mbid + '" href="' + n.url + '">' + n.name + '</a> <a class="artist-preview" href="' + n.url + '" title="'+ n.name +'">peek</a></li>';
    }

    function getSimilar(artist) {
        var url;
        var data = {
            "method": "artist.getInfo",
            "artist": artist,
        };
        var callback = function(data) {
            var artists = $.map(data.artist.similar.artist, renderArtists);
            $("#similarArtists").removeClass("loading").html(artists.join("")).prev("h3").fadeIn().end();
        };
        $.getJSON(url, data, callback);
    }

    function viewShoppingCart(e){
        e.preventDefault();
        var albums = $.map(lfm.cart, function (n, i) {
            return '<li class="album"><img class="album-image" src="'+ n.image +'" title="'+ n.album+' by '+ n.artist +'" /><p><span>'+ n.album+'</span><br/><span> by '+ n.artist +'</span> <a class="remove" href="#" title="Remove this Album" id="a'+ i +'">[x]</a></p></li>';
        });
        var hash = this.href.split("#")[1];
        $("#" + hash).html(albums.join("")).fadeIn().prev("h3").show();
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

        $131("a.artist-preview").live('click', function(e) {
            e.preventDefault();

            $.nyroModalManual({
                "url": this.href,
                "title": this.title,
                "width": "1024",
                "height": "768"
            });
        });

        $131("a.artist-name").live('click', loadArtist);

        $(".basket").droppable({
            accept: ".album-image",
            activeClass: 'droppable-active',
            hoverClass: 'droppable-hover',
            drop: function(ev, ui) {
                var item = {
                    artist: $("#currentArtist").text(),
                    album: ui.draggable.attr("title"),
                    image: ui.draggable.attr("src")
                }
                lfm.cart.push(item);
                $(".count", this).text(lfm.cart.length + " Item" + (lfm.cart.length > 1?"s":""));
            }
        });

        $(".basket a").click(viewShoppingCart);
        
    });
})(jQuery);
