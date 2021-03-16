import { Component, OnInit } from '@angular/core';
import { Layer } from '../models/layer.model';
import { LayerService } from '../services/layer.service';
import { TableModule } from 'primeng/table';
import { ConfirmationService, SelectItem } from 'primeng/api';
import { MessageService } from 'primeng/api';



@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    providers: [MessageService, ConfirmationService]
})
export class DashboardComponent implements OnInit {

    layers: Layer[];
    cols: any[];
    layerDialog: boolean;
    layer: Layer;
    selectedLayers: Layer[];
    submitted: boolean;
    fileObject?: File;
    supportedLayerTypes: any[];
    selectedLayerType: any;

    // ArcGIS Layers
    arcGISDialog: boolean;
    arcGISID: string;

    //will need to use layerservice
    constructor(private messageService: MessageService, private confirmationService: ConfirmationService, private layerService: LayerService) {
        this.supportedLayerTypes = [
            {name: "Make Selection", code: "none"},
            {name: "GeoJSON", code: "geojson"},
            {name: "ArcGIS Online", code: "agol"}
        ]
    }

    ngOnInit() {
        //will need to refactor when making reqs
        this.layerService.getLayers().subscribe(data => {
            this.layers = data;
        });

        this.cols = [
            { field: 'name', header: 'Layer Name' },
            { field: 'fileType', header: 'File Type' },
            { field: 'size', header: 'Size' }
        ];
    }


    openNew() {
        this.selectedLayerType = {name: "Make Selection", code: "none"}
        this.layer = {};
        this.submitted = false;
        this.layerDialog = true;
    }

    deleteSelectedlayers() {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete the selected layers?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.layers = this.layers.filter(val => !this.selectedLayers.includes(val));
                this.selectedLayers = null;
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'layers Deleted', life: 3000 });
            }
        });
    }

    editLayer(layer: Layer) {
        this.layer = { ...layer };
        this.selectedLayerType = this.supportedLayerTypes.find(type => type.name === this.layer.type);
        this.layerDialog = true;
    }

    deleteLayer(layer: Layer) {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete ' + layer.displayName + '?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.layerService.deleteLayer(layer.layerID).subscribe(response => this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Layer Deleted', life: 3000 }),
                    err => console.log(err)
                );
                this.layers = this.layers.filter(val => val.layerID !== layer.layerID);
                this.layer = {};
            }
        });
    }

    hideDialog() {
        this.layerDialog = false;
        this.submitted = false;
    }

    async saveLayer() {
        this.submitted = true;

        switch (this.selectedLayerType.code) {
            case "geojson":
                if (this.layer.name.trim()) {

                    if (this.fileObject) {
                        this.layer.file = await this.toBase64(this.fileObject);
                    }
                    if (this.layer.layerID) {
                        this.layers[this.findIndexById(this.layer.layerID)] = this.layer;
                        this.layerService.updateLayer(this.layer).subscribe(response => this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Layer Updated', life: 3000 }),
                            err => console.log(err)
                        );
                    }
                    else {
                        this.layers.push(this.layer);
                        this.layerService.uploadGeoJSONLayer(this.layer).subscribe(response => this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Layer Created', life: 3000 }),
                            err => console.log(err)
                        );
                        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Layer Created', life: 3000 });
                    }
        
                    this.layers = [...this.layers];
                    this.layerDialog = false;
                    this.layer = {};
                    this.fileObject = null;
                }
            case "agol":
                if (this.layer.name.trim()) {
                    if (this.layer.layerID) {
                        this.layers[this.findIndexById(this.layer.layerID)] = this.layer;
                        this.layerService.updateLayer(this.layer).subscribe(response => this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Layer Updated', life: 3000 }),
                            err => console.log(err)
                        );
                    }
                    else {
                        this.layers.push(this.layer);
                        //TODO: Fix this garbage - need to get rid of redundant endpoint fields
                        this.layer.displayName = this.layer.name;
                        this.layer.arcGISID = this.layer.arcgis;
                        this.layerService.uploadAGOLLayer(this.layer).subscribe(response => this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Layer Created', life: 3000 }),
                            err => console.log(err)
                        );
                        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Layer Created', life: 3000 });
                    }
        
                    this.layers = [...this.layers];
                    this.layerDialog = false;
                    this.layer = {};
                }
        }



    }

    handleFile(event: any) {
        this.fileObject = event.currentFiles[0];
        // this.layer.geoJSON = event as Layer;
        this.layer.type = "GeoJSON";
    }

    findIndexById(id: number): number {
        let index = -1;
        for (let i = 0; i < this.layers.length; i++) {
            if (this.layers[i].layerID === id) {
                index = i;
                break;
            }
        }

        return index;
    }

    toBase64(file): Promise<string | ArrayBuffer> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }

    onLayerTypeChange(event) {
        console.log('event :' + event);
        this.selectedLayerType = event.value;
    }
}
