// Initialiser la carte
var map = L.map('map', {
center: [48.11, -1.64],
zoom: 14,
attributionControl: true});

// Ajouter une attribution personnalisée directement via la carte
map.attributionControl.addAttribution
('Réalisation : <a href="https://sites-formations.univ-rennes2.fr/mastersigat/" target="_blank" >Master SIGAT</a>  / Sources : ESRI et Rennes Métropole');

// Ajouter des fonds de carte
var basemaps = {
OSM: L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png').addTo(map),
ESRI:L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'),
Carto: L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'),
OrthoRM:L.tileLayer.wms('https://public.sig.rennesmetropole.fr/geoserver/ows?',{layers: 'raster:ortho2021'}),
PlanRM:L.tileLayer.wms('https://public.sig.rennesmetropole.fr/geoserver/ows?',{layers: 'ref_fonds:pvci_simple_gris'})
};

// Ajouter l'echelle cartographique
L.control.scale().addTo(map);

// Ajouter une MiniMap
var miniMapLayer = L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png');
var miniMap = new L.Control.MiniMap(miniMapLayer, { toggleDisplay: true, minimized: true, position: 'bottomright'
}).addTo(map)


// Ajout markeur Rennes 2

var popuprennes2 = '<h1> Université Rennes 2 </h1> <br> <img src="https://upload.wikimedia.org/wikipedia/commons/2/29/Batiments_de_nuits_-Univ_Rennes_2_-_Louis_Arretche.jpg" width="350px">';

var customOptions = {'maxWidth': '500', 'className' : 'custom'}

var rennes2icone = L.icon({
iconUrl: 'https://media.theapolis.de/uploads/organization/655cb49559dee.png',
iconSize: [30, 30] });

var Rennes2 = L.marker([48.119, -1.7013], {icon: rennes2icone}).bindPopup(popuprennes2,customOptions);





// Marker Gare

var Gareicone = L.icon({
iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/f4/Sncf-logo.svg',
iconSize: [35, 20] });

var Gare = L.marker([48.103, -1.672], {icon: Gareicone}).bindPopup('<b>Gare SNCF de Rennes</b>');

// Ajouter un gestionnaire d'événements pour le survol (hover)
Gare.on('mouseover', function (e) {
this.openPopup();
});
// Ajouter un gestionnaire d'événements pour quitter le survol (hover)
Gare.on('mouseout', function (e) {
this.closePopup();
})

// Ajout du cadastre en WMS

var Cadastre = L.tileLayer.wms('http://geobretagne.fr/geoserver/cadastre/wms',
{layers: 'CP.CadastralParcel',format: 'image/png',transparent: true, opacity :0.5});


// Ajout des batiments en WMS

var Batiments = L.tileLayer.wms('https://public.sig.rennesmetropole.fr/geoserver/ows?',
{layers: 'ref_cad:batiment',format: 'image/png',transparent: true});

// Ajout du trafic en temps réel

var trafic = L.tileLayer.wms('https://public.sig.rennesmetropole.fr/geoserver/ows?',
{layers: 'trp_rout:v_rva_trafic_fcd',format: 'image/png',transparent: true});


// Gestion des markers

var couches = {"Université Rennes 2": Rennes2, "Gare de Rennes" : Gare, "Cadastre" : Cadastre, "Batiments" : Batiments, "Trafic en temps réel": trafic};



// Ajout des Stations de vélos
var url = 'https://raw.githubusercontent.com/mastersigat/data/main/velostar.geojson';
$.getJSON(url, function (geojson) {
var velos = L.geoJson(geojson).addTo(map);
  
  // Ajout Popup
velos.bindPopup(function(velos) {console.log(velos.feature.properties);
return "<h2> Station : "+velos.feature.properties.nom+"</h2>"+"<hr><h3>"
+velos.feature.properties.nombreemplacementstheorique+ "&nbsp; vélos</h3>" ;
});
  
  
  
});




// Ajouter le controleur de couches
// Création des menus Leaflet
var menu1 = L.control.layers(basemaps, null, { position: 'topleft', collapsed: false }).addTo(map);
var menu2 = L.control.layers(null, couches, { position: 'topright', collapsed: false }).addTo(map);

// Ajout des titres après que les menus soient ajoutés à la carte
setTimeout(function() {
    // Ajout d'un titre pour le premier menu (basemaps)
    var menu1Container = document.querySelector('.leaflet-control-layers.leaflet-control');
    if (menu1Container) {
        var title1 = document.createElement('div');
        title1.innerHTML = '<strong>Fonds de Carte</strong>';
        title1.style.padding = '5px';
        title1.style.backgroundColor = '#ffffff';
        title1.style.borderBottom = '1px solid #ccc';
        menu1Container.insertBefore(title1, menu1Container.firstChild);
    }

    // Ajout d'un titre pour le second menu (couches)
    var menu2Container = document.querySelectorAll('.leaflet-control-layers.leaflet-control')[1];
    if (menu2Container) {
        var title2 = document.createElement('div');
        title2.innerHTML = '<strong>Couches Thématiques</strong>';
        title2.style.padding = '5px';
        title2.style.backgroundColor = '#ffffff';
        title2.style.borderBottom = '1px solid #ccc';
        menu2Container.insertBefore(title2, menu2Container.firstChild);
    }
}, 100);  // Petit délai pour s'assurer que les menus sont bien chargés dans le DOM