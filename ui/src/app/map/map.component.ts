import { Component, OnInit, OnDestroy, ViewChild, ElementRef, Input, Output, EventEmitter, NgZone } from '@angular/core';
import Map from "esri/Map";
import MapView from "esri/views/MapView";
import FeatureLayer from "esri/layers/FeatureLayer";
import esriConfig from "esri/config";
import GeoJSONLayer from 'esri/layers/GeoJSONLayer';
import PopupTemplate from 'esri/PopupTemplate';
import SimpleRenderer from 'esri/renderers/SimpleRenderer';
import SimpleMarkerSymbol from 'esri/symbols/SimpleMarkerSymbol';
import ColorVariable from 'esri/renderers/visualVariables/ColorVariable';
import LabelClass from 'esri/layers/support/LabelClass';
import FieldInfo from 'esri/popup/FieldInfo';
import FieldsContent from 'esri/popup/content/FieldsContent';
import FieldInfoFormat from 'esri/popup/support/FieldInfoFormat';
import ExpressionInfo from 'esri/popup/ExpressionInfo';
import FeatureReductionCluster from 'esri/layers/support/FeatureReductionCluster';
import TextSymbol from 'esri/symbols/TextSymbol';
import Font from 'esri/symbols/Font'

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

    const purpleAirLabels = new LabelClass({
      labelPlacement: "center-center",
      minScale: 2500000,
      labelExpressionInfo: {
        expression: "Round($feature.CorrectedPM2_5Value, 2)"
      }
    });

    const clusteredPurpleAirLabels = new LabelClass({
      symbol: new TextSymbol({
        color: 'white',
        haloColor: "black",
        haloSize: "1px",
        font: new Font({
          family: 'CalciteWebCoreIcons',
          size: 12
        })
      }),
      labelPlacement: 'center-center',
      labelExpressionInfo: {
        expression: '"\ue67a"' // esri-icon-zoom-in-magnifying-glass
      }
    })

    const sensorRenderer = new SimpleRenderer({
      symbol: new SimpleMarkerSymbol({
        size: 30,
        color: [0, 244, 255, 1]
      }),
      visualVariables: [
        new ColorVariable({
          field: "CorrectedPM2_5Value",
          stops: [
            { value: 0, color: "#00FF00" },
            { value: 50, color: "#FFFF00"},
            { value: 150, color: "#FF0000" }
          ]
        })
      ]
    });

    const sensorPopupFields = new FieldsContent({
      fieldInfos: [
        new FieldInfo({
          label: 'PM2.5 (Corrected)',
          fieldName: 'CorrectedPM2_5Value'
        }),
        new FieldInfo({
          label: 'PM2.5',
          fieldName: 'pm2.5'
        }),
        new FieldInfo({
          label: 'Correction Method',
          fieldName: 'CorrectionMethod'
        }),
        new FieldInfo({
          label: 'Last Updated',
          fieldName: 'expression/sensorLastUpdated',
          format: new FieldInfoFormat({
            dateFormat: 'day-short-month-year-short-time'
          }),
        })
      ]
    })

    const sensorDetailTemplate = new PopupTemplate({
      title: "{name}",
      content: [sensorPopupFields],
      expressionInfos: [
        new ExpressionInfo({
          name: 'sensorLastUpdated',
          title: 'Last Updated',
          expression: '$feature.last_seen * 1000'
        })
      ]
    });

    // const policeStopsLayer = new FeatureLayer({
    //   url: "https://services.arcgis.com/V6ZHFr6zdgNZuVG0/arcgis/rest/services/Denver_Police_Stops/FeatureServer/0",
    //   renderer: citiesRenderer as any
    // });

    const purpleAirLayer = new GeoJSONLayer({
      url: "https://k5emdaxun6.execute-api.us-east-1.amazonaws.com/dev/purpleair",
      popupTemplate: sensorDetailTemplate,
      renderer: sensorRenderer,
      labelingInfo: [purpleAirLabels],
      featureReduction: new FeatureReductionCluster({
        clusterRadius: 80,
        clusterMinSize: 30,
        clusterMaxSize: 30,
        labelingInfo: [clusteredPurpleAirLabels]
      })
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

    this._view.on('click', async (event) => {
      const r = await this._view.hitTest(event.screenPoint);
      r.results.forEach(result => {
        if (result.graphic.attributes.clusterId) {
          this._view.goTo({
            target: result.graphic,
            zoom: this._view.zoom + 2
          })
        }
      })
    })

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
    /* // For more info on change detection handling see: https://github.com/Esri/angular-cli-esri-map/issues/70
    // as well as this blog post: https://www.andygup.net/manual-change-detection-in-angular-for-performance/
    this.zone.runOutsideAngular(() => {
      // Initialize MapView and return an instance of MapView
      this.initializeMap().then((mapView) => {
        // The map has been initialized
        console.log('mapView ready: ', mapView.ready);
        this._loaded = mapView.ready;
        this.mapLoadedEvent.emit(true);
      });
    }) */
    this.initializeMap();
  }

  ngOnDestroy() {
    if (this._view){
      this._view.container = null;
    }
  }
}
