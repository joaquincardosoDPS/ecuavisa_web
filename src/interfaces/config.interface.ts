export interface ApiConfigResponse {
    status: string;
    code?: number;
    msj?: string;
    data: AppConfig;
}

export interface AppConfig {
    name: string;
    google_active: boolean;
    google_id: string | null;
    ios_active: boolean;
    ios_id_web: string | null;
    ios_redirect_uri: string | null;
    facebook_active: boolean;
    background: string | null;
    color: string | null;
    logo: string | null;
    base_ads: string;
    "android-version": string;
    "clr-icon": string;
    "clr-primary": string;
    "clr-primary-subtitle": string;
    "clr-primary-text": string;
    "clr-primary-title": string;
    "clr-secondary": string;
    "clr-secondary-button": string;
    "clr-secondary-text": string;
    "clr-secondary-title": string;
    "clr-text-primary-button": string;
    "clr-text-tertiary-button": string;
    "foc-primary": string;
    "grad-sidebar": string;
    "ios-version": string;
    "name-app": string;
    timezone_name: string;
    "politicas-privacidad": string;
    "terminos-condiciones": string;
    "android-link"?: string;
    "ios-link"?: string;
}

