function displayorderId(){
    let orderId = new URL(location.href).searchParams.get("orderId");
    document.getElementById("orderId").innerHTML = orderId;    
}

displayorderId()