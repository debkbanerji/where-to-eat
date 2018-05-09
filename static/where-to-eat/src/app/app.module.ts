import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {
    MatButtonModule, MatCardModule, MatCheckboxModule, MatExpansionModule, MatIconModule, MatInputModule,
    MatProgressSpinnerModule, MatSliderModule
} from "@angular/material";
import 'hammerjs';
import {FormsModule} from "@angular/forms";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {HttpClientModule} from "@angular/common/http";
import {RouterModule} from "@angular/router";

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        RouterModule.forRoot([]),
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        FormsModule,
        MatCardModule,
        MatExpansionModule,
        MatInputModule,
        MatButtonModule,
        MatCheckboxModule,
        MatSliderModule,
        MatIconModule,
        MatProgressSpinnerModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
