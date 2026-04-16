import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function HomeScreen() {
	return (
		<View style={styles.container}>
			<Text style={styles.title}>PaceVault</Text>
			<Text style={styles.subtitle}>Offline pacenote capture</Text>

			<Link href="/scan" style={styles.button}>
				Scan Pacenotes
			</Link>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		padding: 24,
		backgroundColor: "#111",
	},
	title: {
		fontSize: 32,
		fontWeight: "700",
		color: "#fff",
		marginBottom: 8,
	},
	subtitle: {
		fontSize: 16,
		color: "#bbb",
		marginBottom: 24,
	},
	button: {
		backgroundColor: "#fff",
		color: "#111",
		paddingVertical: 14,
		paddingHorizontal: 20,
		borderRadius: 10,
		overflow: "hidden",
		fontWeight: "600",
	},
});
