import {Component, inject, OnInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CoreModule } from 'src/app/core/core.module';
import {UserSession} from "../../core/user-session";
import {AuthService} from "../../auth.service";

@Component({
    selector: 'app-by-pass',
    templateUrl: './by-pass.component.html',
        imports:[CoreModule],
    standalone: true
})
export class ByPassComponent implements OnInit {

  route = inject(ActivatedRoute);
  router = inject(Router);
  private authService = inject(AuthService);
  sessionId;


  ngOnInit(): void
  {

    this.route.queryParams.subscribe(params =>
      {
      this.sessionId = params['token'];
    });


    this.checkAuth();

  }


  async checkAuth() {
    if (!this.sessionId) {
      //console.log("no session id provided");
      return;
    }

    const response = await this.authService.logiByToken(this.sessionId);

    if (response.success) {
      if (response.data) {

        UserSession.login(response.data);

        this.router.navigate(['/dashboard']); // Adjust route as needed
      }
    }

  }

}
