"use client";

import { DynamicSection } from "@/components/dynamic-section";
import { MessageDrawer } from "@/components/message-drawer";
import { StaticSection } from "@/components/static-section";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
						<div className="space-y-4 py-1">
							<StaticSection />
							<DynamicSection />
						</div>
					</TabsContent>
					<TabsContent value="tab2">
						<div className="space-y-1.5">
							<Label htmlFor="demo-input">ชื่อ</Label>
							<Input className="w-60" id="demo-input" placeholder="-" />
						</div>
					</TabsContent>
				</Tabs>
			</div>
		</div>
	);
}
