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
    public noPlacesFound: boolean = false;

    public targetLatitude: number;
    public targetLongitude: number;
    public targetLocation: string;


    public searchLatitude: number;
    public searchLongitude: number;
    public unremovedPlaces: any;
    public removedPlaces: any;
    public numToRemove: number;

    // private API_ADDRESS = '/api/nearby-places';
    // private API_ADDRESS = 'https://wheretoeat.debkbanerji.com/api/nearby-places';
    private API_ADDRESS = 'http://localhost:3000/api/nearby-places';

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

    public doSearch() {
        const component = this;
        component.noPlacesFound = false;
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

            if (response['places'] && response['places'].length > 0) {

                component.searchLatitude = response['search_center']['latitude'];
                component.searchLongitude = response['search_center']['longitude'];
                component.unremovedPlaces = response['places'];
                component.removedPlaces = [];
                component.numToRemove = Math.floor(component.unremovedPlaces.length / 2);

                component.httpErrorMessage = null;
                component.noPlacesFound = false;
                component.pageState = 'afterSearch';
            } else {
                component.noPlacesFound = true;
                component.pageState = 'beforeSearch';
            }
        }, (error => {
            console.log('Error connecting to API', error);
            component.httpErrorMessage = error.message;
            component.noPlacesFound = false;
            this.pageState = 'beforeSearch';
        }));
    }

    public getAddressString(addressObject) {
        const addressArray = [];
        const componentLabels = ['address1', 'address2', 'address3', 'city', 'state', 'zip_code'];
        for (let i = 0; i < componentLabels.length; i++) {
            const component = addressObject[componentLabels[i]];
            if (component && component != '') {
                addressArray.push(component)
            }
        }
        return addressArray.join(', ');
    }

    public getArrayOfLength = function(num) {
        return new Array(Math.ceil(num));
    };

    ngOnDestroy(): void {
        this.routeParameterSubscription.unsubscribe();
    }
}
