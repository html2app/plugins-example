const list = document.getElementById('list')
const back = document.getElementById('back')
const next = document.getElementById('next')

import { App as CapacitorApp } from '@capacitor/app'

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
