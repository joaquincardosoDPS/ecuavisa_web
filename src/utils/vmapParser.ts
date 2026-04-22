/**
 * Parser de VMAP XML para extraer URLs VAST de publicidad.
 * El endpoint de Rudo devuelve un VMAP (Video Multiple Ad Playlist)
 * que contiene las URLs VAST reales de Google Ad Manager.
 */

export interface VmapAdBreak {
    timeOffset: string;   // "start", "end", "00:10:00.000"
    breakType: string;    // "linear"
    breakId: string;      // "preroll", "midroll-1", etc.
    adSource: {
        id: string;
        allowMultipleAds: boolean;
        followRedirects: boolean;
        adTagUri: string; // URL VAST real (ej: pubads.g.doubleclick.net)
    };
}

export interface ParsedVmapData {
    hasAds: boolean;
    totalAdBreaks: number;
    adBreaks: VmapAdBreak[];
    prerollAds: VmapAdBreak[];
    midrollAds: VmapAdBreak[];
    postrollAds: VmapAdBreak[];
}

export class VmapParser {
    static parseVmapXml(xmlString: string): ParsedVmapData {
        try {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xmlString, "text/xml");

            // Verificar errores de parsing
            const parserError = xmlDoc.querySelector("parsererror");
            if (parserError) {
                throw new Error("Error parsing XML: " + parserError.textContent);
            }

            const adBreaks = xmlDoc.querySelectorAll("vmap\\:AdBreak, AdBreak");
            const parsedAdBreaks: VmapAdBreak[] = [];

            adBreaks.forEach((adBreak) => {
                const timeOffset = adBreak.getAttribute("timeOffset") || "";
                const breakType = adBreak.getAttribute("breakType") || "";
                const breakId = adBreak.getAttribute("breakId") || "";

                const adSource = adBreak.querySelector("vmap\\:AdSource, AdSource");
                if (adSource) {
                    const adTagUri = adSource.querySelector("vmap\\:AdTagURI, AdTagURI");
                    if (adTagUri) {
                        const cdataContent = adTagUri.textContent?.trim() || "";

                        parsedAdBreaks.push({
                            timeOffset,
                            breakType,
                            breakId,
                            adSource: {
                                id: adSource.getAttribute("id") || "",
                                allowMultipleAds: adSource.getAttribute("allowMultipleAds") === "true",
                                followRedirects: adSource.getAttribute("followRedirects") === "true",
                                adTagUri: cdataContent,
                            },
                        });
                    }
                }
            });

            // Clasificar por tipo
            const prerollAds = parsedAdBreaks.filter(ad => ad.timeOffset === "start");
            const postrollAds = parsedAdBreaks.filter(ad => ad.timeOffset === "end");
            const midrollAds = parsedAdBreaks.filter(ad =>
                ad.timeOffset !== "start" && ad.timeOffset !== "end"
            );

            return {
                hasAds: parsedAdBreaks.length > 0,
                totalAdBreaks: parsedAdBreaks.length,
                adBreaks: parsedAdBreaks,
                prerollAds,
                midrollAds,
                postrollAds,
            };

        } catch (error) {
            console.warn('[VmapParser] Error parseando VMAP:', error);
            return {
                hasAds: false,
                totalAdBreaks: 0,
                adBreaks: [],
                prerollAds: [],
                midrollAds: [],
                postrollAds: [],
            };
        }
    }
}
