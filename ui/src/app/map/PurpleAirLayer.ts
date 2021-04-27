import Color from 'esri/Color';
import { byName as getColorSchemeByName } from 'esri/smartMapping/symbology/support/colorRamps'
import GeoJSONLayer from 'esri/layers/GeoJSONLayer';
import FeatureReductionCluster from 'esri/layers/support/FeatureReductionCluster';
import Field from 'esri/layers/support/Field';
import LabelClass from 'esri/layers/support/LabelClass';
import { FieldsContent, CustomContent, TextContent } from 'esri/popup/content';
import FieldInfo from 'esri/popup/FieldInfo';
import PopupTemplate from 'esri/PopupTemplate';
import { ClassBreaksRenderer } from 'esri/rasterRenderers';
import ClassBreakInfo from 'esri/renderers/support/ClassBreakInfo';
import { TextSymbol, Font, SimpleMarkerSymbol } from 'esri/symbols';
import buildChart from './chart';
import { PurpleAirService } from '../services/purpleair.service';
import { ColorScheme } from '../models/ColorScheme.model';
import Locator from 'esri/tasks/Locator';
import Graphic from 'esri/Graphic';
import { Point } from 'esri/geometry';
import moment from 'moment';
import { environment } from 'src/environments/environment';

export class PurpleAirLayer {

  private purpleAirService: PurpleAirService;
  private defaultColors: Color[];
  private deutanColors: Color[];
  private protanColors: Color[];
  private tritanColors: Color[];
  private activeColors: Color[];
  private purpleAirLabels: LabelClass;
  private clusteredPurpleAirLabels: LabelClass;
  private purpleAirRenderer: ClassBreaksRenderer;
  private sensorPopupFields: FieldsContent;
  private graphContent: CustomContent;
  private addressContent: CustomContent;
  private footerContent: CustomContent;
  private sensorContent: CustomContent;
  private sensorDetailTemplate: PopupTemplate;
  private purpleAirLayerProperties = {}
  public geoJSONLayer: GeoJSONLayer;
  private locator: Locator;

  /**
   * Builds a new GeoJSONLayer with PurpleAir data
   * @returns A new GeoJSONLayer
   */
  public buildGeoJSONLayer(): GeoJSONLayer {
    this.geoJSONLayer = new GeoJSONLayer(this.purpleAirLayerProperties);
    console.log(this.geoJSONLayer.get('uid'))
    return this.geoJSONLayer;
  }

  /**
   * Sets the PurpleAir layer to use the given color scheme
   * @param colorScheme the color scheme to set the PurpleAir layer to
   */
  public setColorScheme(colorScheme: ColorScheme) {
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
    const renderer = this.purpleAirRenderer.clone();
    renderer.classBreakInfos.forEach((info, index) => {
      info.symbol.color = colors[index];
    });
    this.purpleAirRenderer = renderer;
    this.geoJSONLayer.renderer = renderer;
  }

  /**
   * Builds a description for the LayerList widget
   * @returns Description for the LayerList widget
   */
  public getDescription() {
    return {
      uid: this.geoJSONLayer.get('uid'),
      name: this.geoJSONLayer.title,
      description: 'Air quality data from PurpleAir. Sensor data is corrected using equations from the EPA.',
      attribution: 'PurpleAir'
    }
  }

