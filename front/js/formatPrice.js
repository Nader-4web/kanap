
function formatPrice(amount){
const formatter = new Intl.NumberFormat('EUR', {
    style: 'currency',
    currency: 'EUR',  
});
 return formatter.format(amount)

}