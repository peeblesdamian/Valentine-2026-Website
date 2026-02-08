import './App.css'
import valentine from './assets/valentine.png'
import berry from './assets/berry.png'
import rose from './assets/rose.png'
import beautiful from './assets/beautiful.png'
import perfect from './assets/perfect.png'
import yippie from './assets/yippie.mp3'
import hooray from './assets/hooray.mp3'
import romantic from './assets/romantic.mp3'
import buzzer from './assets/buzzer.mp3'
import sad from './assets/sad.mp3'
import perfectAudio from './assets/perfect.m4a'
import { useState, useRef, useEffect } from 'react'
import confetti from 'canvas-confetti'

const questions = [
  { 
    "text": "Welcome fine cutiee patootiee :333",
    "subText": "Heyyaaaaaaa..  . I told you not to press :(((",
    "image": rose,
    "buttonTextYes": "press meeeeeee :3\n",
    "buttonTextNo": "don't press me :(\n",
  },

  { 
    "text": "You're berry cute!! ahemm :3 Do you like meeee? :3 🥺🥺🥺",
    "subText": "😭😭😭 do you hate me.. . 😭😭 try again. ..",
    "image": berry,
    "buttonTextYes": "I like you lots <3 :33\n",
    "buttonTextNo": "You're lying. ..\n",
  },

  { 
    "text": "There's not a girl more beautiful than you :3 Do you loovvee mee? :33 🥺🥺🥺",
    "subText": "You're meant to say ABSOLUTELY!#@! :((( ",
    "image": beautiful,
    "buttonTextYes": "ABSOLUTELY I LOVE YOUUUU\n",
    "buttonTextNo": "Hey. .. don't think about pressing here..\n",
  },

  { 
    "text": "To my perfect girl Savannah, mind if I ask something of you? :3",
    "subText": "psssss!! you definitely do, pleasseee!! :33",
    "image": perfect,
    "buttonTextYes": "Okayydookayyaaa :33\n",
    "buttonTextNo": "Hmmmm.. .\n",
  },

  { 
    "text": "My love Savannah, will you be my Valentine? :3 😘😘🌹🌹🌹",
    "subText": "heyy.. considering time is over. ..",
    "image": valentine,
    "buttonTextYes": "YESSSS!!@#@!!! \n",
    "buttonTextNo": "I'll consider it.. .\n",
  },

  { 
    "text": "YIPPPPPPPPPIPIEIEIEIEEEE🥰😍😘😘😚😍😍🥰 \n I LOVE YOU SOS SOSOSO SO MUCH SAVANNNAHH",
    "subText": "WEEEEEHEEEEE THY BEAUTIFUL GIRRL LOVESSS MEE HEHEHEHEE IM SO LUCKYYYY TO BE YOURS MWAAAHAHAHH!!!",
    "image": valentine,
    "buttonTextYes": "CONFETTTIII🎊🎉\n",
  }

]

function App() {
  const [visibleCard, setVisibleCard] = useState<number>(0)
  const [visibleNoButton, setVisibleNoButton] = useState<boolean>(true)
  const [yesCooldown, setYesCooldown] = useState<boolean>(false)
  const [bgMusic, setBgMusic] = useState(false)
  const bgMusicRef = useRef(false)

  const perfectSoundRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    bgMusicRef.current = bgMusic
  }, [bgMusic])

  useEffect(() => {
  perfectSoundRef.current = new Audio(perfectAudio)
  perfectSoundRef.current.volume = 0.125
}, [])

  const yippieSound = new Audio(yippie)
  const hooraySound = new Audio(hooray)
  const romanticSound = new Audio(romantic)
  const buzzerSound = new Audio(buzzer)
  const sadSound = new Audio(sad)
  yippieSound.volume = 0.1
  hooraySound.volume = 0.1
  romanticSound.volume = 0.1
  buzzerSound.volume = 0.1
  sadSound.volume = 0.1

  const playSound = async () => {
    while (true)
    {
      yippieSound.play()
      hooraySound.play()
      romanticSound.play()

      await Promise.all([
        new Promise(res => (yippieSound.onended = res)),
        new Promise(res => (hooraySound.onended = res)),
        new Promise(res => (romanticSound.onended = res))
      ])
    }
  }

  const backgroundSong = async () => {
  const audio = perfectSoundRef.current
  if (!audio) return

  bgMusicRef.current = true

  while (bgMusicRef.current) {
    audio.currentTime = 0
    await audio.play()

    await new Promise<void>(res => {
      audio.onended = () => res()
    })
  }

  audio.pause()
  audio.currentTime = 0
  }

  const stopBackgroundSong = () => {
    bgMusicRef.current = false
    setBgMusic(false)

    const audio = perfectSoundRef.current
    if (!audio) return

    audio.pause()
    audio.currentTime = 0
  }

  function startConfettiLoop() {
    stopBackgroundSong()
    let count = 0
    const run = () => {
      if (count < 1){
        count += 1
        playSound()
      }

      confetti({
        particleCount: 148,
        spread: 438,
        origin: { x: Math.random(), y: Math.random()},
        scalar: 3
      });
      setTimeout(run, 824);
    };

    run();
  }


  function nextQuestion() {
    if (yesCooldown) return
    setYesCooldown(true)

    confetti({ particleCount: 438, spread: 438 })

    Math.random() < 0.5 ? yippieSound.play() : hooraySound.play()

    if (visibleCard == 0){
      setBgMusic(true)
      backgroundSong()
    }

    if (visibleCard < questions.length - 1) {
      visibleCard === questions.length - 2
        ? setVisibleNoButton(false)
        : setVisibleNoButton(true)

      setVisibleCard(prev =>
        prev < questions.length - 1 ? prev + 1 : prev
      )
    }

    if (visibleCard === questions.length - 2) {
      startConfettiLoop()
    }

    setTimeout(() => setYesCooldown(false), 1500) // ⏱ YES cooldown
  }
  return (
    <>
      <div style={{flexDirection: 'column', display: 'flex', justifyContent: 'center'}}>
        <p className="welcome">{questions[visibleCard].text}</p>
        {!visibleNoButton && <p>{questions[visibleCard].subText}</p>}
        <img className="logo" src={questions[visibleCard].image}></img>
        <div style={{flexDirection: 'row', display: 'flex', justifyContent: 'center', gap: 12}}>
          <button
            className="button"
            disabled={yesCooldown}
            onClick={nextQuestion}
          >
            {questions[visibleCard].buttonTextYes} ✅
          </button>

          {visibleNoButton && (
            <button
              className="button"
              disabled={yesCooldown}
              onClick={() => {
                if (yesCooldown) return
                setYesCooldown(true)

                setVisibleNoButton(false)
                let rand = Math.random()
                rand > 0.5 ? buzzerSound.play() : sadSound.play()
                setTimeout(() => setYesCooldown(false), rand > 0.5 ? 1500: 6000) // ⏱ NO cooldown
              }}
            >
              {questions[visibleCard].buttonTextNo} ❌
            </button>
          )}
        </div>
      </div>
    </>
  )
}

export default App
