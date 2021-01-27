import { Component, OnInit, OnDestroy, ViewChild, ElementRef, Input, Output, EventEmitter, NgZone } from '@angular/core';
import { MenuItem, PrimeIcons } from 'primeng/api';

import Map from "esri/Map";
import MapView from "esri/views/MapView";
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
import Font from 'esri/symbols/Font';
import LayerList from 'esri/widgets/LayerList';
import { WelcomeService } from '../services/welcome.service';
import { LayerService } from '../services/layer.service';
import Layer from 'esri/layers/Layer';
import PortalItem from 'esri/portal/PortalItem';
import Legend from 'esri/widgets/Legend';
import BasemapToggle from 'esri/widgets/BasemapToggle';

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
  private _center: Array<number> = [-77.46576684324452, 37.56118644444622];
  private _basemap = 'streets';
  private _loaded = false;
  private _view: MapView = null;
  private layers: Array<any> = [];
  hypermapMenuItems: MenuItem[];

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

  openModal() {
    this.welcomeService.openModal();
  }

  constructor(private zone: NgZone, private welcomeService: WelcomeService, private layerService: LayerService) { }

  async initializeMap() {

    this.initializeWorkers();

    // Add each layer uploaded via admin UI to array of available layers
    this.layerService.getLayers().subscribe(async layers => {
      for (const layer of layers) {
        if (layer.type === 'GeoJSON') {
            const newLayer = new GeoJSONLayer({
              url: `http://localhost:5431${layer.path}`,
              title: layer.name,
              visible: false
            });
            this.layers.push(newLayer);
          } else {
            const newLayer = await Layer.fromPortalItem({
              portalItem: new PortalItem({
                id: layer.arcgis
              })
            });
            newLayer.visible = false;
            this.layers.push(newLayer);
          }
      }

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
              { value: 50, color: "#FFFF00" },
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

      // Create and push the layer for PurpleAir sensors
      const purpleAirLayer = new GeoJSONLayer({
        url: "https://k5emdaxun6.execute-api.us-east-1.amazonaws.com/dev/purpleair",
        title: 'PurpleAir Sensors',
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
      this.layers.push(purpleAirLayer);


      // Configure the Map
      const mapProperties = {
        basemap: this._basemap,
        layers: this.layers
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

      // Add LayerList Widget
      const layerList = new LayerList({
        view: this._view,
        selectionEnabled: true,
        // executes for each ListItem in the LayerList
        listItemCreatedFunction: function (event) {
          // The event object contains properties of the
          // layer in the LayerList widget.
          var item = event.item;

          if (item) {
            // open the list item in the LayerList
            item.open = true;
            // set an action for zooming to the full extent of the layer
            item.actionsSections = [[{
              title: "Go to full extent",
              className: "esri-icon-zoom-out-fixed",
              id: "full-extent"
            }]];
          }
        }
      });

      const legend = new Legend({
        view: this._view
      });

      var basemapToggle = new BasemapToggle({
        view: this._view,  // The view that provides access to the map's "streets-vector" basemap
        nextBasemap: "hybrid"  // Allows for toggling to the "hybrid" basemap
      });

      // Add widgets to view
      this._view.ui.add(layerList, 'top-right');
      this._view.ui.add('mapMenuButton', 'bottom-right');
      this._view.ui.add([legend, basemapToggle], 'bottom-left');


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
      });

      // Done loading the map
      this.mapLoadedEvent.emit(true);

      // Welcome Modal
      this.welcomeService.show.subscribe(modalOpen => {
      if (modalOpen) {
        this._view.goTo({
          center: [-77.46576684324452, 37.56118644444622],
          zoom: 10
        });
      }
    });
    })
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

  // getLayers(): Array<GeoJSONLayer> {
  //   this.layerService.getLayers().subscribe
  // }

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
    this.hypermapMenuItems = [
      {
        label: 'Refresh',
        icon: PrimeIcons.REFRESH,
        command() {
          window.location.reload();
        }
      },
      {
        label: 'Exit',
        icon: PrimeIcons.TIMES,
        command: () => {
          this.welcomeService.openModal();
        }
      }
    ]
  }

  ngOnDestroy() {
    if (this._view) {
      this._view.container = null;
    }
  }
}
