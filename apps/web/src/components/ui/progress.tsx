import { cn } from "@/lib/utils";

interface ProgressProps extends React.ComponentProps<"div"> {
	value?: number;
}

function Progress({ className, value = 0, ...props }: ProgressProps) {
	return (
		<div
			aria-valuemax={100}
			aria-valuemin={0}
			aria-valuenow={value}
			className={cn(
				"relative h-2 w-full overflow-hidden rounded-full bg-primary/20",
				className
			)}
			role="progressbar"
			{...props}
		>
			<div
				className="h-full rounded-full bg-primary transition-all"
				style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
			/>
		</div>
	);
}

export { Progress };
