import { Component, OnInit, OnDestroy, ViewChild, ElementRef, Input, Output, EventEmitter, NgZone } from '@angular/core';
import { MenuItem, PrimeIcons } from 'primeng/api';

import Map from "esri/Map";
import MapView from "esri/views/MapView";
import esriConfig from "esri/config";
import GeoJSONLayer from 'esri/layers/GeoJSONLayer';
import PopupTemplate from 'esri/PopupTemplate';
import ClassBreaksRenderer from 'esri/renderers/ClassBreaksRenderer';
import ClassBreakInfo from 'esri/renderers/support/ClassBreakInfo'
import SimpleMarkerSymbol from 'esri/symbols/SimpleMarkerSymbol';
import LabelClass from 'esri/layers/support/LabelClass';
import FieldInfo from 'esri/popup/FieldInfo';
import FieldsContent from 'esri/popup/content/FieldsContent';
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
import Field from 'esri/layers/support/Field';
import IdentityManager from 'esri/identity/IdentityManager';
import { TokenService } from '../services/token.service';
import CustomContent from 'esri/popup/content/CustomContent';
import { byName as getColorSchemeByName } from 'esri/smartMapping/symbology/support/colorRamps'
import buildChart from './chart';
import { PurpleairService } from '../services/purpleair.service';
import Color from 'esri/Color';
import { ColorScheme } from '../models/ColorScheme.model';

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
  private currentColorScheme: ColorScheme
  private defaultColors = [Color.fromHex('#80E235'), Color.fromHex('#FFFF3C'), Color.fromHex('#E37D1C'), Color.fromHex('#DA0300'), Color.fromHex('#82004B'), Color.fromHex('#6B0027')]
  private deutanColors = getColorSchemeByName('Purple 2').colorsForClassBreaks[5].colors;
  private protanColors = getColorSchemeByName('Purple 4').colorsForClassBreaks[5].colors;
  private tritanColors = getColorSchemeByName('Red 5').colorsForClassBreaks[5].colors;
  private activeColors: Color[];
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

  constructor(private zone: NgZone, private welcomeService: WelcomeService, private layerService: LayerService, private tokenService: TokenService, private purpleAirService: PurpleairService) { }

  async initializeMap() {

    this.initializeWorkers();
    console.log(getColorSchemeByName("Green 4").colorsForClassBreaks)

    const token = await this.tokenService.getToken().toPromise()
    IdentityManager.registerToken({
      token: token.access_token,
      server: 'https://www.arcgis.com/sharing/rest'
    })

    // Add each layer uploaded via admin UI to array of available layers
    const layers = await this.layerService.getLayers().toPromise();
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
        expression: "Round($feature.corrected_pm2_5, 2)"
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

    const purpleAirRenderer = new ClassBreaksRenderer({
      field: 'corrected_pm2_5',
      classBreakInfos: [
        new ClassBreakInfo({
          minValue: 0,
          maxValue: 12,
          label: 'Good (≤ 12 µg/m³)',
          symbol: new SimpleMarkerSymbol({
            size: 30,
            color: this.defaultColors[0]
          })
        }),
        new ClassBreakInfo({
          minValue: 12.01,
          maxValue: 35.4,
          label: 'Moderate (≤ 35.4 µg/m³)',
          symbol: new SimpleMarkerSymbol({
            size: 30,
            color: this.defaultColors[1]
          })
        }),
        new ClassBreakInfo({
          minValue: 35.5,
          maxValue: 55.4,
          label: 'Unhealthy for sensitive groups (≤ 55.4 µg/m³)',
          symbol: new SimpleMarkerSymbol({
            size: 30,
            color: this.defaultColors[2]
          })
        }),
        new ClassBreakInfo({
          minValue: 55.5,
          maxValue: 150.4,
          label: 'Unhealthy (≤ 150.4 µg/m³)',
          symbol: new SimpleMarkerSymbol({
            size: 30,
            color: this.defaultColors[3]
          })
        }),
        new ClassBreakInfo({
          minValue: 150.5,
          maxValue: 250.4,
          label: 'Very Unhealthy (≤ 250.4 µg/m³)',
          symbol: new SimpleMarkerSymbol({
            size: 30,
            color: this.defaultColors[4]
          })
        }),
        new ClassBreakInfo({
          minValue: 250.5,
          maxValue: 42000,
          label: 'Hazardous (≥ 250.5 µg/m³)',
          symbol: new SimpleMarkerSymbol({
            size: 30,
            color: this.defaultColors[5]
          })
        }),
      ]
    })

    const sensorPopupFields = new FieldsContent({
      fieldInfos: [
        new FieldInfo({
          label: 'PM2.5 (Corrected)',
          fieldName: 'corrected_pm2_5'
        }),
        new FieldInfo({
          label: 'PM2.5',
          fieldName: 'pm2_5'
        }),
        new FieldInfo({
          label: 'Correction Method',
          fieldName: 'correction_method'
        }),
        /* new FieldInfo({
          label: 'Last Updated',
          fieldName: 'expression/sensorLastUpdated',
          format: new FieldInfoFormat({
            dateFormat: 'day-short-month-year-short-time'
          }),
        }) */
      ]
    })

    const graphContent = new CustomContent({
      outFields: ['*'],
      creator: (graphic) => buildChart(graphic, this.purpleAirService, this.activeColors)
    });

    const sensorDetailTemplate = new PopupTemplate({
      title: "{name}",
      content: [sensorPopupFields, graphContent],
      /* expressionInfos: [
        new ExpressionInfo({
          name: 'sensorLastUpdated',
          title: 'Last Updated',
          expression: '$feature.time / 1000'
        })
      ] */
    });

    // Create and push the layer for PurpleAir sensors
    const purpleAirLayer = new GeoJSONLayer({
      // Thanks Lambda, you served us well
      // url: "https://k5emdaxun6.execute-api.us-east-1.amazonaws.com/dev/purpleair",
      url: 'http://localhost:5431/api/purpleair/geojson',
      title: 'PurpleAir Sensors',
      copyright: 'PurpleAir',
      popupTemplate: sensorDetailTemplate,
      renderer: purpleAirRenderer,
      labelingInfo: [purpleAirLabels],
      featureReduction: new FeatureReductionCluster({
        clusterRadius: 80,
        clusterMinSize: 30,
        clusterMaxSize: 30,
        labelingInfo: [clusteredPurpleAirLabels]
      }),
      fields: [
        new Field({
          name: 'purpleair_id',
          alias: 'Sensor ID',
          type: 'integer'
        }),
        new Field({
          name: 'name',
          alias: 'Sensor Name',
          type: 'string'
        }),
        new Field({
          name: 'pm2_5',
          alias: 'Particulate Matter in the Air (micrograms per cubic meter)',
          type: 'double'
        }),
        new Field({
          name: 'humidity',
          alias: 'Relative Humidity',
          type: 'integer'
        }),
        new Field({
          name: 'temperature',
          alias: 'Temperature',
          type: 'integer'
        }),
        new Field({
          name: 'corrected_pm2_5',
          alias: 'Particulate Matter in the Air (µg/m³)',
          type: 'double'
        }),
        new Field({
          name: 'correction_method',
          alias: 'Correction Method',
          type: 'string'
        })
      ]
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

    const basemapToggle = new BasemapToggle({
      view: this._view,
      nextBasemap: "hybrid"
    });

    // Add widgets to view
    this._view.ui.add(layerList, 'top-right');
    this._view.ui.add('mapMenuButton', 'bottom-right');
    this._view.ui.add(legend, 'bottom-left');
    this._view.ui.add(basemapToggle, 'top-left');


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

    const setColorScheme = (colorScheme: ColorScheme) => {
      let colors = this.defaultColors;
      switch (colorScheme.type) {
        case 'default':
          colors = this.defaultColors;
          break;
        case 'deutan':
          colors = this.deutanColors;
          break;
        case 'protan':
          colors = this.protanColors;
          break;
        case 'tritan':
          colors = this.tritanColors;
          break;
        default:
          break;
      }
      this.activeColors = colors;
      const renderer = purpleAirRenderer.clone();
      renderer.classBreakInfos.forEach((info, index) => {
        info.symbol.color = colors[index];
      });
      purpleAirLayer.renderer = renderer;
    }

    // Welcome Modal
    this.welcomeService.show.subscribe(modalOpen => {
      if (modalOpen) {
        this._view.goTo({
          center: [-77.46576684324452, 37.56118644444622],
          zoom: 10
        });
        this._view.popup.close();
        this.welcomeService.setColorScheme({ type: 'default', label: '' });
      }
    });

    this.welcomeService.colorScheme.subscribe(setColorScheme);
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
    this.activeColors = this.defaultColors;
  }

  ngOnDestroy() {
    if (this._view) {
      this._view.container = null;
    }
  }
}
