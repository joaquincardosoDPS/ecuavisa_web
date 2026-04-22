/**
 * Servicio de sesión HLS para el redirector DPS
 */

import axios from "axios";
// import { getPlatformAnalytics } from "@/utils/application";

export interface HlsSessionParams {
    dpssid: string;
    ndvc: string;
    sid: string;
    // platform: string;
}

// Obtiene o genera los parámetros de sesión HLS
export async function getHlsSessionParams(): Promise<HlsSessionParams> {
    const STORAGE_DPSSID = 'dps_session_dpssid';
    const sid = await generateShortId();

    let dpssid = localStorage.getItem(STORAGE_DPSSID);
    let ndvc = '0';

    if (!dpssid) {
        dpssid = await generateShortId();
        localStorage.setItem(STORAGE_DPSSID, dpssid);
        ndvc = '1';
    }

    // Identificador de plataforma para el redirector DPS
    // const platform = `13GOTV${getPlatformAnalytics()}`;

    // console.log('[HLS Session]', { dpssid, ndvc, sid, platform });

    return { dpssid, ndvc, sid };
    // return { dpssid, ndvc, sid, platform };
}

// Genera ID corto via endpoint DPS
async function generateShortId(): Promise<string> {
    const res = await axios.get('https://redirector.rudo.video/get_dpssid.php');
    return res.data.dpssid;
}

/**
 * Inyecta parámetros de sesión DPS (Mango) a las URLs de video o publicidad
 */
// export function forceSessionParams(url: string, params: HlsSessionParams): string {
//     if (!url || url === 'undefined' || url === 'null') return url;

//     try {
//         // Usar objeto URL para inyección limpia de parámetros
//         const urlObj = new URL(url.startsWith('http') ? url : window.location.origin + (url.startsWith('/') ? '' : '/') + url);
//         urlObj.searchParams.set('dpssid', params.dpssid);
//         urlObj.searchParams.set('ndvc', params.ndvc);
//         urlObj.searchParams.set('sid', params.sid);
//         urlObj.searchParams.set('platform', params.platform);

//         if (!url.startsWith('http')) {
//             return urlObj.pathname + urlObj.search;
//         }
//         return urlObj.toString();
//     } catch (_e) {
//         // Fallback manual si el objeto URL falla en navegadores antiguos
//         let newUrl = url;
//         const entries = [
//             `dpssid=${params.dpssid}`,
//             `ndvc=${params.ndvc}`,
//             `sid=${params.sid}`,
//             `platform=${params.platform}`
//         ];
//         entries.forEach(param => {
//             const key = param.split('=')[0];
//             const regex = new RegExp(`([?&])${key}=([^&]*)`, 'i');
//             if (newUrl.match(regex)) {
//                 newUrl = newUrl.replace(regex, `$1${param}`);
//             } else {
//                 newUrl += (newUrl.indexOf('?') > -1 ? '&' : '?') + param;
//             }
//         });
//         return newUrl;
//     }
// }
