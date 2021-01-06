package hypermap.controller;

import hypermap.entity.GeoJSONLayer;
import hypermap.entity.SmallGeoJSONLayer;
import hypermap.repository.GeoJSONLayerRepository;
import hypermap.repository.SimpleGeoJSONLayerRepository;
import hypermap.response.LayerResponse;
import io.swagger.annotations.Api;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api")
@Api(tags = "Layers")
@CrossOrigin
public class LayerController {
    private GeoJSONLayerRepository geoJSONLayerRepository;
    private SimpleGeoJSONLayerRepository simpleGeoJSONLayerRepository;

    @GetMapping("layers")
    public ResponseEntity<List<LayerResponse>> getGeoJSONLayers() {
        List<SmallGeoJSONLayer> geoJSONLayers = simpleGeoJSONLayerRepository.findAll();
        List<LayerResponse> layers = new ArrayList<>();
        for (SmallGeoJSONLayer layer : geoJSONLayers) {
            LayerResponse response = new LayerResponse();
            response.setName(layer.getDisplayName());
            response.setType("GeoJSON");
            response.setPath("/api/layers/get/" + layer.getLayerID());

            // Backwards compat. for admin-ui
            response.setDisplayName(layer.getDisplayName());
            response.setLayerID(layer.getLayerID());
            response.setDescription(layer.getDescription());
            layers.add(response);
        }
        return ResponseEntity.ok(layers);
    }

    @GetMapping("layers/get/{layerID}")
    public ResponseEntity<String> getGeoJSONLayerData(@PathVariable("layerID") int layerID) {
        Optional<GeoJSONLayer> layer = geoJSONLayerRepository.findById(layerID);
        return layer
                .map(geoJSONLayer -> ResponseEntity
                        .ok()
                        .contentType(MediaType.APPLICATION_JSON)
                        .body(geoJSONLayer.getGeoJSON()))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @Autowired
    public void setGeoJSONLayerRepository(GeoJSONLayerRepository geoJSONLayerRepository) {
        this.geoJSONLayerRepository = geoJSONLayerRepository;
    }

    @Autowired
    public void setSimpleGeoJSONLayerRepository(SimpleGeoJSONLayerRepository simpleGeoJSONLayerRepository) {
        this.simpleGeoJSONLayerRepository = simpleGeoJSONLayerRepository;
    }
}
