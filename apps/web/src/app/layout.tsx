import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import "../index.css";
import Header from "@/components/header";
import Providers from "@/components/providers";

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

const ibmPlexSansThai = localFont({
	src: [
		{
			path: "../fonts/IBM_Plex_Sans_Thai/IBMPlexSansThai-ExtraLight.ttf",
			weight: "200",
		},
		{
			path: "../fonts/IBM_Plex_Sans_Thai/IBMPlexSansThai-Light.ttf",
			weight: "300",
		},
		{
			path: "../fonts/IBM_Plex_Sans_Thai/IBMPlexSansThai-Regular.ttf",
			weight: "400",
		},
		{
			path: "../fonts/IBM_Plex_Sans_Thai/IBMPlexSansThai-Medium.ttf",
			weight: "500",
		},
		{
			path: "../fonts/IBM_Plex_Sans_Thai/IBMPlexSansThai-SemiBold.ttf",
			weight: "600",
		},
		{
			path: "../fonts/IBM_Plex_Sans_Thai/IBMPlexSansThai-Bold.ttf",
			weight: "700",
		},
	],
	variable: "--font-sans",
});

const syne = localFont({
	src: "../fonts/Syne/Syne-ExtraBold.ttf",
	variable: "--font-syne",
	weight: "800",
});

export const metadata: Metadata = {
	title: "MALI - OPD Assistant",
	description: "Ambient OPD Assistant with AI-powered clinical support",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body
				className={`${ibmPlexSansThai.variable} ${geistMono.variable} ${syne.variable} antialiased`}
			>
				<Providers>
					<div className="grid h-svh grid-rows-[auto_1fr] overflow-hidden">
						<Header />
						<main className="h-full min-h-0 overflow-hidden">{children}</main>
					</div>
				</Providers>
			</body>
		</html>
	);
}
