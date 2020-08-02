import * as React from "react";
import MatrixCell from "./MatrixCell";

class Matrix extends React.Component {
   constructor(props) {
      super(props);

      this.state = {
         x: -1,
         y: -1,
         caret: 0,
         columns: this.props.columns
      };

      this.style = {
         overflow: "hidden",
         display: "inline-block",
         borderLeft: "2px solid #333",
         borderRight: "2px solid #333",
         padding: "0 2px",
         borderRadius: "4px"
      };
   }

   getHeight() {
      return this.state.columns[0].length;
   }

   getWidth() {
      return this.state.columns.length;
   }

   getCellValue(x, y) {
      if (x < 0 || y < 0 || x > this.getWidth() - 1 || y > this.getHeight() - 1) return "";
      return this.state.columns[x][y];
   }

   setCellValue(x, y, val) {
      let columns = this.state.columns;
      columns[x][y] = val;
      this.setState({
         columns: columns
      });
   }

   componentDidMount() {
      console.log(this.props.columns);
   }

   getColumn(n) {
      return this.state.columns[n];
   }

   setColumn(n, values) {
      let columns = this.state.columns;
      columns[n] = values;
      this.setState({ columns: columns });
   }

   getColumns() {
      return this.state.columns;
   }

   getRow(n) {
      let row = new Array(this.getWidth());
      let columns = this.state.columns;
      for (let i = 0; i < columns.length; i++) {
         row[i] = columns[i][n];
      }

      return row;
   }

   setRow(n, values) {
      let columns = this.state.columns;
      for (let i = 0; i < values.length; i++) {
         columns[i][n] = values[i];
      }

      this.setState({ columns: columns });
   }

   getRows() {
      let rows = new Array(this.getHeight());
      for (let i = 0; i < this.getHeight(); i++) {
         rows[i] = this.getRow(i);
      }
      ;

      return rows;
   }

   isResizeableX() {
      let resize = this.props.resize;
      return (!this.props.readonly && (resize === "horizontal" || resize === "both" || resize === undefined));
   }

   isResizeableY() {
      let resize = this.props.resize;
      return (!this.props.readonly && (resize === "vertical" || resize === "both" || resize === undefined));
   }

   setCell(caret, cellX, cellY) {
      // Remove columns / rows if needed
      this.truncate(cellX, cellY);

      this.setState({
         caret: caret,
         x: cellX,
         y: cellY
      });
   }

   moveCell(dx, dy) {
      let cellX = this.state.x;
      let caretPos;

      if (this.state.caret + dx > ("" + this.getCellValue(cellX, this.state.y)).length) {
         cellX++;
         caretPos = 0; // First pos in next cell
      } else if (this.state.caret + dx < 0) {
         cellX--;
         caretPos = ("" + this.getCellValue(cellX, this.state.y)).length;
      } else {
         caretPos = this.state.caret + dx;
      }
      let cellY = this.state.y + dy;

      // Negative position is not allowed
      if (cellX < 0) return;
      if (cellY < 0) return;

      // If outside bounds and resizing is disabled
      if (!this.isResizeableX() && cellX >= this.getWidth()) cellX = this.state.x;
      if (!this.isResizeableY() && cellY >= this.getHeight()) cellY = this.state.y;

      // Remove columns / rows if needed
      this.truncate(cellX, cellY);

      // Add column / row if needed
      if (cellX >= this.getWidth() && this.isResizeableX()) {
         this.addColumn();
      }
      if (this.state.y + dy >= this.getHeight() && this.isResizeableY()) {
         this.addRow();
      }

      this.setState({
         caret: caretPos,
         x: cellX,
         y: cellY
      });
   }

   addRow() {
      let columns = this.state.columns;
      for (let i = 0; i < columns.length; i++) {
         columns[i].push("");
      }
      this.setState({
         height: this.getHeight() + 1,
         columns: columns
      });
   }

   addColumn() {
      let columns = this.state.columns;
      let newColumn = new Array(this.getHeight());
      for (let i = 0; i < newColumn.length; i++) {
         newColumn[i] = "";
      }
      columns.push(newColumn);

      this.setState({
         width: this.state.width + 1,
         columns: columns
      });
   }

   isRowEmpty(row) {
      for (let i = 0; i < this.state.columns.length; i++) {
         let col = this.state.columns[i];
         if (("" + col[col.length - 1]).length > 0) {
            return false;
         }
      }
      return true;
   }

   isColumnEmpty(col) {
      let column = this.state.columns[col];
      for (let i = 0; i < column.length; i++) {
         if (("" + column[i]).length > 0) return false;
      }
      return true;
   }

   removeRow(row) {
      for (let i = 0; i < this.state.columns.length; i++) {
         this.state.columns[i].splice(row, 1);
      }
      this.setState({
         columns: this.state.columns
      });
   }

   removeColumn(col) {
      this.state.columns.splice(col, 1);
      this.setState({
         columns: this.state.columns
      });
   }

   truncate(cellX, cellY) {
      for (let x = this.getWidth() - 1; x > cellX; x--) {
         if (this.isColumnEmpty(x) && this.isResizeableX()) this.removeColumn(x);
      }
      for (let y = this.getHeight() - 1; y > cellY; y--) {
         if (this.isRowEmpty(y) && this.isResizeableY()) this.removeRow(y);
      }
   }

   render() {
      let activeCell = this.state.x * this.getHeight() + this.state.y;
      let currentCell = 0;

      let columns = this.state.columns.map(function(columnValues, x) {
         let y = 0;
         let column = columnValues.map(function(value, y) {
            let active = currentCell === activeCell;
            let cell = <MatrixCell key={x + "-" + y} value={value} matrix={this} x={x} y={y} active={active}
                                   readonly={this.props.readonly}/>;
            currentCell++;
            return cell;
         }, this);

         let columnStyle = {
            float: "left",
            padding: "2px"
         };

         return <div key={x} style={columnStyle}>{column}</div>;

      }, this);
      return (
         <div style={this.style}>
            {columns}
         </div>
      );
   }
}

export default Matrix;