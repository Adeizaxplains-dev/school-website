import { featuresConfig as features } from "../../config/features.config.js";

/** Slim notice for sales demos. Turn off with features.demoNotice = false. */
export default function DemoBanner() {
  if (!features.demoNotice) return null;
  return (
    <div className="bg-secondary px-4 py-2 text-center text-sm font-medium text-on-secondary">
      Demo preview: sample content is shown. Details will be replaced with the school's verified information.
    </div>
  );
}
