var tpt = {};
tpt.Element = function(){}; // default element
// Config.h
tpt.CELL = 4;
tpt.ISTP = tpt.CELL/2;
tpt.CFDS = 4.0/tpt.CELL;
tpt.SIM_MAXVELOCITY = 1e4 * 1.0;

// Elements.h
tpt.R_TEMP = 22;
tpt.MAX_TEMP = 9999;
tpt.MIN_TEMP = 0;
tpt.O_MAX_TEMP = 3500;
tpt.O_MIN_TEMP = -273;

// Element.h
tpt.IPL = -257.0;
tpt.IPH = 257.0;
tpt.ITL = tpt.MIN_TEMP-1;
tpt.ITH = tpt.MAX_TEMP+1;
tpt.NT = -1;
tpt.ST = 10000; // Special transition

tpt.TYPE_PART          = 0x00001;  //1 Powders
tpt.TYPE_LIQUID        = 0x00002;  //2 Liquids
tpt.TYPE_SOLID         = 0x00004;  //4 Solids
tpt.TYPE_GAS           = 0x00008;  //8 Gasses (Includes plasma)
tpt.TYPE_ENERGY        = 0x00010;  //16 Energy (Thunder, Light, Neutrons etc.)
tpt.PROP_CONDUCTS      = 0x00020;  //32 Conducts electricity
tpt.PROP_BLACK         = 0x00040;  //64 Absorbs Photons (not currently implemented or used, a photwl attribute might be better)
tpt.PROP_NEUTPENETRATE = 0x00080;  //128 Penetrated by neutrons
tpt.PROP_NEUTABSORB    = 0x00100;  //256 Absorbs neutrons, reflect is default
tpt.PROP_NEUTPASS      = 0x00200;  //512 Neutrons pass through, such as with glass
tpt.PROP_DEADLY        = 0x00400;  //1024 Is deadly for stickman
tpt.PROP_HOT_GLOW      = 0x00800;  //2048 Hot Metal Glow
tpt.PROP_LIFE          = 0x01000;  //4096 Is a GoL type
tpt.PROP_RADIOACTIVE   = 0x02000;  //8192 Radioactive
tpt.PROP_LIFE_DEC      = 0x04000;  //2^14 Life decreases by one every frame if > zero
tpt.PROP_LIFE_KILL     = 0x08000;  //2^15 Kill when life value is <= zero
tpt.PROP_LIFE_KILL_DEC = 0x10000;  //2^16 Kill when life value is decremented to <= zero
tpt.PROP_SPARKSETTLE   = 0x20000;  //2^17 Allow Sparks/Embers to settle
tpt.PROP_NOAMBHEAT     = 0x40000;  //2^18 Don't transfer or receive heat from ambient heat.
tpt.PROP_DRAWONCTYPE   = 0x80000;  //2^19 Set its ctype to another element if the element is drawn upon it (like what CLNE does)
tpt.PROP_NOCTYPEDRAW   = 0x100000; // 2^20 When this element is drawn upon with, do not set ctype (like BCLN for CLNE)

tpt.FLAG_STAGNANT = 0x1;
tpt.FLAG_SKIPMOVE = 0x2; // skip movement for one frame, only implemented for PHOT
tpt.FLAG_WATEREQUAL = 0x4; //if a liquid was already checked during equalization
tpt.FLAG_MOVABLE = 0x8; // compatibility with old saves (moving SPNG), only applies to SPNG
tpt.FLAG_PHOTDECO = 0x8; // compatibility with old saves (decorated photons), only applies to PHOT. Having the same value as FLAG_MOVABLE is fine because they apply to different elements, and this saves space for future flags,


tpt.ST_NONE = 0;
tpt.ST_SOLID = 1;
tpt.ST_LIQUID = 2;
tpt.ST_GAS = 3;

tpt.BOUNDS_CHECK = true;

tpt.OLD_PT_WIND = 147;

tpt.PT_NUM = 256;

tpt.particle_count = 0;

