import React, {Component} from 'react';
import ReactHtmlParser from 'react-html-parser';

class RichTextOutput extends Component {
  render () {
		const styleCommon = {
			backgroundColor: "transparent",
			color: '#000',
			fontSize: "12px",
			margin: "16px",
			lineHeight: "1.6em",
		};

		const styleEng = {
			...styleCommon,
			fontFamily: "Helvetica, sans-serif",
		};

		const styleChn = {
			...styleCommon,
			fontFamily: "arial-unicode-ms",
		};

    return (
      <div
				style={this.props.lang === 'eng' ? styleEng : styleChn}
      >
				{ ReactHtmlParser(this.props.body) }
      </div>
    );
  }
}
export { RichTextOutput };
