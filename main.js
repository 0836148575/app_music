
const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const cd = $('.cd')
const playBtn = $('.btn-toggle-play')
const player = $('.player')
const progress = $('#progress')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')

const app = {
  currentIndex: 0,
  songs: [
      {
        name: 'Đế vương',
        singer: 'Đình Dũng, ACV',
        path: './Assets/music/song1.mp3',
        image: './Assets/image/song1.png'
      },
      {
        name: 'Em đã có người mới rồi',
        singer: 'Tóc tiên',
        path: './Assets/music/song2.mp3',
        image: './Assets/image/song2.png'
      },
      {
        name: 'Trả',
        singer: 'Hải Lưu',
        path: './Assets/music/song3.mp3',
        image: './Assets/image/song3.png'
      },
      {
        name: 'Đế vương',
        singer: 'Đình Dũng, ACV',
        path: './Assets/music/song1.mp3',
        image: './Assets/image/song1.png'
      },
      {
        name: 'Em đã có người mới rồi',
        singer: 'Tóc tiên',
        path: './Assets/music/song2.mp3',
        image: './Assets/image/song2.png'
      },
      {
        name: 'Trả',
        singer: 'Hải Lưu',
        path: './Assets/music/song3.mp3',
        image: './Assets/image/song3.png'
      },
      {
        name: 'Đế vương',
        singer: 'Đình Dũng, ACV',
        path: './Assets/music/song1.mp3',
        image: './Assets/image/song1.png'
      },
      {
        name: 'Em đã có người mới rồi',
        singer: 'Tóc tiên',
        path: './Assets/music/song2.mp3',
        image: './Assets/image/song2.png'
      },
      {
        name: 'Trả',
        singer: 'Hải Lưu',
        path: './Assets/music/song3.mp3',
        image: './Assets/image/song3.png'
      }
  ],

  render: function() {
    const htmls = this.songs.map(function(song, index) {
      return `
          <div class="song ${index === app.currentIndex ? 'active' : ''}">
              <div class="thumb" 
                    style="background-image: url('${song.image}')">
              </div>
              <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
              </div>
              <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                  </div>
              </div>
          </div>
        `
    })
    $('.playlist').innerHTML = htmls.join('')
  },

  defineProperties: function() {
      Object.defineProperty(this, 'currentSong', {
        get: function() {
          return this.songs[this.currentIndex]
        }
      })
  },
  handleEvents: function() {
      const cdWidth = cd.offsetWidth
      const _this = this
      isPlaying: false
      isRandom: false
      isReapeat: false

      // Xử lý phóng to thu nhỏ cái cd
      document.onscroll = function() {
          const scrollTop = window.scrollY || document.documentElement.scrollTop
          const newCdWidth = cdWidth - scrollTop

          cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0
          cd.style.opacity = newCdWidth / cdWidth
          // cach k dung ES6
          // if(newCdWidth > 0) {
          //   cd.style.width = newCdWidth + 'px' 
          // } else {
          //   cd.style.width = 0
          // }
      }

      // cd quay / dung`
      const cdThumbAnimate = cdThumb.animate([
          {transform: 'rotate(360deg)'}
      ], {
          duration: 10000,           // 10second
          iterations: Infinity
      })
      cdThumbAnimate.pause()

       //xử lí khi click nút play
      playBtn.onclick = function() {
        if(_this.isPlaying){
            audio.pause()
        } else {
            audio.play()
        }
      }

      //khi song duoc play
      audio.onplay = function() {
          player.classList.add('playing')
          _this.isPlaying = true
          cdThumbAnimate.play()
      }
      //khi song bi pause
      audio.onpause = function() {
        player.classList.remove('playing')
        _this.isPlaying = false
        cdThumbAnimate.pause()
      }

      // khi tien do bai hat thay doi
      audio.ontimeupdate = function() {
        if(audio.duration) {
          const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
          progress.value =  progressPercent
        }
      }

      // khi tua song
      progress.onchange = function(e) {
        const seekTime = audio.duration * e.target.value / 100
        audio.currentTime = seekTime
      }

      // click next song
      nextBtn.onclick = function() {
        if(_this.isRandom) {
          _this.playRandomSong()
        } else {
          _this.nextSong()
        }
        audio.play()
        _this.render()
        _this.scrollToActiveSong()
        }
       // click prev song
      prevBtn.onclick = function() {
        if(_this.isRandom) {
          _this.playRandomSong()
        } else {
          _this.prevSong()
        }
        audio.play()
        _this.render()
        _this.scrollToActiveSong()
      }

      // xu li bat / tat random song
      randomBtn.onclick = function(e) {
        _this.isRandom = !_this.isRandom
        randomBtn.classList.toggle('active', _this.isRandom)
      }

      // onended song
      audio.onended = function() {
        if(_this.isRepeat){
          audio.play()
        } else {
          nextBtn.click()
        }
      }

      // xu li bat / tat repeat song
      repeatBtn.onclick = function(e) {
        _this.isRepeat = !_this.isRepeat
        repeatBtn.classList.toggle('active', _this.isRepeat)
      }

  },
  scrollToActiveSong: function() {
      setTimeout(() => {
        $('.song.active').scrollIntoView({
          behavior: 'smooth',
          block: 'nearest'
        })
      }, 300)
  },
  loadCurrentSong: function() {
      heading.textContent = this.currentSong.name
      cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
      audio.src = this.currentSong.path
  },
  nextSong: function() {
    // console.log(this.currentIndex);

      this.currentIndex++
      if(this.currentIndex >= this.songs.length){
        this.currentIndex = 0
      }
      this.loadCurrentSong()
  },
  prevSong: function() {
    // console.log(this.currentIndex);
    this.currentIndex--
    if(this.currentIndex < 0){
      this.currentIndex = this.songs.length - 1
    }
    this.loadCurrentSong()
  },
  playRandomSong: function() {
    // console.log(this.currentIndex);
    let newIndex
    do{
      newIndex = Math.floor(Math.random() * this.songs.length)
    } while (newIndex === this.currentIndex)

    this.currentIndex = newIndex 
    this.loadCurrentSong()
  },
  start: function() {
    // Định nghĩa các  thuộc tính cho Object
      this.defineProperties()  

    // lắng nghe / xử lý các sự kiện (DOM Events)
      this.handleEvents()

    // load bai hat dau tien khi chay ung dung
      this.loadCurrentSong()

    // render playlist
      this.render()
  }

}

app.start()