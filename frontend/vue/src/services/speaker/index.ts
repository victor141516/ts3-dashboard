import { ServerSummaryResponse } from '../api'

export const speakNewPeople = (previous: ServerSummaryResponse, current: ServerSummaryResponse) => {
  const prevSet = new Set(Object.values(previous).flat())
  const curSet = new Set(Object.values(current).flat())
  prevSet.forEach((v) => curSet.delete(v))
  const newPeopleList = Array.from(curSet)
  if (newPeopleList.length === 0) return

  const newPeopleText = new Intl.ListFormat().format(
    newPeopleList.map((p) => ({ victor141516: 'Víctor', Dav1z: 'David' }[p] ?? p)),
  )
  const lang = window.navigator.language.split('-')[0]
  const i18dTextOptions = {
    en: `${newPeopleText} connected to the server`,
    es: `Se ${newPeopleList.length === 1 ? 'ha' : 'han'} conectado ${newPeopleText}`,
  } as Record<string, string>
  const i18dText = i18dTextOptions[lang] ?? i18dTextOptions.en
  console.log({ lang, i18dText })

  const msg = new SpeechSynthesisUtterance()
  const voices = window.speechSynthesis.getVoices()
  msg.voice = voices[0]
  msg.volume = 1 // From 0 to 1
  msg.rate = 1 // From 0.1 to 10
  msg.pitch = 1 // From 0 to 2
  msg.text = i18dText
  msg.lang = lang
  speechSynthesis.speak(msg)
}
