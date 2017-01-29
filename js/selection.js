//Add a selection
jviz.modules.coverviewer.prototype.selection = function(start, end)
{
  //Update the selection start position
  this._selection.start = parseInt(start);

  //Update the selection end position
  this._selection.end = parseInt(end);

  //Set selection active as true
  this._selection.active = true;

  //Draw the selection
  this.selectionDraw();

  //Continue
  return this;
};

//Draw the selection
jviz.modules.coverviewer.prototype.selectionDraw = function()
{
  //Check if selection is enabled
  if(this._selection.enabled === false || this._selection.has === false){ return this; }

  //Get the draw zone
  var draw = this._canvas.el.draw();

  //Get the canvas layer
  var canvas = this._canvas.el.layer(this._selection.layer);

  //Clear the layer
  canvas.Clear();

  //Check the start point
  if(this._draw.end < this._selection.start){ return this; }

  //Check the end point
  if(this._selection.end < this._draw.start){ return this; }

  //Get the start position
  var pos_start = Math.max(0, draw.width * (this._selection.start - this._draw.start) / this._draw.length);

  //Get the end position
  var pos_end = Math.min(draw.width, draw.width * (this._selection.end - this._draw.start) / this._draw.length);

  //Get the rectangle position x
  this._selection.rect.posx = draw.margin.left + pos_start;

  //Get the rectangle position y
  this._selection.rect.posy = draw.margin.top;

  //Get the rectangle width
  this._selection.rect.width = Math.abs(pos_end - pos_start);

  //Get the rectangle height
  this._selection.rect.height = draw.height;

  //Draw the selection rectangle
  canvas.Rect({ x: this._selection.rect.posx, y: this._selection.rect.posy, width: this._selection.rect.width, height: this._selection.rect.height });

  //Fill the rectanle
  canvas.Fill({ color: this._selection.color, opacity: this._selection.rect.opacity });

  //Continue
  return this;
};

//Selection down
jviz.modules.coverviewer.prototype.selectionDown = function(x, y)
{
  //Active the click
  this._selection.click.active = true;

  //Set the selection type as create
  this._selection.click.type = 0;

  //Initialize the start point
  this._selection.click.start = x;

  //Initialize the end point
  this._selection.click.end = x;

  //Save the original click position
  this._selection.click.original = x;

  //Check if has selection
  if(this._selection.has === true && this.selectionOver(x, y) === true || this._selection.fixed === true)
  {
    //Check the rectangle start
    if(x < this._selection.rect.posx + this._selection.margin && this._selection.fixed === false)
    {
      //Change the end point
      this._selection.click.original = this._selection.rect.posx + this._selection.rect.width;
    }
    //Check the rectangle end
    else if(this._selection.rect.posx + this._selection.rect.width - this._selection.margin < x && this._selection.fixed === false)
    {
      //Change the start point
      this._selection.click.original = this._selection.rect.posx;
    }
    //Only move
    else
    {
      //Set the selection type to move
      this._selection.click.type = 1;

      //Get the min value
      this._selection.move.min = this._draw.margin + this._selection.rect.width / 2;

      //Get the max value
      this._selection.move.max = this._draw.margin + this._draw.width - this._selection.rect.width / 2;

      //Save the move width
      this._selection.move.width = this._selection.rect.width;
    }
  }

  //Disable the selection click move
  this._selection.click.move = false;

  //Has a selection
  this._selection.has = true;
};

//Selection move
jviz.modules.coverviewer.prototype.selectionMove = function(x, y)
{
  //Check if has selection
  if(this._selection.has === false){ return; }

  //Check if selection click is active
  if(this._selection.click.active === false)
  {
    //Exit
    return;
  }

  //Check the selection click type
  if(this._selection.click.type === 1)
  {
    //Check the position x
    if(x < this._selection.move.min){ x = this._selection.move.min; }

    //Check the position x
    if(this._selection.move.max < x){ x = this._selection.move.max; }

    //Get the click start point
    this._selection.click.start = x - this._selection.move.width / 2;

    //Get the click end point
    this._selection.click.end = x + this._selection.move.width / 2;
  }
  else
  {
    //Check the position x
    if(x < this._draw.margin){ x = this._draw.margin; }

    //Check the position x
    if(this._draw.margin + this._draw.width < x){ x = this._draw.margin + this._draw.width; }

    //Get the difference
    var diff = x - this._selection.click.original;

    //Check the orientation
    if(diff < 0)
    {
      //Save the click start point
      this._selection.click.start = x;

      //Save the click end point
      this._selection.click.end = this._selection.click.original;
    }
    else
    {
      //Save the click start point
      this._selection.click.start = this._selection.click.original;

      //Save the click end point
      this._selection.click.end = x;
    }
  }

  //Get the selection start
  this._selection.start = this._draw.start + this._draw.length * (this._selection.click.start - this._draw.margin) / this._draw.width;

  //Get the selection end
  this._selection.end = this._draw.start + this._draw.length * (this._selection.click.end - this._draw.margin) / this._draw.width;

  //Get the selection length
  //this._selection.length = Math.abs(this._selection.end - this._selection.start);

  //Draw the selection
  this.selectionDraw();

  //Set selection move as true
  this._selection.click.move = true;
};

//Selection up
jviz.modules.coverviewer.prototype.selectionUp = function(x, y)
{
  //Check if is active
  if(this._selection.click.active === false){ return; }

  //Check for no move
  if(this._selection.click.move === false && this._selection.fixed === false)
  {
    //Does not has a selection
    this._selection.has = false;

    //Clear the selection
    this.selectionClear();
  }

  //Set active as false
  this._selection.click.active = false;

  //Disable the selection move
  this._selection.click.move = false;
};

//Selection over
jviz.modules.coverviewer.prototype.selectionOver = function(x, y)
{
  //Check the left point
  if(x < this._selection.rect.posx - this._selection.margin){ return false; }

  //Check the right side
  if(this._selection.rect.posx + this._selection.rect.width + this._selection.margin < x){ return false; }

  //Return true
  return true;
};

//Clear the selection
jviz.modules.coverviewer.prototype.selectionClear = function()
{
  //Clear the selection
  this._canvas.el.layer(this._selection.layer).Clear();

  //Continue
  return this;
};
