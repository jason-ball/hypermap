package hypermap.entity;

public interface SmallGeoJSONLayer {

    int getLayerID();

    String getDisplayName();

    String getDescription();

    default String getFileType() {
        return "GeoJSON";
    }

    default int getSize() {
        return 0;
    }
}
