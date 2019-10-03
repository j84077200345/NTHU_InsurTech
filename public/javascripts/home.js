document.getElementById('addHome').addEventListener('click', function() {
  if(deferredPrompt) {   // 確定我們有「攔截」到chrome所發出的install banner事件
    deferredPrompt.prompt();   // 決定要跳出通知

    // 根據用戶的選擇進行不同處理，這邊我指印出log結果
    deferredPrompt.userChoice.then(function(choiceResult) {
      console.log(choiceResult.outcome);
      
      if(choiceResult.outcome === 'dismissed'){
        console.log('User cancelled installation');
      }else{
        console.log('User added to home screen');
      }
    });
    deferredPrompt = null; // 一旦用戶允許加入後，之後就不會再出現通知
  }
});