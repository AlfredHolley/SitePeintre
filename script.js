
// Head, Cache /////////////////////////////////////////////////


document.getElementById('aboutShowMoreTrigger').addEventListener('click', function() {
    var aboutShowMore = document.getElementById('aboutShowMore');
    var headerAbout = document.getElementById('header_about');
    var overlayGradient = document.querySelector('.overlay-gradient');
    var readMore = this.getElementsByClassName('readMore')[0];
    var readLess = this.getElementsByClassName('readLess')[0];

    var computedStyle = window.getComputedStyle(headerAbout);
    var maxHeight = computedStyle.getPropertyValue('max-height');

    if (maxHeight !== 'none') {
        headerAbout.style.maxHeight = 'none';
        overlayGradient.classList.add('hidden');
        readMore.style.display = 'none';
        readLess.style.display = 'inline';
    } else {
        headerAbout.style.maxHeight = '100px';
        overlayGradient.classList.remove('hidden');
        readMore.style.display = 'inline';
        readLess.style.display = 'none';
    }
});





// SERIES /////////////////////////////////////////////////
// Grid
var grid = document.getElementById('artwork-grid');

function createOnclickHandler(artworkTitle) {
    return function() {
        // Save the current state
        var state = {
            view: document.getElementById('artwork-grid').style.display === 'block' ? 'grid' : 'series',
            scrollPosition: window.scrollY
        };
        // Add the state to the browser history
        history.pushState(state, '');

        // Redirect to the detail page
        openArtwork(artworkTitle);
    };
}

for (var i = 0; i < artworks.length; i++)
{
    var artwork = artworks[i];

    var gridItem = document.createElement('div');
    gridItem.className = 'grid-item';

    var img = document.createElement('img');
    img.src = artwork.imageUrl;
    img.alt = artwork.title;
    img.onclick = createOnclickHandler(artwork.title);
    gridItem.appendChild(img);

    var title = document.createElement('p');
    title.className = 'title';
    title.textContent = artwork.title;
    gridItem.appendChild(title);

    var details = document.createElement('p');
    details.className = 'details';
    details.textContent = artwork.format || 'Taille inconnue';
    gridItem.appendChild(details);

    grid.appendChild(gridItem);
}

// SERIES
document.getElementById('gridButton').addEventListener('click', function() {
    document.getElementById('artwork-grid').style.display = 'block';
    document.getElementById('artwork-series').style.display = 'none';
    this.classList.add('active');
    document.getElementById('seriesButton').classList.remove('active');
    history.replaceState({view: 'grid', scrollPosition: window.scrollY}, '');

});

document.getElementById('seriesButton').addEventListener('click', function() {
    document.getElementById('artwork-grid').style.display = 'none';
    document.getElementById('artwork-series').style.display = 'block';
    this.classList.add('active');
    document.getElementById('gridButton').classList.remove('active');

    // Get the series_pair div
    var seriesDiv = document.querySelector('.scroll-horizon');
    var seriesDiv_baroque = document.querySelector('#portrait_baroque');
    var seriesDiv_fleurs = document.querySelector('#fleurs');



    // Clear the div
    seriesDiv.innerHTML = '';
    seriesDiv_baroque.innerHTML = '';
    seriesDiv_fleurs.innerHTML = '';
    // Filter the artworks for "paysage" series
    var paysageArtworks = artworks.filter(function(artwork) {
        return artwork.serie === 'paysage';
    
    });
    var portrait_baroqueArtwork = artworks.filter(function(artwork) {
        return artwork.serie === 'portrait_baroque';
    
    });
    var fleursArtworks = artworks.filter(function(artwork) {
        return artwork.serie === 'fleurs';
    
    });


    // Create an image element for each artwork and add it to the div
    paysageArtworks.forEach(function(artwork) {
        var img = document.createElement('img');
        img.src = artwork.imageUrl;
        img.alt = artwork.title;
        
        img.onclick = createOnclickHandler(artwork.title);
        img.style.display = 'inline-block';
        img.style.width = 'auto';
        img.style.height = '300px';
        img.style.marginRight = '10px';
        seriesDiv.appendChild(img);
    });
    // Create an image element for each artwork and add it to the div
    portrait_baroqueArtwork.forEach(function(artwork) {
        var img = document.createElement('img');
        img.src = artwork.imageUrl;
        img.alt = artwork.title;
        
        img.onclick = createOnclickHandler(artwork.title);
        img.style.display = 'inline-block';
        img.style.width = 'auto';
        img.style.height = '300px';
        img.style.marginRight = '10px'; 
        seriesDiv_baroque.appendChild(img);
    });
    fleursArtworks.forEach(function(artwork) {
        var img = document.createElement('img');
        img.src = artwork.imageUrl;
        img.alt = artwork.title;
        
        img.onclick = createOnclickHandler(artwork.title);
        img.style.display = 'inline-block';
        img.style.width = 'auto';
        img.style.height = '300px';
        img.style.marginRight = '10px';
        seriesDiv_fleurs.appendChild(img);
    });


    // Add CSS for horizontal scrolling
    history.replaceState({view: 'series', scrollPosition: window.scrollY}, '');
});

