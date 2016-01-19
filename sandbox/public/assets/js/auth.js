function auth() {
        var endpoint = "http://localhost:3000/email";
        var requestBody;
		var roleCode;
		var key = "d0cd3bb6342ab6aed210958a04a9b50c5455a06dc455222fec6d23d6c0808428114df34b";
		var api_action = "automation_contact_add";
		var api_output = "json";
		var contentType ="application/json";
		

        this.login = function(account,password) {
        	//console.log("USERNAME: " + $.cookie("USERNAME"));
		console.log('!!!');
		requestBody = {lastname: account, email: password};
		console.log("requestbody" + JSON.stringify(requestBody));
                $.ajax({
					url: endpoint,
					type: 'POST',
					dataType: 'json',
					contentType:contentType,
					//processData: false,
					data: JSON.stringify(requestBody),
					//console.log("requestbody" + requestBody);
					success: function(data) {
						alert("post success");
						//window.location.href = "index.html";
				 	
                	},
        	        error: function() {
	//				alert("Login failed!!");
					alert("test");
                       }
                });
        };
		
		
}
