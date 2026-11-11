import { notFound } from "next/navigation";
import { Workspace } from "./Workspace";
import { getProperty } from "@/lib/real-estate/data";

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!getProperty(slug)) notFound();
  return <Workspace slug={slug} />;
}
