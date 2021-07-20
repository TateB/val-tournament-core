# Valorant Stream Overlay
## For valorant map bans, a timer, score overlays, and more

Valorant stream overlay, uses VOT/LPL colours, but can be customised to whatever you want.

## Features

### Timer
Pretty simple timer, for throwing on stream when you are at a break or starting soon.

### Map Bans
Shows map bans in a pretty cool manner, can also show autobans, and does all from a Bo1 to a Bo5. 
All it takes is copy pasting your veto log into the settings for it to auto configure itself (in the chance that it doesn't, you can still fix things manually).

### Score overlay 
A score overlay for while you are in game, uses team names and scores.
There are 4 options for a score overlay: 
`charselect/obs`, for in character select screen, (no actual scores) just puts team names up the top of the screen.
`scoreoverlay/obs`, for an actual in game score overlay.
`scoreoverlay/obs_vs`, for a "Team A VS Team B" at a starting screen
`scoreoverlay/obs_rs`, for a multi row score overlay if you're not in game, but in a break or something like that.

### General Settings
You have the ability to choose uppercase or lowercase characters (depending on stream aesthetic), as well as choosing the VOT/LPL colour scheme.
Upcoming is a custom colour chooser, the forms are there but it's not yet implemented so don't try to use it.

### Keep in mind this project is a WIP, and not finished yet.
You will probably encounter bugs. Lol.


### Map Bans Screenshots
Four bans (Bo1):
![Four Bans Example](example_images/4bans.png)

Two bans (Bo3):
![Two Bans Example](example_images/2bans.png)

No bans (Bo5):
![No Bans Example](example_images/nobans.png)

This application requires NodeJS to run

How to install:
```
npm install
```
to install all the dependencies.

How to run:
```
node index
```
This command should run everything smoothly but be sure to check the logs in case there are errors.

The default port is set to 3000, but this can be changed.
http://localhost:3000 to visit the settings page.


### OBS Viewports
#### Map Bans
`http://localhost:3000/mapbans/obs` 
Resolution: 1500x720

#### Score Overlays
`http://localhost:3000/scoreoverlay/obs`
Main Score Overlay, Resolution: 1920x1080

`http://localhost:3000/scoreoverlay/obs_vs`
VS Team Name Overlay, Resolution: Any

`http://localhost:3000/scoreoverlay/obs_rs`
Break/Not In-Game Score Overlay, Resolution: Any

`http://localhost:3000/charselect/obs`
Character Select Team Name Overlay, Resolution: 1920x1080

#### Timer Overlay
`http://localhost:3000/timer/obs`
Resolution: Any



