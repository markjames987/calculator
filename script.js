const display = document.getElementById('display');

    function appendvalue(value){
        display.value+=value;
    }

function calculate(){
    try{
        display.value=eval(display.value);
    }
    catch{ 
        display.value='Error'; 
     }
}
        
