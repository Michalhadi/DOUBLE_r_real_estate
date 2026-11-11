import { notFound } from "next/navigation";
import { ProjectLanding } from "./ProjectLanding";
import { getProperty } from "@/lib/real-estate/data";

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!getProperty(slug)) notFound();
  return <ProjectLanding slug={slug} />;
}
