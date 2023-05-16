// Récupérer l'identifiant de l'œuvre d'art depuis l'URL
var artworkId = new URLSearchParams(window.location.search).get('id');

// Trouver l'œuvre d'art correspondante dans le fichier de données
var artwork = artworks.find(function(artwork) {
    return artwork.title === artworkId;
});

// Afficher les détails de l'œuvre d'art
if (artwork) {
    document.title = artwork.title;

    var details = document.getElementById('artwork-details');

    var img = document.createElement('img');
    img.src = artwork.imageUrl;
    img.alt = artwork.title;
    details.appendChild(img);

    var title = document.createElement('h1');
    title.textContent = artwork.title;
    details.appendChild(title);

    var description = document.createElement('p');
    description.textContent = artwork.description;
    details.appendChild(description);
} else {
    document.title = 'Œuvre non trouvée';
    document.getElementById('artwork-details').textContent = 'Désolé, cette œuvre n\'a pas été trouvée.';
}