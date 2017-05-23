import React from 'react'
import { render } from 'react-dom'
import elasticsearch from 'elasticsearch'

let client = new elasticsearch.Client({
	host: 'localhost:9200',
	log: 'trace'
})

const App = React.createClass({
	getInitialState () {
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
