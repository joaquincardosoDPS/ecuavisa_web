import { useConfigStore } from "@/features/config/useConfigStore";
import FooterAccordion from "./components/FooterAccordion";
import fallbackLogo from "@/assets/img/logo.svg";
import { CORPORATE_LINKS, RRSS_LINKS } from "./constants";
import appStoreIcon from "@/assets/img/footer/appstore.png";
import playStoreIcon from "@/assets/img/footer/playstore.png";
import rokuIcon from "@/assets/img/footer/roku.png";
import lgIcon from "@/assets/img/footer/lg.png";
import androidTvIcon from "@/assets/img/footer/androidtv.png";


function Footer() {
    const config = useConfigStore((s) => s.config);
    const logo = config?.logo || fallbackLogo;

    return (
        <footer className="w-full bg-(--clr-primary) text-(--clr-primary-text) py-12 mx-auto mt-10">
            <div className="mx-auto max-w-7xl flex flex-col gap-10">
                <div className="flex justify-center">
                    <img src={logo} alt="Logo" className="h-38 w-auto" />
                </div>
                <FooterAccordion />

                <div className="flex flex-wrap justify-between gap-x-8 gap-y-2 text-(--clr-primary-title) underline mt-8">
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

                <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-t border-(--clr-secondary)/30 pt-8">
                    <div className="flex flex-row items-center">
                        <a
                            href={config?.["ios-link"] || "#"}
                            target={config?.["ios-link"] ? "_blank" : undefined}
                            rel={config?.["ios-link"] ? "noopener noreferrer" : undefined}
                        >
                            <img src={appStoreIcon} alt="App Store" />
                        </a>
                        <a
                            href={config?.["android-link"] || "#"}
                            target={config?.["android-link"] ? "_blank" : undefined}
                            rel={config?.["android-link"] ? "noopener noreferrer" : undefined}
                            className="ml-3"
                        >
                            <img src={playStoreIcon} alt="Play Store" />
                        </a>
                        <div className="flex flex-row gap-4 items-center ml-4">
                            <img src={rokuIcon} alt="Roku Store" className="" />
                            <img src={lgIcon} alt="LG Store" className="" />
                            <img src={androidTvIcon} alt="Android TV Store" className="" />
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
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
                </div>
            </div>
        </footer>
    );
}

export default Footer;
