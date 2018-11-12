import { BrowserModule } from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { NgModule } from '@angular/core';
import {MatChipsModule, MatProgressBarModule} from '@angular/material';

// components
import { AppComponent } from './app.component';
import { ControlComponent } from './components/control/control.component';
import {DragDropModule} from '@angular/cdk/drag-drop';

import {GenreBarComponent} from './components/genre-bar/genre-bar.component';

import { PlaylistComponent } from './components/playlist/playlist.component';

// services
import {PlayerPageComponent} from './components/player-page/player-page.component';
import { PlaylistService } from './shared/services/playlist.service';
import {APP_BASE_HREF} from '@angular/common';
import { HttpClientService } from './shared/services/http-client.service';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {SettingsComponent} from './components/settings/settings.component';

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
    ControlComponent,
    HttpClient,
    PlaylistService,
    HttpClientService],
  bootstrap: [AppComponent]
})
export class AppModule { }
