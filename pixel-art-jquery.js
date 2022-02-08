let xXx = Math.floor(window.outerWidth/20);
const size_of_brick = 10;

let brush_color = $('#choose_color_body').val();

const pattern_css_board = {
	"background-color":"#eaeaea",
	"font-size":"0",
	"padding":"16px 0px 16px 0px",
	"border-radius":"7px",
	"text-align":"center"
}

const default_css_pattern_tr = {
	"width":`${(size_of_brick + 2)* xXx}px`,
	"display":"inline-block",
	"text-align":"center"
}

const default_css_pattern_td = {
	"-moz-box-shadow":"inset 0 0 1px #eaeaea",
	"-webkit-box-shadow":"inset 0 0 1px #eaeaea",
	"box-shadow":"inset 0 0 1px #eaeaea",
	"width":`${(size_of_brick)}px`,
	"height":`${(size_of_brick)}px`,
	"display":"inline-block",
	"background-color":"#ffffff"
}

const colored_css_pattern_td = {
	"-moz-box-shadow":"none",
	"-webkit-box-shadow":"none",
	"box-shadow":"none",
	"width":`${(size_of_brick)}px`,
	"height":`${(size_of_brick)}px`,
	"display":"inline-block"
}

const wrapper_css = {
	"width":`${(size_of_brick + 2)* xXx + 200}px`,
  "margin":"0 auto"
}

//----SRV FUNCS------------------------------------------------------------------------------------

const built_empty_table = function () {

	const table = $("<div id=\"blackboard\" class=\"main_table\"></div>").css(pattern_css_board);
	const tr = $("<div id=\"tr_board\"></div>").css(default_css_pattern_tr);
	const td = $("<div id=\"td_board\" class=\"white\"></div>").css(default_css_pattern_td);
	for(let i=1;i<xXx;i++) tr.append(td.clone());
	for(let i=1;i<xXx/2;i++) table.append(tr.clone());

	return table;
}


const set_color_for_board_cell = function (cell) {

	if (cell.attr('id') != 'td_board') return;
	if (brush_color != "#ffffff") {
		cell.css(colored_css_pattern_td);
		cell.css("background-color",brush_color);
	}
	else{
		cell.css(default_css_pattern_td);
	}
}


const moved = function (event) {
 	event.buttons === 1 ? set_color_for_board_cell($(event.target)) : window.removeEventListener("mousemove", moved);
}

const set_color_by_pal = function (cell) {
	if(cell.attr('id') === "opt"){
    brush_color = cell.val();   
    $('#choose_color_body').val(cell.val());
  }
}


const download = function (filename, textInput) {
	const element = $('<a></a>');
  element.attr('href','data:text/html;charset=utf-8, ' + encodeURIComponent(textInput));
  element.attr('download', filename);
  $('body').append(element);
  element[0].click();
	element.remove();
}


const handleFileSelect = function (input) {
  const file = input.target.files[input.target.files.length-1];
  const reader = new FileReader();
  reader.readAsText(file);
  
  reader.onload = function() {
  	
  	const wrapper = new DOMParser().parseFromString(reader.result, 'text/html');
    const new_wrapper = $(wrapper.children[0].children[1].children[0]);
    if (new_wrapper.attr('id') === 'wrapper')
    	$('#wrapper').replaceWith(new_wrapper);
    else
    	alert('Warning, its not valid file');
  };
}

//----EVENT INITIATOR BLOCK------------------------------------------------------------------------

$('#wrapper').css(wrapper_css);
$('#wrapper').append(built_empty_table);

$("html").mousedown(function (event) {
	if (event.buttons === 1) {
		const cell = $(event.target);
		set_color_for_board_cell($(event.target));
		set_color_by_pal($(event.target));
		$("html").mousemove(moved);
		event.preventDefault();
	}
});

$('#input_button_clear').click(function(){
	$('#blackboard').remove();
	$('#wrapper').prepend(built_empty_table);
})

$('#choose_color_body').on('change',function(){
	brush_color = event.target.value;
});

$("#input_button_save").on('click',function(event){
	let blackboard = $('#net'), filename = "output.html";
  download(filename, blackboard.html());
});

$('#files').change(handleFileSelect);