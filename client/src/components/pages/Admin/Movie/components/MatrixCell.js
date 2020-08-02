import * as React from "react";

class MatrixCell extends React.Component {
   constructor(props) {
      super(props);

      this.activeStyle = {
         border: '1px solid #000',
         display: 'block',
         margin: '4px 0',
         padding: '4px',
         width: '30px',
         textAlign: 'center'
      };

      this.defaultStyle = {
         border: '1px solid #eee',
         display: 'block',
         margin: '4px 0',
         padding: '4px',
         width: '30px',
         textAlign: 'center'
      }
   }

   onChange(e) {
      let oldVal = this.props.value;
      let val = e.target.value;
      let diffLen = (''+val).length - (''+oldVal).length;
      this.props.matrix.setCellValue(this.props.x, this.props.y, val);
      this.setState({value: val});
      this.props.matrix.moveCell(diffLen, 0)
   }

   onClick(e) {
      this.props.matrix.setCell(e.target.selectionStart, this.props.x, this.props.y)
   }

   onKeyUp(e) {
      let dy = 0;
      let dx = 0;
      switch(e.key) {
         case "ArrowUp":
            dy = -1;
            break;
         case "ArrowRight":
            dx = 1;
            break;
         case "ArrowDown":
            dy = 1;
            break;
         case "ArrowLeft":
            dx = -1;
            break;
      }

      this.props.matrix.moveCell(dx, dy);
   }

   render() {
      let style = this.defaultStyle;
      if(this.props.active) style = this.activeStyle;
      return (
         <input ref="input" type="text" style={style} value={this.props.value} readOnly={this.props.readonly}
                onClick={this.onClick.bind(this)}
                onKeyUp={this.onKeyUp.bind(this)}
                onChange={this.onChange.bind(this)} />
      );
   }
}

export default MatrixCell;