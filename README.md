# sloMoPlayer


This is a music player for the browser that slows music down and adds reverb. Inspired by Bohren and der Club of Gore and Caretaker. Highly recommended for screwed jazz.

To run, add music files into the /music directory and run 

`npm i` 

to get the projects dependencies and then


`ng build` 

to complile the angular code
This creates playlists based on shared genres so make sure all of your music files match the genres you want them to have.

finally run the node server and feed it the music file directory which will now be in the /dist folder eg:


`node server.js`

