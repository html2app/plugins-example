import { WebView } from "@yandeu/js-bridge";
import { Vibration } from "@yandeu/js-bridge/lib/plugins/vibration.js";
import { Share } from '@yandeu/js-bridge/lib/plugins/share.js'

// Fix orientation to portrait only (as a example)
WebView.orientation.setPortrait();

const shareText = document.getElementById('share-text')!
const vibrate = document.getElementById('vibrate')!

shareText.addEventListener('click', async () => {
  console.log('Share Text')
  await Share.text('Hello!')
})

vibrate.addEventListener('click', () => {
  console.log('Vibrate')
  Vibration.vibrate()
})
