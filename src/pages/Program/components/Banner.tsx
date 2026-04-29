import type { Chapter, Program } from "@/interfaces/catalog.interface";
import { useEffect, useState } from "react";
import InfoBanner from "./InfoBanner";
import InfoBannerSingle from "./InfoBannerSingle";

function Banner({ program, isSingle = false, chapter }: { program: Program, isSingle?: boolean, chapter?: Chapter }) {

  const [scrollOpacity, setScrollOpacity] = useState(0);


  useEffect(() => {
    const handleScroll = () => {
      const scroll = window.scrollY;
      const threshold = 500;
      const opacity = Math.min(scroll / threshold, 1);
      setScrollOpacity(opacity);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const bgImg =
    program?.image_slider?.big ||
    program?.image_background?.big ||
    program?.image_land?.big;

  return (
    <>
      <div className="fixed inset-0 -z-10 bg-(--clr-primary)">
        {/* Imagen */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${bgImg})`,
            backgroundSize: "cover",
            backgroundPosition: "top right",
            backgroundRepeat: "no-repeat",
          }}
        />

        <div className="absolute inset-y-0 left-0 w-2/3 bg-linear-to-r from-(--clr-primary) via-(--clr-primary)/40 to-transparent"></div>
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-linear-to-t from-(--clr-primary) via-(--clr-primary)/40 to-transparent"></div>

        <div
          className="absolute inset-0 bg-(--clr-primary) transition-opacity duration-75"
          style={{ opacity: scrollOpacity * 0.9 }}
        />
      </div>
      {/* Info del programa */}
      {!isSingle ? (
        <InfoBanner program={program} />

      ) : (
        <InfoBannerSingle program={program} chapter={chapter} />
      )}

    </>
  );
}

export default Banner;
