/**
 * Servicio de identificación publicitaria del dispositivo
 * para Google Ad Manager (VAST).
 */

import type { DeviceAdInfo } from '../types';

const DEFAULT_FALLBACK_DOMAIN = 'https://www.ecuavisa.com';

let cachedInfo: DeviceAdInfo | null = null;

/**
 * Obtiene info de ads del dispositivo (cachéa resultado).
 * En esta versión puramente Web, se utiliza un UUID persistente en localStorage.
 */
export function getDeviceAdInfo(): Promise<DeviceAdInfo> {
    if (cachedInfo) {
        return Promise.resolve(cachedInfo);
    }
    const info = getGenericAdInfo();
    cachedInfo = info;
    return Promise.resolve(info);
}

// Fallback genérico (web)
// Genera un dpid persistente siguiendo las reglas de Google AdManager
function getGenericAdInfo(): DeviceAdInfo {
    const STORAGE_KEY = 'generic_device_rdid';
    let rdid = localStorage.getItem(STORAGE_KEY);

    if (!rdid) {
        // Generador simple de UUID v4 de fallback
        const generateUUID = () => {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        };
        rdid = (typeof crypto !== 'undefined' && crypto.randomUUID)
            ? crypto.randomUUID()
            : generateUUID();
        localStorage.setItem(STORAGE_KEY, rdid);
    }

    return { rdid: rdid, is_lat: '0', idtype: 'dpid' };
}

// Enriquece URL VAST con parámetros del dispositivo
export function appendAdParamsToVastUrl(vastUrl: string, adInfo: DeviceAdInfo, fallbackDomain?: string): string {
    if (!vastUrl) return vastUrl;

    // Limpieza de &amp; recursiva
    let cleanedUrl = vastUrl;
    while (cleanedUrl.indexOf('&amp;') !== -1) {
        cleanedUrl = cleanedUrl.replace(/&amp;/g, '&');
    }
    vastUrl = cleanedUrl;

    const qIndex = vastUrl.indexOf('?');
    let base = qIndex === -1 ? vastUrl : vastUrl.substring(0, qIndex);
    const queryString = qIndex === -1 ? '' : vastUrl.substring(qIndex + 1);

    const paramsMap: Record<string, string> = {};
    if (queryString) {
        const pairs = queryString.split('&');
        for (let i = 0; i < pairs.length; i++) {
            const eqIndex = pairs[i].indexOf('=');
            if (eqIndex === -1) {
                paramsMap[pairs[i]] = '';
            } else {
                paramsMap[pairs[i].substring(0, eqIndex)] = pairs[i].substring(eqIndex + 1);
            }
        }
    }

    // --- RUDO LIVE -> GOOGLE (workaround CORS http/https mismatch) ---
    if (base.indexOf('rudo.video/ads/vmap/live/') !== -1) {
        const slugParts = base.split('/');
        const slug = slugParts[slugParts.length - 1].split('?')[0];

        // Ad units por señal — agregar mapeos de Ecuavisa cuando estén definidos
        const iuMap: Record<string, string> = {};
        const iu = iuMap[slug];

        base = 'https://pubads.g.doubleclick.net/gampad/ads';
        paramsMap['iu'] = encodeURIComponent(iu);
        paramsMap['output'] = 'xml_vast4';
        paramsMap['sz'] = '640x480';
        paramsMap['gdfp_req'] = '1';
        paramsMap['tfcd'] = '0';
        paramsMap['npa'] = '0';

        // Eliminar parámetros exclusivos de Rudo que Google rechaza
        delete paramsMap['app'];
        delete paramsMap['dpssid'];
        delete paramsMap['ndvc'];
        delete paramsMap['sid'];
        delete paramsMap['platform'];
        delete paramsMap['impl'];
    }

    // Agregar parámetros de identificación persistente (Web)
    if (adInfo.rdid && adInfo.idtype) {
        paramsMap['rdid'] = encodeURIComponent(adInfo.rdid);
        paramsMap['is_lat'] = encodeURIComponent(adInfo.is_lat);
        paramsMap['idtype'] = encodeURIComponent(adInfo.idtype);
    }

    if (!paramsMap['correlator'] || paramsMap['correlator'] === '') {
        paramsMap['correlator'] = String(Math.floor(Date.now() * Math.random()));
    }
    if (!paramsMap['unviewed_position_start']) {
        paramsMap['unviewed_position_start'] = '1';
    }
    if (!paramsMap['vpos']) {
        paramsMap['vpos'] = 'preroll';
    }
    if (!paramsMap['impl']) {
        paramsMap['impl'] = 's';
    }
    if (paramsMap['sz'] === '512x288') {
        paramsMap['sz'] = '640x480';
    }

    // --- FIXES SOLO PARA GOOGLE AD MANAGER (no aplicar a Rudo) ---
    const isGoogleAds = base.indexOf('pubads.g.doubleclick.net') !== -1 ||
                        base.indexOf('googleads.g.doubleclick.net') !== -1;

    if (isGoogleAds) {
        // Helper: detecta valores inválidos en params de URL
        const isInvalidUrlParam = (val: string | undefined): boolean => {
            if (!val) return true;
            const decoded = decodeURIComponent(val);
            return decoded.indexOf('localhost') !== -1
                || decoded.indexOf('[placeholder]') !== -1
                || decoded === 'placeholder'
                || decoded.trim() === '';
        };

        // 1. Corregir url si es inválida
        if (isInvalidUrlParam(paramsMap['url'])) {
            // Usar description_url como fallback si tiene un dominio real
            const fallbackUrl = (!isInvalidUrlParam(paramsMap['description_url']))
                ? decodeURIComponent(paramsMap['description_url'])
                : fallbackDomain || DEFAULT_FALLBACK_DOMAIN;
            paramsMap['url'] = encodeURIComponent(fallbackUrl);
        }

        // 2. Corregir ref si es inválida
        if (isInvalidUrlParam(paramsMap['ref'])) {
            paramsMap['ref'] = paramsMap['url'];
        }

        // 3. Corregir description_url si es inválida
        if (isInvalidUrlParam(paramsMap['description_url'])) {
            paramsMap['description_url'] = paramsMap['url'];
        }

        // 4. Cambiar entorno a Video Player
        paramsMap['env'] = 'vp';
    }
    // ---------------------------------

    const parts: string[] = [];
    for (const key in paramsMap) {
        if (Object.prototype.hasOwnProperty.call(paramsMap, key)) {
            parts.push(key + '=' + paramsMap[key]);
        }
    }

    return base + '?' + parts.join('&');
}
