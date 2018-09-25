var express = require('express');
var router = express.Router();
const {SparqlClient, SPARQL} = require('sparql-client-2');

const client =
    new SparqlClient('http://dbpedia.org/sparql')
        .register({
            db: 'http://dbpedia.org/resource/',
            dbpedia: 'http://dbpedia.org/property/',
            geo: 'http://www.w3.org/2003/01/geo/wgs84_pos#'
        });

function fetchPOIs(lat, lon, radiusKm, limit) {
    console.log(lat, lon);
    return client
        .query(SPARQL`
	        SELECT ?subject ?label ?abstract ?distance WHERE {
		        ?subject geo:lat ?lat.
		        ?subject geo:long ?long.
		        ?subject rdfs:label ?label.
		        ?subject dbo:abstract ?abstract.
		        BIND(bif:haversine_deg_km (${lat}, ${lon}, ?lat, ?long) as ?distance).
	        FILTER(
		        ?distance < ${radiusKm} &&
		        lang(?label) = "en" &&
		        lang(?abstract) = "en"
		        ).
	        } ORDER BY (?distance) LIMIT ${limit}`)
        .execute()
        // Get the item we want.
        .then(resp => Promise.resolve(resp.results.bindings));
    // .then(response => Promise.resolve(response.results.bindings[0].leaderName.value));
}

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('loading');
});

router.get('/nogps', function(req, res, next) {
    res.render('nogps');
});

router.get('/:lat/:lon', function(req, res, next) {
    let lat = parseFloat(req.params.lat);
    let lon = parseFloat(req.params.lon);

    console.log(lat, lon);

    fetchPOIs(lat, lon, 25, 50)
        .then(pois => res.render('index', { pois: pois, lat: lat, lon: lon }))
        .catch(e => console.log(e));
});

router.get('/json/:lat/:lon', function(req, res, next) {
    let lat = parseFloat(req.params.lat);
    let lon = parseFloat(req.params.lon);
    //let result = { pois: pois, lat: lat, lon: lon }
    console.log(lat, lon);

    fetchPOIs(lat, lon, 25, 50)
        .then(pois => res.send(JSON.stringify({ pois: pois, lat: lat, lon: lon })))
        .catch(e => console.log(e));
});

module.exports = router;
