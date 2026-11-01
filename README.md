# Mobile App with Plugins

To build on [https://html2app.dev/](https://html2app.dev/).

This example uses the plugins `vibration` and `Share`.

## How to

```bash
# install dependencies
npm i

# build
npx -y esbuild www/index.ts --bundle --outfile=www/bundle.js

# zip all files
(linux/macos) zip -r app.zip www
(windows) tar.exe -acvf app.zip www

# now upload app.zip to https://html2app.dev/
# on html2app.dev select and active the Vibration ahs Share plugins.
```
