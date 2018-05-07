import {Component, OnDestroy, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ActivatedRoute} from "@angular/router";
import {Subscription} from "rxjs/index";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
    private routeParameterSubscription: Subscription;

    public pageState: string = 'beforeSearch';
    public httpErrorMessage: string;

    public targetLatitude: number;
    public targetLongitude: number;
    public targetLocation: string;

    private API_ADDRESS = '/api/nearby-places';

    // private API_ADDRESS = 'https://where-2-eat.herokuapp.com//api/nearby-places';

    constructor(private http: HttpClient, private route: ActivatedRoute) {
    }

    ngOnInit(): void {
        const component = this;
        this.routeParameterSubscription = this.route.queryParams.subscribe(params => {
            console.log(params);
            if (+params['latitude'] && +params['longitude']) {
                component.targetLatitude = +params['latitude'];
                component.targetLongitude = +params['longitude'];
            }
            if (params['location']) {
                component.targetLocation = params['location'];
            }
            component.setCoordinatesToRequested();
        });
    }

    public setCoordinatesToRequested(): void {
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

    ngOnDestroy(): void {
        this.routeParameterSubscription.unsubscribe();
    }
}
