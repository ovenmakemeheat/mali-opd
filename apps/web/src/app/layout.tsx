import type { Metadata } from "next";
import { Geist_Mono, Raleway } from "next/font/google";
import "../index.css";
import Header from "@/components/header";
import Providers from "@/components/providers";

const raleway = Raleway({
	variable: "--font-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
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
			<body className={`${raleway.variable} ${geistMono.variable} antialiased`}>
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
