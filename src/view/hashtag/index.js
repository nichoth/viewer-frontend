import { html } from 'htm/preact'
var _ = {
    find: require('lodash.find')
}
var { PUB_URL } = require('../../CONSTANTS')
if (process.env.NODE_ENV === 'test') {
    PUB_URL = 'http://0.0.0.0:8888'
}
var HeadPart = require('../head-part')
var MsgList = require('../msg-list')
var Sidebar = require('../sidebar')

function Hashtags (props) {
    if (!props.hashtag.feed) return null

    console.log('hashtags', props)

    return html`
        <${HeadPart} />

        <div class="hashtag-wrapper">
            <${MsgList} msgs=${props.hashtag.feed} />
            <${Sidebar} ...${props} />
        </div>
    `
}

module.exports = Hashtags
