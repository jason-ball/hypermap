import { Component, OnInit } from '@angular/core';
import { Layer } from '../models/layer.model';
import { LayerService } from '../services/layer.service';
import { TableModule } from 'primeng/table';
import { ConfirmationService } from 'primeng/api';
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

    //will need to use layerservice
    constructor(private messageService: MessageService, private confirmationService: ConfirmationService, private layerService: LayerService) { }

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
        this.layerDialog = true;
    }

    deleteLayer(layer: Layer) {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete ' + layer.displayName + '?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.layers = this.layers.filter(val => val.layerID !== layer.layerID);
                this.layer = {};
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'layer Deleted', life: 3000 });
            }
        });
    }

    hideDialog() {
        this.layerDialog = false;
        this.submitted = false;
    }

    async saveLayer() {
        this.submitted = true;

        if (this.layer.displayName.trim()) {

            if (this.fileObject) {
                this.layer.file = await this.toBase64(this.fileObject);
            }

            if (this.layer.layerId) {
                this.layers[this.findIndexById(this.layer.layerId)] = this.layer;
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Layer Updated', life: 3000 });
            }
            else {
                this.layers.push(this.layer);
                this.layerService.uploadLayer(this.layer).subscribe(response => this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Layer Created', life: 3000 }),
                    err => console.log(err)
                );
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Layer Created', life: 3000 });
            }

            this.layers = [...this.layers];
            this.layerDialog = false;
            this.layer = {};
            this.fileObject = null;
        }
    }

    handleFile(event: any) {
        this.fileObject = event.currentFiles[0];
        // this.layer.geoJSON = event as Layer;
        this.layer.fileType = "GeoJSON";
    }

    findIndexById(id: string): number {
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
}
