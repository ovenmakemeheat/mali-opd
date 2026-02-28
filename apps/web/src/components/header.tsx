"use client";
import { Stethoscope } from "lucide-react";
import Link from "next/link";
import { MOCKUP_MODE } from "@/lib/config";
import { ModeToggle } from "./mode-toggle";
import { Badge } from "./ui/badge";

export default function Header() {
	return (
		<div className="sticky top-0 z-50 w-full border-border/40 border-b bg-background/80 backdrop-blur-md">
			<div className="container mx-auto flex flex-row items-center justify-between px-4 py-2">
				<nav className="flex items-center gap-4">
					<Link
						className="flex items-center gap-2 font-semibold text-lg"
						href="/"
					>
						<Stethoscope className="h-5 w-5" />
						<span>MALI</span>
					</Link>
					<span className="text-muted-foreground text-sm">OPD Assistant</span>
					{MOCKUP_MODE && (
						<Badge className="text-xs" variant="outline">
							Demo Mode
						</Badge>
					)}
				</nav>
				<div className="flex items-center gap-2">
					<ModeToggle />
				</div>
			</div>
		</div>
	);
}
