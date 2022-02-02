import { html } from 'htm/preact'
import { useEffect } from 'preact/hooks'
const _ = {
    get: require('lodash.get')
}

function PostMenu ({ msg, onCloseModal }) {
    function copy (key, ev) {
        ev.preventDefault()
        if (key === 'link') {
            var { host, protocol } = window.location
            var msgLink = protocol + '//' + host + '/' +
                encodeURIComponent(msg.key)
            navigator.clipboard.writeText(msgLink)
                .catch(err => console.log('err', err))

            return onCloseModal()
        }

        var val = _.get(msg, key)
        navigator.clipboard.writeText(val)
            .catch(err => {
                console.log('oh no', err)
            })

        onCloseModal()
    }

    // Similar to componentDidMount and componentDidUpdate:
    useEffect(() => {
        function onClick (ev) {
            onCloseModal()
        }

        document.addEventListener('click', onClick)

        return () => document.removeEventListener('click', onClick)
    }, [])

    return html`<div class="modal-options">
        <button class="icon-btn options-close" onclick=${onCloseModal}
            aria-label="Close window"
        >
            <i aria-hidden="true" class="fas fa-times"></i>
        </button>

        <ul>
            <li>
                <button class="opt-btn" aria-label="Copy message ID"
                    onclick=${copy.bind(null, 'key')}
                >
                    <i aria-hidden="true" class="fas fa-percent"></i>
                    Copy message ID
                </button>
            </li>
            <li>
                <button class="opt-btn" aria-label="Copy message text"
                    onclick=${copy.bind(null, 'value.content.text')}
                >
                    <i aria-hidden="true" class="fas fa-book"></i>
                    Copy message text
                </button>
            </li>
            <li>
                <button class="opt-btn" aria-label="Copy link to message"
                    onclick=${copy.bind(null, 'link')}
                >
                    <i aria-hidden="true" class="fas fa-link"></i>
                    Copy link to message
                </button>
            </li>
        </ul>
    </div>`
}

module.exports = PostMenu
