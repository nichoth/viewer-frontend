var Bus = require('@nichoth/events')
var observ = require('observ')
var struct = require('observ-struct')
import { html } from 'htm/preact'
import Observable from 'observ'
var route = require('route-event')()
var evs = require('./EVENTS')

module.exports = function Loop () {
    var state = State()
    var bus = Bus({ memo: true })
    Subscribe(bus, state)

    // this gets called immediately
    route(function onChange (path) {
        bus.emit(evs.route.change, path)
    })

    function loop ({ children, state }) {
        console.log('render', state)
        return html`<div class="planetary">
            ${children}
        </div>`
    }

    return { bus, state, loop, setRoute: route.setRoute }
}

function State () {
    return struct({
        routePath: observ(null),
        profiles: observ(null),
        content: struct({
            username: observ(null),
            data: observ(null),
            hashtag: observ(null)
        })
    })
}

function Subscribe (bus, state) {
    bus.on(evs.route.change, newRoute => {
        if (newRoute === state().routePath) return
        state.routePath.set(newRoute)
    })
}
