# Jinzhou Zhao — Personal Website

## Preview locally

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Open http://127.0.0.1:8000. No build tools or dependencies are required.

## Publish on GitHub Pages

1. Push these files to the `main` branch of `Jinzhou511/PersonalWebsite`.
2. In the repository, open **Settings → Pages**.
3. Select **Deploy from a branch**, then **main** and **/(root)**. Save.
4. Wait for GitHub's Pages deployment to complete.

Expected site address after deployment: https://jinzhou511.github.io/PersonalWebsite/.

Official instructions: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

GitHub Free supports Pages on public repositories. Private repository Pages availability depends on the account plan.

## Update content

- `index.html`: biography, portfolio, consulting services and contact links.
- `styles.css`: layout, colors, typography and responsive styles.
- `script.js`: theme preference and mobile navigation.
- `assets/`: locally hosted photos and favicon.

All asset URLs are relative, so the site works at both a repository subpath and a custom domain. Contact links open the visitor's email client; there is no backend or contact form. Google Fonts is optional; system fonts are used as a fallback. The original website remains independent of this deployment.

## Journey map

The interactive SVG map uses an equirectangular projection of the contiguous United States, with a separately scaled South America inset for São Paulo. City markers use geographic coordinates; connecting curves illustrate the journey rather than exact travel paths. The main route is Boston → Pittsburgh → Dallas → Bay Area. Branches connect Dallas with Detroit, Columbia (Missouri) and São Paulo (Brazil).

Country outlines are derived from Natural Earth's public-domain 1:110m country dataset: https://www.naturalearthdata.com/about/terms-of-use/. Map geometry is inline in `index.html`; city details and selection behavior are in `script.js`. Branch descriptions do not assume work roles or project details not supplied by the owner.
