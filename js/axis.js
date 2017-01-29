//Draw the axis
jviz.modules.coverviewer.prototype.axisDraw = function()
{
  //Get the draw zone
  var draw = this._canvas.el.draw();

  //Get the canvas layer
  var canvas = this._canvas.el.layer(this._axis.layer);

  //Clear the layer
  canvas.Clear();

  //Calculate the axis values
  this.axisValues();

  //Initialize the axis points
  var lines = [];

  //Add the first point
  lines.push([ draw.margin.left, draw.margin.top ]);

  //Add the second point
  lines.push([ draw.margin.left, draw.margin.top + draw.height ]);

  //Add the last point
  lines.push([ draw.margin.left + draw.width, draw.margin.top + draw.height ]);

  //Draw the lines
  canvas.Line(lines);

  //Set the line style
  canvas.Stroke({ width: this._axis.lines.width, color: this._axis.lines.color, opacity: this._axis.lines.opacity });

  //Read all the axis values
  for(var i = 0; i < this._axis.values.length; i++)
  {
    //Get the value
    var value = this._axis.values[i];

    //Get the value position x
    var pos_x = draw.margin.left;

    //Get the value position y
    var pos_y = draw.margin.top + draw.height - draw.height * (value / this._cover.max);

    //Set the line dash
    canvas.ctx.setLineDash([10, 10]);

    //Draw the line
    canvas.Line([[pos_x, pos_y], [pos_x + draw.width, pos_y]]);

    //Set the line stroke
    canvas.Stroke({ width: this._axis.lines.width, color: this._axis.lines.color, opacity: this._axis.lines.opacity });

    //Text values
    var text = { text: jviz.math.format(value), x: pos_x - this._axis.text.margin.left, y: pos_y - this._axis.text.margin.top };

    //Draw the text
    canvas.Text(Object.assign(text, this._axis.text)); 
  }

  //Disable draw axis again
  this._axis.draw = false;

  //Return this
  return this;
};

//Calculate the axis values
jviz.modules.coverviewer.prototype.axisValues = function()
{
  //Reset the values
  this._axis.values = [];

  //Get the number of digits v
  var num = jviz.math.digits(parseInt(this._cover.max));

  //Get the incremental values
  var increment = Math.pow(10, num - 1);

  //Check the increment
  if((this._cover.max / increment) > 5){ increment = increment * 2; }

  //Counter
  var i = 1;

  //Add the values
  while(increment * i < this._cover.max)
  {
    //Add the value
    this._axis.values.push(increment * i);

    //Increment the i counter
    i = i + 1;
  }

  //Continue
  return this;
};
