document.getElementById("save-btn").addEventListener("click", function(){
      //Generate download of file
      var text = document.getElementById("text-val").value;
      //Create new blob with content
      var blob = new Blob([text], {type: "text/plain;charset=utf-8"});
      saveAs(blob, "azure_script.ps1");
    }, false);

    function toggle(source){
      checkboxes = document.getElementsByName('foo');
      for(var i = 0, n=checkboxes.length;i<n;i++){
        checkboxes[i].checked = source.checked;
      }
    }

    $('.selectall').on('change', function(e) {
    var $inputs = $('#checkboxlist input[type=checkbox]');
    if(e.originalEvent === undefined) {
        var allChecked = true;
        $inputs.each(function(){
            allChecked = allChecked && this.checked;
        });
        this.checked = allChecked;
    } else {
        $inputs.prop('checked', this.checked);
    }
});

$('#checkboxlist input[type=checkbox]').on('change', function(){
    $('.selectall').trigger('change');
});

var cb = $('.myCheckBox');
cb.change(function(){
    $('#btnStart').prop('disabled', cb.filter(':checked').length < 1);
});
$('.myCheckBox').change();

function resetPage(){
    var resetbtn = document.getElementById("btnReset");
    resetbtn.onclick = window.location.reload();
}

var count = 0;
function clickFunc() {
count += 1;
var btn = document.getElementById("btnStart");

if(count >= 1) 
     btn.disabled = true;
}

var type = "\n\n";
var selected = [];

function generate() {  
    
    if(document.getElementById("check_aks").checked==true){
        // type=type+"AKS Script \n";
        selected.push('../static/scriptfile/aks.txt');   
    }
    if(document.getElementById("check_resources").checked==true){
        selected.push('../static/scriptfile/resources.txt');
    }
    if(document.getElementById("check_subscriptions").checked==true){
        selected.push('../static/scriptfile/subs.txt');
    }
    if(document.getElementById("check_locks").checked==true){
       selected.push('../static/scriptfile/locks.txt');
    }
    if(document.getElementById("check_tags").checked==true){
        selected.push('../static/scriptfile/tags.txt');
    }
    if(document.getElementById("check_storages").checked==true){
        selected.push('../static/scriptfile/storage.txt');
    }
    if(document.getElementById("check_keyvault").checked==true){
        selected.push('../static/scriptfile/keyvaults.txt');
    }
    console.log("ingenerate");
    printer();
      // document.getElementById("text-val").value = x + type;
}
function printer(){
 var x = "# Connects to Az Account \nConnect-AzAccount \n# Get all subscriptions \n$azSubs = Get-AzSubscription \n# Loop through all Azure Subscriptions \nforeach ($azSub in $azSubs){ \n	Set-AzContext $azSub.id | Out-Null \n}"; 
 if(selected.length != 0){
     console.log("inprinter");
    var shifted = selected.shift();
    readFile(shifted);
  }
  else{
    document.getElementById("text-val").value = x + type;
  }
}

function readFile(file, callback)
{
    var f = new XMLHttpRequest();
    f.open("GET", file);
    f.onreadystatechange = function ()
    {
        if(f.readyState === 4)
        {
            if(f.status === 200 || f.status == 0)
            {
                var res= f.responseText;
                type = type + res; 
                console.log("inreadFile");
                printer();
            }
            else{
                callback(null);
            }
        }
    }
    f.send(null);
}