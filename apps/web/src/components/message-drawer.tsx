"use client";

import { MessageCircle } from "lucide-react";
import { useState } from "react";

export function MessageDrawer() {
	const [open, setOpen] = useState(true);

	return (
		<div className="flex min-h-screen">
			<div
				className={`overflow-hidden transition-all duration-300 ease-in-out ${
					open ? "w-64 opacity-100" : "w-0 opacity-0"
				}`}
			>
				<div className="flex h-full w-64 flex-col bg-card ring-1 ring-foreground/10">
					<div className="flex items-center justify-between border-b px-3 py-2.5">
						<span className="font-medium text-sm">Messages</span>
					</div>
					<div className="flex-1 overflow-y-auto px-3 py-3">
						<p className="text-muted-foreground text-sm italic">
							No messages yet.
						</p>
					</div>
				</div>
			</div>

			{/* Pull tab spans full height */}
			<button
				aria-label="Toggle messages"
				className="flex w-8 items-center justify-center border-x bg-card text-muted-foreground transition-colors hover:text-foreground"
				onClick={() => setOpen((v) => !v)}
				type="button"
			>
				<MessageCircle className="size-4" />
			</button>
		</div>
	);
}
