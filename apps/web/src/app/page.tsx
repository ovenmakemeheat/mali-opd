import { DynamicSection } from "@/components/dynamic-section";
import { MessageDrawer } from "@/components/message-drawer";
import { StaticSection } from "@/components/static-section";

export default function Page() {
	return (
		<div className="flex min-h-screen bg-background">
			<MessageDrawer />
			<div className="flex-1 space-y-6 px-6 py-8">
				<StaticSection />
				<DynamicSection />
			</div>
		</div>
	);
}