with({})
{
	this.Identifier = "";          // Example: DEFAULT_PT_METL
	this.Name = "";                // Example: METL
	this.Colour = null;            // Example: new tpt.Colour(red, green, blue)
	this.MenuVisible = 0;          // (unused)
	this.MenuSection = null;
	this.Enabled = 0;
	
	this.Advection = 0.0;
	this.AirDrag = 0.00 * tpt.CFDS;
	this.AirLoss = 0.0;
	this.Loss = 0.00;
	this.Collision = 0.0;
	this.Gravity = 0.0;
	this.Diffusion = 0.0;
	this.HotAir = 0.0 * tpt.CFDS;
	this.Falldown = 0;
	
	this.Flammable = 0;
	this.Explosive = 0;
	this.Meltable = 0;
	this.Hardness = 0;
	
	this.Weight = 100;
	
	this.Temperature = tpt.R_TEMP+0.0+273.15;
	this.HeatConduct = 0;
	this.Description = "";
	
	this.State = null;
	this.Properties = 0;
	
	this.LowPressure = tpt.IPL;
	this.LowPressureTransition = tpt.NT;
	this.HighPressure = tpt.IPH;
	this.HighPressureTransition = tpt.NT;
	this.LowTemperature = tpt.ITL;
	this.LowTemperatureTransition = tpt.NT;
	this.HighTemperature = tpt.ITH;
	this.HighTemperatureTransition = tpt.NT;
	
	this.Create = function(particle){};
	this.Update = function(particle){};
	this.Deleted = function(particle){};
	this.Graphics = function(){}; // unused
	// #define UPDATE_FUNC_ARGS Simulation* sim, int i, int x, int y, int surround_space, int nt, Particle *parts, int pmap[YRES][XRES]
	// #define UPDATE_FUNC_SUBCALL_ARGS sim, i, x, y, surround_space, nt, parts, pmap
	// #define GRAPHICS_FUNC_ARGS Renderer * ren, Particle *cpart, int nx, int ny, int *pixel_mode, int* cola, int *colr, int *colg, int *colb, int *firea, int *firer, int *fireg, int *fireb
	// #define GRAPHICS_FUNC_SUBCALL_ARGS ren, cpart, nx, ny, pixel_mode, cola, colr, colg, colb, firea, firer, fireg, fireb
	
	tpt.Element.prototype = this;
}
tpt.particles = [];
tpt.map = [];
tpt.width = tpt.XRES = 612;
tpt.height = tpt.YRES = 384;
tpt.Element.count = 0;
tpt.createElementType = function(ele)
{
	var v = new tpt.Element;
	v.Id = tpt.Element.count;
	tpt.Element.count++;
	for(i in ele) v[i]=ele[i];
	tpt.Element[ele.Name]=v;
	tpt.Element[v.Id]=v;
}
tpt.kill_part = function(i)
{
	tpt.particles[i] = null;
	tpt.particle_count--;
}
tpt.simulate = function()
{
	// refer to Simulation.cpp: update_particles_i
	var n = tpt.particles.length;
	var k = tpt.particles;
	// clear map
	tpt.map = [];
	for(i=0;i<n;i++)
	{
		var t = k[i];
		// kill any particles outside the screen
		if(t) if(t.x<tpt.CELL || t.y<tpt.CELL || t.x>=tpt.XRES-tpt.CELL || t.y>=tpt.YRES-tpt.CELL) tpt.kill_part(i);
		// kill unenabled particles
		else if (tpt.Element[t.type].Enabled == 0) tpt.kill_part(i);
		else {
			if(!tpt.map[t.x]) tpt.map[t.x]=[];
			tpt.map[t.x][t.y] = i;
		}
	}
	// update particles
	for(i=0;i<n;i++)
	{
		var t = k[i];
		if(t) tpt.Element[t.type].Update();
	}
}
tpt.Colour = function(r,g,b){
	this.r = this.red = r;
	this.g = this.green = g;
	this.b = this.blue = b;
	this.toString = function(){
		var a = Number(this.r).toString(16),
		    b = Number(this.g).toString(16),
			c = Number(this.b).toString(16);
		a = ("0"+a).slice(-2);
		b = ("0"+b).slice(-2);
		c = ("0"+c).slice(-2);
		return "#"+a+b+c;
	}
}
tpt.draw = function()
{
	var imgdata = context.createImageData(tpt.width,tpt.height);
	var n = tpt.particles.length;
	var g = tpt.particles;
	for(var i=0;i<n;i++)
	{
		var t = g[i];
		if(t){
			var m = tpt.Element[t.type];
			var k = (t.x+t.y*tpt.width)*4;
			imgdata.data[k+0] = m.Colour.red;
			imgdata.data[k+1] = m.Colour.green;
			imgdata.data[k+2] = m.Colour.blue;
			imgdata.data[k+3] = 255;//alpha
			//console.log('imgdata['+t.x+']['+t.y+']=('+t.color.red+','+t.color.green+','+t.color.blue+')');
		}
	}
	if(tpt.brush.size == 0)
	{
		// brush is a dot
		var k = (mouseX+mouseY*tpt.width)*4;
		imgdata.data[k+0] = imgdata.data[k+1] = imgdata.data[k+2] = 255;
		imgdata.data[k+3] = 144;
	}
	else
	{
		var last = -1;
		for(var y = -tpt.brush.size; -y + mouseY >= 0 && y <= 0 && mouseY + y < tpt.width; y++)
		{
			var x = Math.floor(Math.sqrt(tpt.brush.size * tpt.brush.size - y * y));
			for(var m = -x; m <= x; m++)
			if(Math.abs(m) > last || (Math.abs(m) == last && x == last))
			{
				if(-m+mouseX>=0&&-m+mouseX<tpt.width)
				{
					if(y+mouseY<tpt.height&&y+mouseY>=0)
					{
						var k = ((-m+mouseX)+(y+mouseY)*tpt.width)*4;
						imgdata.data[k+0] = imgdata.data[k+1] = imgdata.data[k+2] = 255;
						imgdata.data[k+3] = 144;
					}
					if(-y+mouseY>=0&&-y+mouseY<tpt.height)
					{
						var k = ((-m+mouseX)+(-y+mouseY)*tpt.width)*4;
						imgdata.data[k+0] = imgdata.data[k+1] = imgdata.data[k+2] = 255;
						imgdata.data[k+3] = 144;
					}
				}
				if(m+mouseX<tpt.width&&m+mouseX>=0)
				{
					if(y+mouseY<tpt.height&&y+mouseY>=0)
					{
						var k = ((m+mouseX)+(y+mouseY)*tpt.width)*4;
						imgdata.data[k+0] = imgdata.data[k+1] = imgdata.data[k+2] = 255;
						imgdata.data[k+3] = 144;
					}
					if(-y+mouseY<tpt.height&&-y+mouseY<tpt.height)
					{
						var k = ((m+mouseX)+(-y+mouseY)*tpt.width)*4;
						imgdata.data[k+0] = imgdata.data[k+1] = imgdata.data[k+2] = 255;
						imgdata.data[k+3] = 144;
					}
				}
			}
			var last = x;
		}
	}
	
	// draw menus
	context.putImageData(imgdata,0,0);
	for(var i = 0;i < tpt.menu.length;i++) tpt.menu[i].draw();
	/*var x=0,y=0;
	for(var i=0;i<256;i++)
	{	
		var f=tpt.font[i];
		if(x+f.width>=600){
			y += 10;
			x = 0;
		}
		context.putImageData(f,x,y);
		x += f.width;
	}*/
	//context.putImageData(tpt.font[229],0,0);
	// draw brush at mouseX mouseY with a radius of brushSize
}
tpt.Button = function(c,x,y){
	// menu is a 15*15 thing with 1 pixel (200,200,200) border, (235,235,235) and NOTed when chosen
	// c: char, x,y: left, top
	this.c=c;this.x=x;this.y=y;
	
	var f1=tpt.font[this.c];
	var f2=context.createImageData(f1.width,10);
	
	// NOTed font
	for(var x=0;x<f1.data.length;x+=4)
	{
		f2.data[x]=f1.data[x];
		f2.data[x+1]=f1.data[x+1];
		f2.data[x+2]=f1.data[x+2];
		f2.data[x+3]=255-f1.data[x+3];
	}
	var w=f1.width,h=10,ax=Math.ceil(7.5-f1.width/2);
	this.draw1 = function() {
		context.putImageData(tpt.Button.data1,this.x,this.y);
		context.putImageData(f1,this.x+ax,this.y+2);
	}
	this.draw2 = function() {
		context.putImageData(tpt.Button.data2,this.x,this.y);
		context.fillStyle="white";
		context.fillRect(this.x+1,this.y+1,13,13);
		context.putImageData(f2,this.x+ax,this.y+2);
	}
	this.status = false;
	this.draw = function() {
		if(this.status) this.draw2(); else this.draw1();
	}
	this.mouseover=function(){this.status=true;}
	this.mouseout=function(){this.status=false;}
	this.mousedown=function(){};
	this.mouseup=function(){};
}
tpt.Button.init = function(){
	var dat1 = context.createImageData(15,15),dat2=context.createImageData(dat1),dat3=context.createImageData(dat1);
	// border 200
	var data1 = dat1.data;
	for(var x=0;x<15;x++){data1[x*4]=data1[x*4+1]=data1[x*4+2]=255;data1[x*4+3]=200;}
	for(var x=0;x<15;x++){data1[x*4+840]=data1[x*4+841]=data1[x*4+842]=255;data1[x*4+843]=200;}
	for(var y=0;y<15;y++){data1[y*15*4]=data1[y*15*4+1]=data1[y*15*4+2]=255;data1[y*15*4+3]=200;}
	for(var y=0;y<15;y++){data1[(y*15+14)*4]=data1[(y*15+14)*4+1]=data1[(y*15+14)*4+2]=255;data1[(y*15+14)*4+3]=200;}
	dat1.data=data1;
	// border 235
	var data2 = dat2.data;
	for(var x=0;x<15;x++){data2[x*4]=data2[x*4+1]=data2[x*4+2]=255;data2[x*4+3]=235;}
	for(var x=0;x<15;x++){data2[x*4+840]=data2[x*4+841]=data2[x*4+842]=255;data2[x*4+843]=235;}
	for(var y=0;y<15;y++){data2[y*15*4]=data2[y*15*4+1]=data2[y*15*4+2]=255;data2[y*15*4+3]=235;}
	for(var y=0;y<15;y++){data2[(y*15+14)*4]=data2[(y*15+14)*4+1]=data2[(y*15+14)*4+2]=255;data2[(y*15+14)*4+3]=235;}
	dat2.data=data2;
	// border 255
	var data3 = dat3.data;
	for(var x=0;x<15;x++){data3[x*4]=data3[x*4+1]=data3[x*4+2]=255;data3[x*4+3]=255;}
	for(var x=0;x<15;x++){data3[x*4+840]=data3[x*4+841]=data3[x*4+842]=255;data3[x*4+843]=255;}
	for(var y=0;y<15;y++){data3[y*15*4]=data3[y*15*4+1]=data3[y*15*4+2]=255;data3[y*15*4+3]=255;}
	for(var y=0;y<15;y++){data3[(y*15+14)*4]=data3[(y*15+14)*4+1]=data3[(y*15+14)*4+2]=255;data3[(y*15+14)*4+3]=255;}
	dat3.data=data3;
	tpt.Button.data1=dat1;
	tpt.Button.data2=dat2;
	tpt.Button.data3=dat3;
};
tpt.menu = [];
tpt.Particle = function(e,x,y){
	this.type = e.Id;
	this.life = 0;
	this.ctype = 0;
	this.x = x;
	this.y = y;
	this.vx = 0;
	this.vy = 0;
	this.temp = tpt.Element[e.Id].Temperature;
	this.flags = 0;
	this.tmp = 0;
	this.tmp2 = 0;
	this.dcolour = 0;
	this.pavg = [0.0, 0.0, 0.0];
	tpt.Element[e.Id].Create(this);
}
tpt.createParticle = function(ele,x,y){
	var x=Math.ceil(x);
	var y=Math.ceil(y);
	var l = tpt.particles.length;
	if(x < 0 || y < 0 || x >= tpt.XRES || y >= tpt.YRES) return;
	tpt.particles[l] = new tpt.Particle(ele,x,y);
	if(!tpt.map[x]) tpt.map[x]=[];
	tpt.map[x][y] = l;
	tpt.particle_count++;
}
tpt.try_createParticle = function(ele,x,y){
	var x=Math.ceil(x);
	var y=Math.ceil(y);
	if(tpt.map[x]) if(tpt.map[x][y]) return;
	if(ele.Enabled == 0) return;
	return tpt.createParticle(ele,x,y);
}
tpt.deleteParticle = function(id){
	var n = tpt.particles[id];
	tpt.map[n.x][n.y] = null;
	tpt.particles[id] = null;
	tpt.particle_count--;
}
tpt.deleteParticleAt = function(x,y){
	if(tpt.map[x]) if(tpt.map[x][y]) tpt.deleteParticle(tpt.map[x][y]);
}

