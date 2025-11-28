const list = document.getElementById('list')
const back = document.getElementById('back')
const next = document.getElementById('next')
const toast = document.getElementById('toast')
const vibrate = document.getElementById('vibrate')

import { App as CapacitorApp } from '@capacitor/app'
import { Toast } from '@capacitor/toast'
import { Haptics } from '@capacitor/haptics'

// https://stackoverflow.com/a/69084017
CapacitorApp.addListener('backButton', () => goBack())

back.addEventListener('click', () => goBack())

next.addEventListener('click', () => {
  const count = list.children.length
  const li = document.createElement('li')
  li.innerText = 'page ' + count
  list.appendChild(li)
})

const goBack = () => {
  const count = list.children.length
  count <= 1 ? CapacitorApp.exitApp() : list.lastElementChild.remove()
}

toast.addEventListener('click', async () => {
  console.log('Show toast')
  await Toast.show({
    text: 'Hello!'
  })
})

vibrate.addEventListener('click', async () => {
  console.log('Vibrate')
  await Haptics.vibrate()
})
