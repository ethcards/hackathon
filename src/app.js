import React from 'react'
import { render } from 'react-dom'
import elasticsearch from 'elasticsearch'
import Web3 from 'web3'
const Eth = require('ethjs-query')
const EthContract = require('ethjs-contract')

const abi = [{"constant":true,"inputs":[],"name":"endBlock","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"logos","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_owner","type":"address"},{"name":"_author","type":"address"},{"name":"_metadatUrl","type":"string"}],"name":"registLogo","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"claimWinner","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"startBlock","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"votePerETH","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"_logoAddress","type":"address"}],"name":"isLogo","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"withdrawDonates","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"vote","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"emergencyStop","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_amount","type":"uint256"}],"name":"sendToFaucet","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"totalReward","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"stopped","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"release","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_receiver","type":"address"}],"name":"claimReward","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"faucet","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"winner","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"type":"function"},{"inputs":[],"payable":false,"type":"constructor"},{"payable":true,"type":"fallback"},{"anonymous":false,"inputs":[{"indexed":false,"name":"addr","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"ReceiveDonate","type":"event"}]

const address = '0xef55bfac4228981e850936aaf042951f7b146e41'
function initContract (contract) {
  const MiniToken = contract(abi)
  const miniToken = MiniToken.at(address)
 console.log(miniToken)
}

function startApp(web3) {
  const eth = new Eth(web3.currentProvider)
  const contract = new EthContract(eth)
  initContract(contract)
conosle.log(contract)
}

let client = new elasticsearch.Client({
	host: 'localhost:9200',
	log: 'trace'
})


const App = React.createClass({
	getInitialState () {
if (typeof web3 !== 'undefined') {
    web3 = new Web3(web3.currentProvider);
} else {
    // set the provider you want from Web3.providers
    web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
}

startApp(web3);
		return {
			results: []
		}
	},
	handleChange ( event ) {
		const search_query = event.target.value

		client.search({
			q: search_query
		}).then(function ( body ) {
			this.setState({ results: body.hits.hits })
		}.bind(this), function ( error ) {
			console.trace( error.message );
		});
	},
	render () {
		return (
			<div className="container">
				<input type="text" onChange={ this.handleChange } />
				<SearchResults results={ this.state.results } />
			</div>
		)
	}
})

const SearchResults = React.createClass({
	propTypes: {
		results: React.PropTypes.array
	},
	getDefaultProps () {
		return { results: [] }
	},
	render () {
		return (
			<div className="search_results">
				<hr />
				<ul>
				{ this.props.results.map((result) => {
					return <img src={result._source.user.profile_image_url_https} alt='user image' width='42' height='42'/>  }) }
				</ul>
			</div>
		)
	}
})


render( <App />, document.getElementById( 'main' ) )
