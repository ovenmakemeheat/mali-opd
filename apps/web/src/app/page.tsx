"use client";

import { DynamicSection } from "@/components/dynamic-section";
import { MessageDrawer } from "@/components/message-drawer";
import { StaticSection } from "@/components/static-section";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Page() {
	return (
		<div className="flex min-h-screen bg-background">
			<MessageDrawer />
			<div className="flex-1 px-4 py-1">
				<Tabs defaultValue="tab1">
					<TabsList>
						<TabsTrigger value="tab1">มะลิ</TabsTrigger>
						<TabsTrigger value="tab2">จดบันทึก</TabsTrigger>
					</TabsList>
					<TabsContent value="tab1">
						<StaticSection />
					</TabsContent>
					<TabsContent value="tab2">
						<DynamicSection />
					</TabsContent>
				</Tabs>
			</div>
		</div>
	);
}
