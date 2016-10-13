//Manage the samples
jviz.modules.coverviewer.prototype.samples = function(data)
{
  //Check the data object
  if(typeof data === 'undefined'){ return this._samples.names; }

  //Check for array
  if(jviz.is.array(data) === false){ data = [ data ]; }

  //Save the names
  this._samples.names = data;

  //Count the number of samples
  this._samples.count = data.length;

  //Initialize the active samples list
  this._samples.active = [];

  //Initialize the samples empty array
  this._samples.empty = jviz.array.zeros(data.length);

  //Calulate the background lines opacity
  this._bg.opacity = (this._samples.count === 0) ? 0 : 1 / this._samples.count;
};

//Draw the samples
jviz.modules.coverviewer.prototype.samplesDraw = function()
{
  //Check the active samples count
  if(this._samples.active.length === 0){ return; }

  //Get the draw zone
  var draw = this._canvas.draw();

  //Get the canvas layer
  var canvas = this._canvas.layer(this._samples.layer);

  //Clear the layer
  canvas.Clear();

  //Lines array
  var lines = [];

  //Initialize the array
  for(var j = 0; j < this._samples.active.length; j++){ lines[j] = []; }

  //Real position counter
  var p = draw.margin.left;

  //Read all the positions
  for(var i = this._draw.start; i < this._draw.end; i++)
  {
    //Get the cover array
    var cover = (typeof this._data.normalized[i] === 'undefined') ? this._samples.empty : this._data.normalized[i];

    //Draw the lines
    for(var j = 0; j < this._samples.active.length; j++)
    {
      //Get the index
      var index = this._samples.active[j];

      //Calculate the y position
      var py = this._height - draw.margin.bottom - cover[index];

      //Push
      lines[j].push([p, py]);
    }

    //Increment the counter
    p = p + 1;
  }

  //Draw all the lines
  for(var j = 0; j < this._samples.active.length; j++)
  {
    //Get the index
    var index = this._samples.active[j];

    //Draw the line
    canvas.Line(lines[j]);

    //Set the line style
    canvas.Stroke({ width: this._samples.line.width, color: this._colors[index] });
  }
};

//Clear the samples layer
jviz.modules.coverviewer.prototype.samplesClear = function()
{
  //Clear the samples layer
  this._canvas.layer(this._samples.layer).Clear();
};

//Display a sample
jviz.modules.coverviewer.prototype.showSample = function(index)
{
  //Check the index value
  if(index < 0 || this._samples.count <= index){ return jviz.console.error('Invalid sample index'); }

  //Activate the sample
  this._samples.active.push(index);

  //Draw the actual position
  this.draw();
};

//Hide a sample
jviz.modules.coverviewer.prototype.hideSample = function(index)
{
  //Desactivate the sample
  this._samples.active = jviz.array.remove(this._samples.active, index);

  //Clear the samples layer
  this.samplesClear();

  //Draw the actual positon
  this.draw();
};

//Check if sample is active
jviz.modules.coverviewer.prototype.isSample = function(n)
{
  //Get the index
  var index = this._samples.active.indexOf(n);

  //Return if sample is active
  return (index === -1) ? false : true;
};
