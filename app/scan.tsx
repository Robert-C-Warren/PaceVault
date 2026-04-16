import { CameraView, useCameraPermissions } from "expo-camera";
import * as FileSystem from "expo-file-system/legacy";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import { ActivityIndicator, Alert, Image, Pressable, StyleSheet, Text, View } from "react-native";
import { db } from "../lib/db";

export default function ScanScreen() {
	const [permission, requestPermission] = useCameraPermissions();
	const cameraRef = useRef<CameraView | null>(null);
	const router = useRouter();
	const pageId = `page-${Date.now()}`;

	const [isSaving, setIsSaving] = useState(false);
	const [savedImageUri, setSavedImageUri] = useState<string | null>(null);

	const takePhoto = async () => {
		if (!cameraRef.current || isSaving) return;

		try {
			setIsSaving(true);

			const photo = await cameraRef.current.takePictureAsync({
				quality: 1,
			});

			if (!photo?.uri) {
				throw new Error("No photo URI returned.");
			}

			const dir = `${FileSystem.documentDirectory}pacenotes/`;
			const fileName = `page-${Date.now()}.jpg`;
			const newPath = `${dir}${fileName}`;

			const dirInfo = await FileSystem.getInfoAsync(dir);
			if (!dirInfo.exists) {
				await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
			}

			await FileSystem.copyAsync({
				from: photo.uri,
				to: newPath,
			});

			setSavedImageUri(newPath);
		} catch (error) {
			console.error(error);
			Alert.alert("Capture failed", "Could not save the image.");
		} finally {
			db.runSync(
				`INSERT INTO pages (id, stageId, pageNumber, imageUri, createdAt)
                 VALUES (?, ?, ?, ?, ?)`,
				[pageId, STAGE_ID, Date.now(), newPath, new Date().toISOString()],
			);
			setIsSaving(false);
		}
	};

	if (!permission) {
		return (
			<View style={styles.centered}>
				<ActivityIndicator />
			</View>
		);
	}

	if (!permission.granted) {
		return (
			<View style={styles.centered}>
				<Text style={styles.permissionText}>Camera permission is required to scan pacenotes.</Text>
				<Pressable style={styles.primaryButton} onPress={requestPermission}>
					<Text style={styles.primaryButtonText}>Grant Camera Access</Text>
				</Pressable>
			</View>
		);
	}

	if (savedImageUri) {
		return (
			<View style={styles.previewContainer}>
				<Image source={{ uri: savedImageUri }} style={styles.previewImage} />
				<View style={styles.previewActions}>
					<Pressable style={styles.secondaryButton} onPress={() => setSavedImageUri(null)}>
						<Text style={styles.secondaryButtonText}>Scan Another</Text>
					</Pressable>

					<Pressable
						style={styles.primaryButton}
						onPress={() =>
							router.push({
								pathname: "/review",
								params: { imageUri: savedImageUri },
							})
						}>
						<Text style={styles.primaryButtonText}>Continue</Text>
					</Pressable>
				</View>
			</View>
		);
	}

	return (
		<View style={styles.container}>
			<CameraView ref={cameraRef} style={styles.camera} facing="back" />
			<View style={styles.controls}>
				<Pressable style={styles.captureButton} onPress={takePhoto}>
					<Text style={styles.captureButtonText}>{isSaving ? "Saving..." : "Capture"}</Text>
				</Pressable>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#000",
	},
	camera: {
		flex: 1,
	},
	controls: {
		padding: 24,
		backgroundColor: "#111",
	},
	captureButton: {
		backgroundColor: "#fff",
		borderRadius: 999,
		paddingVertical: 16,
		alignItems: "center",
	},
	captureButtonText: {
		color: "#111",
		fontWeight: "700",
		fontSize: 16,
	},
	centered: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		padding: 24,
		backgroundColor: "#111",
	},
	permissionText: {
		color: "#fff",
		fontSize: 16,
		textAlign: "center",
		marginBottom: 20,
	},
	primaryButton: {
		backgroundColor: "#fff",
		paddingVertical: 14,
		paddingHorizontal: 20,
		borderRadius: 10,
	},
	primaryButtonText: {
		color: "#111",
		fontWeight: "700",
	},
	previewContainer: {
		flex: 1,
		backgroundColor: "#000",
		justifyContent: "center",
	},
	previewImage: {
		flex: 1,
		resizeMode: "contain",
	},
	previewActions: {
		flexDirection: "row",
		gap: 12,
		padding: 16,
		backgroundColor: "#111",
	},
	secondaryButton: {
		flex: 1,
		borderWidth: 1,
		borderColor: "#666",
		paddingVertical: 14,
		borderRadius: 10,
		alignItems: "center",
	},
	secondaryButtonText: {
		color: "#fff",
		fontWeight: "600",
	},
});
