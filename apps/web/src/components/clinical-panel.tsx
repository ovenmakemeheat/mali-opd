interface PanelProps {
	children: React.ReactNode;
	label: string;
}

export default function Panel({ label, children }: PanelProps) {
	return (
		<div className="border border-border bg-card">
			<div className="border-border border-b px-4 py-2">
				<span className="font-semibold text-muted-foreground text-xs uppercase tracking-wider">
					{label}
				</span>
			</div>
			<div className="px-4 py-5">{children}</div>
		</div>
	);
}
