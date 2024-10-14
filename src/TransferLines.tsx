// TransferLines.js
import "./TransferLines.css";

interface TransferLinesProps {
	transfers: string[];
}

function TransferLines({ transfers }: TransferLinesProps) {
	return (
		<div className="transfer-lines-container">
			{transfers.map((imageSrc, index) => (
				<img
					key={index}
					src={imageSrc}
					alt={`${imageSrc} Line`}
					className="transfer-line-image"
				/>
			))}
		</div>
	);
}

export default TransferLines;
