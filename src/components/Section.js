import React from 'react';
import {markdown} from 'markdown';

import * as API from '../api';

export default class Section extends React.Component {

  constructor(props) {
    super(props);

    this.state = this.getState(props);
  }

  getState = (props) => ({
    editing: props.user && props.user.username === props.section.editor,
    content: props.section.content,
    html: props.section.content ? markdown.toHTML(props.section.content) : ''
  })

  startEditing = (ev) => {
    if (!this.props.user || this.state.editing) {
      return;
    }

    this.setState({editing: true});
    API.pages.child(this.props.path).update({editor: this.props.user.username});
  }

  updateContent = (ev) => this.setState({content: ev.target.value});

  save = (ev) => {
    this.setState({editing: false});

    API.pages.child(this.props.path).update({
      editor: null,
      content: this.state.content || null
    });
  }

  componentWillReceiveProps(nextProps) {
    this.setState(this.getState(nextProps));
  }

  render() {
    let content;
    let classes = ['row', 'section'];

    if (this.props.user) {
      classes.push('editable');
    }

    if (this.state.editing) {
      classes.push('editing');
      content = <textarea className="twelve columns" defaultValue={this.state.content}
        onChange={this.updateContent} onBlur={this.save}></textarea>
    } else {
      content = <span dangerouslySetInnerHTML={{__html: this.state.html}}/>;
    }

    return (
      <section onClick={this.startEditing}className={classes.join(' ')}>{content}</section>
    );
  }
};
