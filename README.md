# Mapbans overlay
## For valorant map bans

Valorant map bans overlay, uses VOT/LPL colours, but can be customised to whatever you want.

### Now features: veto reading
Copy and paste the veto log directly into the webpage, and the veto will automatically set everything up for you.
Manual edit mode is still available, but will only need to be used when there is some sort of error in how the veto is read.
FYI: Typing auto as the team who banned a map will make it an "autoban map" and it won't be prominently displayed on the screen.

### Keep in mind this project is a WIP, and not finished yet.
You will probably encounter bugs. Lol.

Four bans (Bo1):
![Four Bans Example](example_images/4bans.png)

Two bans (Bo3):
![Two Bans Example](example_images/2bans.png)

No bans (Bo5):
![No Bans Example](example_images/nobans.png)

requires nodejs to run

how to install:
```
npm install
```
to install requirements

how to run
```
node index
```
default port is 3000, but you can change this in the code
https://localhost:3000 to visit the settings page

https://localhost:3000/obs for the OBS browser source,
make sure the viewport is set to 1500x720 as well.


