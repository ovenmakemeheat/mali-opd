import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function DynamicSection() {
	return (
		<div className="flex gap-6">
			<div className="w-1/2 space-y-4">
				<Card size="sm">
					<CardHeader>
						<CardTitle>Patient</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-foreground text-sm leading-relaxed">
							Hello World
						</p>
					</CardContent>
				</Card>

				<Card size="sm">
					<CardHeader>
						<CardTitle>Vitals</CardTitle>
					</CardHeader>
					<CardContent>
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
					</CardContent>
				</Card>
			</div>
			<div className="w-1/2">
				<Card size="sm">
					<CardHeader>
						<CardTitle>Transcript</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-muted-foreground text-sm italic leading-loose">
							Awaiting input…
						</p>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
