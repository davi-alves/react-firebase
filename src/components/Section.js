import React from 'react';
import {markdown} from 'markdown';

import * as API from '../api';

export default class Section extends React.Component {

  constructor (props, context) {
    super(props, context);
    this.context = context;
    this.state = this.getState(props);
  }

  getState = (props) => ({
    locked: props.user && props.section.editor && props.user.username !== props.section.editor,
    editing: props.user && props.user.username === props.section.editor,
    content: props.section.content,
    html: props.section.content ? markdown.toHTML(props.section.content) : ''
  })

  startEditing = (evt) => {
    if (evt.target.tagName === 'A') {
      var href = evt.target.getAttribute('href');
      if (href.indexOf('/page/') === 0) {
        this.context.router.transitionTo(href);
        return evt.preventDefault();
      }
      return;
    }

    if (!this.props.user || this.state.editing || this.state.locked) {
      return;
    }

    this.setState({ editing: true });
    API.pages.child(this.props.path).update({
      editor: this.props.user.username
    });
  }

  updateContent = (ev) => this.setState({content: ev.target.value});

  save = (ev) => {
    this.setState({editing: false});

    API.pages.child(this.props.path).update({
      editor: null,
      content: this.state.content || null
    });
  }

  makeLinks(html, callback) {
    const anchor = /\[\[(.*)\]\]/g;

    API.pages.once('value', (snapshot) => {
      let pages = snapshot.exportVal();
      let keys = Object.keys(pages);

      callback(html.replace(anchor, (match, anchorText) => {
        for (let key of keys) {
          if (pages[key].title === anchorText.trim()) {
            return `<a href="/page/${key}">${anchorText}</a>`;
          }
        }
      }));
    })
  }

  componentWillReceiveProps(nextProps) {
    let state = this.getState(nextProps);
    this.makeLinks(state.html, (html) => {
      state.html = html;
      this.setState(state);
    });
  }

  render() {
    let content;
    let classes = ['row', 'section'];

    if (this.props.user) {
      classes.push(this.state.locked ? 'locked' : 'editable');
    }

    if (this.state.editing) {
      classes.push('editing');
      content = <textarea className="twelve columns" ref="editor"
        defaultValue={this.state.content} onChange={this.updateContent}
        onBlur={this.save}></textarea>
    } else {
      content = <span dangerouslySetInnerHTML={{__html: this.state.html}}/>;
    }

    return (
      <section onClick={this.startEditing}className={classes.join(' ')}>{content}</section>
    );
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.editing) {
      React.findDOMNode(this.refs.editor).focus();
    }
  }

  componentDidMount() {
    this.componentWillReceiveProps(this.props);
  }
};

Section.contextTypes = {
  router: React.PropTypes.func.isRequired
};
