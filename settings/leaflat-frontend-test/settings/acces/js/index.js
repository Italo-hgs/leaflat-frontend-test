// Inicia o mapa com as coordenadas
var map = L.map('map').setView([-32.74161003193115, -55.99011956786738], 5);

// API primeira camada de mapa
var osm = L.tileLayer('https:\/\/server.arcgisonline.com\/ArcGIS\/rest\/services\/World_Imagery\/MapServer\/tile\/{z}\/{y}\/{x}', {
    maxZoom: 19,
    subdomains:['mt0','mt1','mt2','mt3'],
}).addTo(map);

// API camada - segunda camada de map
var outraCamada = L.tileLayer('https:\/\/{s}.tile.openstreetmap.org\/{z}\/{x}\/{y}.png',{
    Zoom: 12,
}).addTo(map);

function onEachFeature(feature, layer) {
    var text = "Este é um texto de popup para o usuário!"
    var popupContent = `<p>${text}</p>`; // Aqui eu passei o texto que será exibido ao clicar no marcador de localização.
    if (feature.properties && feature.properties.popupContent) {
        popupContent += "<br>" + feature.properties.popupContent;
    }
    layer.bindPopup(popupContent);
}

// API /api/teste-leaflet/pontos
$.getJSON("https://terraq.com.br/api/teste-leaflet/pontos", function (data) {}).done(
    function (data) {
        var featureCollection = L.geoJSON(data, {
            pointToLayer: function (feature, latlng) {
                var iconUrl = feature.properties.icon;
                var featureIcon = L.icon({
                    iconUrl: "./img/marcador.png",
                    iconSize: [32, 37],
                    iconAnchor: [16, 37],
                    popupAnchor: [0, -28]
                });
                return L.marker(latlng, {
                    icon: featureIcon
                });
            },
            onEachFeature: onEachFeature
        }).addTo(map);
    }
);

// oms layer
var osm = L.tileLayer('https://{s}.tile.oppensstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contribuitors'
});
osm.addTo(map)

// Marker
var myIcon = L.icon({
    iconUrl: './img/marcador.png',
    iconSize: [40, 40]
})
var singleMarker = L.marker([28.3949, 84.1240], { icon: myIcon, draggable: true });
var popUp = singleMarker.bindPopup('Este é o pop' + singleMarker.getLatLng()).openPopup()
popUp.addTo(map);

// Layer controles
var baseMaps = {
    "Ver pelo Satélite": osm,
    "Ver pelo Street": outraCamada,
};
L.control.layers(baseMaps).addTo(map)

// Menu lateral exibe dados do usuário
var dadosUsuario = (
    {id:6,email:"user6@terraq.com.br",nome:"José",data_nascimento:"1967-12-28",sexo:"Masculino",telefone:"+55 91 5863-9475",avatar: '<img src="https:\/\/randomuser.me\/api\/portraits\/med\/men\/9.jpg" />'}
)
var helloPopup = L.popup().setContent(dadosUsuario.nome + '<br>' + dadosUsuario.email + '<br>' + dadosUsuario.data_nascimento + '<br>' + dadosUsuario.sexo + '<br>' + dadosUsuario.telefone + '<br>' + dadosUsuario.avatar);

L.easyButton('fa fa-bars', function(btn, map){
    helloPopup.setLatLng(map.getCenter()).openOn(map);
}).addTo(map);