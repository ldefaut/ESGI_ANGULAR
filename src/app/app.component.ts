import {Component} from '@angular/core';
import {AuthService} from "./services/auth.service";
import {Router} from "@angular/router";
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'kanban-fire';
  locales = {
    'en-US': $localize`:@@english:English`,
    'fr': $localize`:@@French:French`,
  };
  browserLang : string | undefined = this.translate.getBrowserLang();

  constructor(
    public authService: AuthService,
    router: Router,
    public translate: TranslateService
  ) {
    if (authService.isLoggedIn) {
      router.navigate(['dashboard']);
    }

    translate.addLangs(['en-US', 'fr']);
    translate.setDefaultLang('en-US');

    if (localStorage.getItem('locale')) {
      // @ts-ignore
      translate.use(localStorage.getItem('locale'));
    } else {
      translate.use(this.browserLang?.match(/en-US|fr/) ? this.browserLang : 'en-US');
    }
  }

  changeLocale(value: string) {
    localStorage.setItem('locale', value);
    this.translate.use(value);
  }
}
