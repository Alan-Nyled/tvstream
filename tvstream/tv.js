/* global Alpine */
const streams = {
    "DR1": 'https://drlive01hls.akamaized.net/hls/live/2014185/drlive01/master2000.m3u8',
    "DR2": 'https://drlive02hls.akamaized.net/hls/live/2014187/drlive02/master2000.m3u8',
    "DRTV": "https://drevent01hls.akamaized.net/hls/live/2014198/drevent01/master5500.m3u8",
    "TV2 Lorry": 'https://cdn-lt-live.tv2lorry.dk/env/cluster-1-a.live.nvp1/live/hls/p/2045321/e/1_grusx1zd/tl/main/st/0/t/Tpoil8IUW0Ll-I7MNdvq9w/index-s32.m3u8',
    "TV2 Øst": "https://cdn-lt-live.tveast.dk/env/cluster-1-b.live.nvp1/live/hls/p/1953381/e/0_zphj9q61/tl/main/st/0/t/WlWMNJkqB-huIqA6IPKtjw/index-s32.m3u8",
    "TV2 Bornholm": 'https://live.tv2bornholm.dk/stream/live/playlist.m3u8',
    "TV2 Fyn": 'https://cdn-lt-live.tv2fyn.dk/env/cluster-1-b.live.nvp1/live/hls/p/1966291/e/0_vsfrv0zm/tl/main/st/0/t/6YzMg7iC2gGNwEhTTd--Jw/index-s32.m3u8',
    "TV2 Syd": 'https://cdn-lt-live.tvsyd.dk/env/cluster-1-b.live.nvp1/live/hls/p/1956351/e/0_e9slj9wh/tl/main/st/0/t/snnpk1n9YrfUFmtJega-Jg/index-s32.m3u8',
    "TV2 MidtVest": 'https://cdn-lt-live.tvmidtvest.dk/env/cluster-1-a.live.frp1/live/hls/p/1953371/e/1_qwqu2d0z/tl/main/st/0/t/R-Nbk7NAOQWLAqgHM2MA5Q/index-s32.m3u8',
    "TV2 Østjylland": "https://cdn-lt-live.tv2oj.dk/env/cluster-1-b.live.nvp1/live/hls/p/2102081/e/0_x4p3licd/tl/main/st/0/t/1IDpsILQMeKSa8ToigNosQ/index-s32.m3u8",
    "TV2 Nord": 'https://cdn-lt-live.tv2nord.dk/env/cluster-1-b.live.nvp1/live/hls/p/1956931/e/1_h9yfe7h2/tl/main/st/1/t/kNsCSriKvxV7XpyiejfS4g/index-s32.m3u8',
    "ABC News": 'https://content.uplynk.com/channel/3324f2467c414329b3b0cc5cd987b6be.m3u8',
    "CNN": 'https://cnn-cnninternational-1-de.samsung.wurl.com/manifest/playlist.m3u8',
    "CBSN": 'https://cbsn-us-cedexis.cbsnstream.cbsnews.com/out/v1/55a8648e8f134e82a470f83d562deeca/master.m3u8',
    "TV4": 'https://lbs-aws-hls.tv4play.se/dailive/bbr-event1-p/master3404.m3u8',
    "Retro TV": 'https://bcovlive-a.akamaihd.net/5e531be3ed6c41229b2af2d9bffba88d/us-east-1/6183977686001/profile_1/chunklist.m3u8',
    "Canal 26": 'https://live-edge01.telecentro.net.ar/live/smil:c26.smil/playlist.m3u8'
}

const getIndex = name => playing.findIndex(s => s.name === name)

let playing, listen, dragging

document.addEventListener('alpine:init', () => {

    playing = Alpine.reactive([])
    listen = Alpine.reactive({})

    Alpine.data('listen', () => ({on: ''}))
    Alpine.data('streams', () => ({streams}))
    Alpine.data('playing', () => ({
            playing,
            replace(prev, next) {
                if (listen.on === prev)
                    listen.on = next
                new Video(next, getIndex(prev))
            }
        }))

    Alpine.magic('isPlaying', () => name => playing.find(s => s.name === name))
    Alpine.magic('listening', () => name => listen.on === name)
    Alpine.magic('size', () => {
        switch (true) {
            case (playing.length > 16):
                return "col-lg-2"
                break
            case (playing.length > 9):
                return "col-lg-3"
                break
            case (playing.length > 4):
                return "col-lg-4"
                break
            case (playing.length > 1):
                return "col-lg-6"
                break
            default:
                return "col-lg-12"
        }
    })
    Alpine.magic('stop', () => name => {
            if (listen.on === name)
                listen.on = ''
            playing[getIndex(name)].hls.destroy()
            playing.splice(getIndex(name), 1)
        })
})

class Video {
    constructor(name, index = '') {
        this.name = name
        this.src = streams[name]
        this.index = index
        this.mountVideo()
    }
    hls() {
        if (Hls.isSupported()) {
            let hls = new Hls()
            hls.loadSource(this.src)
            return hls
        }
    }
    mountVideo() {
        let object = {'name': this.name, 'hls': this.hls()}
        if (this.index !== '') {
            playing[this.index].hls.destroy()
            playing.splice(this.index, 1, object)
        } else
            playing.push(object)
    }
}