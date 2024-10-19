import "./Header.css";

interface HeaderProps {
	text: string;
}

function Header({ text }: HeaderProps) {
	return (
		<div className="Header">
			<h1>{text}</h1>
		</div>
	);
}

export default Header;
