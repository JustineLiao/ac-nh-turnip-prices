//chart.js color
window.chartColors = {
  red: 'rgb(255, 99, 132)',
  orange: 'rgb(255, 159, 64)',
  yellow: 'rgb(255, 205, 86)',
  green: 'rgb(75, 192, 192)',
  blue: 'rgb(54, 162, 235)',
  purple: 'rgb(153, 102, 255)',
  grey: 'rgb(201, 203, 207)'
};

$(document).ready(function () {
  // load sell_prices from local storage
  try {
    const sell_prices = JSON.parse(localStorage.getItem("sell_prices"));

    if (!Array.isArray(sell_prices) || sell_prices.length !== 14) {
      return;
    }

    sell_prices.forEach((sell_price, index) => {
      if (!sell_price) {
        return;
      }

      if (index === 0) {
        $("#buy").val(sell_price);
        return;
      }

      const element = $("#sell_" + index);

      if (element.length) {
        element.val(sell_price);
      }
    });

    $(document).trigger("input");
  } catch (e) {
    console.error(e);
  }

  $("#reset").on("click", function() {
    $("input").val(null).trigger("input");
  })
});

$(document).on("input", function() {
  // Update output on any input change

  var buy_price = parseInt($("#buy").val());

  var sell_prices = [buy_price, buy_price];
  for (var i = 2; i < 14; i++) {
    sell_prices.push(parseInt($("#sell_" + i).val()));
  }

  localStorage.setItem("sell_prices", JSON.stringify(sell_prices));

  const is_empty = sell_prices.every(sell_price => !sell_price);
  if (is_empty) {
    $("#output").html("");
    return;
  }

  let output_possibilities = "";
  let graph_min = [];
  let graph_max = [];

  for (let poss of analyze_possibilities(sell_prices)) {
    var out_line = "<tr><td>" + poss.pattern_description + "</td>"
    for (let day of poss.prices.slice(1)) {
      if (day.min !== day.max) {
        out_line += `<td>${day.min}~${day.max}</td>`;
      } else {
        out_line += `<td class="one">${day.min}</td>`;
      }
    }
    out_line += `<td class="one">${poss.weekMax}</td></tr>`;
    output_possibilities += out_line

    // graph_min.push(poss.weekMin);
    // graph_max.push(poss.weekMax);
  }
  console.log(global_min_max)
  for (var i = 0; i < global_min_max.length; i++){
    graph_min.push(global_min_max[i].min);
    graph_max.push(global_min_max[i].max);
  }
  console.log(graph_max)
  console.log(graph_min)
  $("#output").html(output_possibilities)

  var ctx = document.getElementById('myChart').getContext('2d');
  var myChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Sun', 'Mon1', 'Mon2', 'Tue1', 'Tue2', 'Wed1','Wed2', 'Thu1', 'Thu2', 'Fri1', 'Fri2', 'Sat1', 'Sat2'],
      datasets: [{
        label: '真實價格',
        backgroundColor: window.chartColors.green,
        borderColor: window.chartColors.green,
        data: sell_prices.slice(1),
        fill: false,
        spanGaps: true,
        pointRadius: 4
      },
      {
        label: '預測上限',
        backgroundColor: window.chartColors.yellow,
        borderColor: window.chartColors.yellow,
        data: graph_max,
        fill: '1',
      },
      {
        label: '預測下限',
        backgroundColor: window.chartColors.red,
        borderColor: window.chartColors.red,
        data: graph_min,
        fill: false,
      }
      ]
    },
    options: {
      responsive: true,
      title: {
        display: false,
        text: '大頭菜走勢圖'
      },
      tooltips: {
        mode: 'index',
        intersect: false,
      },
      hover: {
        mode: 'nearest',
        intersect: true
      },
      scales: {
        xAxes: [{
          display: true,
          scaleLabel: {
            display: true,
            labelString: '日期'
          }
        }],
        yAxes: [{
          display: true,
          scaleLabel: {
            display: true,
            labelString: '售價'
          },
          ticks: {
            // suggestedMin: 50,
            suggestedMax: 700
          }
        }]
      }
      // scales: {
      //   xAxes: {
      //     display: true,
      //     scaleLabel: {
      //       display: true,
      //       labelString: '日期'
      //     }
      //   },
      //   yAxes: {
      //     display: true,
      //     scaleLabel: {
      //       display: false,
      //       labelString: '售價'
      //     },
      //     ticks: {
      //       max: 700,
      //       beginAtZero: true,
      //     }
      //   }
      // }
    }
  });
})




