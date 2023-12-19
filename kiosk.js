$(document).ready(function(){
       
    //=====================================================
    $('.product-list li').click(function(){
        var product = $(this).find('.product-name').text();
        var price = $(this).find('.product-price').text();
        var quantity = $(this).find('.quantity-input').val();
        var newItem = $('<li>').text(product + ' - ' + price + ' x ' + quantity);
    $('#cart').append(newItem);
    });
    //장바구니 목록 삭제
    $('.delete-button').click(function(){
        $('#cart').empty();
    });
    //-------------------------------------------------------
    $('.quantity-input').click(function(event){
         event.stopPropagation();
    });
    //===========================================================
    //===========================================================
    //마우스 호버 이벤트 처리
    $('.delete-button').hover(
    function(){
    // 마우스 호버 시 실행할 코드
        $(this).css('background-color', 'black');
        $(this).css('font-size', '45px');
    },
    function(){
    // 마우스 호버 해제 시 실행할 코드
        $(this).css('background-color', 'red');
        $(this).css('font-size', '38px');
    }
);
    //============================================================
    $('.product-list li').hover(
    function(){
        // 마우스 호버 시 실행할 코드
        $(this).css('background-color', 'lightgray');
        $(this).find('a').css('font-size', '25px');
    },
    function(){
        // 마우스 호버 해제 시 실행할 코드
        $(this).css('background-color', 'white');
        $(this).find('a').css('font-size', '14px');
    }
);
//===================================================================================
$('.button').hover(
 function(){
 // 마우스 호버 시 실행할 코드
    $(this).css('background-color', 'blue');
    
 },
 function(){
 // 마우스 호버 해제 시 실행할 코드
    $(this).css('background-color', 'red');
    
 }
);
//=====================================================



//==================================================================================
//결제 이벤트 처리 
  // 주문버튼 클릭 이벤트 처리
  $('.button').click(function(){
       
         if ($('#cart li').length === 0) {
             Swal.fire({
                 icon: 'error',
                 title: '장바구니에 상품을 추가해주세요.'
             });
        
                
         } else {
             var total = calculateTotalPrice(); 
             Swal.fire({
                 title: '총 가격은 ' + total + '원 입니다. 주문하시겠습니까?',
                 showCancelButton: true,
                 confirmButtonText: '주문',
                 cancelButtonText: '취소'
             }).then((result) => {
                 if (result.isConfirmed) {
                    Swal.fire({
                        title: '현금을 입력해주세요:',
                        input: 'text',
                        inputValidator: (value) => {
                            if (isNaN(value)) {
                              return '숫자만 입력 바람';
                            }
                          },
                        inputAttributes: {
                        autocapitalize: 'off'
                        },
                        showCancelButton: true,
                        confirmButtonText: '확인',
                        cancelButtonText: '취소'


                    



                    }).then((cashInput) => {
                        if (cashInput.dismiss === 'cancel') {
                            // Handle cancel action here
                         
                        } else if (cashInput.value === '' || cashInput.value === null) {
                           
                        } else if (parseInt(cashInput.value) < total) {
                            Swal.fire({
                                icon: 'error',
                                title: '입력한 현금이 부족합니다.'
                            });
                         } else {
                            var orderSummary = completeOrder();
                             var change = parseInt(cashInput.value) - total;
                             if (change > 0) {
                                 Swal.fire({
                                     icon: 'success',
                                     title: '주문이 완료되었습니다. 거스름돈은 ' + change + '원 입니다.',
                                     text:orderSummary,
                                     showCancelButton:'true',
                                     confirmButtonText:'프린트',
                                     cancelButtonText:'닫기'
                                 }).then((result) => {
                                    if (result.isConfirmed) {
                                        $('#cart').empty();
                                        window.print(printOrderSummary(this));
                                    }else {
                                        $('#cart').empty();
                                    }


                                   
                                    

                                });
                             } else { 
                                 var orderSummary = completeOrder();
                                 Swal.fire({
                                     icon: 'success',
                                     title: '주문이 완료되었습니다',
                                     text: orderSummary,
                                     showCancelButton: true,
                                     confirmButtonText: '프린트',
                                     cancelButtonText: '닫기'
                                 }).then((result) => {
                                     if (result.isConfirmed) {
                                        $('#cart').empty();
                                         window.print(printOrderSummary(this));
                                 }else{
                                    $('#cart').empty();
                                 }
                             });
                          
                                 


                             } 
         


                         }
                     });
                 }
             });
         }
     });
//===========================================================================================
// 가격 계산처리
function calculateTotalPrice(){
 var total = 0;
 $('#cart li').each(function(){
 var priceText = $(this).text().split(' - ')[1].replace('가격:', '').replace('원', '');
 var price = parseInt(priceText);
 var quantity = parseInt($(this).text().split(' x ')[1]);
 if (!isNaN(price) && !isNaN(quantity)) {
     total += price * quantity;
 }
});
return total;
}

//=======================================================================================
//주문완료 안내
function completeOrder() {
    var orderTime = new Date().toLocaleString();
    var orderDetails = '';

    var cartItems = $('.cart li').clone();

    var total = calculateTotalPrice(cartItems);

    cartItems.each(function(){
        var itemText = $(this).text();
        console.log(itemText); // 각 항목의 텍스트를 출력합니다.
        if (itemText) {
            orderDetails += itemText + '\n';
        }
    });

    var orderSummary = '주문 완료 시간: ' + orderTime + '\n' + orderDetails + '장바구니 남은금액 : 0' + '원(결제정상처리)';
    
    return  orderSummary; 
}

//============================================================================================
//print display
function printOrderSummary() {
    var printWindow = window.open('', '_blank');
    var orderSummary = completeOrder();
    console.log(orderSummary);
    var html = '<html><head><title>주문완료</title></head><body>';
    html += '<h1>주문완료</h1><hr>';
    html += '<pre>' + orderSummary + '</pre>';
    html += '</body></html>';

    printWindow.document.write(html);
    printWindow.document.close();
}


//=============================================================================================
//li태그 클릭이벤트 발생시 주문버튼 에 색깔변화와 폰트사이즈의 변화 
function blinkOrderButton() {
var colors = ['#FF5733', '#33FF57', '#5733FF', '#33FFEC', '#FF33F9']; // 원하는 색깔 추가
var button = $('.button');

setInterval(function() {
    var randomColor = colors[Math.floor(Math.random() * colors.length)];
    $('.button').css('background-color', randomColor);

}, 1000)
}

// li 태그를 클릭할 때 호출
$('.product-list li').click(function() {
blinkOrderButton();
});
//====================================================================================/

//=====================================================================================
});
    //emoji Event 처리
    setInterval(function(){
        var snowflakeType = Math.random() < 0.5 ? '🐻‍❄️' : '❄️';
        var snowflake = $('<span>').addClass('snowflake').text(snowflakeType);
        snowflake.css('left', Math.random() * 100 + '%');
        snowflake.css('animation-duration', Math.random() * 2 + 2 + 's');
     $('body').append(snowflake);
        setTimeout(function(){
         snowflake.remove();
        }, 5000);
    }, 1500);

// video url: copyright =  https://www.youtube.com/watch?v=NrtHJzCVT-c
