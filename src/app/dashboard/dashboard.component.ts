// Angular Import
import { Component, OnInit, inject } from '@angular/core';

// project import
import { Badge } from 'primeng/badge';
import { SentSmsChartComponent } from 'src/app/charts/sent-sms-chart/sent-sms-chart.component';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { MonthlySmsStatsChartComponent } from '../charts/monthly-sms-stats-chart/monthly-sms-stats-chart.component';
import { UserSession } from '../core/user-session';
import { DashboardService } from './dashboard.service';

@Component({
  selector: 'app-dashboard',
  imports: [SentSmsChartComponent,  SharedModule, MonthlySmsStatsChartComponent, Badge],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  private dashboardService = inject(DashboardService);

  merchant = UserSession.getMerchant();
  user = UserSession.getUser();

  // Summary data from API
  summary: any = {};
  smsStats:any = {};
  latestSms:any[] = [];

  totalSmsSent: number = 0;

  async ngOnInit() {
    try {
      const response = await this.dashboardService.getSummary();
      this.summary = response.data;

      const smsStatsResponse = await this.dashboardService.getSmsStats();
      this.smsStats = smsStatsResponse.data;

      this.totalSmsSent = (Object.values(this.smsStats) as number[]).reduce((sum, value) => sum + value, 0)

      const latestSmsResponse = await this.dashboardService.getLatestSms();
      this.latestSms = latestSmsResponse.data;
    } catch (error) {
      console.error('Error fetching dashboard summary:', error);
    }
  }


  profileCard = [
    {
      style: 'bg-primary-dark text-white',
      background: 'bg-primary',
      value: '$203k',
      text: 'Net Profit',
      color: 'text-white',
      value_color: 'text-white'
    },
    {
      background: 'bg-warning',
      avatar_background: 'bg-light-warning',
      value: '$550K',
      text: 'Total Revenue',
      color: 'text-warning'
    }
  ];
}