  /**
   * Builds a new PurpleAir layer
   * @param purpleAirService A PurpleAirService instance (needed for the charts)
   */
  constructor(purpleAirService: PurpleAirService) {
    this.purpleAirService = purpleAirService;
    this.locator = new Locator({
      url: 'https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer',
    });

    this.defaultColors = [Color.fromHex('#80E235'), Color.fromHex('#FFFF3C'), Color.fromHex('#E37D1C'), Color.fromHex('#DA0300'), Color.fromHex('#82004B'), Color.fromHex('#6B0027')]
    this.deutanColors = getColorSchemeByName('Red and Gray 4').colorsForClassBreaks[5].colors.reverse();
    this.protanColors = getColorSchemeByName('Blue and Gray 2').colorsForClassBreaks[5].colors.reverse();
    this.tritanColors = getColorSchemeByName('Red and Gray 6').colorsForClassBreaks[5].colors.reverse();
    this.activeColors = this.defaultColors;

    this.purpleAirLabels = new LabelClass({
      labelPlacement: 'center-center',
      minScale: 2500000,
      labelExpressionInfo: {
        expression: 'Round($feature.corrected_pm2_5, 2)'
      }
    });

    this.clusteredPurpleAirLabels = new LabelClass({
      symbol: new TextSymbol({
        color: 'white',
        haloColor: 'black',
        haloSize: '1px',
        font: new Font({
          family: 'CalciteWebCoreIcons',
          size: 12
        })
      }),
      labelPlacement: 'center-center',
      labelExpressionInfo: {
        expression: '"\ue67a"' // esri-icon-zoom-in-magnifying-glass
      }
    });

    this.purpleAirRenderer = new ClassBreaksRenderer({
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
    });

    this.sensorPopupFields = new FieldsContent({
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
    });

    this.graphContent = new CustomContent({
      outFields: ['*'],
      creator: (graphic) => buildChart(graphic, this.purpleAirService, this.activeColors)
    });

    this.addressContent = new CustomContent({
      outFields: ['*'],
      creator: async (g: any) => {
        const { graphic }: { graphic: Graphic } = g;
        const point = graphic.geometry as Point;
        const result = await this.locator.locationToAddress({
          location: point,
          locationType: 'street'
        });
        if (result.attributes.Addr_type === 'PointAddress') {
          return `
            <h1 class="text-center mt-0">${result.attributes.ShortLabel}</h1>
            <h2 class="text-center mt-0">${result.address.split(/,\s(.+)/)[1]}</h2>
          `;
        } else {
          return `<h1 class="text-center"">${result.attributes.ShortLabel}</h1>`;
        }
      }
    });

    this.footerContent = new CustomContent({
      outFields: ['*'],
      creator() {
        return `
          <p class="text-center mb-0">This data was corrected using equations from the EPA.</p>
        `;
      }
    });

    this.sensorContent = new CustomContent({
      outFields: ['*'],
      creator(g: any) {
        const { graphic }: { graphic: Graphic } = g;
        if (graphic.attributes.temperature && graphic.attributes.humidity) {
          return `
            <div class="sensor-row">
              <div>
                <p class="text-center">${graphic.attributes.corrected_pm2_5} µg/m³</p>
                <p class="text-center">Particulate Matter</p>
              </div>
              <div>
                <p class="text-center">${graphic.attributes.temperature} ˚F</p>
                <p class="text-center">Temperature</p>
              </div>
              <div>
                <p class="text-center">${graphic.attributes.humidity}%</p>
                <p class="text-center">Relative Humidity</p>
              </div>
            </div>
          `;
        } else {
          return `
            <div class="sensor-row">
              <div>
                <p class="text-center">${graphic.attributes.corrected_pm2_5}</p>
                <p class="text-center">Particulate Matter</p>
              </div>
            </div>
          `;
        }
      }
    });

    this.sensorDetailTemplate = new PopupTemplate({
      title: '{name}',
      content: [this.addressContent, this.sensorContent, this.graphContent, this.footerContent],
      /* expressionInfos: [
        new ExpressionInfo({
          name: 'sensorLastUpdated',
          title: 'Last Updated',
          expression: '$feature.time / 1000'
        })
      ] */
    });

    this.purpleAirLayerProperties = {
      // Thanks Lambda, you served us well
      // url: 'https://k5emdaxun6.execute-api.us-east-1.amazonaws.com/dev/purpleair',
      url: `${environment.serverHost}/api/purpleair/geojson`,
      title: 'PurpleAir Sensors',
      copyright: 'PurpleAir',
      popupTemplate: this.sensorDetailTemplate,
      renderer: this.purpleAirRenderer,
      labelingInfo: [this.purpleAirLabels],
      featureReduction: new FeatureReductionCluster({
        clusterRadius: 80,
        clusterMinSize: 30,
        clusterMaxSize: 30,
        labelingInfo: [this.clusteredPurpleAirLabels]
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
        }),
        new Field({
          name: 'time',
          alias: 'Last Updated',
          type: 'integer'
        })
      ]
    };

    this.buildGeoJSONLayer();
  }
}
