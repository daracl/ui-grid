var gridObj;
function loadGrid(initFlag) {
  const jsonInfo = getItem();

  gridDraw(document.getElementById('sample'), jsonInfo.items, jsonInfo.fields);
}

document.addEventListener('DOMContentLoaded', function () {
  loadGrid(true);
});

function gridDraw(element, aaa, colItem, message) {
  gridObj = Daracl.grid.create(
    element,
    {
      style: 'striped',
      selectionMode: 'multiRow', // row , cell , multiRow , multiCell	// 선택 방법.
      fields: colItem,
      items: aaa,
      body: {
        //disableKeydown: true, // 키 이벤트 비활성화
        // 방향키 컨트롤 .
        keyNavHandler: function (moveInfo) {
          console.log(moveInfo);
        },
        pasteBefore: function (a) {
          console.log('pasteBefore', a);
          return a;
        },
        pasteAfter: function (a) {
          console.log('pasteAfter', a);
        },
      },
    },
    message,
  );
}