tpt.createElementType({
	Identifier: "DEFAULT_PT_TEST",
	Name: "TEST",
	Colour: new tpt.Colour(0x40, 0x40, 0x60),
	MenuVisible: 1,
	MenuSection: null,
	Enabled: 1,
	
	Advection: 0.0,
	AirDrag: 0.00 * tpt.CFDS,
	AirLoss: 0.0,
	Loss: 0.00,
	Collision: 0.0,
	Gravity: 0.0,
	Diffusion: 0.0,
	HotAir: 0.0 * tpt.CFDS,
	Falldown: 0,
	
	Flammable: 0,
	Explosive: 0,
	Meltable: 0,
	Hardness: 0,
	
	Weight: 100,
	
	Temperature: tpt.R_TEMP+0.0+273.15,
	HeatConduct: 0,
	Description: "Test element",
	
	State: null,
	Properties: 0,
	
	LowPressure: tpt.IPL,
	LowPressureTransition: tpt.NT,
	HighPressure: tpt.IPH,
	HighPressureTransition: tpt.NT,
	LowTemperature: tpt.ITL,
	LowTemperatureTransition: tpt.NT,
	HighTemperature: tpt.ITH,
	HighTemperatureTransition: tpt.NT,
	
	Create: function(){
	},
	Update: function(){
	}
});

