const addMoreRoutes = (app) => {
    app.get('/dummyroute', (req, res) => res.send('dummy route'))

    app.get('/onemoreroute', (req, res) => res.send('another one'))
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