import { getPropertyById } from "@/lib/actions/properties";
import { notFound } from "next/navigation";
import EditPropertyForm from "./edit-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Edit Property",
};

export default async function EditPropertyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const property = await getPropertyById(id);

  if (!property) {
    notFound();
  }

  return <EditPropertyForm property={property} />;
}
