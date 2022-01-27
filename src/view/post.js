import { html } from 'htm/preact'
import { useState } from 'preact/hooks';
import Markdown from 'preact-markdown'
const moment = require('moment');
const remark = require('remark')
import cidToUrl from 'remark-image-cid-to-url/browser'
import remarkParse from 'remark-parse'
var ref = require('ssb-ref')
var linkifyRegex = require('@planetary-ssb/remark-linkify-regex')
var Blob = require('./blob')
var PostMenu = require('./post-menu')
var { PUB_URL } = require('../CONSTANTS')

function isThread (post) {
    return Array.isArray(post)
}

const linkifyHashtags = linkifyRegex(/#[\w-]+/g, node => {
    return '/tag/' + node.substring(1)
})

function CopyButton (props) {
    const { value, copied, onCopy } = props

    function copy (ev) {
        ev.preventDefault()
        console.log('copy', value)
        onCopy(value)
    }

    return html` <button title="copy user ID" onclick=${copy}
        class="icon-btn copy${copied === value ? ' has-copied' : ''}"
        aria-label="Copy to clipboard"
    >
        <i aria-hidden="true" class="far fa-copy"></i>
    </button>`
}


function Post (props) {
    const _post = props.post
    const post = isThread(_post) ? _post[0] : _post
    var { mentions } = post.value.content
    var hasImages = !!((mentions || []).filter(m => {
        return ref.isBlob(m.link)
    })[0])

    var [options, setOptions] = useState(false)

    var { profiles, username, onCopy, copied } = props

    var profile = (profiles || {})[post.value.author]
    var authorName = (profile || {}).name || username

    function openOptions (ev) {
        ev.preventDefault()
        console.log('options')
        setOptions(true)
    }

    function closeModal (ev) {
        ev.preventDefault()
        setOptions(false)
    }

    return html`<li class="post ${isThread(_post) ? 'is-thread' : ''}">

        ${options ?
            html`<${PostMenu} onCloseModal=${closeModal} msg=${post} />` :
            null
        }

        <header class="post_head">
            <div class="post_signature">
                <a href="#" class="post_author has_stories">
                    <${Blob} blob=${({ link: ((profile || {}).image) })} />
                </a>

                <span class="post_author_name pro_user">
                    <a href="/feed/${authorName}" class="post_author_name pro_user">
                        ${authorName}
                    </a>

                    <${CopyButton} value=${post.value.author}
                        copied=${copied}
                        onCopy=${onCopy}
                    />

                    ${
                        post.value.author === copied ?
                            html`<span>copied!</span>` :
                            null
                    }
                </span>

            </div>

            <div class="post_meta">
                <span class="post_timestamp">
                    ${moment(post.value.timestamp)
                        .format("dddd, MMMM Do YYYY, h:mm:ss a")
                    }
                </span>
            </div>

            <button class="post_options" onclick=${openOptions}></button>
        </header>

        ${mentions && mentions[0] && hasImages ?
            html`<div class="image-carousel">
                ${mentions.map(blob => {
                    return ref.isBlob(blob.link) ?
                        html`<img src=${PUB_URL + '/blob/' +
                            encodeURIComponent(blob.link)}
                        />` :
                        null
                })}
            </div>` :
            null
        }

        ${post.value.content.text ?
            html`<${Markdown} markdown=${
                remark()
                    .use(linkifyHashtags)
                    .use(cidToUrl(blobId => {
                        return (PUB_URL + '/blob/' +
                            encodeURIComponent(blobId))
                    }))
                    .use(remarkParse, { commonmark: true })
                    .processSync(post.value.content.text).contents
                }
            />` :
            null
        }

        <footer class="post_reactions">
            <div class="post_actions">
                <ul class="action_buttons">
                    <li class="action_button action_button--share">
                        <a href="#">Share</a>
                    </li>
                </ul>
            </div>

            <ul class="post_comments">
                <li class="post_comment">
                    <header class="comment_author">
                        <a href="#" class="comment_author_name pro_user">Maven</a>
                    </header>
                    <main class="comment_body">
                        <p class="comment_text">Hey! That's me by the <a href="#" class="text_link">DJ booth</a> :P Can't believe we had such a fun night dancing our minds to the best industrial techno in Europe 🎆</p>
                    </main>
                    <footer class="comment_timestamp">Tuesday at 5:16pm</footer>
                </li>
            </ul>

            <a href="#" class="comment_prompt">
                <span class="comment_signup text_link">Sign up</span>
                to leave a comment
            </a>
        </footer>
    </li>`
}

module.exports = Post