if (!history.state) {
    // L'utilisateur est sur la page pour la première fois
    // Simulez un clic sur le bouton "Series"
    document.getElementById('seriesButton').click();
}

window.onpopstate = function(event) {
    if (event.state) {
        // Restore the view
        if (event.state.view === 'grid') {
            document.getElementById('artwork-grid').style.display = 'block';
            document.getElementById('artwork-series').style.display = 'none';
            document.getElementById('gridButton').classList.add('active');
            document.getElementById('seriesButton').classList.remove('active');
        } else {
            // Click the "Series" button to show the series
            document.getElementById('seriesButton').click();
        }
        // Restore the scroll position
        window.scrollTo(0, event.state.scrollPosition);
    }
};

function smoothScroll(element, target, duration) {
    target = Math.round(target);
    duration = Math.round(duration);
    if (duration < 0) {
        return Promise.reject("bad duration");
    }
    if (duration === 0) {
        element.scrollLeft = target;
        return Promise.resolve();
    }

    var start_time = Date.now();
    var end_time = start_time + duration;

    var start_top = element.scrollLeft;
    var distance = target - start_top;

    var smooth_step = function(start, end, point) {
        if(point <= start) { return 0; }
        if(point >= end) { return 1; }
        var x = (point - start) / (end - start);
        return x * x * (3 - 2 * x);
    }

    return new Promise(function(resolve, reject) {
        var previous_top = element.scrollLeft;

        function scroll_frame() {
            if(element.scrollLeft != previous_top) {
                resolve();
                return;
            }

            var now = Date.now();
            var point = smooth_step(start_time, end_time, now);
            var frameTop = Math.round(start_top + (distance * point));
            element.scrollLeft = frameTop;

            if(now >= end_time) {
                resolve();
                return;
            }

            if(element.scrollLeft === previous_top
                && element.scrollLeft !== frameTop) {
                resolve();
                return;
            }
            previous_top = element.scrollLeft;

            setTimeout(scroll_frame, 0);
        }

        setTimeout(scroll_frame, 0);
    });
}



var seriesDivs = document.querySelectorAll('.scroll-horizon');

seriesDivs.forEach(function(seriesDiv) {
    var leftArrow = seriesDiv.parentNode.querySelector('.left-arrow');
    var rightArrow = seriesDiv.parentNode.querySelector('.right-arrow');

    leftArrow.addEventListener('click', function() {
        smoothScroll(seriesDiv, seriesDiv.scrollLeft - 500, 600);
    });

    rightArrow.addEventListener('click', function() {
        smoothScroll(seriesDiv, seriesDiv.scrollLeft + 500, 600);
    });

    seriesDiv.addEventListener('scroll', function() {
        leftArrow.style.visibility = seriesDiv.scrollLeft > 0 ? 'visible' : 'hidden';

        var maxScrollLeft = seriesDiv.scrollWidth - seriesDiv.clientWidth;
        rightArrow.style.visibility = seriesDiv.scrollLeft < maxScrollLeft ? 'visible' : 'hidden';
    });

    leftArrow.style.visibility = 'hidden';
});

// Pages /////////////////////////////////////////////////

var artworkId = new URLSearchParams(window.location.search).get('id');

if (artworkId) {
    var artwork = artworks.find(function(artwork) {
        return artwork.title === artworkId;
    });

    if (artwork) {
        document.title = artwork.title;

        var img = document.createElement('img');
        img.src = artwork.imageUrl;
        img.alt = artwork.title;
        document.getElementById('artwork-details').appendChild(img);

        var title = document.createElement('h2');
        title.textContent = artwork.title;
        document.getElementById('artwork-details').appendChild(title);

        var description = document.createElement('p');
        description.textContent = artwork.description;
        document.getElementById('artwork-details').appendChild(description);

    } else {
        document.title = 'Œuvre non trouvée';
        document.getElementById('artwork-details').textContent = 'Désolé, cette œuvre n\'a pas été trouvée.';
    }
}

// Presentation //////////////////////////////////////////////


document.getElementById('linkPresentation').addEventListener('click', function(e) {
    e.preventDefault();
    fetch('presentation.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('Presentation').innerHTML = data;
        });

    document.getElementById('linkContact').classList.remove('active');
    document.getElementById('linkActualites').classList.remove('active');
    e.target.classList.add('active');
});

document.getElementById('linkActualites').addEventListener('click', function(e) {
    e.preventDefault();
    fetch('actualite.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('Presentation').innerHTML = data;
        });
        
    document.getElementById('linkContact').classList.remove('active');
    document.getElementById('linkPresentation').classList.remove('active');
    e.target.classList.add('active');
});

document.getElementById('linkContact').addEventListener('click', function(e) {
    e.preventDefault();
    fetch('contact.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('Presentation').innerHTML = data;
        });
    document.getElementById('linkPresentation').classList.remove('active');
    document.getElementById('linkActualites').classList.remove('active');  // Ajoutez cette ligne
    e.target.classList.add('active');
});

// Ajout de ceci pour charger le contenu de presentation.html par défaut
fetch('presentation.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('Presentation').innerHTML = data;
        
        // Restore the initial state if there is one
        if (history.state) {
            window.onpopstate({state: history.state});
        }
    });












