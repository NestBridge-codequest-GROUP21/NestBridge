/**
 * Back-compat wrapper — prefer `BrandLogo` for new call sites.
 * Keeps Welcome / Splash imports working without churn.
 */
export { default } from './BrandLogo';
export type { BrandLogoProps as BrandLogoMarkProps } from './BrandLogo';
