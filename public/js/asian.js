
const createDailyPriceObj = (data, symbol, callback) => {
    if (!data) return callback(err);
    let newData = [];

    newData.push({
        symbol: symbol,
        close: parseFloat(data["Global Quote"]["05. price"]).toFixed(2),
    });

    return callback(null, newData);
};

const getDaily = async () => {
    const symbols = ['TCEHY', '600519.SS', 'BABA', '601288.SS', '601857.SS'];
    let dataFetched = [];

    for (let i = 0; i < symbols.length; i++) {
        const symbol = symbols[i];

        await fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=6VWT72JNHHLBF3MH`)
            .then((response) => response.json())
            .then((data) => {
                createDailyPriceObj(data, symbol, (err, obj) => {
                    if (err) return console.error(err);

                    dataFetched.push(...obj);
                });
            });
    }

    console.log(dataFetched);

    document.getElementById('six').innerHTML += `<li> $${dataFetched[0].close}</li>`;
    document.getElementById('seven').innerHTML += `<li>  &#165;${dataFetched[1].close}</li>`;
    document.getElementById('eight').innerHTML += `<li> $${dataFetched[2].close}</li>`;
    document.getElementById('nine').innerHTML += `<li>  &#165;${dataFetched[3].close}</li>`;
    document.getElementById('ten').innerHTML += `<li>  &#165;${dataFetched[4].close}</li>`;

    return dataFetched;

};


//   India


const createDailyPriceObjj = (data, symbol, callback) => {
    if (!data) return callback(err);
    let newData = [];

    newData.push({
        symbol: symbol,
        close: parseFloat(data["Global Quote"]["05. price"]).toFixed(2),
    });

    return callback(null, newData);
};

const getDaily1 = async () => {
    const symbols = ['RELIANCE.BSE', 'TCS.BSE', 'HDFCBANK.BSE', 'ICICIBANK.BSE', 'HINDUNILVR.BSE', 'TM'];
    let dataFetched = [];

    for (let i = 0; i < symbols.length; i++) {
        const symbol = symbols[i];

        await fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=6VWT72JNHHLBF3MH`)
            .then((response) => response.json())
            .then((data) => {
                createDailyPriceObjj(data, symbol, (err, obj) => {
                    if (err) return console.error(err);
                    dataFetched.push(...obj);
                });
            });
    }

    console.log(dataFetched);


    document.getElementById('one').innerHTML += `<li> &#8377;${dataFetched[0].close}</li>`;
    document.getElementById('two').innerHTML += `<li> &#8377;${dataFetched[1].close}</li>`;
    document.getElementById('three').innerHTML += `<li> &#8377;${dataFetched[2].close}</li>`;
    document.getElementById('four').innerHTML += `<li> &#8377;${dataFetched[3].close}</li>`;
    document.getElementById('five').innerHTML += `<li> &#8377;${dataFetched[4].close}</li>`;





    return dataFetched;
};

// japan
const createDailyPriceObjjj = (data, symbol, callback) => {
    if (!data) return callback(err);
    let newData = [];

    newData.push({
        symbol: symbol,
        close: parseFloat(data["Global Quote"]["05. price"]).toFixed(2),
    });

    return callback(null, newData);
};



const getDaily2 = async () => {
    const symbols = ['TM', 'SONY', 'KYCCF', 'NPPXF', 'MUFG'];
    let dataFetched = [];

    for (let i = 0; i < symbols.length; i++) {
        const symbol = symbols[i];

        await fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=6VWT72JNHHLBF3MH`)
            .then((response) => response.json())
            .then((data) => {
                createDailyPriceObjjj(data, symbol, (err, obj) => {
                    if (err) return console.error(err);
                    dataFetched.push(...obj);
                });
            });
    }

    console.log(dataFetched);


    document.getElementById('eleven').innerHTML += `<li> $${dataFetched[0].close}</li>`;
    document.getElementById('twelve').innerHTML += `<li> $${dataFetched[1].close}</li>`;
    document.getElementById('thirteen').innerHTML += `<li> $${dataFetched[2].close}</li>`;
    document.getElementById('fourteen').innerHTML += `<li> $${dataFetched[3].close}</li>`;
    document.getElementById('fifteen').innerHTML += `<li> $${dataFetched[4].close}</li>`;


    return dataFetched;
};