mouseLeft = false;
mouseMiddle = false;
mouseRight = false;
mouseLastX = -1;
mouseLastY = -1;
mouseX = -1;
mouseY = -1;
tpt.brush = {};
tpt.brush.size = 3;
tpt.brush.draw = function(f){
	for(var i = -this.size; i <= this.size; i++)
	{
		var m = Math.floor(Math.sqrt(this.size * this.size - i * i));
		for(var j = -m; j <= m; j++)
		{
			f(i,j);
		}
	}
}

FPS = 0;
tpt.work = function()
{
	tpt.simulate();
	tpt.draw();
	brushsize.innerText = tpt.brush.size;
	pcount.innerText = tpt.particle_count;
	FPS += 1;
}

tpt.Tool = function(){
	this.name = this.description = "";
	this.draw = function(){};
}

tpt.ElementTool = function(name,desc,element){
	// from Tool.cpp
	this.name = name;
	this.description = desc;
	this.draw = function(xx,yy)
	{
		tpt.brush.draw(function(x,y){tpt.try_createParticle(element,x+xx,y+yy)});
	}
	this.undraw = function(xx,yy)
	{
		tpt.brush.draw(function(x,y){tpt.deleteParticleAt(x+xx,y+yy)});
	}
}

tpt.Point = function(x,y){this.x=x;this.y=y}

