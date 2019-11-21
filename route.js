const express = require('express')
const uuid = require('uuid')
const moment = require('moment')
const fs = require('file-system')
const router = express.Router()
let videos = require('./data/videos')
const users = require('./data/user')
const categories = require('./data/category')
const v_categories = require('./data/video_category')

router.get('/', (req,res) => {
    res.json(videos.map(video => ({
        ...video,
        user: users.find(user => user.id == video.user_id),
        // categories: v_categories.filter(v_c => video.id == v_c.video_id).map(item => categories.find(category => category.id == item.category_id))
        categories: categories.find(category => category.id == video.category_id)
    })))
})

router.get('/:id', (req,res) =>{
    const video = videos.find(video => video.id == req.params.id);
    if(video) return res.json(video);
    res.status(404).json({mes: `No video with id of ${req.params.id}`})
})

router.post('/', (req, res) =>{
    const {video_name, descriptions, user_id} = req.body
    if (!video_name) return res.status(400).json({msg: 'Please insert video name!'})
    console.log(uuid.v4())
    const new_video = {
        id: uuid.v4(),
        video_name,
        descriptions,
        pub_date: moment().format('LLLL'),
        user_id,
    }

    videos.push(new_video)
    res.json(new_video)
    let data = JSON.stringify(videos) 
    fs.writeFile('data/videos.js', `const videos = ${data} \n module.exports = videos`, (err) => { 
        if (err) throw err; 
    }) 
})

router.put('/:id', (req, res) => {
    const {video_name, descriptions} = req.body
    if (!video_name) return res.status(400).json({msg: 'Please insert video name!'})

    for(const video of videos) {
        if (video.id == req.params.id) {
            video.video_name = video_name || video.video_name;
            video.descriptions = descriptions || video.descriptions;
            video.updated_at = moment().format('LLLL')
            return res.json(video)
        }
    }
    res.status(404).json({mes: `No video with id of ${req.params.id}`})
})

router.delete('/:id', (req, res) => {
    videos = videos.filter(video => video.id != req.params.id)
    res.status(200).json({msg: `delete successfully`})
    let data = JSON.stringify(videos) 
    fs.writeFile('data/videos.js', `const videos = ${data} \n module.exports = videos`, (err) => { 
        if (err) throw err; 
    }) 
})

module.exports = router