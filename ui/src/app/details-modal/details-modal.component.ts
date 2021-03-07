import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-details-modal',
    templateUrl: './details-modal.component.html',
    styleUrls: ['./details-modal.component.scss']
})
export class DetailsModalComponent implements OnInit {
    @Input() details: any;
    display: boolean = true;
    name: string;
    attribution: string;
    description: string;

    ngOnInit() {
        console.log(`DetailsModal OnInit ${this.details}`);
    }
}