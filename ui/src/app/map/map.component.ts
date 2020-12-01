import { Component, OnInit, OnDestroy, ViewChild, ElementRef, Input, Output, EventEmitter, NgZone } from '@angular/core';
import Map from "esri/Map";
import MapView from "esri/views/MapView";
import FeatureLayer from "esri/layers/FeatureLayer";
import esriConfig from "esri/config";
import GeoJSONLayer from "esri/layers/GeoJSONLayer";

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, OnDestroy {

  @Output() mapLoadedEvent = new EventEmitter<boolean>();

  // The <div> where we will place the map
  @ViewChild('mapViewNode', { static: true }) private mapViewEl: ElementRef;

  private _zoom = 10;
  private _center: Array<number> = [0.1278, 51.5074];
  private _basemap = 'streets';
  private _loaded = false;
  private _view: MapView = null; 

  get mapLoaded(): boolean {
    return this._loaded;
  }

  @Input()
  set zoom(zoom: number) {
    this._zoom = zoom;
  }

  get zoom(): number {
    return this._zoom;
  }

  @Input()
  set center(center: Array<number>) {
    this._center = center;
  }

  get center(): Array<number> {
    return this._center;
  }

  @Input()
  set basemap(basemap: string) {
    this._basemap = basemap;
  }

  get basemap(): string {
    return this._basemap;
  }

  constructor(private zone: NgZone) { }

  async initializeMap() {

    this.initializeWorkers();
    
    let sensorLabels:any[] = [];
    const nameArcade = "$feature.PM2_5Value";
    const nameClass = {
      labelPlacement: "below-right",
      minScale: 2500000,
      labelExpressionInfo: {
        expression: nameArcade
      }
    };
    sensorLabels.push(nameClass)


    const sensorRenderer = {
      type: "simple", // autocasts as new SimpleRenderer()
      symbol: {
        type: "simple-marker", // autocasts as new SimpleMarkerSymbol()
        size: 30,
        color: [0, 244, 255, 1]
      },
      visualVariables: [
        {
          type: "color",
          field: "PM2_5Value",
          stops: [
            { value: 0, color: "#00FF00" },
            { value: 50, color: "#FFFF00"},
            { value: 150, color: "#FF0000" }
          ]
        }
      ],
      labelingInfo: [nameClass]
    };

    const sensorDetailTemplate = {
      title: "{Label}",
      content: "PM 2.5: {PM2_5Value}"
    };

    // const policeStopsLayer = new FeatureLayer({
    //   url: "https://services.arcgis.com/V6ZHFr6zdgNZuVG0/arcgis/rest/services/Denver_Police_Stops/FeatureServer/0",
    //   renderer: citiesRenderer as any
    // });

    const purpleAirLayer = new GeoJSONLayer({
      url: "https://k5emdaxun6.execute-api.us-east-1.amazonaws.com/dev/layer/42",
      popupTemplate: sensorDetailTemplate,
      renderer: sensorRenderer as any
    });

    // Configure the Map
    const mapProperties = {
      basemap: this._basemap,
      layers: [purpleAirLayer]
    };

    const map = new Map(mapProperties);   

    // Initialize the MapView
    const mapViewProperties = {
      container: this.mapViewEl.nativeElement,
      center: this._center,
      zoom: this._zoom,
      map: map
    };

    
    this._view = new MapView(mapViewProperties);
    
    // wait for the map to load
    await this._view.when(); 
    return this._view;
  }

  initializeWorkers() {
    const DEFAULT_WORKER_URL = "https://js.arcgis.com/4.17/";
    const DEFAULT_LOADER_URL = `${DEFAULT_WORKER_URL}dojo/dojo-lite.js`;

    esriConfig.workers.loaderUrl = DEFAULT_LOADER_URL;
    esriConfig.workers.loaderConfig = {
      baseUrl: `${DEFAULT_WORKER_URL}dojo`,
      packages: [
        { name: "esri", location: `${DEFAULT_WORKER_URL}esri` },
        { name: "dojo", location: `${DEFAULT_WORKER_URL}dojo` },
        { name: "dojox", location: `${DEFAULT_WORKER_URL}dojox` },
        { name: "dstore", location: `${DEFAULT_WORKER_URL}dstore` },
        { name: "moment", location: `${DEFAULT_WORKER_URL}moment` },
        { name: "@dojo", location: `${DEFAULT_WORKER_URL}@dojo` },
        {
          name: "cldrjs",
          location: `${DEFAULT_WORKER_URL}cldrjs`,
          main: "dist/cldr"
        },
        {
          name: "globalize",
          location: `${DEFAULT_WORKER_URL}globalize`,
          main: "dist/globalize"
        },
        {
          name: "maquette",
          location: `${DEFAULT_WORKER_URL}maquette`,
          main: "dist/maquette.umd"
        },
        {
          name: "maquette-css-transitions",
          location: `${DEFAULT_WORKER_URL}maquette-css-transitions`,
          main: "dist/maquette-css-transitions.umd"
        },
        {
          name: "maquette-jsx",
          location: `${DEFAULT_WORKER_URL}maquette-jsx`,
          main: "dist/maquette-jsx.umd"
        },
        { name: "tslib", location: `${DEFAULT_WORKER_URL}tslib`, main: "tslib" }
      ]
    };    
  }

  ngOnInit() {
    // For more info on change detection handling see: https://github.com/Esri/angular-cli-esri-map/issues/70
    // as well as this blog post: https://www.andygup.net/manual-change-detection-in-angular-for-performance/
    this.zone.runOutsideAngular(() => {
      // Initialize MapView and return an instance of MapView
      this.initializeMap().then((mapView) => {
        // The map has been initialized
        console.log('mapView ready: ', mapView.ready);
        this._loaded = mapView.ready;
        this.mapLoadedEvent.emit(true);
      });
    })
  }

  ngOnDestroy() {
    if (this._view){
      this._view.container = null;
    }
  }
}