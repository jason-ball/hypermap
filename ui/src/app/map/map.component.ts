import { Component, OnInit, OnDestroy, ViewChild, ElementRef, Input, Output, EventEmitter, NgZone } from '@angular/core';
import { MenuItem, PrimeIcons } from 'primeng/api';

import Map from 'esri/Map';
import MapView from 'esri/views/MapView';
import esriConfig from 'esri/config';
import GeoJSONLayer from 'esri/layers/GeoJSONLayer';
import LayerList from 'esri/widgets/LayerList';
import { WelcomeService } from '../services/welcome.service';
import { LayerService } from '../services/layer.service';
import Layer from 'esri/layers/Layer';
import PortalItem from 'esri/portal/PortalItem';
import Legend from 'esri/widgets/Legend';
import BasemapToggle from 'esri/widgets/BasemapToggle';
import IdentityManager from 'esri/identity/IdentityManager';
import { TokenService } from '../services/token.service';
import { PurpleAirService } from '../services/purpleair.service';
import { PurpleAirLayer } from './PurpleAirLayer';
import { Point } from 'esri/geometry';
import { WebMercator } from 'esri/geometry/SpatialReference';

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
  private layerDescriptions: Array<any> = [];
  private showDetails: boolean = false;
  private curDetails: any;
  hypermapMenuItems: MenuItem[];
  private updateTimer: number;
  private purpleAirLayer: PurpleAirLayer;
  private purpleAirGeoJSONLayer: GeoJSONLayer;
  private map: Map;

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

  updatePurpleAirLayer() {
    console.log('[HYPERMAP] Updating PurpleAir data...');

    this.map.layers.remove(this.purpleAirGeoJSONLayer);
    this.layers = this.layers.filter(layer => layer != this.purpleAirGeoJSONLayer);
    this.layerDescriptions = this.layerDescriptions.filter(desc => desc.uid != this.purpleAirGeoJSONLayer.get('uid'));
    this.purpleAirGeoJSONLayer.destroy();

    this.purpleAirGeoJSONLayer = this.purpleAirLayer.buildGeoJSONLayer();
    this.layerDescriptions.push(this.purpleAirLayer.getDescription());

    this.layers.push(this.purpleAirGeoJSONLayer);
    this.map.layers.add(this.purpleAirGeoJSONLayer);
  }

  constructor(private zone: NgZone, private welcomeService: WelcomeService, private layerService: LayerService, private tokenService: TokenService, private purpleAirService: PurpleAirService) { }

  async initializeMap() {

    this.initializeWorkers();

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
        let portalItem: any = newLayer.get('portalItem');
        let portalItemDesc = portalItem.get('description');
        let portalAttrib = portalItem.get('accessInformation');
        let layerDesc = {
          'uid': newLayer.get('uid'),
          'name': layer.name,
          'description': layer.description == null ? portalItemDesc : layer.description,
          'attribution': portalAttrib
        }
        this.layerDescriptions.push(layerDesc)
        newLayer.visible = false;
        this.layers.push(newLayer);
      }
    }

    this.purpleAirGeoJSONLayer = this.purpleAirLayer.buildGeoJSONLayer();
    this.layers.push(this.purpleAirGeoJSONLayer);
    this.layerDescriptions.push(this.purpleAirLayer.getDescription());


    // Configure the Map
    const mapProperties = {
      basemap: this._basemap,
      layers: this.layers
    };

    this.map = new Map(mapProperties);

    // Initialize the MapView
    const mapViewProperties = {
      container: this.mapViewEl.nativeElement,
      center: this._center,
      zoom: this._zoom,
      map: this.map
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
        const item = event.item;

        if (item) {
          // open the list item in the LayerList
          item.open = true;
          // set an action for zooming to the full extent of the layer
          item.actionsSections = [
            [
              {
                title: 'Go to full extent',
                className: 'esri-icon-zoom-out-fixed',
                id: 'full-extent'
              },
              {
                title: 'Layer information',
                className: 'esri-icon-description',
                id: 'information'
              }
            ],
            [
              {
                title: 'Increase opacity',
                className: 'esri-icon-up',
                id: 'increase-opacity'
              },
              {
                title: 'Decrease opacity',
                className: 'esri-icon-down',
                id: 'decrease-opacity'
              }
            ]
          ];
        }
      }
    });
    layerList.on('trigger-action', async (event) => {
      //Define custom layer list actions here
      switch (event.action.id) {
        case 'information': {
          // Determine layer selected by user and display details modal
          let layer = event.item.layer;
          this.curDetails = this.layerDescriptions.find(x => x.uid == layer.get('uid'));
          this.showDetails = true;
          break;
        }
        case 'increase-opacity': {
          let layer = event.item.layer;
          if (layer.opacity < 1)
            layer.opacity += 0.1;

          break;
        }
        case 'decrease-opacity': {
          let layer = event.item.layer;
          if (layer.opacity > 0)
            layer.opacity -= 0.1;

          break;
        }
      }
    });

    const legend = new Legend({
      view: this._view
    });

    const basemapToggle = new BasemapToggle({
      view: this._view,
      nextBasemap: 'hybrid'
    });

    // Add widgets to view
    this._view.ui.add(layerList, 'top-right');
    this._view.ui.add('mapMenuButton', 'bottom-right');
    this._view.ui.add(legend, 'bottom-left');
    this._view.ui.add('detailsModal', 'center');
    this._view.ui.add(basemapToggle, 'top-left');

    // Use an event listener to manually open popups.
    // Avoids automatically opening empty popups after clicking on a geometry.
    this._view.popup.autoOpenEnabled = false;
    this._view.popup.autoCloseEnabled = false;
    this._view.on("click", async (event) => {
      const r = await this._view.hitTest(event.screenPoint);
      for (const result of r.results) {
        // Runs when a clustered point is clicked
        if (result.graphic.attributes.clusterId) {
          this._view.goTo({
            target: result.graphic,
            zoom: this._view.zoom + 2
          })
          break;
        } else if (result.graphic.attributes.corrected_pm2_5) {
          // Runs if a PurpleAir sensor is clicked
          console.log(result.graphic)
          const mapY = this._view.extent.ymin;
          const pointY: number = result.graphic.geometry.get('y');
          const pointX: number = result.graphic.geometry.get('x');
          const deltaY = pointY - mapY - 5;

          const p = new Point({
            x: pointX,
            y: this._view.center.y + deltaY,
            spatialReference: WebMercator
          });

          this._view.goTo({
            target: window.innerHeight < 978 ? p : this._view.center
          })
            .then(() => this._view.popup.open({
              location: event.mapPoint,
              fetchFeatures: true
            }))
            .catch(console.error)
          break;
        } else if (result.graphic.attributes.OBJECTID) {
          this._view.popup.open({
            location: event.mapPoint,
            fetchFeatures: true
          });
        }
      }
    });

    // Done loading the map
    this.mapLoadedEvent.emit(true);

    // Welcome Modal
    this.welcomeService.show.subscribe(modalOpen => {
      if (modalOpen) {
        this._view.goTo({
          center: [-77.46576684324452, 37.56118644444622],
          zoom: 10,
          rotation: 0,
        });
        this._view.popup.close();
        this.welcomeService.setColorScheme({ type: 'default', label: '' });
        this.updateTimer = window.setInterval(() => this.updatePurpleAirLayer(), 60000);
      } else {
        window.clearInterval(this.updateTimer);
      }
    });

    this.welcomeService.colorScheme.subscribe(colorScheme => this.purpleAirLayer.setColorScheme(colorScheme));
  }

  initializeWorkers() {
    const DEFAULT_WORKER_URL = 'https://js.arcgis.com/4.17/';
    const DEFAULT_LOADER_URL = `${DEFAULT_WORKER_URL}dojo/dojo-lite.js`;

    esriConfig.workers.loaderUrl = DEFAULT_LOADER_URL;
    esriConfig.workers.loaderConfig = {
      baseUrl: `${DEFAULT_WORKER_URL}dojo`,
      packages: [
        { name: 'esri', location: `${DEFAULT_WORKER_URL}esri` },
        { name: 'dojo', location: `${DEFAULT_WORKER_URL}dojo` },
        { name: 'dojox', location: `${DEFAULT_WORKER_URL}dojox` },
        { name: 'dstore', location: `${DEFAULT_WORKER_URL}dstore` },
        { name: 'moment', location: `${DEFAULT_WORKER_URL}moment` },
        { name: '@dojo', location: `${DEFAULT_WORKER_URL}@dojo` },
        {
          name: 'cldrjs',
          location: `${DEFAULT_WORKER_URL}cldrjs`,
          main: 'dist/cldr'
        },
        {
          name: 'globalize',
          location: `${DEFAULT_WORKER_URL}globalize`,
          main: 'dist/globalize'
        },
        {
          name: 'maquette',
          location: `${DEFAULT_WORKER_URL}maquette`,
          main: 'dist/maquette.umd'
        },
        {
          name: 'maquette-css-transitions',
          location: `${DEFAULT_WORKER_URL}maquette-css-transitions`,
          main: 'dist/maquette-css-transitions.umd'
        },
        {
          name: 'maquette-jsx',
          location: `${DEFAULT_WORKER_URL}maquette-jsx`,
          main: 'dist/maquette-jsx.umd'
        },
        { name: 'tslib', location: `${DEFAULT_WORKER_URL}tslib`, main: 'tslib' }
      ]
    };
  }

  closeModal($event: any) {
    this.showDetails = false;
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
    this.purpleAirLayer = new PurpleAirLayer(this.purpleAirService);
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
