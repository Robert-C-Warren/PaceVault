import { Link, useLocalSearchParams } from "expo-router";
import { Image, StyleSheet, Text, View } from "react-native";

export default function ReviewScreen() {
	const { imageUri } = useLocalSearchParams<{ imageUri?: string }>();

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Saved Pacenote</Text>

			{imageUri ?
				<Image source={{ uri: imageUri }} style={styles.image} />
			:	<Text style={styles.fallback}>No image found.</Text>}

			<Link href="/" style={styles.button}>
				Back Home
			</Link>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#111",
		padding: 16,
		justifyContent: "center",
	},
	title: {
		color: "#fff",
		fontSize: 24,
		fontWeight: "700",
		textAlign: "center",
		marginBottom: 16,
	},
	image: {
		width: "100%",
		height: 500,
		resizeMode: "contain",
		marginBottom: 20,
	},
	fallback: {
		color: "#bbb",
		textAlign: "center",
		marginBottom: 20,
	},
	button: {
		alignSelf: "center",
		backgroundColor: "#fff",
		color: "#111",
		paddingVertical: 14,
		paddingHorizontal: 20,
		borderRadius: 10,
		overflow: "hidden",
		fontWeight: "700",
	},
});
