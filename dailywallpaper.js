const fetch = require('cross-fetch');
const fs=require('fs')
const {exec}=require('child_process')
const schedule = require('node-schedule')
const os=require('os')
const doSync=()=>{
    fetch("https://www.bing.com/HPImageArchive.aspx?&format=js&idx=0&mkt=en-US&n=1").then(res=>{
        return res.json()
    }).then(json=>{
        fetch("https://www.bing.com"+json.images[0].url).then(img=>{
            return img.arrayBuffer()
        }).then(buffer=>{
            fs.writeFileSync('daily_bing.jpg',Buffer.from(buffer))
            exec(`sudo gsettings set org.gnome.desktop.background picture-uri "file://${process.cwd()}/daily_bing.jpg"`,(error, stdout, stderr) => {
                console.log(error, stdout, stderr)
            })
        })
    })
}
if(os.platform()==='linux'){
    switch(process.arch){
        // case 'arm':exec(`export GIO_EXTRA_MODULES=/usr/lib/x86_64-linux-gnu/gio/modules/`)
        // case 'arm64':exec(`export GIO_EXTRA_MODULES=/usr/lib/x86_64-linux-gnu/gio/modules/`)
        // case 'x32':exec(`export GIO_EXTRA_MODULES=/usr/lib/x86_64-linux-gnu/gio/modules/`)
        case 'x64':
        case 'x32':exec(`export GIO_EXTRA_MODULES=/usr/lib/x86_64-linux-gnu/gio/modules/`);break;
    }
    
}
doSync()
schedule.scheduleJob('0 0 10 * * *', ()=>{
    doSync()
});