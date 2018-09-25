import { BrowserModule } from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import { NgModule } from '@angular/core';

// components
import { AppComponent } from './app.component';
import { ControlComponent } from './components/control/control.component';
import {GenreBarComponent} from './components/genre-bar/genre-bar.component';

import { PlaylistComponent } from './components/playlist/playlist.component';

// services
import {TagReaderService} from './shared/services/tag-reader.service';
import {PlayerPageComponent} from './components/player-page/player-page.component';
import { PlaylistService } from './shared/services/playlist.service';
import {APP_BASE_HREF} from '@angular/common';
import { HttpClientService } from './shared/services/http-client.service';
import {HttpClient, HttpClientModule} from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    ControlComponent,
    PlaylistComponent,
    GenreBarComponent,
    PlayerPageComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [
    {provide: APP_BASE_HREF, useValue: '/'},
    HttpClient,
    TagReaderService,
    PlaylistService,
    HttpClientService],
  bootstrap: [AppComponent]
})
export class AppModule { }
