import { getProperties, getRegisteredTenants } from "@/lib/actions/properties";
import CreateContractForm from "./create-contract-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "New Contract",
};

export default async function NewContractPage({
  searchParams,
}: {
  searchParams: Promise<{ property?: string }>;
}) {
  const { property: defaultPropertyId } = await searchParams;
  const [properties, tenants] = await Promise.all([
    getProperties(),
    getRegisteredTenants(),
  ]);

  return (
    <div className="max-w-xl mx-auto">
      <CreateContractForm
        properties={properties}
        tenants={tenants}
        defaultPropertyId={defaultPropertyId}
      />
    </div>
  );
}
