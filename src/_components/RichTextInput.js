import React, {Component} from 'react';
import PropTypes from 'prop-types';
import RichTextEditor from 'react-rte';
import './style.css';

class RichTextInput extends Component {
  static propTypes = {
    onChange: PropTypes.func
  };


  state = {
    //value: RichTextEditor.createEmptyValue()
		value: RichTextEditor.createValueFromString((this.props.record.body || ""), 'html')
  }

  onChange = (value) => {
    this.setState({value});
    if (this.props.onChange) {
      // Send the changes up to the parent component as an HTML string.
      // This is here to demonstrate using `.toString()` but in a real app it
      // would be better to avoid generating a string on each change.
      this.props.onChange(
        value.toString('html')
      );
    }
  };

  render () {
    return (
      <RichTextEditor
        value={this.state.value}
        onChange={this.onChange}
        editorClassName="rich-text-input"
        readOnly={ this.props.disabled }
      />
    );
  }
}
export default RichTextInput;
