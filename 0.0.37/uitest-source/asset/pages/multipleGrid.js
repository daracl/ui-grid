function loadGrid(initFlag) {
  if (initFlag) {
    const dgGridSampleConfig = localStorage.getItem('dgGridSampleConfig');

    if (dgGridSampleConfig) {
      try {
        const cfg = JSON.parse(dgGridSampleConfig);

        document.getElementById('dataType').value = cfg.itemType;
        document.getElementById('itemCount').value = cfg.itemCount;
        document.getElementById('cellCount').value = cfg.cellCount;
      } catch (e) {
        console.log('dgGridSampleConfig : ', dgGridSampleConfig, e);
      }
    }
  }

  const itemType = document.getElementById('dataType').value;
  const itemCount = parseInt(document.getElementById('itemCount').value, 10);
  const cellCount = parseInt(document.getElementById('cellCount').value, 10);

  localStorage.setItem('dgGridSampleConfig', JSON.stringify({ itemType, itemCount, cellCount }));

  const jsonInfo = getItem(itemType, itemCount, cellCount);

  gridDraw(document.getElementById('sample'), initFlag ? jsonInfo.items : [], jsonInfo.fields, 'auto', 'default');
  gridDraw(document.getElementById('sample2'), jsonInfo.items, jsonInfo.fields, 'auto', 'striped');
  gridDraw(document.getElementById('sample3'), jsonInfo.items, jsonInfo.fields, 800, 'borderless');
}

document.addEventListener('DOMContentLoaded', function () {
  loadGrid(true);
});

function gridDraw(element, aaa, colItem, width, styleClass) {
  try {
    Daracl.grid.instance(element)?.destroy();
  } catch (e) {
    console.log(e);
  }

  const gridObj = Daracl.grid.create(element, {
    style: styleClass,
    selectionMode: 'multiCell', // row , cell , multiRow , multiCell	// 선택 방법.
    width: width,
    height: 205,
    search: {
      enabled: true,
      mode: 'simple', //'full'
    },

    fields: colItem,
    items: aaa,
  });
}

function getRandomFloatFromInput(a, b) {
  const min = Math.min(a, b);
  const max = Math.max(a, b);
  return Math.floor(Math.random() * (max - min) + min);
}
