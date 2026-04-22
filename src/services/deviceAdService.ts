/**
 * Servicio de identificación publicitaria del dispositivo
 * para Google Ad Manager (VAST).
 */

import { ADS_FALLBACK_DOMAIN } from '@/config-global';

export interface DeviceAdInfo {
    rdid: string;
    is_lat: string;
    idtype: string;
}

var cachedInfo: DeviceAdInfo | null = null;

// Obtiene info de ads del dispositivo (cachéa resultado)
export function getDeviceAdInfo(): Promise<DeviceAdInfo> {
    if (cachedInfo) {
        return Promise.resolve(cachedInfo);
    }
    return detectDeviceAdInfo().then(function (info) {
        cachedInfo = info;
        return info;
    });
}

function detectDeviceAdInfo(): Promise<DeviceAdInfo> {
    if (typeof (window as any).tizen !== 'undefined' && typeof (window as any).webapis !== 'undefined') {
        return getTizenAdInfo();
    }
    if (typeof (window as any).webOS !== 'undefined' || navigator.userAgent.toLowerCase().indexOf('web0s') !== -1) {
        return getLgAdInfo();
    }
    return Promise.resolve(getGenericAdInfo());
}

// Samsung Tizen: obtiene TIFA y LAT
function getTizenAdInfo(): Promise<DeviceAdInfo> {
    return new Promise(function (resolve) {
        try {
            var webapis = (window as any).webapis;
            if (webapis && webapis.adinfo) {
                var tifa = webapis.adinfo.getTIFA() || '';
                console.log('[DeviceAd] Tizen TIFA:', tifa || '(empty)');
                var lat = '0';
                try {
                    lat = webapis.adinfo.isLATEnabled() ? '1' : '0';
                } catch (_e) {
                    lat = '0';
                }
                resolve({ rdid: tifa, is_lat: lat, idtype: 'tifa' });
            } else {
                resolve(getGenericAdInfo());
            }
        } catch (error) {
            console.error('[DeviceAd] Error Tizen:', error);
            resolve(getGenericAdInfo());
        }
    });
}

// LG webOS: obtiene LGUDID
function getLgAdInfo(): Promise<DeviceAdInfo> {
    return new Promise(function (resolve) {
        try {
            var webOS = (window as any).webOS;
            if (webOS && webOS.service && webOS.service.request) {
                webOS.service.request('luna://com.webos.service.sm', {
                    method: 'deviceid/getIDs',
                    parameters: { idType: ['LGUDID'] },
                    onSuccess: function (res: any) {
                        var lgudid = '';
                        if (res && res.idList) {
                            for (var i = 0; i < res.idList.length; i++) {
                                if (res.idList[i].idType === 'LGUDID') {
                                    lgudid = res.idList[i].idValue || '';
                                    break;
                                }
                            }
                        }
                        resolve({ rdid: lgudid, is_lat: '0', idtype: 'lgudid' });
                    },
                    onFailure: function (err: any) {
                        console.error('[DeviceAd] Error LG UDID:', err);
                        resolve(getGenericAdInfo());
                    }
                });
            } else {
                resolve(getGenericAdInfo());
            }
        } catch (error) {
            console.error('[DeviceAd] Error LG:', error);
            resolve(getGenericAdInfo());
        }
    });
}

// Fallback genérico (web o dispositivos no identificados)
// Genera un dpid persistente siguiendo las reglas de Google AdManager
function getGenericAdInfo(): DeviceAdInfo {
    const STORAGE_KEY = 'generic_device_rdid';
    let rdid = localStorage.getItem(STORAGE_KEY);

    if (!rdid) {
        // Generador simple de UUID v4 de fallback
        const generateUUID = () => {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
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
export function appendAdParamsToVastUrl(vastUrl: string, adInfo: DeviceAdInfo): string {
    if (!vastUrl) return vastUrl;

    // Limpieza de &amp; recursiva
    let cleanedUrl = vastUrl;
    while (cleanedUrl.indexOf('&amp;') !== -1) {
        cleanedUrl = cleanedUrl.replace(/&amp;/g, '&');
    }
    vastUrl = cleanedUrl;

    var qIndex = vastUrl.indexOf('?');
    var base = qIndex === -1 ? vastUrl : vastUrl.substring(0, qIndex);
    var queryString = qIndex === -1 ? '' : vastUrl.substring(qIndex + 1);

    var paramsMap: Record<string, string> = {};
    if (queryString) {
        var pairs = queryString.split('&');
        for (var i = 0; i < pairs.length; i++) {
            var eqIndex = pairs[i].indexOf('=');
            if (eqIndex === -1) {
                paramsMap[pairs[i]] = '';
            } else {
                paramsMap[pairs[i].substring(0, eqIndex)] = pairs[i].substring(eqIndex + 1);
            }
        }
    }

    // --- RUDO LIVE -> GOOGLE (workaround CORS http/https mismatch) ---
    if (base.indexOf('rudo.video/ads/vmap/live/') !== -1) {
        var slugParts = base.split('/');
        var slug = slugParts[slugParts.length - 1].split('?')[0];

        var iuMap: Record<string, string> = {
            '13cl': '/112372207/13go/canal13/preroll',
            't13': '/112372207/13go/t13/preroll',
            'deportes': '/112372207/13go/13deportes/preroll',
            'cultura': '/112372207/13go/13cultura/preroll',
            'entretencion': '/112372207/13go/13entretencion/preroll',
            '13cocina': '/112372207/13go/13cocina/preroll',
            '13viajes': '/112372207/13go/13viajes/preroll',
        };
        var iu = iuMap[slug] || '/112372207/13go/canal13/preroll';

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

    // Solo agregar parámetros de dispositivo si existen (Smart TV)
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
    var isGoogleAds = base.indexOf('pubads.g.doubleclick.net') !== -1 ||
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
            var fallbackDomain = (!isInvalidUrlParam(paramsMap['description_url']))
                ? decodeURIComponent(paramsMap['description_url'])
                : ADS_FALLBACK_DOMAIN;
            paramsMap['url'] = encodeURIComponent(fallbackDomain);
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

    var parts: string[] = [];
    for (var key in paramsMap) {
        if (Object.prototype.hasOwnProperty.call(paramsMap, key)) {
            parts.push(key + '=' + paramsMap[key]);
        }
    }

    return base + '?' + parts.join('&');
}
