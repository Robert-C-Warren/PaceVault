import { Stack } from "expo-router";
import { useEffect } from "react";
import { initDb } from "../lib/db";

export default function Layout() {
	useEffect(() => {
		initDb();
	}, []);

	return <Stack screenOptions={{ headerShown: false }} />;
}
