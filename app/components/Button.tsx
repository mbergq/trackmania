type Props = {
	content: string;
	onClick?: () => void;
	disabled?: boolean;
	className?: string;
};

export const Button: React.FC<Props> = ({
	content,
	onClick,
	disabled,
	className,
}) => {
	return (
		<button
			type="button"
			className={`px-4 py-2 bg-tm-grey hover:bg-tm-green hover:text-tm-grey hover:border-tm-grey disabled:opacity-50 rounded border border-tm-green text-tm-green cursor-pointer ${className}`}
			onClick={onClick}
			disabled={disabled}
		>
			{content}
		</button>
	);
};
