import { Component, ElementRef, ViewChild } from '@angular/core';
import { CoviddataService } from '../coviddata.service';
import { Chart, ChartConfiguration, LinearScale, TimeScale, CategoryScale, Tooltip } from 'chart.js';


interface CovidData {
  cases_time_series: {
    date: string;
    dailyconfirmed: string;

  }[];

}
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  @ViewChild('myChart', { static: false }) myChart!: ElementRef | undefined;
  @ViewChild('myLineChart', { static: false }) myLineChart!: ElementRef | undefined;
  @ViewChild('mypiechart', { static: false }) mypiechart!: ElementRef | undefined;
  @ViewChild('mydonugthchart', { static: false }) mydonugthchart!: ElementRef | undefined;
  covidData: any;
  coviddata: any[] = []
  chart: Chart | undefined;
  dailyChartData: any[] = []
  barChart: any
  constructor(private share: CoviddataService) { }



  ngOnInit(): void {
    this.fetchCovidData();


  }
  ngAfterViewInit() {
    if (this.myChart) {
      setTimeout(() => {
        this.createbarChart();
        this.createLineChart();
        this.processData();
        this.createPieChart();
        this.createDoughnutChart()
      }, 100);

    }
  }
  fetchCovidData() {
    this.share.getCovidData().subscribe(
      (data: any) => {
        if (data && data.cases_time_series) {
          console.log(data)
          this.covidData = data.cases_time_series
          this.dailyChartData = this.covidData.map((item: any) => ({
            name: item.date,
            value: parseInt(item.dailyconfirmed, 10),
            recover: parseInt(item.dailyrecovered, 10)

          }));
          this.coviddata = data.statewise.map((item: any) => ({
            active: parseInt(item.active, 10),
            confirmed: parseInt(item.confirmed, 10),
            recover: parseInt(item.deltadeaths),
            deaths: parseInt(item.deaths)

          }));


        }
      },
      (error) => {
        console.error('Error fetching COVID-19 data:', error);
      }
    );
  }
  createbarChart() {
    if (!this.myChart) {
      console.error('myChart is not defined.');
      return;
    }

    const canvas = this.myChart.nativeElement;
    const ctx = canvas.getContext('2d');
    console.log(this.dailyChartData)
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.dailyChartData.map(item => item.name),
        datasets: [
          {
            label: 'dailyconfirmed',
            data: this.dailyChartData.map(item => item.value),
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
          },
        ],
      },

      options: {
        scales: {
          y: {
            type: 'linear',
            position: 'left',
            beginAtZero: true,
          },
        },
      },


    });
  }


  createLineChart() {
    if (!this.myLineChart) {
      console.error('myLineChart is not defined.');
      return;
    }

    const canvas = this.myLineChart.nativeElement;
    const ctx = canvas.getContext('2d');

    new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.dailyChartData.map(item => item.name),
        datasets: [
          {
            label: 'dailyrecovered',
            data: this.dailyChartData.map(item => item.recover),
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
          },
        ],
      },

      options: {
        scales: {
          y: {
            type: 'linear',
            position: 'left',
            beginAtZero: true,
          },
        },
      },
    });
  }

  pieChartData: any = {};
  processData() {
    this.pieChartData = {
      active: this.coviddata.reduce((sum: any, item: any) => sum + parseInt(item.active), 0),
      confirmed: this.coviddata.reduce((sum: any, item: any) => sum + parseInt(item.confirmed), 0),
      deaths: this.coviddata.reduce((sum: any, item: any) => sum + parseInt(item.deaths), 0),
      recover: this.coviddata.reduce((sum: any, item: any) => sum + parseInt(item.recover), 0),
    };
    console.log(this.pieChartData)
  }

  createPieChart() {
    if (!this.mypiechart) {
      console.error('mypiechart is not defined.');
      return;
    }
    const canvas = this.mypiechart.nativeElement;
    const ctx = canvas.getContext('2d');

    new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['Active', 'Confirmed', 'Deaths', 'Recover'],
        datasets: [{
          data: [this.pieChartData.active, this.pieChartData.confirmed, this.pieChartData.deaths, this.pieChartData.Recovered],
          backgroundColor: [
            'rgb(255, 99, 132)',
            'rgb(54, 162, 235)',
            'rgb(255, 205, 86)',
            'rgba(0, 128, 0, 0.7)',
          ],
        }],
      },
      options: {
        responsive: true,
      },
    });

  }


  createDoughnutChart() {
    if (!this.mydonugthchart) {
      console.error('mydonugthchart is not defined.');
      return;
    }
    const canvas = this.mydonugthchart.nativeElement;
    const ctx = canvas.getContext('2d');

    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Active', 'Confirmed', 'Deaths', 'Recover'],
        datasets: [{
          data: [this.pieChartData.active, this.pieChartData.confirmed, this.pieChartData.deaths, this.pieChartData.recover],
          backgroundColor: [
            'rgb(255, 99, 132)',
            'rgb(54, 162, 235)',
            'rgb(255, 205, 86)',
            'rgba(0, 128, 0, 0.7)',
          ],
        }],
      },
      options: {
        responsive: true,
      },
    });
  }


}



