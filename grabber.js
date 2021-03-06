const fetch = require( 'node-fetch' );
require( 'dotenv' ).config();
const DateMaker = require( './date_maker' );

const { startTime, endTime } = DateMaker.getDayRangeNDaysAgo( 0 );
const baseUrl = `https://connect.squareup.com/v1/4X68FD52ZJ44J/payments?begin_time=${startTime}&end_time=${endTime}&limit=200`;


const getTxs = ( url, txs ) => fetch( url, {
  method: 'GET',
  headers: {
    authorization: process.env.TOKEN,
    'content-type': 'application/json',
  },
} )
  .then( response => Promise.all( [response.json(), response.headers] ) )
  .then( ( [currentTxs, headers] ) => {
    const linkHeader = headers.get( 'link' );
    if ( linkHeader ) {
      const link = linkHeader.substring( linkHeader.indexOf( '<' ) + 1, linkHeader.indexOf( '>' ) );
      return getTxs( link, txs.concat( currentTxs ) );
    }
    return txs.concat( currentTxs );
  } )

  .catch( ( err ) => {
    console.log( err );
  } );

const getTxTotals = txs => txs.reduce( ( prev, curr ) => prev + curr.gross_sales_money.amount, 0 );

getTxs( baseUrl, [] ).then( ( txs ) => {
  console.log( getTxTotals( txs ) / 100 );
} ).catch( ( err ) => {
  console.log( err );
} );

