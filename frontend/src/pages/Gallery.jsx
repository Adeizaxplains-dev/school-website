import { schoolConfig } from "../config/school.config.js";
import { useSeo } from "../hooks/useSeo.js";
import PageHero from "../components/common/PageHero.jsx";
import CtaBand from "../components/common/CtaBand.jsx";
import GalleryGrid from "../components/gallery/GalleryGrid.jsx";

const { gallery, school } = schoolConfig;

export default function Gallery() {
  useSeo({ title: "Gallery", description: `Photos of school life at ${school.name}.`, path: "/gallery" });

  return (
    <>
      <PageHero title={gallery.heading} intro={gallery.intro} />
      <GalleryGrid />
      <CtaBand />
    </>
  );
}
