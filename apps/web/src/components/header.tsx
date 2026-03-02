"use client";
import { MOCKUP_MODE } from "@/lib/config";
import { ModeToggle } from "./mode-toggle";
import { Badge } from "./ui/badge";

export default function Header() {
	return (
		<header className="flex h-14 items-center justify-between gap-4 border-border border-b bg-background px-5">
			<div className="flex items-center gap-2">
				<span
					className="font-extrabold text-lg text-teal-600 tracking-tight"
					style={{ fontFamily: "var(--font-syne)" }}
				>
					MALI
				</span>
				<span className="mt-1 font-light text-muted-foreground text-xs">
					Ambient Clinical Intelligence v0.2
				</span>
				{MOCKUP_MODE && (
					<Badge className="text-xs" variant="outline">
						Demo Mode
					</Badge>
				)}
			</div>
			<ModeToggle />
		</header>
	);
}
