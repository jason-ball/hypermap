import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
    selector: 'app-details-modal',
    templateUrl: './details-modal.component.html',
    styleUrls: ['./details-modal.component.scss']
})
export class DetailsModalComponent implements OnInit {
    @Input() details: any;
    @Output() closeModal = new EventEmitter<boolean>();
    display: boolean = true;
    name: string;
    attribution: string;
    description: string;

    ngOnInit() {
        console.log(`DetailsModal OnInit ${this.details}`);
    }

    onClose($event: any) {
        this.closeModal.emit(true);
    }
}