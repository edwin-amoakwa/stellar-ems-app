// angular import
import { Component, inject, OnInit, ViewChild } from '@angular/core';

// third party
import { ApexOptions, ChartComponent, NgApexchartsModule } from 'ng-apexcharts';
import { DashboardService } from '../../dashboard/dashboard.service';

@Component({
  selector: 'monthly-sms-chart-chart',
  imports: [NgApexchartsModule],
  templateUrl: './monthly-sms-stats-chart.component.html',
  styleUrl: './monthly-sms-stats-chart.component.scss'
})
export class MonthlySmsStatsChartComponent implements OnInit{
  // public props
  @ViewChild('chart') chart!: ChartComponent;
  chartOptions!: Partial<ApexOptions>;

  dashboardService = inject(DashboardService);

  chartData: any = {};
  // Constructor
  constructor() {
this.chartOptions = {}
  }

  ngOnInit() {
    this.loadChartData();
  }

  async loadChartData() {
    let response = await this.dashboardService.getMonthlySMS();
    this.chartData = response.data;

    // this.chartOptions.series[0].data = this.chartData;
    this.createChart();
    console.log("this.chartData", JSON.stringify(this.chartOptions, null, 2));
  }





  createChart(){
    this.chartOptions =  {
      series: this.chartData?.series,
      dataLabels: {
        enabled: false
      },
      chart: {
        type: 'bar',
        // height: 480,
        stacked: true,
        toolbar: {
          show: true
        },
        background: 'transparent'
      },
      colors: ['#1E88E5', '#D32F2F', '#388E3C', '#FBC02D'],
      responsive: [
        {
          breakpoint: 480,
          options: {
            legend: {
              position: 'bottom',
              offsetX: -10,
              offsetY: 0
            }
          }
        }
      ],
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '50%'
        }
      },
      xaxis: {
        type: 'category',
        categories: this.chartData?.labels,
      },
      tooltip: {
        theme: 'light'
      }
    };
  }




  // Constructor
  constructor1() {
    this.chartOptions = {
      series: [
        {
          name: 'Investment',
          data: [35, 125, 35, 35, 35, 80, 35, 20, 35, 45, 15, 75]
        },
        {
          name: 'Loss',
          data: [35, 15, 15, 35, 65, 40, 80, 25, 15, 85, 25, 75]
        },
        {
          name: 'Profit',
          data: [35, 145, 35, 35, 20, 105, 100, 10, 65, 45, 30, 10]
        },
        {
          name: 'Maintenance',
          data: [0, 0, 75, 0, 0, 115, 0, 0, 0, 0, 150, 0]
        }
      ],
      dataLabels: {
        enabled: false
      },
      chart: {
        type: 'bar',
        // height: 480,
        stacked: true,
        toolbar: {
          show: true
        },
        background: 'transparent'
      },
      colors: ['#d3eafd', '#2196f3', '#673ab7', '#ede7f6'],
      responsive: [
        {
          breakpoint: 480,
          options: {
            legend: {
              position: 'bottom',
              offsetX: -10,
              offsetY: 0
            }
          }
        }
      ],
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '50%'
        }
      },
      xaxis: {
        type: 'category',
        categories: this.chartData?.labels,
        // categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      },
      tooltip: {
        theme: 'light'
      }
    };
  }





}
