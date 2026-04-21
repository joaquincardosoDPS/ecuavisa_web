// src/utils/applyConfigToCSS.ts
// Aplica la configuración dinámica del cliente a las variables CSS de :root
export function applyConfigToCSS(config: any) {
    if (!config) return;
    const root = document.documentElement;

    // Colores
    if (config["clr-primary"]) root.style.setProperty('--clr-primary', config["clr-primary"]);
    if (config["clr-secondary"]) root.style.setProperty('--clr-secondary', config["clr-secondary"]);
    if (config["clr-primary-title"]) root.style.setProperty('--clr-primary-title', config["clr-primary-title"]);
    if (config["clr-secondary-title"]) root.style.setProperty('--clr-secondary-title', config["clr-secondary-title"]);
    if (config["clr-primary-button"]) root.style.setProperty('--clr-primary-button', config["clr-primary-button"]);
    if (config["clr-secondary-button"]) root.style.setProperty('--clr-secondary-button', config["clr-secondary-button"]);
    if (config["clr-primary-subtitle"]) root.style.setProperty('--clr-primary-subtitle', config["clr-primary-subtitle"]);
    if (config["clr-secondary-subtitle"]) root.style.setProperty('--clr-secondary-subtitle', config["clr-secondary-subtitle"]);
    if (config["clr-primary-text"]) root.style.setProperty('--clr-primary-text', config["clr-primary-text"]);
    if (config["clr-secondary-text"]) root.style.setProperty('--clr-secondary-text', config["clr-secondary-text"]);
    if (config["clr-text-primary-button"]) root.style.setProperty('--clr-text-primary-button', config["clr-text-primary-button"]);
    if (config["clr-text-secondary-button"]) root.style.setProperty('--clr-text-secondary-button', config["clr-text-secondary-button"]);
    if (config["clr-text-tertiary-button"]) root.style.setProperty('--clr-text-tertiary-button', config["clr-text-tertiary-button"]);
    if (config["clr-icon"]) root.style.setProperty('--clr-icon', config["clr-icon"]);
    if (config["clr-edit"]) root.style.setProperty('--clr-edit', config["clr-edit"]);
    if (config["foc-primary"]) root.style.setProperty('--foc-primary', config["foc-primary"]);
    if (config["foc-secondary"]) root.style.setProperty('--foc-secondary', config["foc-secondary"]);
    if (config["foc-tertiary"]) root.style.setProperty('--foc-tertiary', config["foc-tertiary"]);

    // Fuentes
    if (config["font-family-title"]) root.style.setProperty('--font-family-title', config["font-family-title"]);
    if (config["font-family-text"]) root.style.setProperty('--font-family-text', config["font-family-text"]);
    if (config["font-family-button"]) root.style.setProperty('--font-family-button', config["font-family-button"]);
    if (config["font-family-subtitle"]) root.style.setProperty('--font-family-subtitle', config["font-family-subtitle"]);
    if (config["font-size-title"]) root.style.setProperty('--font-size-title', config["font-size-title"]);
    if (config["font-size-subtitle"]) root.style.setProperty('--font-size-subtitle', config["font-size-subtitle"]);
    if (config["font-size-text"]) root.style.setProperty('--font-size-text', config["font-size-text"]);
    if (config["font-size-subtext"]) root.style.setProperty('--font-size-subtext', config["font-size-subtext"]);
    if (config["font-title"]) root.style.setProperty('--font-title', config["font-title"]);
    if (config["font-subtitle"]) root.style.setProperty('--font-subtitle', config["font-subtitle"]);
    if (config["font-text"]) root.style.setProperty('--font-text', config["font-text"]);
    if (config["font-weight-title"]) root.style.setProperty('--font-weight-title', config["font-weight-title"]);
    if (config["font-weight-subtitle"]) root.style.setProperty('--font-weight-subtitle', config["font-weight-subtitle"]);
    if (config["font-weight-text"]) root.style.setProperty('--font-weight-text', config["font-weight-text"]);
    if (config["font-weight-subtext"]) root.style.setProperty('--font-weight-subtext', config["font-weight-subtext"]);

    // Gradientes
    if (config["grad-banner"]) root.style.setProperty('--grad-banner', config["grad-banner"]);
    if (config["grad-sidebar"]) root.style.setProperty('--grad-sidebar', config["grad-sidebar"]);

}
