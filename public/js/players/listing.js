// Make concurrent requests to grab all player's rankings
// TODO use a single route to grab all player's rankings
axios.all([
    axios.get('/api/players/nick/rankings'),
    axios.get('/api/players/ira/rankings'),
    axios.get('/api/players/john/rankings'),
])
    .then(axios.spread((nickRes, iraRes, johnRes) => {
        const nickRankings = nickRes.data
            , iraRankings = iraRes.data
            , johnRankings = johnRes.data;

        // Create a gameIds array to use it as the x-axis
        const gameIds = nickRankings.map(ranking => ranking.gameId);
        const dates = nickRankings.map(ranking => ranking.date);

        // Assure that all rankings are pushed in the array in the same order (i.e correspond to the same game)
        const nickData = []
            , iraData = []
            , johnData = [];

        for (let gameId of gameIds) {
            nickData.push(nickRankings.filter(ranking => ranking.gameId === gameId)[0].rank);
            iraData.push(iraRankings.filter(ranking => ranking.gameId === gameId)[0].rank);
            johnData.push(johnRankings.filter(ranking => ranking.gameId === gameId)[0].rank);
        }

        // Create the graph data TODO make it more dynamic
        const dataSets = [{
            label: 'nick',
            data: nickData,
            fill: false,
            borderColor: "#3e95cd",
            backgroundColor: "#3e95cd",
        }, {
            label: 'john',
            data: johnData,
            fill: false,
            borderColor: "#3cba9f",
            backgroundColor: "#3cba9f",
        }, {
            label: 'ira',
            data: iraData,
            fill: false,
            borderColor: "#c45850",
            backgroundColor: "#c45850",
        }];

        // Create the graph options TODO make it more dynamic
        const options = {
            responsive: true,
            title: {
                display: true,
                text: 'Players Rankings'
            },
            legend: {
                display: true
            },
            scales: {
                xAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Game ids'
                    }
                }],
                yAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Final position'
                    },
                    ticks: {
                        reverse: true,
                        stepSize: 1,
                    },
                }]
            }
        };

        drawLineGraph(dates, dataSets, options)

    }))
    .catch(error => console.log(error));

/**
 * Creates a line graph
 * @param xAxis
 * @param dataSets
 * @param options
 */
const drawLineGraph = (xAxis, dataSets, options) => {
    const ctx = document.getElementById('myChart').getContext('2d');
    const myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: xAxis,
            datasets: dataSets
        },
        options: options
    });
};
