const fetch = require( 'node-fetch' );
require( 'dotenv' ).config();
const DateMaker = require( './date_maker' );

const testStart = '2020-05-01T00%3A00%3A00-08%3A00';
const testend = '2020-05-24T23%3A59%3A59-08%3A00';
const { startTime, endTime } = DateMaker.getWeekRangeNWeeksAgo( 1 );


const getTxs = ( token, txs ) => {
  let url = `https://connect.squareup.com/v1/4X68FD52ZJ44J/payments?begin_time=${testStart}&end_time=${testend}&limit=200`;
  if ( token ) url += `&batch_token=${token}`;
  return fetch( url, {
    method: 'GET',
    headers: {
      authorization: process.env.TOKEN,
      'content-type': 'application/json',
    },
  } )
    .then( ( response ) => {
      const { headers } = response;
      return Promise.all( [response.json(), response.headers] );
    } )
    .then( ( [currentTxs, headers] ) => {
      console.log( currentTxs.length );
    } )

    .catch( ( err ) => {
      console.log( err );
    } );
};

getTxs( null, [] );