tpt.ToolButton = function(pos, size, text, tooltip, colour, texture){
	// from gui/game/ToolButton.cpp
	this.SetSelectionState(-1);
	this.BorderActive = new tpt.Colour(255, 0, 0);
	var temp = document.createElement("canvas");
	temp.width = size.x;
	temp.height = size.y;
	var temp = temp.getContext('2d');
	var totalColour = colour.b + 3 * colour.g + 2 * colour.r;
	if(texture)
	{
		temp.putImageData(texture,2,2); // texture's size should be (size.x-4)*(size.y-4)
	}
	else
	{
		temp.fillStyle = colour.toString();
		console.log(temp.fillStyle);
		temp.fillRect(2,2,size.x-4,size.y-4);
	}
	if(this.isMouseInside) // TODO: isMouseInside undefined
	{
		temp.strokeStyle = this.BorderActive.toString();
		temp.rect(0,0,size.x,size.y);
		temp.stroke();
	}
	else
	{
		console.log(pos,size,colour,this.BorderInactive.toString());
		temp.strokeStyle = this.BorderInactive.toString();
		temp.rect(0,0,size.x,size.y);
		temp.stroke();
	}
	this.bitmap = temp.getImageData(0,0,size.x,size.y);
	this.pos = pos;
	

	/*if (totalColour<544)
	{
		g->drawtext(screenPos.X+textPosition.X, screenPos.Y+textPosition.Y, buttonDisplayText.c_str(), 255, 255, 255, 255);
	}
	else
	{
		g->drawtext(screenPos.X+textPosition.X, screenPos.Y+textPosition.Y, buttonDisplayText.c_str(), 0, 0, 0, 255);
	}*/
}
tpt.ToolButton.prototype.draw = function(){
	context.putImageData(this.bitmap,this.pos.x,this.pos.y);
}
tpt.ToolButton.prototype.SetSelectionState = function(state)
{
	this.currentSelection = state;
	switch(state)
	{
	case 0:
		this.BorderInactive = new tpt.Colour(255, 0, 0);
		break;
	case 1:
		this.BorderInactive = new tpt.Colour(0, 0, 255);
		break;
	case 2:
		this.BorderInactive = new tpt.Colour(0, 255, 0);
		break;
	case 3:
		this.BorderInactive = new tpt.Colour(0, 255, 255);
		break;
	default:
		this.BorderInactive = new tpt.Colour(0, 0, 0);
		break;
	}
}
tpt.ToolButton.prototype.OnMouseClick = function(x,y,button)
{
	this.isButtonDown = true;
}
tpt.ToolButton.prototype.OnMouseUnclick = function(x,y,button)
{
	if(this.isButtonDown)
	{
		this.isButtonDown = false;
		SetSelectionState(0);
	}
}
/*void ToolButton::Draw(const ui::Point& screenPos)
{
	Graphics * g = ui::Engine::Ref().g;
	int totalColour = Appearance.BackgroundInactive.Blue + (3*Appearance.BackgroundInactive.Green) + (2*Appearance.BackgroundInactive.Red);

	if (Appearance.GetTexture())
	{
		g->draw_image(Appearance.GetTexture(), screenPos.X+2, screenPos.Y+2, 255);
	}
	else
	{
		g->fillrect(screenPos.X+2, screenPos.Y+2, Size.X-4, Size.Y-4, Appearance.BackgroundInactive.Red, Appearance.BackgroundInactive.Green, Appearance.BackgroundInactive.Blue, Appearance.BackgroundInactive.Alpha);
	}

	if (isMouseInside && currentSelection == -1)
	{
		g->drawrect(screenPos.X, screenPos.Y, Size.X, Size.Y, Appearance.BorderActive.Red, Appearance.BorderActive.Green, Appearance.BorderActive.Blue, Appearance.BorderActive.Alpha);
	}
	else
	{
		g->drawrect(screenPos.X, screenPos.Y, Size.X, Size.Y, Appearance.BorderInactive.Red, Appearance.BorderInactive.Green, Appearance.BorderInactive.Blue, Appearance.BorderInactive.Alpha);
	}

	if (totalColour<544)
	{
		g->drawtext(screenPos.X+textPosition.X, screenPos.Y+textPosition.Y, buttonDisplayText.c_str(), 255, 255, 255, 255);
	}
	else
	{
		g->drawtext(screenPos.X+textPosition.X, screenPos.Y+textPosition.Y, buttonDisplayText.c_str(), 0, 0, 0, 255);
	}
}

void ToolButton::SetSelectionState(int state)
{
	currentSelection = state;
	switch(state)
	{
	case 0:
		Appearance.BorderInactive = ui::Colour(255, 0, 0);
		break;
	case 1:
		Appearance.BorderInactive = ui::Colour(0, 0, 255);
		break;
	case 2:
		Appearance.BorderInactive = ui::Colour(0, 255, 0);
		break;
	case 3:
		Appearance.BorderInactive = ui::Colour(0, 255, 255);
		break;
	default:
		Appearance.BorderInactive = ui::Colour(0, 0, 0);
		break;
	}
}

int ToolButton::GetSelectionState()
{
	return currentSelection;
}

ToolButton::~ToolButton() {
}


}*/


