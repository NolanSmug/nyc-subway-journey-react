import React, { ReactNode } from 'react';
import "./Station.css";

export interface StationProps {
  name: string;
  transfers: JSX.Element[];
  header?: ReactNode;
}

function Station({ name, transfers, header }: StationProps) {
	return (
		<>
			{header}
			<div className="station-container" data-name={name}>
				<h2 className="station-name">{name}</h2>
				<div className="transfers-container">{transfers}</div>
			</div>
		</>
	);
};

export default Station;
