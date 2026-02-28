import { createContext, useContext, useState } from "react";
import { cn } from "@/lib/utils";

interface TabsContextValue {
	onValueChange: (value: string) => void;
	value: string;
}

const TabsContext = createContext<TabsContextValue | null>(null);

function Tabs({
	defaultValue,
	value,
	onValueChange,
	className,
	children,
	...props
}: {
	defaultValue?: string;
	value?: string;
	onValueChange?: (value: string) => void;
	className?: string;
	children: React.ReactNode;
} & React.ComponentProps<"div">) {
	const [internalValue, setInternalValue] = useState(defaultValue ?? "");

	const currentValue = value ?? internalValue;
	const handleValueChange = onValueChange ?? setInternalValue;

	return (
		<TabsContext.Provider
			value={{ value: currentValue, onValueChange: handleValueChange }}
		>
			<div className={cn("w-full", className)} {...props}>
				{children}
			</div>
		</TabsContext.Provider>
	);
}

function TabsList({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			className={cn(
				"inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground",
				className
			)}
			role="tablist"
			{...props}
		/>
	);
}

function TabsTrigger({
	className,
	value,
	...props
}: { value: string } & React.ComponentProps<"button">) {
	const context = useContext(TabsContext);
	if (!context) {
		throw new Error("TabsTrigger must be used within Tabs");
	}

	const isActive = context.value === value;

	return (
		<button
			aria-selected={isActive}
			className={cn(
				"inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 font-medium text-sm ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
				isActive
					? "bg-background text-foreground shadow"
					: "hover:bg-background/50 hover:text-foreground",
				className
			)}
			data-state={isActive ? "active" : "inactive"}
			onClick={() => context.onValueChange(value)}
			role="tab"
			type="button"
			{...props}
		/>
	);
}

function TabsContent({
	className,
	value,
	...props
}: { value: string } & React.ComponentProps<"div">) {
	const context = useContext(TabsContext);
	if (!context) {
		throw new Error("TabsContent must be used within Tabs");
	}

	if (context.value !== value) {
		return null;
	}

	return (
		<div
			className={cn(
				"mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
				className
			)}
			data-state="active"
			role="tabpanel"
			{...props}
		/>
	);
}

export { Tabs, TabsContent, TabsList, TabsTrigger };
