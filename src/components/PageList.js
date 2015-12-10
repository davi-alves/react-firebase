import React from 'react';
import {Link} from 'react-router';

import * as API from '../api';

export default class PageList extends React.Component {

  state = {
    loaded: false,
    pages: {},
    newPageTitle: ''
  }

  constructor(props, context) {
    super(props, context);

    this.context = context;
  }

  update = (ev) => this.setState({newPageTitle: ev.target.value});

  createPage = (ev) => {
    if (ev.charCode !== 13) {
      return;
    }

    // the push will automatically save the object as a new entity to the Firebase database
    var id = API.pages.push({title: this.state.newPageTitle});
    this.context.router.transitionTo('page', {id: id.key()});
    this.setState({newPageTitle: ''});
  }

  render() {
    let items = this.state.loaded ?
      Object.keys(this.state.pages)
        .map((id) => <li key={id}><Link to="page" params={ {id: id} }>{this.state.pages[id].title}</Link></li>) :
      [<li key="loading"><em>Loading</em></li>];

    return (
      <div>
        {this.props.user ?
            <input className="u-full-width" placeholder="New Page Title" type="text"
              value={this.state.newPageTitle}
              onChange={this.update}
              onKeyPress={this.createPage} /> : null}
              <ul>{items}</ul>
      </div>
    );
  }

  componentDidMount() {
    API.pages.on('value', (snapshot) => this.setState({
      pages: snapshot.exportVal() || [],
      loaded: true
    }))
  }
};

PageList.contextTypes = {
  router: React.PropTypes.func.isRequired
};
