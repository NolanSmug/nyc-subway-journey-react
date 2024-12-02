# NYC Subway Journey Game React App

### Screenshots
<img src='./src/images/cover-screenshot-1.png'>
<img src='./src/images/cover-screenshot-2.png'>

## How to Play
You are placed into a random NYC subway station. Your objective is to reach another randomly given station by utilizing your knowledge of the NYC subway system. 

### Initialization
1. **Random Starting Point:**
- At the beginning of the game, you are assigned:
  - A `starting station` 
  - A `destination station` (see [all_stations.csv](./public/csv/all_stations.csv))
  - A `starting line` (e.g., A, 2, N,...)
2. **Choosing a Direction:**
- Before you can move, you must choose a `starting direction` (e.g. UPTOWN, DOWNTOWN) by: 
   - Clicking the `[Toggle Direction]` text on the subway car, or 
   - Clicking `Change Direction` button. 
- The `Advance` button will remain disabled until a direction is chosen.
     > If you want, you may transfer to a different line before selecting a direction.
3. **Ready to Move:**
- Once a direction is selected, you are able to `Advance` and `Transfer`. 
<br>

### Gameplay

1. **Navigating the Subway:**
- The game UI displays your `current station` and `destination station`. Like you would in real life, use the according actions to progress:

   **Buttons:**
  -  `Advance Station` – Advance 1 station (see `conductor mode` to control this value)
  -  `Change Direction` – Reverses your current direction. Each line has specific `UPTOWN` and `DOWNTOWN` labels.
  -  `Transfer Lines` –  Click on a subway line at your `current station` to switch to that line and continue your journey in the same direction.
      > **Note:** Using this button is optional. You can directly click on a subway line icon at the current station to switch to it as well.
  - `Refresh` – Refreshes the current game with new starting and destination stations.  
<br>

1. **Goal:**
- Successfully navigate from your starting station to your destination station by advancing through stations and transferring train lines as needed. Be mindful of your `current direction` throughout as well.
  
### Configuration Settings
- **`Theme`** – Toggle light/dark mode
- **`Upcoming Stations`** – Toggle upcoming stations visibility
- **`Upcoming Stations Layout`** – Set the upcoming stations view to vertical or horizontal
- **`Conductor Mode`** – Enable conductor mode (default is rider mode)


### Conductor Mode
Think of conductor mode as a sort of a professional feature mode. When enabled, users are able to:  

1. Advance an inputted number of stations
2. View _keyboard shortcuts_ for all buttons

### Keyboard Shortcuts
- `→` Advance Station
- `t` Transfer Lines
- `c` Change Direction
- `r` Reset Game
- `+` Increase Advance Count
- `-` Decrease Advance Count
<br><br>
- `Shift` + `D` – Toggle **Theme**
- `Shift` + `U` – Toggle **Upcoming Stations**
- `Shift` + `L` – Toggle **Upcoming Stations Layout**
- `Shift` + `C` – Toggle **Conductor Mode**



This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).