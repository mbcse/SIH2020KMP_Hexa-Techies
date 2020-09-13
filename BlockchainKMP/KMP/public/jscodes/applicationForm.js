window.onload=()=>{
   
    $("#NewApplication").submit(function(e) {
        e.preventDefault(); // prevent actual form submit
        var form = $(this);
        var url ="/client/aerodromeapplication"; //get submit url [replace url here if desired]
        $.ajax({
            type: "POST",
            url: url,
            data: form.serialize(), // serializes form input
            success: function(response){
                if(response.status){
                    console.log(response);
                     KMPcontract.methods.registerApplicant(response.id,response.name, response.address, response.phone, response.nationality).send({from:userAccount},(err,tx)=>{})
                     .on('receipt',(rc)=>{
                         console.log("Applicant added to blockchain");
                     });

                     KMPcontract.methods.registerAerodrome(response.id,response.aerodromename, response.name, response.latitude, response.longitude, response.district_state, response.category).send({from:userAccount},(err,tx)=>{})
                     .on('receipt',(rc)=>{
                         console.log("Aerodrome added to blockchain");
                         alert("Application Submitted Successfully")
                     });
                }
                else{
                    alert("Server Error");
                    
                }
            }
        });
    });






}