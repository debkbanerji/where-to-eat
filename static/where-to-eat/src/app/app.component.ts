import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    public pageState: string = 'beforeSearch';
    public httpErrorMessage: string;

    public targetLatitude: number;
    public targetLongitude: number;
    public targetLocation: string;

    private API_ADDRESS = '/api/nearby-places';

    constructor(private http: HttpClient) {
    }

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
        component.pageState = 'loading';

        let requestParams = {};

        if (component.targetLocation && component.targetLocation != '') {
            requestParams['location'] = component.targetLocation;
        }

        if (component.targetLatitude != null && component.targetLongitude != null) {
            requestParams['latitude'] = component.targetLatitude;
            requestParams['longitude'] = component.targetLongitude;
        }

        const requestParamsKeys = Object.keys(requestParams);
        const requestParamsList = [];
        for (let i = 0; i < requestParamsKeys.length; i++) {
            const key = requestParamsKeys[i];
            requestParamsList.push(key + '=' + requestParams[key]);
        }

        const targetAddress = this.API_ADDRESS + '?' + requestParamsList.join('&');

        console.log('Making request', targetAddress);

        this.http.get(targetAddress).subscribe(response => {
            console.log('response', response);
            component.httpErrorMessage = null;
            this.pageState = 'afterSearch';
        }, (error => {
            console.log('Error connecting to API', error);
            component.httpErrorMessage = error.message;
            this.pageState = 'beforeSearch';
        }));
    }
}
