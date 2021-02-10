package hypermap.controller;

import hypermap.entity.ArcGISLayer;
import hypermap.entity.GeoJSONLayer;
import hypermap.entity.MinimalGeoJSONLayer;
import hypermap.repository.ArcGISLayerRepository;
import hypermap.repository.GeoJSONLayerRepository;
import hypermap.repository.MapLayerRepository;
import hypermap.requestbody.AdminUIArcGISRequest;
import hypermap.requestbody.AdminUILayerUploadRequest;
import hypermap.requestbody.ArcGISTokenRequest;
import hypermap.response.ArcGISToken;
import hypermap.response.LayerResponse;
import io.swagger.annotations.Api;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.*;

@RestController
@RequestMapping("/api")
@Api(tags = "Layers")
@CrossOrigin
public class LayerController {
    private MapLayerRepository mapLayerRepository;
    private GeoJSONLayerRepository geoJSONLayerRepository;
    private ArcGISLayerRepository arcGISLayerRepository;

    @Autowired
    public void setMapLayerRepository(MapLayerRepository mapLayerRepository) {
        this.mapLayerRepository = mapLayerRepository;
    }

    @Autowired
    public void setGeoJSONLayerRepository(GeoJSONLayerRepository geoJSONLayerRepository) {
        this.geoJSONLayerRepository = geoJSONLayerRepository;
    }

    @Autowired
    public void setArcGISLayerRepository(ArcGISLayerRepository arcGISLayerRepository) {
        this.arcGISLayerRepository = arcGISLayerRepository;
    }

    @GetMapping("layers")
    public ResponseEntity<List<LayerResponse>> getLayers() {
        List<MinimalGeoJSONLayer> geoJSONLayers = geoJSONLayerRepository.findAllBy();
        List<ArcGISLayer> arcGISLayers = arcGISLayerRepository.findAll();

        List<LayerResponse> layers = new ArrayList<>();
        for (MinimalGeoJSONLayer layer : geoJSONLayers) {
            LayerResponse response = new LayerResponse();
            response.setName(layer.getDisplayName());
            response.setType("GeoJSON");
            response.setPath("/api/layers/geojson/get/" + layer.getLayerID());

            // Backwards compat. for admin-ui
            response.setLayerID(layer.getLayerID());
            response.setDescription(layer.getDescription());
            layers.add(response);
        }
        for (ArcGISLayer layer : arcGISLayers) {
            LayerResponse response = new LayerResponse();
            response.setName(layer.getDisplayName());
            response.setType("ArcGIS Online");
            response.setArcgis(layer.getArcgisID());

            // Backwards compat. for admin-ui
            response.setLayerID(layer.getLayerID());
            response.setDescription(layer.getDescription());
            layers.add(response);
        }
        return ResponseEntity.ok(layers);
    }

    @GetMapping("layers/geojson/get/{layerID}")
    public ResponseEntity<String> getGeoJSONLayerData(@PathVariable("layerID") int layerID) {
        Optional<GeoJSONLayer> layer = geoJSONLayerRepository.findById(layerID);
        return layer
                .map(l -> ResponseEntity
                        .ok()
                        .contentType(MediaType.APPLICATION_JSON)
                        .body(l.getGeoJSON()))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/MapLayer/GeoJSON")
    public ResponseEntity<List<GeoJSONLayer>> getAllGeoJSON() {
        return ResponseEntity.ok(geoJSONLayerRepository.findAll());
    }

    @PostMapping(path = "/MapLayer/GeoJSON")
    public void addGeoJSON(@RequestBody AdminUILayerUploadRequest request) {
        // Make a new layer object
        GeoJSONLayer layer = new GeoJSONLayer();

        // Set the basic properties from the request
        layer.setDescription(request.getDescription());
        layer.setDisplayName(request.getDisplayName());

        // Get the GeoJSON from the request
        String geoJSON = request.getFile();

        // Remove the MIME type
        // https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs
        geoJSON = geoJSON.substring(geoJSON.indexOf(",") + 1);

        // Decode the base64 encoded GeoJSON
        geoJSON = new String(Base64.getDecoder().decode(geoJSON));

        // Add the geoJSON to the layer
        layer.setGeoJSON(geoJSON);

        // Save it!
        geoJSONLayerRepository.save(layer);
    }

    @PostMapping(path = "/layers/arcgis")
    public void addArcGISLayer(@RequestBody AdminUIArcGISRequest request) {
        // Make a new layer object
        ArcGISLayer layer = new ArcGISLayer();

        // Set the basic properties from the request
        layer.setDescription(request.getDescription());
        layer.setDisplayName(request.getDisplayName());
        layer.setArcgisID(request.getArcGISID());

        // Save it!
        arcGISLayerRepository.save(layer);
    }

    @PutMapping(path = "/MapLayer/GeoJSON")
    public void updateGeoJson(@RequestBody AdminUILayerUploadRequest request) {
        // Get the layer from the DB
        GeoJSONLayer layer = geoJSONLayerRepository.getOne(request.getLayerID());

        // Set the basic properties from the request
        if (request.getDescription() != null) {
            layer.setDescription(request.getDescription());
        }
        if (request.getDisplayName() != null) {
            layer.setDisplayName(request.getDisplayName());
        }

        if (request.getFile() != null) {
            // Get the GeoJSON from the request
            String geoJSON = request.getFile();

            // Remove the MIME type
            // https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs
            geoJSON = geoJSON.substring(geoJSON.indexOf(",") + 1);

            // Decode the base64 encoded GeoJSON
            geoJSON = new String(Base64.getDecoder().decode(geoJSON));

            // Add the geoJSON to the layer
            layer.setGeoJSON(geoJSON);
        }

        // Save it!
        geoJSONLayerRepository.save(layer);
    }

    @PutMapping(path = "/layers/arcgis")
    public void updateArcGISLayer(@RequestBody AdminUIArcGISRequest request) {
        // Get the layer from the DB
        ArcGISLayer layer = arcGISLayerRepository.getOne(request.getLayerID());

        // Set the basic properties from the request
        if (request.getDescription() != null) {
            layer.setDescription(request.getDescription());
        }
        if (request.getDisplayName() != null) {
            layer.setDisplayName(request.getDisplayName());
        }

        if (request.getArcGISID() != null) {
            layer.setArcgisID(request.getArcGISID());
        }

        // Save it!
        arcGISLayerRepository.save(layer);
    }

    @DeleteMapping(path = "/layers/{id}")
    public void deleteGeoJson(@PathVariable(value = "id") String id) {
        mapLayerRepository.deleteById(Integer.valueOf(id));
    }

    @GetMapping(path = "/arcgis-token")
    public ResponseEntity<String> getArcGISToken() {
        WebClient webClient = WebClient.create("https://www.arcgis.com");
        ArcGISTokenRequest request = new ArcGISTokenRequest();
        request.setClientID("client");
        request.setClientSecret("secret");

        Mono<String> token = webClient.post()
                .uri("/sharing/rest/oauth2/token?")
                .accept(MediaType.APPLICATION_JSON)
                .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                .body(BodyInserters.fromFormData(request.toMap()))
                .retrieve()
                .bodyToMono(String.class);

        return ResponseEntity.ok().contentType(MediaType.APPLICATION_JSON).body(token.block());
    }
}
