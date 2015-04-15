/**
 * Maps the spreadsheet cells into a dataframe, consisting of an array of rows (i.e. a 2d array).
 * The selectedCol arg selects which column in the spreadsheet to map into an array.
 */
function mapEntries(json, selectedCol){
  var dataframe = new Array();
  
  var row = new Array();
  //column length
  for (var i=0; i < json.feed.entry.length; i++) {
    //select entry
    var entry = json.feed.entry[i];
    if (entry.gs$cell.col == '1') {
        row.push(parseFloat(entry.content.$t));
    }

    if (entry.gs$cell.col == selectedCol) {
      row.push(parseFloat(entry.content.$t));
      dataframe.push(row);
      var row = new Array();
    }  
    } 
  
  return dataframe;
}