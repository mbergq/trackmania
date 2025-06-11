import { parseTrackmaniaStyledText } from "@/lib/utils/client-utils";

type Props = {
	letters: string;
};

export const TrackmaniaText: React.FC<Props> = ({ letters }) => {
	const segments = parseTrackmaniaStyledText(letters);
	return (
		<span>
			{segments.map((segment) => (
				<span
					key={segment.color + segment.text}
					style={{
						color: segment.color,
						fontWeight: segment.styles.bold ? "bold" : "normal",
						fontStyle: segment.styles.italic ? "italic" : "normal",
						fontStretch: segment.styles.wide
							? "expanded"
							: segment.styles.narrow
								? "condensed"
								: "normal",
						textShadow: segment.styles.shadow ? "" : "none",
						fontVariant: segment.styles.narrow ? "small-caps" : "normal",
						textTransform: segment.styles.uppercase ? "uppercase" : "none",
					}}
				>
					{segment.text}
				</span>
			))}
		</span>
	);
};
