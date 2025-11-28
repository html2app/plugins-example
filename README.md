# Capacitor app with plugins

To build on https://html2app.dev/

This example uses the plugins `@capacitor/app@5`, `@capacitor/toast@5` and `@capacitor/haptics@5`.

## How to

Either [download the apk (for android)](app-debug.apk) or build it yourself:

```bash
# install dependencies
npm i

# build
npx -y esbuild www/index.js --bundle --outfile=www/bundle.js

# zip all files
(linux/macos) zip -r app.zip www assets config.json
(windows) tar.exe -acvf app.zip www assets config.json

# now upload app.zip to https://html2app.dev/
```
