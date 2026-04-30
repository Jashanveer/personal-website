/**
 * Inline script that runs BEFORE React hydrates. Sets data-theme on <html>
 * based on saved preference or prefers-color-scheme so there's no flash
 * of wrong theme on first paint.
 *
 * Must be rendered in <head> via dangerouslySetInnerHTML.
 */
const themeBootstrap = `
(function () {
  try {
    var saved = localStorage.getItem('theme');
    var systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    var theme = saved === 'light' || saved === 'dark'
      ? saved
      : (systemDark ? 'dark' : 'light');
    document.documentElement.dataset.theme = theme;
  } catch (e) {}
})();
`.trim();

export default function ThemeScript() {
  return (
    <script
      // safe: hardcoded string with no interpolation
      dangerouslySetInnerHTML={{ __html: themeBootstrap }}
    />
  );
}
