import type { Metadata } from "next";
import RoadmapContent from "@/components/roadmap/RoadmapContent";

export const metadata: Metadata = {
  title: "Roadmap | BLD Trainer",
};

export default function Home() {
  return <RoadmapContent />;
}
