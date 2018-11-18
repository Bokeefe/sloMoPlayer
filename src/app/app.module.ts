// angular
import {APP_BASE_HREF} from '@angular/common';
import {BrowserModule} from '@angular/platform-browser';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { NgModule } from '@angular/core';
import {MatChipsModule, MatProgressBarModule} from '@angular/material';

// components
import {AppComponent} from './app.component';
import {ControlComponent} from './components/control/control.component';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {GenreBarComponent} from './components/genre-bar/genre-bar.component';
import {PlaylistComponent} from './components/playlist/playlist.component';
import {PlayerPageComponent} from './components/player-page/player-page.component';
import {SettingsComponent} from './components/settings/settings.component';

// services
import {AudioService} from './shared/services/audio.service';
import {PlaylistService} from './shared/services/playlist.service';
import {HttpClientService } from './shared/services/http-client.service';

@NgModule({
  declarations: [
    AppComponent,
    ControlComponent,
    PlaylistComponent,
    GenreBarComponent,
    PlayerPageComponent,
    SettingsComponent
  ],
  imports: [
    DragDropModule,
    MatChipsModule,
    MatProgressBarModule,
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    {provide: APP_BASE_HREF, useValue: '/'},
    AudioService,
    ControlComponent,
    HttpClient,
    PlaylistService,
    HttpClientService],
  bootstrap: [AppComponent]
})
export class AppModule { }
