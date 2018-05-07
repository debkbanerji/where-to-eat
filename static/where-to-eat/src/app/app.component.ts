import {Component, OnInit} from '@angular/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    public pageState: string = 'beforeSearch';

    public targetLatitude: number;
    public targetLongitude: number;
    public targetLocation: string;

    private API_ADDRESS = '/api/nearby-places';

    ngOnInit(): void {
        this.setCoordinatesToProvided();
    }

    private setCoordinatesToProvided(): void {
        const component = this;
        navigator.geolocation.getCurrentPosition(function (providedLocation) {
            const providedCoordinates = providedLocation.coords;
            component.targetLatitude = providedCoordinates.latitude;
            component.targetLongitude = providedCoordinates.longitude;
            console.log('User\'s estimated location', providedLocation)
        }, function () {
            // Do nothing - user must enter location manually
        });
    }

    public abs(num: number) {
        return Math.abs(num);
    }

    public doSeearch() {
        const component = this;
        component.pageState = 'loading'
    }
}
