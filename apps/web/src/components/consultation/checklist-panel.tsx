import { AlertTriangle, CheckCircle2, Circle, FileText } from "lucide-react";
import { useEvidence } from "@/components/consultation/evidence-context";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ChecklistItem, ChecklistStatus } from "@/types";

interface ChecklistPanelProps {
	items: ChecklistItem[];
}

const statusConfig: Record<
	ChecklistStatus,
	{ label: string; className: string; icon: React.ReactNode }
> = {
	answered: {
		label: "Answered",
		className: "bg-green-100 text-green-800",
		icon: <CheckCircle2 className="h-4 w-4 text-green-600" />,
	},
	partial: {
		label: "Partial",
		className: "bg-yellow-100 text-yellow-800",
		icon: <AlertTriangle className="h-4 w-4 text-yellow-600" />,
	},
	not_asked: {
		label: "Not Asked",
		className: "bg-gray-100 text-gray-600",
		icon: <Circle className="h-4 w-4 text-gray-400" />,
	},
};

const ChecklistItemRow = ({ item }: { item: ChecklistItem }) => {
	const config = statusConfig[item.status];
	const { hoveredEvidenceId, setHoveredEvidenceId } = useEvidence();

	const isDimmed =
		hoveredEvidenceId !== null && hoveredEvidenceId !== item.evidenceId;

	const isHighlighted =
		hoveredEvidenceId !== null &&
		item.evidenceId !== undefined &&
		hoveredEvidenceId === item.evidenceId;

	return (
		<button
			className={`group relative flex w-full items-start gap-3 border-b py-2 text-left transition-all duration-300 last:border-0 ${
				isDimmed ? "opacity-30" : "opacity-100"
			} ${isHighlighted ? "-mx-2 rounded-md border-transparent bg-primary/5 px-2" : ""}`}
			onMouseEnter={() => {
				if (item.evidenceId) {
					setHoveredEvidenceId(item.evidenceId);
				}
			}}
			onMouseLeave={() => setHoveredEvidenceId(null)}
			type="button"
		>
			<span className="mt-0.5">{config.icon}</span>
			<div className="min-w-0 flex-1">
				<p className="flex items-center gap-1.5 font-medium text-sm">
					{item.question}
					{item.evidenceId && (
						<FileText className="h-3 w-3 text-muted-foreground opacity-30 transition-opacity group-hover:opacity-100" />
					)}
				</p>
				{item.answer && (
					<p className="mt-0.5 text-muted-foreground text-xs">{item.answer}</p>
				)}
			</div>
			<Badge className={config.className}>{config.label}</Badge>
		</button>
	);
};

function CategoryGroup({
	category,
	items,
}: {
	category: string;
	items: ChecklistItem[];
}) {
	return (
		<div className="space-y-1">
			<h4 className="font-semibold text-muted-foreground text-xs uppercase tracking-wide">
				{category}
			</h4>
			{items.map((item) => (
				<ChecklistItemRow item={item} key={item.id} />
			))}
		</div>
	);
}

export function ChecklistPanel({ items }: ChecklistPanelProps) {
	const grouped = items.reduce<Record<string, ChecklistItem[]>>((acc, item) => {
		const category = item.category ?? "General";
		if (!acc[category]) {
			acc[category] = [];
		}
		acc[category].push(item);
		return acc;
	}, {});

	const stats = {
		answered: items.filter((i) => i.status === "answered").length,
		partial: items.filter((i) => i.status === "partial").length,
		notAsked: items.filter((i) => i.status === "not_asked").length,
	};

	return (
		<Card>
			<CardHeader className="pb-3">
				<div className="flex items-center justify-between">
					<CardTitle className="font-medium text-sm">
						Clinical Coverage
					</CardTitle>
					<div className="flex items-center gap-2 text-xs">
						<span className="flex items-center gap-1 text-green-600">
							{stats.answered} <CheckCircle2 className="h-3 w-3" />
						</span>
						<span className="flex items-center gap-1 text-yellow-600">
							{stats.partial} <AlertTriangle className="h-3 w-3" />
						</span>
						<span className="flex items-center gap-1 text-gray-400">
							{stats.notAsked} <Circle className="h-3 w-3" />
						</span>
					</div>
				</div>
			</CardHeader>
			<CardContent>
				{items.length === 0 ? (
					<p className="py-4 text-center text-muted-foreground text-sm">
						Checklist will populate as conversation progresses
					</p>
				) : (
					<div className="space-y-4">
						{Object.entries(grouped).map(([category, categoryItems]) => (
							<CategoryGroup
								category={category}
								items={categoryItems}
								key={category}
							/>
						))}
					</div>
				)}
			</CardContent>
		</Card>
	);
}
