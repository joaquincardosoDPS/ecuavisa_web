import { useLocation } from "react-router-dom";
import { useConfigStore } from "@/features/config/useConfigStore";
// import FooterAccordion from "./components/FooterAccordion";
import fallbackLogo from "@/assets/img/logo.svg";
import { CORPORATE_LINKS, RRSS_LINKS } from "./constants";
import appStoreIcon from "@/assets/img/footer/appstore.png";
import playStoreIcon from "@/assets/img/footer/playstore.png";
import rokuIcon from "@/assets/img/footer/roku.png";
import lgIcon from "@/assets/img/footer/lg.png";
import androidTvIcon from "@/assets/img/footer/androidtv.png";
import samsungIcon from "@/assets/img/footer/samsung.png";
import hisenseIcon from "@/assets/img/footer/hisense.png";


function Footer() {
    const location = useLocation();
    const config = useConfigStore((s) => s.config);
    const logo = config?.logo || fallbackLogo;

    if (location.pathname !== "/" && location.pathname !== "/programas") {
        return null;
    }

    return (
        <footer className="w-full bg-(--clr-primary) text-(--clr-primary-text) py-12 mx-auto ">
            <div className="mx-auto max-w-7xl flex flex-col">
                <div className="flex justify-center items-center gap-2">
                    <img src={logo} alt="Logo" className="h-11 w-auto" />
                    <h5 className="text-(--clr-primary-text) font-bold text-4xl">ecuavisa</h5>
                </div>

                <div className="flex flex-wrap text-base text-[#B5A5BD] justify-center gap-x-8 gap-y-2 mt-14">
                    {CORPORATE_LINKS.map((item) => {
                        const rawUrl = config?.[item.variable];
                        const url = typeof rawUrl === "string" ? rawUrl : undefined;
                        return (
                            <a
                                key={item.name}
                                href={url || "#"}
                                target={url ? "_blank" : undefined}
                                rel={url ? "noopener noreferrer" : undefined}
                                className="hover:text-(--foc-primary) transition-colors"
                            >
                                {item.name}
                            </a>
                        );
                    })}
                </div>

                <div className="flex items-center mx-auto mt-9 gap-2">
                    <a
                        href={config?.["ios-link"] || "#"}
                        target={config?.["ios-link"] ? "_blank" : undefined}
                        rel={config?.["ios-link"] ? "noopener noreferrer" : undefined}
                    >
                        <img src={appStoreIcon} alt="App Store" className="brightness-75" />
                    </a>
                    <a
                        href={config?.["android-link"] || "#"}
                        target={config?.["android-link"] ? "_blank" : undefined}
                        rel={config?.["android-link"] ? "noopener noreferrer" : undefined}
                        className=""
                    >
                        <img src={playStoreIcon} alt="Play Store" className="brightness-75" />
                    </a>
                    <div className="flex flex-row gap-7 items-center ml-4">
                        <img src={rokuIcon} alt="Roku Store" className="brightness-75" />
                        <img src={lgIcon} alt="LG Store" className="brightness-75" />
                        <img src={androidTvIcon} alt="Android TV Store" className="brightness-75" />
                        <img src={samsungIcon} alt="Samsung" className="" />
                        <img src={hisenseIcon} alt="Hisense" className="" />
                    </div>
                </div>
                <div className="flex items-center mx-auto mt-10.5 gap-4">
                    {RRSS_LINKS.map((item) => {
                        const rawUrl = config?.[item.variable as keyof typeof config];
                        const url = typeof rawUrl === "string" ? rawUrl : undefined;
                        return (
                            <a
                                key={item.name}
                                href={url || "#"}
                                target={url ? "_blank" : undefined}
                                rel={url ? "noopener noreferrer" : undefined}
                                className="hover:opacity-80 transition-opacity"
                                aria-label={item.name}
                            >
                                <img src={item.logo} alt={item.name} className="h-6 w-auto object-contain" />
                            </a>
                        );
                    })}
                </div>
                {/* <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-t border-(--clr-secondary)/30 pt-8">

                </div> */}
            </div>
        </footer>
    );
}

export default Footer;
