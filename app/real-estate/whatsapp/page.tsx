import { WhatsAppClient } from "./WhatsAppClient";
import { getProperty, PROPERTIES } from "@/lib/real-estate/data";

export default async function Page({ searchParams }: { searchParams: Promise<{ property?: string }> }) {
  const { property } = await searchParams;
  const p = getProperty(property ?? "") ?? PROPERTIES[0];
  return <WhatsAppClient slug={p.slug} />;
}
