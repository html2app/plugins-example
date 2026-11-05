# Mobile App with Plugins

To build on [https://html2app.dev/](https://html2app.dev/).

This example uses the plugins `vibration` and `Share`.

## How to

```bash
# install dependencies (you need node.js)
npm i

# install the latest @yandeu/js-bridge version if needed
npm i @yandeu/js-bridge@latest

# build
npx -y esbuild www/index.ts --bundle --outfile=www/bundle.js

# zip all files
(linux/macos) zip -r app.zip www
(windows) tar.exe -acvf app.zip www

# now upload app.zip to https://html2app.dev/
# on html2app.dev select and active the Vibration ahs Share plugins.
```

# Without a bundler

You can skip the build step and load the JavaScript modules directly from a CDN such as [esm.sh](https://esm.sh/). The `index.html` in this project does that:

```html
<script type="module">
  // import WebView
  import { WebView } from "https://esm.sh/@yandeu/js-bridge@0.0.2"
  // import the Share plugin
  import { Share } from "https://esm.sh/@yandeu/js-bridge@0.0.2/lib/plugins/share"

  // set navigation bar to red
  WebView.navigationBar.setColor("#FF0000");

  // share a text on click
  let btn = document.getElementById("share-text")
  btn.addEventListener("click", ()=>{
    console.log("Hello")
    Share.text("Hello")
  })
</script>
```

Without a bundler, you do not need `npm i`, `esbuild`, or `www/bundle.js`. Zip the `www` folder and upload it as usual.

**Drawback:** Files loaded from an external server are not embedded in the app bundle. The app needs an internet connection to fetch them, so it will not work offline.

**Recommendation:** Bundle all required assets with the app. This gives the best user experience, because the app starts quickly and works offline. Use the bundler setup described above.
