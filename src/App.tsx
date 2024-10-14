import React from 'react';
import './App.css';
import TransferLines from './TransferLines';
import Station from './Station';

import IMG_1 from "./images/1.svg";
import IMG_2 from "./images/2.svg";
import IMG_3 from "./images/3.svg";
import IMG_4 from "./images/4.svg";
import IMG_5 from "./images/5.svg";
import IMG_6 from "./images/6.svg";
import IMG_6D from "./images/6d.svg";
import IMG_7 from "./images/7.svg";
import IMG_7D from "./images/7d.svg";
import IMG_A from "./images/a.svg";
import IMG_B from "./images/b.svg";
import IMG_C from "./images/c.svg";
import IMG_D from "./images/d.svg";
import IMG_E from "./images/e.svg";
import IMG_F from "./images/f.svg";
import IMG_G from "./images/g.svg";
import IMG_H from "./images/h.svg";
import IMG_J from "./images/j.svg";
import IMG_L from "./images/l.svg";
import IMG_M from "./images/m.svg";
import IMG_N from "./images/n.svg";
import IMG_Q from "./images/q.svg";
import IMG_R from "./images/r.svg";
import IMG_S from "./images/s.svg";
import IMG_SF from "./images/sf.svg";
import IMG_SR from "./images/sr.svg";
import IMG_T from "./images/t.svg";
import IMG_W from "./images/w.svg";
import IMG_Z from "./images/z.svg";
import IMG_SIR from "./images/sir.svg";
import Header from './Header';

function App() {
  return (
    <div className="Game">
      <div className="stations-container">
        <div className="station-box" id="current-station">
          <Header text="Current Station" />
          <div className="stationItem">
            <Station
              name={"14 St-Union Sq"}
              transfers={[
                <TransferLines transfers={[IMG_N, IMG_Q, IMG_R, IMG_W]} />,
                <TransferLines transfers={[IMG_4, IMG_5, IMG_6, IMG_L]} />,
              ]}
            />
          </div>
        </div>
        <div className="station-box" id="destination-station">
          <Header text="Destination Station" />
          <div className="stationItem">
            <Station
              name={"Times Sq-42 St"}
              transfers={[
                <TransferLines transfers={[IMG_1, IMG_2, IMG_3, IMG_7]} />,
                <TransferLines transfers={[IMG_N, IMG_Q, IMG_R, IMG_W]} />,
                <TransferLines transfers={[IMG_S]} />,
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
