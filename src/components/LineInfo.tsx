import { EnumDeclaration } from "typescript";
import "./LineInfo.css";
import { ReactNode } from "react";

export enum LineType {
	LOCAL,
	EXPRESS,
}

const LineTypeStrings: string[] = ["Local", "Express"];

interface LineInfoProps {
	direction: string;
	line: string;
	type?: LineType;
}

function lineTypeToString(lineType: LineType | undefined): string {
	if (lineType === undefined) {
		return "";
	}
	return LineTypeStrings[lineType];
}

function LineInfo({ direction, line, type }: LineInfoProps) {
	return (
		<>
			<div className="LineInfo-container">
				<h2>{direction}&nbsp;&nbsp;</h2>
				<img src={line} alt={`${line}`} className="transfer-line-image" />
				<h2>&nbsp;&nbsp;{lineTypeToString(type)} Train</h2>{" "}
			</div>
		</>
	);
}

export default LineInfo;
