const addMoreRoutes = (app) => {
    app.get('/dummyroute', (req, res) => res.send('dummy route'))

    app.get('/onemoreroute', (req, res) => res.send('another one'))

    addMoreRoutes1(app)
    addMoreRoutes2(app)
    addMoreRoutes3(app)
}

const addMoreRoutes1 = (app) => {
    app.get('/dummyroute1', (req, res) => res.send('dummy route'))

    app.get('/onemoreroute1', (req, res) => res.send('another one'))
}

const addMoreRoutes2 = (app) => {
    app.get('/dummyroute2', (req, res) => res.send('dummy route'))

    app.get('/onemoreroute2', (req, res) => res.send('another one'))
}

const addMoreRoutes3 = (app) => {
    app.get('/dummyroute3', (req, res) => res.send('dummy route'))

    app.get('/onemoreroute3', (req, res) => res.send('another one'))
}

const startPolling1 = (pollBalance) => {
    const conditionFn = d => false; //keep polling
    /** Poll every 5 seconds */
    //const interval = 5e3;

    //const timeout = 30e9; //find a way to poll forever

    asyncPoll(pollBalance, conditionFn, { interval: 5e3, timeout: 30e9 })
        .then(console.log)
        .catch(console.error);
}

module.exports.addMoreRoutes = addMoreRoutes
module.exports.addMoreRoutes1 = addMoreRoutes1
module.exports.addMoreRoutes2 = addMoreRoutes2
module.exports.addMoreRoutes3 = addMoreRoutes3