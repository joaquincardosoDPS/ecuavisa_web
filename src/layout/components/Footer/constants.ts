import type { AppConfig } from "@/interfaces/config.interface";

import xIcon from "@/assets/img/footer/x.png";
import facebookIcon from "@/assets/img/footer/facebook.png";
import instagramIcon from "@/assets/img/footer/instagram.png";
import tiktokIcon from "@/assets/img/footer/tiktok.png";
import youtubeIcon from "@/assets/img/footer/youtube.png";
// import twitchIcon from "@/assets/img/footer/twitch.png";

export interface FaqItem {
    question: string;
    answer: string;
}

export interface CorporateLink {
    name: string;
    variable: keyof AppConfig;
}

export interface RrssLink {
    name: string;
    variable: string;
    logo: string;
}

export const FAQ_ITEMS: FaqItem[] = [
    {
        question: "¿Qué puedo encontrar en Ecuavisa?",
        answer: `En Ecuavisa encontrarás lo mejor del canal en un solo lugar: programas en emisión, capítulos completos, un catálogo de producciones históricas del canal, noticias, deportes, contenido exclusivo en digital y múltiples señales en vivo para que disfrutes tus contenidos favoritos cuando y donde quieras.`
    },
    {
        question: "¿En qué dispositivos está disponible Ecuavisa?",
        answer: `Celulares y tablets con iOS y Android.
        • Smart TV compatibles (Android TV, Samsung y Roku)
        • Computadores mediante la versión web
        • Importante: Seguimos trabajando para que puedas disfrutar de Ecuavisa en más plataformas y dispositivos.`
    },
    {
        question: "¿Qué beneficios tiene iniciar sesión?",
        answer: `Al iniciar sesión en Ecuavisa puedes acceder a una experiencia más personalizada. Podrás continuar viendo tus contenidos favoritos donde los dejaste, recibir recomendaciones acordes a tus intereses y disfrutar de una navegación adaptada a tus preferencias, sin importar el dispositivo que utilices.`
    },
    {
        question: "¿Puedo ver la señal en vivo de Ecuavisa?",
        answer: `Sí. En Ecuavisa puedes ver la señal en vivo y acceder a múltiples señales en directo. Además de disfrutar de eventos especiales, deportes, noticias y la programación habitual del canal desde cualquier lugar.`
    },
];

export const CORPORATE_LINKS: CorporateLink[] = [
    { name: "Aviso Legal", variable: "url_corporativo" },
    { name: "Política de cookies", variable: "url_comercial" },
    { name: "Políticas de privacidad", variable: "url_concursos" },
    { name: "Corporativo", variable: "url_proveedores" },
    { name: "Ayuda", variable: "url_trabaja" },
    { name: "Código ético", variable: "url_ztd" },
    { name: "Rendición de cuentas Guayaquil", variable: "url_visita" },
    { name: "Rendición de cuentas Quito", variable: "url_visita" }
];

export const RRSS_LINKS: RrssLink[] = [
    { name: "Instagram", variable: "url_instagram", logo: instagramIcon },
    { name: "Facebook", variable: "url_facebook", logo: facebookIcon },
    { name: "TikTok", variable: "url_tiktok", logo: tiktokIcon },
    { name: "X", variable: "url_x", logo: xIcon },
    { name: "YouTube", variable: "url_youtube", logo: youtubeIcon },
];
