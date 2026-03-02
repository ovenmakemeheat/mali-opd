import Panel from "@/components/clinical-panel";

export default function Page() {
	return (
		<div className="min-h-screen bg-background px-6 py-8">
			<div className="flex gap-6">
				<div className="w-1/2 space-y-px">
					<Panel label="Patient">
						<p className="text-foreground text-sm leading-relaxed">
							Hello World
						</p>
					</Panel>

					<Panel label="Vitals">
						<div className="space-y-3">
							<div className="flex items-baseline justify-between border-border border-b border-dashed pb-2">
								<span className="text-muted-foreground text-xs tracking-wide">
									Blood Pressure
								</span>
								<span className="font-medium text-foreground text-sm">—</span>
							</div>
							<div className="flex items-baseline justify-between border-border border-b border-dashed pb-2">
								<span className="text-muted-foreground text-xs tracking-wide">
									Heart Rate
								</span>
								<span className="font-medium text-foreground text-sm">—</span>
							</div>
							<div className="flex items-baseline justify-between">
								<span className="text-muted-foreground text-xs tracking-wide">
									Temperature
								</span>
								<span className="font-medium text-foreground text-sm">—</span>
							</div>
						</div>
					</Panel>
				</div>

				<div className="w-1/2">
					<Panel label="Transcript">
						<p className="text-muted-foreground text-sm italic leading-loose">
							Awaiting input…
						</p>
					</Panel>
				</div>
			</div>

			<div className="mt-6">
				<Panel label="Clinical Summary">
					<div className="grid grid-cols-3 divide-x divide-border">
						<div>
							<p className="mb-1 font-semibold text-muted-foreground text-xs uppercase tracking-wider">
								Chief Complaint
							</p>
							<p className="text-foreground text-sm">—</p>
						</div>
						<div className="px-5">
							<p className="mb-1 font-semibold text-muted-foreground text-xs uppercase tracking-wider">
								Assessment
							</p>
							<p className="text-foreground text-sm">—</p>
						</div>
						<div className="px-5">
							<p className="mb-1 font-semibold text-muted-foreground text-xs uppercase tracking-wider">
								Plan
							</p>
							<p className="text-foreground text-sm">—</p>
						</div>
					</div>
				</Panel>
			</div>
		</div>
	);
}