window.onload = function(){
	// refer to GameView.cpp for game appearance
	if(!view.getContext)
	{
		alert('Your browser is too old, please upgrade or download Google Chrome');
		location.href = 'https://www.google.com/chrome/';
		throw null; // stop script execution
	}
	context = view.getContext('2d');
	
	var n = tpt.font.length;
	for(i=0;i<n;i++)
	{
		var k = context.createImageData(tpt.font[i][0].length,10);
		for(y=0;y<10;y++)
		{
			var f = tpt.font[i][y];
			var width = f.length;
			for(x=0;x<width;x++)
			{
				var l = (x+y*width) * 4;
				k.data[l+0] = k.data[l+1] = k.data[l+2] = 255;
				k.data[l+3] = 255 * f[x] / 3;
			}
		}
		tpt.font[i] = k;
	}
	
	view.width = tpt.width + 17;
	view.height = tpt.height + 40;
	
	wheelEvent = function(e){
		var e = e || window.event;
		var delta = e.wheelDelta ? (e.wheelDelta / 120) : (-e.detail / 3);
		tpt.brush.size += delta;
		if(tpt.brush.size > 200) tpt.brush.size = 200;
		if(tpt.brush.size < 0) tpt.brush.size = 0;
	}
	
	// Firefox (notice that although other browsers support addEventListener, it won't work here)
	if(view.addEventListener)
		view.addEventListener('DOMMouseScroll', wheelEvent, false);
	// other
	if(view.attachEvent)
		view.attachEvent('onmousewheel',scrollFunc); 
	else
		view.onmousewheel = wheelEvent;
	
	view.onmousemove = function(e){
		var e = window.event || e;
		if(e.clientX < tpt.width && e.clientY < tpt.height) // operations inside TPT box
		{
			if(mouseLeft)
			{
				var m;
				if(Math.abs(e.clientX - mouseLastX) > Math.abs(e.clientY - mouseLastY)) m = Math.abs(e.clientX - mouseLastX);
				else m = Math.abs(e.clientY - mouseLastY);
				if(m==0) test_tool.draw(e.clientX, e.clientY);
				else
				{
					var i = 0;
					while(i<=m)
					{
						test_tool.draw(e.clientX * i / m + mouseLastX * (m - i) / m, e.clientY * i / m + mouseLastY * (m - i) / m);
						i++;
					}
				}
			}
			if(mouseRight)
			{
				var m;
				if(Math.abs(e.clientX - mouseLastX) > Math.abs(e.clientY - mouseLastY)) m = Math.abs(e.clientX - mouseLastX);
				else m = Math.abs(e.clientY - mouseLastY);
				if(m==0) test_tool.undraw(e.clientX, e.clientY);
				else
				{
					var i = 0;
					while(i<=m)
					{
						test_tool.undraw(e.clientX * i / m + mouseLastX * (m - i) / m, e.clientY * i / m + mouseLastY * (m - i) / m);
						i++;
						console.log(e.clientX * i / m + mouseLastX * (m - i) / m, e.clientY * i / m + mouseLastY * (m - i) / m);
					}
				}
			}
		}
		else // operations outside TPT box
		{
			for(i=0;i<tpt.menu.length;i++) 
			{
				var m = tpt.menu[i];
				if(e.clientX>=m.x&&e.clientY>=m.y&&e.clientX<m.x+15&&e.clientY<m.y+15){m.mouseover();}else{m.mouseout();}
			}
		}
		mouseLastX = e.clientX;
		mouseLastY = e.clientY;
		mouseX = e.clientX;
		mouseY = e.clientY;
	}
	view.onmousedown = function(e){
		var e = window.event || e;
		switch(e.button)
		{
			case 0: mouseLeft = true; break;
			case 1: mouseMiddle = true; break;
			case 2: mouseRight = true; break;
			default: break;
		}
		mouseLastX = e.clientX;
		mouseLastY = e.clientY;
		view.onmousemove(e);
		for(i=0;i<tpt.menu.length;i++) 
		{
			var m = tpt.menu[i];
			if(e.clientX>=m.x&&e.clientY>=m.y&&e.clientX<m.x+15&&e.clientY<m.y+15){m.mousedown();}
		}
		return false;
	}
	view.onmouseup = function(e){
		var e = window.event || e;
		switch(e.button)
		{
			case 0: mouseLeft = false; break;
			case 1: mouseMiddle = false; break;
			case 2: mouseRight = false; break;
			default: break;
		}
		mouseLastX = -1;
		mouseLastY = -1;
		mouseX = e.clientX;
		mouseY = e.clientY;
		for(i=0;i<tpt.menu.length;i++) 
		{
			var m = tpt.menu[i];
			if(e.clientX>=m.x&&e.clientY>=m.y&&e.clientX<m.x+15&&e.clientY<m.y+15){m.mouseup();}
		}
		return false;
	}
	view.oncontextmenu = function(e){
		return false;
	}
	view.onmouseout = function(e){
		mouseX = mouseY = -1;
	}
	setInterval(function(){
		fps.innerText = FPS;
		FPS = 0;
	},1000);
	tpt.Button.init();
	
	// from simulation/SimulationData.cpp
	
	/*	{"\xC1", "Walls", 0, 1},
		{"\xC2", "Electronics", 0, 1},
		{"\xD6", "Powered Materials", 0, 1},
		{"\x99", "Sensors", 0, 1},
		{"\xE2", "Force", 0, 1},
		{"\xC3", "Explosives", 0, 1},
		{"\xC5", "Gasses", 0, 1},
		{"\xC4", "Liquids", 0, 1},
		{"\xD0", "Powders", 0, 1},
		{"\xD1", "Solids", 0, 1},
		{"\xC6", "Radioactive", 0, 1},
		{"\xCC", "Special", 0, 1},
		{"\xD2", "Game Of Life", 0, 1},
		{"\xD7", "Tools", 0, 1},
		{"\xE4", "Decoration tools", 0, 1},
		{"\xC8", "Cracker", 0, 0},
		{"\xC8", "Cracker!", 0, 0},*/
	tpt.GameMenus = [
		[0xC1, "Walls", 0, 1],
		[0xC2, "Electronics", 0, 1],
		[0xD6, "Powered Materials", 0, 1],
		[0x99, "Sensors", 0, 1],
		[0xE2, "Force", 0, 1],
		[0xC3, "Explosives", 0, 1],
		[0xC5, "Gasses", 0, 1],
		[0xC4, "Liquids", 0, 1],
		[0xD0, "Powders", 0, 1],
		[0xD1, "Solids", 0, 1],
		[0xC6, "Radioactive", 0, 1],
		[0xCC, "Special", 0, 1],
		[0xD2, "Game Of Life", 0, 1],
		[0xD7, "Tools", 0, 1],
		[0xE4, "Decoration tools", 0, 1]
	];
	var game_count = tpt.GameMenus.length;
	var y=view.height-game_count*16-16;//leave space for pause
	for(i=0;i<game_count;i++)
	{
		tpt.menu[i]=new tpt.Button(tpt.GameMenus[i][0],613,y+i*16);
	}
	/*tpt.menu[0] = new tpt.Menu(0xC1,613,y+=16);
	tpt.menu[1] = new tpt.Menu(0xC2,613,y+=16);
	tpt.menu[2] = new tpt.Menu(0xD6,613,y+=16);
	tpt.menu[3] = new tpt.Menu(0x99,613,y+=16);
	tpt.menu[4] = new tpt.Menu(0xE2,613,y+=16);
	tpt.menu[5] = new tpt.Menu(0xC3,613,y+=16);
	tpt.menu[6] = new tpt.Menu(0xC5,613,y+=16);
	tpt.menu[7] = new tpt.Menu(0xC4,613,y+=16);
	tpt.menu[8] = new tpt.Menu(0xD0,613,y+=16);
	tpt.menu[9] = new tpt.Menu(0xD1,613,y+=16);
	tpt.menu[10] = new tpt.Menu(0xC6,613,y+=16);
	tpt.menu[11] = new tpt.Menu(0xCC,613,y+=16);
	tpt.menu[12] = new tpt.Menu(0xD2,613,y+=16);
	tpt.menu[13] = new tpt.Menu(0xD7,613,y+=16);
	tpt.menu[14] = new tpt.Menu(0xE4,613,y+=16);
	tpt.menu[15] = new tpt.Menu(0x90,613,y+=16);*/
	//if(window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame)
	//	(window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame)(tpt.work);
	//else
		setInterval(tpt.work,0);
	// according to the documents, requestAnimationFrame will stop the animation when the window is not focused?
	// (setInterval does )
	// still hesitating if I should use requestAnimationFrame
	// also, requestAnimationFrame seems to work incorrectly (callback called only once?)
}